'use client'

import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api, { refreshAccessToken , getMenu, postMenuReview, postFoodReview } from '@/lib/api'
import Confetti from 'react-confetti'
import { FaStar, FaArrowLeft, FaRegSmileBeam, FaRegFrownOpen } from 'react-icons/fa'

const HOME = '/ssabab'
const todayISO = new Date().toISOString().slice(0, 10)
const hour = new Date().getHours()

export default function ReviewPage() {
  const router = useRouter()
  const { menuId: rawId } = useParams()
  const menuId = Number(rawId)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [ready, setReady] = useState(false)
  const [menuDate, setMenuDate] = useState<string | null>(null)
  const [isTodayMenu, setIsTodayMenu] = useState(false)
  const [isAllowedTime, setIsAllowedTime] = useState(false)
  const todayStr = new Date().toISOString().slice(0, 10)
  
  // 오늘 날짜 ISO
  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), [])

  // 1. 로그인 체크
  useEffect(() => {
    refreshAccessToken().then(() => {
      setIsLoggedIn(true)
      setReady(true)
    }).catch(() => {
      alert('로그인 후 이용해주세요')
      router.push('/login')
    })
  }, [router])

  // 2. 메뉴 날짜 확인 (id 기준)
  useEffect(() => {
    if (!rawId || isNaN(menuId)) {
      alert('해당 날짜의 리뷰는 불가능합니다')
      router.push(HOME)
      return
    }
    // 메뉴 정보 받아서 날짜 비교
    getMenu(todayISO).then(res => {
      // 해당 menuId의 날짜 찾아서 세팅
      const found = res.data.menus.find((m: any) => m.menuId === menuId)
      if (!found) {
        alert('오늘 메뉴가 아닙니다')
        router.push(HOME)
        return
      }
      setMenuDate(todayISO)
      setIsTodayMenu(true)
    }).catch(() => {
      setMenuDate(null)
      setIsTodayMenu(false)
      router.push(HOME)
    })
    // 시간 체크 (12~23시만 허용)
    const hour = new Date().getHours()
    setIsAllowedTime(hour >= 12 && hour < 23)
  }, [rawId, menuId, router, todayISO])

  // 접근 제한 (시간/날짜/로그인)
  if (!isLoggedIn || !ready) return null
  // if (!isAllowedTime) {
  //   return <div className="text-center py-20">리뷰는 12:00~23:00에만 가능합니다.</div>
  // }
  if (!isTodayMenu) {
    return <div className="text-center py-20">오늘 메뉴만 리뷰할 수 있습니다.</div>
  }
  // ── 2. 오늘 메뉴 불러오기 ────────────────────────────────
  const [todayMenu, setTodayMenu] = useState<{
    menuId: number
    foods: { foodId: number; foodName: string }[]
  } | null>(null)

  useEffect(() => {
    getMenu(todayStr)
      .then(res => {
        const data = res.data as any
        const menusArr = data.menus ?? [data.menu1, data.menu2]
        const found = menusArr.find((m: any) => m.menuId === menuId)
        if (!found) {
          alert('해당 날짜의 리뷰는 불가능합니다')
          router.push(HOME)
        } else {
          setTodayMenu({ menuId: found.menuId, foods: found.foods })
        }
      })
      .catch(err => {
        console.error(err)
        alert('오늘 메뉴를 불러올 수 없습니다')
        router.push(HOME)
      })
  }, [todayStr, menuId, router])

  // ── 3️. 이미 리뷰했는지 체크 & 불가 메뉴 차단 ──────────────
  const [hasReviewedToday, setHasReviewedToday] = useState(false)
  const [forceRewrite, setForceRewrite] = useState(false)
  const [showRewriteConfirm, setShowRewriteConfirm] = useState(false)
  useEffect(() => {
    if (!todayMenu) return
    api
      .get<{ reviewed: boolean; menuId?: number }>('/api/review/check', { params: { date: todayStr } })
      .then(res => {
        if (res.data.reviewed && res.data.menuId !== menuId) {
          alert('다른 메뉴의 리뷰를 등록하셨습니다')
          router.push(HOME)
        } else if (res.data.reviewed && res.data.menuId === menuId) {
          // 같은 메뉴에 리뷰가 있을 때: 재작성 확인 (forceRewrite 등)
          setShowRewriteConfirm(true)
        }
        setHasReviewedToday(!!res.data.reviewed)
      })
      .catch(err => {
        console.error(err)
        setHasReviewedToday(false)
      })
  }, [todayMenu, todayStr, menuId, router])

  // 메뉴ID 변경시 forceRewrite 등 상태 리셋
  useEffect(() => {
    setForceRewrite(false)
    setShowRewriteConfirm(false)
  }, [menuId])

  // window 크기 (Confetti용)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── 4️. 리뷰 내용 로드 (수정 모드) ─────────────────────────
  const [itemRatings, setItemRatings] = useState<Record<number, number>>({})
  const [isSatisfied, setIsSatisfied] = useState<boolean | null>(null)
  const [oneLineReview, setOneLineReview] = useState('')
  useEffect(() => {
    if (!todayMenu || (!hasReviewedToday && !forceRewrite)) {
      setItemRatings({})
      setIsSatisfied(null)
      setOneLineReview('')
      return
    }
    const id = todayMenu.menuId
    // 음식 평점 불러오기
    api
      .get<{ reviews: { foodId: number; foodScore: number }[] }>('/api/review/food', { params: { menuId: id } })
      .then(res => {
        const map: Record<number, number> = {}
        res.data.reviews.forEach(r => { map[r.foodId] = r.foodScore })
        setItemRatings(map)
      })
      .catch(err => { console.error(err) })
    // 메뉴 한줄평 불러오기
    api
      .get<{ menuRegret: boolean; menuComment: string }>('/api/review/menu', { params: { menuId: id } })
      .then(res => {
        setIsSatisfied(!res.data.menuRegret)
        setOneLineReview(res.data.menuComment)
      })
      .catch(() => { })
  }, [todayMenu, hasReviewedToday, forceRewrite])

  const handleStarClick = (idx: number, rating: number) => {
    setItemRatings(prev => ({ ...prev, [idx]: rating }))
  }

  const handleGoToSsabab = () => router.push(HOME)
  const handleGoToAnalysis = () => router.push('/analysis')

  // ── 5️. 폼 상태 & 모달 훅 ─────────────────────────────────
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [confirmMsg, setConfirmMsg] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  // 클릭 아웃사이드 시 취소모달
  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === wrapperRef.current) {
      setShowCancelModal(true)
    }
  }

  // ── 6️. 제출 전 유효성 & 확인모달 ─────────────────────────
  const handleSubmitReview = () => {
    if (isSatisfied === null) return alert('만족도를 선택해주세요')
    const unrated = Object.values(itemRatings).some(v => v === 0)
    setConfirmMsg(
      unrated
        ? '별점이 0점인 음식이 있습니다. 제출하시겠습니까?'
        : '정말 제출하시겠습니까?'
    )
    setShowConfirmModal(true)
  }

  // ── 7️. 등록/수정 API 호출 ─────────────────────────────────
  const executeSubmission = async () => {
    if (!todayMenu) return
    const id = todayMenu.menuId
    try {
      await postFoodReview({
        menuId: id,
        reviews: Object.entries(itemRatings).map(([fid, score]) => ({
          foodId: +fid,
          foodScore: score,
        })),
      })
      await postMenuReview({
        menuId: id,
        menuRegret: isSatisfied === false,
        menuComment: oneLineReview,
      })
      setShowConfirmModal(false)
      setShowSuccessModal(true)
    } catch (err) {
      console.error(err)
      alert('리뷰 저장 중 오류가 발생했습니다')
    }
  }

  const cancel = () => setShowCancelModal(false)

//   return (
// 오늘이 아니거나, 리뷰 가능 시간이 아니면 차단
// if (todayMenu && todayMenu.menuId && todayStr !== todayISO) {
//   alert('오늘 메뉴에 대해서만 리뷰할 수 있습니다')
//   router.push(HOME)
//   return null
// }
// if (hour < 12 || hour >= 23) {
//   return (
//     <main className="fixed inset-0 flex items-center justify-center bg-black/10">
//       <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md w-full">
//         <h2 className="text-xl font-bold mb-4">리뷰 작성 가능 시간은 12:00 ~ 23:00입니다.</h2>
//         <button className="mt-6 px-6 py-2 rounded bg-orange-500 text-white font-bold" onClick={() => router.push(HOME)}>
//           메인으로 이동
//         </button>
//       </div>
//     </main>
//   )
// }
//     <main className="fixed inset-0 bg-black/10 flex items-center justify-center">
//       <div
//         ref={wrapperRef}
//         onClick={handleWrapperClick}
//         className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
//       >
//         {/* 뒤로가기(취소) */}
//         <button
//           onClick={() => setShowCancelModal(true)}
//           className="absolute top-4 left-4 text-gray-500"
//         >
//           <FaArrowLeft size={20} />
//         </button>

//         {/* 평가폼 */}
//         <p className="text-gray-600 text-lg font-medium">
//           <span className="text-black font-bold">{todayStr}</span>
//         </p>
//         <h2 className="text-xl font-bold text-center mb-4">
//           오늘 식사 선택이 만족스러우셨나요?
//         </h2>
//         <div className="space-y-4">

//           {/* 만족도 선택 카드 */}
//           <div className="flex justify-around">
//             <div onClick={() => setIsSatisfied(true)}
//               className={`
//                 flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer
//                 transition-all duration-300 border-2 w-full max-w-[150px]
//                 ${isSatisfied === true ? 'border-orange-500 bg-red-100 shadow-lg' : 'border-gray-200 bg-white hover:shadow-md'}
//               `}>
//               <FaRegSmileBeam size={32} className={isSatisfied ? 'text-orange-500' : 'text-gray-300'} />
//               <span>만족</span>
//             </div>
//             <div onClick={() => setIsSatisfied(false)}
//               className={`
//                 flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer
//                 transition-all duration-300 border-2 w-full max-w-[150px]
//                 ${isSatisfied === false ? 'border-orange-500 bg-gray-100 shadow-lg' : 'border-gray-200 bg-white hover:shadow-md'}
//               `}>
//               <FaRegFrownOpen size={32} className={isSatisfied === false ? 'text-orange-500' : 'text-gray-300'} />
//               <span>후회</span>
//             </div>
//           </div>

//           {/* 각 음식별 별점 */}
//           <div className="mb-6 space-y-3">
//             <h5 className="text-base font-semibold text-gray-800">음식별 별점</h5>
//             {todayMenu?.foods.map(food => (
//               <div key={food.foodId} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
//                 <span className="text-gray-700">{food.foodName}</span>
//                 <div className="flex">
//                   {[1, 2, 3, 4, 5].map(star => (
//                     <FaStar
//                       key={star}
//                       className={`cursor-pointer ${star <= (itemRatings[food.foodId] || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
//                       onClick={() => handleStarClick(food.foodId, star)} // new: foodId 기준
//                       size={20}
//                     />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* 한 줄 평 입력 */}
//           <div className="mb-6 text-left">
//             <p className="text-base font-semibold text-gray-800 mb-2">한 줄 평을 자유롭게 남겨주세요.</p>
//             <textarea
//               className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//               rows={3}
//               placeholder="한줄평을 입력하세요"
//               value={oneLineReview}
//               onChange={e => setOneLineReview(e.target.value)}
//             />
//           </div>

//           <button
//             onClick={handleSubmitReview}
//             className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors w-full"
//           >
//             제출하기
//           </button>
//         </div>
//       </div>

//       {/* 취소 확인 모달 */}
//       {showCancelModal && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">정말 취소하시겠어요?</h3>
//             <p className="text-gray-600 mb-8">작성하던 모든 내용이 사라져요.</p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={cancel}
//                 className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
//               >
//                 계속 작성
//               </button>
//               <button
//                 onClick={() => router.back()}
//                 className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
//               >
//                 작성 취소
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 제출 확인 모달 */}
//       {showConfirmModal && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">{confirmMsg}</h3>
//             <div className="flex justify-center gap-4 mt-8">
//               <button
//                 onClick={() => setShowConfirmModal(false)}
//                 className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
//               >
//                 아니요
//               </button>
//               <button
//                 onClick={executeSubmission}
//                 className="px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
//               >
//                 네, 제출합니다
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 성공 모달 */}
//       {showSuccessModal && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
//           <Confetti
//             width={windowSize.width}
//             height={windowSize.height}
//             recycle={false}
//             numberOfPieces={300}
//             gravity={0.1}
//           />
//           <div className="bg-white p-10 rounded-lg shadow-2xl max-w-md w-full text-center transform transition-all scale-100">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
//               <span className="text-4xl">🎉</span>
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-3">평가해주셔서 감사합니다!</h3>
//             <p className="text-gray-600 mb-8">여러분의 소중한 의견은 더 나은 점심을 만드는 데 큰 도움이 됩니다.</p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={handleGoToAnalysis}
//                 className="px-6 py-3 rounded-lg bg-gray-800 text-white font-semibold hover:bg-black transition-colors flex-1"
//               >
//                 분석 페이지 <br /> 보러가기
//               </button>
//               <button
//                 onClick={handleGoToSsabab}
//                 className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors flex-1"
//               >
//                 메인 페이지 <br /> 보러가기
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   )
// }



  // (리턴은 아래처럼 디버깅용 값만 보여주도록 임시 변경)
  return (
    <main className="fixed inset-0 bg-black/10 flex items-center justify-center">
      <div>
        <div>menuId: {menuId}</div>
        <div>hasReviewedToday: {String(hasReviewedToday)}</div>
        <div>forceRewrite: {String(forceRewrite)}</div>
        <div>showRewriteConfirm: {String(showRewriteConfirm)}</div>
        <div>itemRatings: {JSON.stringify(itemRatings)}</div>
        <div>isSatisfied: {String(isSatisfied)}</div>
        <div>oneLineReview: {oneLineReview}</div>
      </div>
    </main>
  )
}