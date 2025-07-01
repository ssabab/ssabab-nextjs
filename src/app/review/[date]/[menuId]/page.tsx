'use client'

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getMenu, postMenuReview, putMenuReview, postFoodReview, putFoodReview, refreshAccessToken, Menu, FoodInfo } from '@/lib/api'
import Confetti from 'react-confetti'
import { FaStar, FaArrowLeft, FaRegSmileBeam, FaRegFrownOpen } from 'react-icons/fa'
import { isAxiosError } from 'axios'

const HOME = '/ssabab'

// KST 보정 함수
function getKSTDate(date?: Date) {
  const now = date ?? new Date()
  return new Date(now.getTime() + 9 * 60 * 60 * 1000)
}
function getKSTDateISO(date?: Date) {
  return getKSTDate(date).toISOString().slice(0, 10)
}


// 별점 행을 최적화(React.memo)하여, 음식별 별점만 리렌더
interface StarRatingRowProps {
  foodId: number
  foodName: string
  rating: number
  onStarClick: (foodId: number, foodScore: number) => void
}
const StarRatingRow = React.memo(function StarRatingRow({ foodId, foodName, rating, onStarClick }: StarRatingRowProps) {
  const stars = useMemo(() => [1, 2, 3, 4, 5], [])
  const handleClick = useCallback(
    (star: number) => onStarClick(foodId, star),
    [foodId, onStarClick]
  )
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-700">{foodName}</span>
      <div className="flex">
        {stars.map(star => (
          <FaStar
            key={star}
            className={`cursor-pointer ${star <= (rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => handleClick(star)}
            size={20}
          />
        ))}
      </div>
    </div>
  )
})

export default function ReviewPage() {
  const router = useRouter()
  const params = useParams() as { date: string; menuId: string }
  const reviewDate = params.date
  const menuId = Number(params.menuId)

  // ------ 모든 Hook은 여기 선언 ------
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [ready, setReady] = useState(false)
  const [menuData, setMenuData] = useState<Menu | null>(null)
  const [itemRatings, setItemRatings] = useState<Record<number, number>>({})
  const [isSatisfied, setIsSatisfied] = useState<boolean | null>(null)
  const [oneLineReview, setOneLineReview] = useState('')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [confirmMsg, setConfirmMsg] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  // ---- KST 오늘 날짜/시간 계산 ----
  const todayISO = getKSTDateISO()
  const hour = new Date().getHours()


  // 1. 로그인 체크
  useEffect(() => {
    if (document.cookie.includes('accessToken')) {
      setIsLoggedIn(true)
      setReady(true)
    } else {
      refreshAccessToken().then(() => {
        setIsLoggedIn(true)
        setReady(true)
      }).catch(() => {
        alert('로그인 후 이용해주세요')
        router.push('/login')
      })
    }
  }, [router])

  // 2. 메뉴 데이터 가져오기 (menuId로 menu1/menu2 중 하나 찾음)
  useEffect(() => {
    if (!reviewDate || isNaN(menuId)) {
      alert('잘못된 접근입니다.')
      router.push(HOME)
      return
    }
    const localKey = `reviewPage_menu_${reviewDate}_${menuId}`
    const localMenu = localStorage.getItem(localKey)
    if (localMenu) {
      setMenuData(JSON.parse(localMenu))
      return
    }
    
    getMenu(reviewDate)
      .then(res => {
        // response: { menu1: {...}, menu2: {...} }
        const menus = [res.data.menu1, res.data.menu2].filter(Boolean)
        const found = menus.find((m: Menu) => Number(m.menuId) === menuId)
        if (!found) {
          alert('해당 날짜의 메뉴가 없습니다.')
          router.push(HOME)
          return
        }
        setMenuData(found)
      })
      .catch(() => {
        router.push(HOME)
      })
  }, [reviewDate, menuId, router])

  // 3. 창 사이즈 감지 (Confetti용)
  useEffect(() => {
    const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // 4. 음식 평점 클릭 (최적화)
  const handleStarClick = useCallback((fid: number, rating: number) => {
    setItemRatings(prev => ({ ...prev, [fid]: rating }))
  }, [])

  // 5. 폼 제출
  const handleSubmitReview = () => {
    if (isSatisfied === null) return alert('만족도를 선택해주세요')
    const allFoods = menuData?.foods || []
    const anyZeroRating = allFoods.some((food: FoodInfo) => !itemRatings[food.foodId] || itemRatings[food.foodId] === 0)
    setConfirmMsg(
      anyZeroRating
        ? '별점이 0점인 음식이 있습니다. 제출하시겠습니까?'
        : '정말 제출하시겠습니까?'
    )
    setShowConfirmModal(true)
  }

  const starRows = useMemo(() => {
    return menuData?.foods?.map((food: FoodInfo) => (
      <StarRatingRow
        key={food.foodId}
        foodId={food.foodId}
        foodName={food.foodName}
        rating={itemRatings[food.foodId] || 0}
        onStarClick={handleStarClick}
      />
    ))
  }, [menuData, itemRatings, handleStarClick])

  const makeFoodReviews = () => {
    if (!menuData || !menuData.foods) return []
    return menuData.foods.map((food: FoodInfo) => ({
      foodId: food.foodId,
      foodScore: itemRatings[food.foodId] || 0,
    }))
  }
const executeSubmission = async () => {
  if (!menuData) {
    console.error("메뉴 데이터가 없습니다. 제출을 중단합니다.");
    setShowConfirmModal(false);
    return;
  }
  const reviewsArr = makeFoodReviews();

  const payloadFood = {
    menuId: menuData.menuId,
    reviews: reviewsArr,
  };

  const payloadMenu = {
    menuId: menuData.menuId,
    menuRegret: isSatisfied === false,
    menuComment: oneLineReview,
  };

  try {
    await postFoodReview(payloadFood);
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      console.error("postFoodReview 실패", err.response?.status, err.response?.data);
      if (err.response?.status === 400) {
        try {
          await putFoodReview(payloadFood);
          console.log("putFoodReview 성공 (대체)");
        } catch (putErr) {
          console.error("putFoodReview 실패", putErr);
          throw putErr;
        }
      } else {
        throw err;
      }
    } else {
      console.error("postFoodReview 실패", err);
      throw err;
    }
  }

  try {
    await postMenuReview(payloadMenu);
    console.log("postMenuReview 성공");
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      console.error("postMenuReview 실패", err.response?.status, err.response?.data);
      if (err.response?.status === 400) {
        try {
          await putMenuReview(payloadMenu);
          console.log("putMenuReview 성공 (대체)");
        } catch (putErr) {
          console.error("putMenuReview 실패", putErr);
          throw putErr;
        }
      } else {
        throw err;
      }
    } else {
      console.error("postMenuReview 실패", err);
      throw err;
    }
  }

  setShowConfirmModal(false);
  setShowSuccessModal(true);
  const todayISO = getKSTDateISO()
  localStorage.setItem(`lunchReview_${todayISO}`, String(menuData.menuId))
};

  const cancel = () => setShowCancelModal(false)
  const handleGoToSsabab = () => router.push(HOME)
  const handleGoToAnalysis = () => router.push('/analysis')
  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === wrapperRef.current) setShowCancelModal(true)
  }

  // ---- 접근 제한 ----
  if (!isLoggedIn || !ready) return null
  if (reviewDate !== todayISO) {
    return <div className="text-center py-20">오늘 메뉴만 리뷰할 수 있습니다.</div>
  }
  if (!(hour >= 12 && hour < 23)) {
    return (
      <main className="fixed inset-0 flex items-center justify-center bg-black/10">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">리뷰 작성 가능 시간은 12:00 ~ 23:00입니다.</h2>
          <button className="mt-6 px-6 py-2 rounded bg-orange-500 text-white font-bold" onClick={() => router.push(HOME)}>
            메인으로 이동
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 pb-24 pt-6 inset-0 bg-gray-50 flex items-center justify-center">
      <div
        ref={wrapperRef}
        onClick={handleWrapperClick}
        className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
      >
        {/* 뒤로가기(취소) */}
        <button
          onClick={() => setShowCancelModal(true)}
          className="absolute top-4 left-4 text-gray-500"
        >
          <FaArrowLeft size={20} />
        </button>

        {/* 평가폼 */}
        <p className="text-gray-600 text-center text-sm font-medium p-3">
          <span className="gray-600 font-medium">{reviewDate}</span>
        </p>
        <h2 className="text-xl font-bold text-center mb-7">
          오늘 식사 선택이 만족스러우셨나요?
        </h2>
        <div className="space-y-4">

          {/* 만족도 선택 카드 */}
          <div className="flex justify-around">
            <div onClick={() => setIsSatisfied(true)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer
                transition-all duration-300 border-2 w-full max-w-[150px]
                ${isSatisfied === true ? 'border-orange-500 bg-red-100 shadow-lg' : 'border-gray-200 bg-white hover:shadow-md'}
              `}>
              <FaRegSmileBeam size={32} className={isSatisfied ? 'text-orange-500' : 'text-gray-300'} />
              <span>만족</span>
            </div>
            <div onClick={() => setIsSatisfied(false)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer
                transition-all duration-300 border-2 w-full max-w-[150px]
                ${isSatisfied === false ? 'border-orange-500 bg-gray-100 shadow-lg' : 'border-gray-200 bg-white hover:shadow-md'}
              `}>
              <FaRegFrownOpen size={32} className={isSatisfied === false ? 'text-orange-500' : 'text-gray-300'} />
              <span>후회</span>
            </div>
          </div>

          {/* 각 음식별 별점 */}
          <div className="mb-6 space-y-3">
            <h5 className="text-base text-center font-semibold text-gray-800">음식별 별점</h5>
            {starRows}
          </div>

          {/* 한 줄 평 입력 */}
          <div className="mb-6 text-left">
            <p className="text-base text-center font-semibold text-gray-800 mb-2">한 줄 평을 자유롭게 남겨주세요.</p>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="한줄평을 입력하세요"
              value={oneLineReview}
              onChange={e => setOneLineReview(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmitReview}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors w-full"
          >
            제출하기
          </button>
        </div>
      </div>
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">정말 취소하시겠어요?</h3>
            <p className="text-gray-600 mb-8">작성하던 모든 내용이 사라져요.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancel}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
              >
                계속 작성
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                작성 취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 제출 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{confirmMsg}</h3>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
              >
                아니요
              </button>
              <button
                onClick={executeSubmission}
                className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
              >
                네, 제출합니다
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={300}
            gravity={0.1}
          />
          <div className="bg-white p-10 rounded-lg shadow-2xl max-w-md w-full text-center transform transition-all scale-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <span className="text-4xl">🎉</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">평가해주셔서 감사합니다!</h3>
            <p className="text-gray-600 mb-8">여러분의 소중한 의견은 더 나은 점심을 만드는 데 큰 도움이 됩니다.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleGoToAnalysis}
                className="px-6 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-black transition-colors flex-1"
              >
                분석 페이지 <br /> 보러가기
              </button>
              <button
                onClick={handleGoToSsabab}
                className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors flex-1"
              >
                메인 페이지 <br /> 보러가기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}