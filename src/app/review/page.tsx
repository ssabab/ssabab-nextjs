'use client';

import React, { useEffect, useState, useRef } from 'react';
import { BiBowlRice } from 'react-icons/bi';
import { FaStar, FaArrowLeft, FaRegSmileBeam, FaRegFrownOpen } from 'react-icons/fa';
import { useMenuStore, dayLabels } from '@/stores/useMenuStore';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti'; // Confetti 컴포넌트 임포트

export default function ReviewPage() {
  const router = useRouter();

  const {
    currentWeekMenus,
    selectedDay,
    initializeStore,
  } = useMenuStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  const todayMenu = currentWeekMenus ? currentWeekMenus[selectedDay] : null;

  const [selectedMenuOption, setSelectedMenuOption] = useState<'A' | 'B' | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [itemRatings, setItemRatings] = useState<Record<string, number>>({});
  const [isSatisfied, setIsSatisfied] = useState<boolean | null>(null);
  const [oneLineReview, setOneLineReview] = useState<string>('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const reviewFormRef = useRef<HTMLDivElement>(null);
  const [parentMinHeight, setParentMinHeight] = useState('400px');
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (showReviewForm) {
      if (reviewFormRef.current) {
        setParentMinHeight(`${reviewFormRef.current.offsetHeight + 50}px`);
      } else {
        setParentMinHeight('400px');
      }
    } else {
      setParentMinHeight('500px');
    }
  }, [showReviewForm, reviewFormRef.current?.offsetHeight]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const today = new Date();
  const month = today.getMonth() + 1;
  const date = today.getDate();
  const dayOfWeekLabel = selectedDay && dayLabels[selectedDay] ? dayLabels[selectedDay] : '';

  const handleMenuCardClick = (option: 'A' | 'B') => {
    setSelectedMenuOption(option);
  };

  const handleNextClick = () => {
    if (!selectedMenuOption) {
      alert('메뉴를 먼저 선택해주세요!');
      return;
    }
    setShowReviewForm(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  const handleStarClick = (item: string, rating: number) => {
    setItemRatings(prev => ({ ...prev, [item]: rating }));
  };

  // 모든 평가 관련 상태를 초기화하는 함수
  const resetReviewState = () => {
    setSelectedMenuOption(null);
    setShowReviewForm(false);
    setItemRatings({});
    setIsSatisfied(null);
    setOneLineReview('');
    setShowSuccessModal(false);
    setShowCancelModal(false);
    setShowConfirmSubmitModal(false);
  };

  // 실제 제출 로직을 담는 함수
  const executeSubmission = () => {
    console.log('--- 평가 제출 ---');
    console.log('선택 메뉴:', selectedMenuOption);
    console.log('각 음식별 별점:', itemRatings);
    console.log('식사 만족도:', isSatisfied ? '만족' : '불만족');
    console.log('한 줄 평:', oneLineReview);
    
    setShowConfirmSubmitModal(false);
    setShowSuccessModal(true);
  };

  const handleGoToSsabab = () => {
    resetReviewState();
    router.push('/ssabab');
  };

  const handleGoToAnalysis = () => {
    resetReviewState();
    router.push('/analysis');
  };

  const handleSubmitReview = () => {
    if (!selectedMenuOption) { 
      alert('메뉴가 선택되지 않았습니다!');
      return;
    }
    if (isSatisfied === null) {
      alert('식사 만족도를 선택해주세요!');
      return;
    }
    if (!todayMenu) {
      alert('메뉴 정보를 불러올 수 없습니다!');
      return;
    }

    const currentMenu = selectedMenuOption === 'A' ? todayMenu.menuA : todayMenu.menuB;
    let hasUnratedItems = false;
    
    // 별점 0점 또는 미선택 항목 확인
    for (const item of currentMenu) {
      if (itemRatings[item] === undefined || itemRatings[item] === 0) {
        hasUnratedItems = true;
        break;
      }
    }

    if (hasUnratedItems) {
      setConfirmMessage('별점이 0점인 음식이 있습니다. 정말 제출하시겠습니까?');
    } else {
      setConfirmMessage('정말 제출하시겠습니까?');
    }
    setShowConfirmSubmitModal(true);
  };

  const handleCancelReview = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    resetReviewState();
  };

  const cancelCancel = () => {
    setShowCancelModal(false);
  };

  if (!todayMenu) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-gray-700 font-sans">오늘의 메뉴를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 pb-24 pt-20 bg-gray-50 font-sans relative">
      <div className="container mx-auto px-4">
        {/* 뒤로가기 버튼 (평가 폼에서만 표시) */}
        {showReviewForm && (
          <button
            onClick={handleCancelReview}
            className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors z-10"
            aria-label="뒤로가기"
          >
            <FaArrowLeft size={20} className="text-gray-700" />
          </button>
        )}

        {/* 날짜 및 문구 (이미지 기반) - 메뉴 선택 화면 */}
        {!showReviewForm && (
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg font-medium">
              <span className="text-black font-bold">{month}월 {date}일 {dayOfWeekLabel}요일</span>
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">
              실제로 드신 메뉴를 선택해 주세요
            </h2>
          </div>
        )}

        {/* 메뉴 선택 / 평가 폼 전환을 위한 컨테이너 */}
        <div
          className="max-w-3xl mx-auto relative overflow-hidden"
          style={{ minHeight: parentMinHeight }}
        >
          {/* 메뉴 선택 그리드 */}
          <div
            className={`
              grid grid-cols-1 md:grid-cols-2 gap-6
              absolute w-full
              transition-transform duration-700 ease-in-out
              ${showReviewForm ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}
            `}
          >
            {/* 메뉴 A 카드 */}
            <div
              onClick={() => handleMenuCardClick('A')}
              className={`
                flex flex-col items-start bg-white p-6 rounded-lg shadow-md cursor-pointer
                transition-all duration-300 ease-in-out transform border-2
                ${selectedMenuOption === 'A' ? 'border-orange-500 shadow-xl' : 'border-gray-200'}
                hover:shadow-lg
              `}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-3">
                <BiBowlRice size={20} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">A 메뉴</h3>
              <ul className="text-gray-700 text-sm list-disc list-inside text-left w-full">
                {todayMenu.menuA.map((item) => (
                  <li key={item} className="py-1">
                    <span className="ml-2">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 메뉴 B 카드 */}
            <div
              onClick={() => handleMenuCardClick('B')}
              className={`
                flex flex-col items-start bg-white p-6 rounded-lg shadow-md cursor-pointer
                transition-all duration-300 ease-in-out transform border-2
                ${selectedMenuOption === 'B' ? 'border-orange-500 shadow-xl' : 'border-gray-200'}
                hover:shadow-lg
              `}
            >
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-3">
                <BiBowlRice size={20} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">B 메뉴</h3>
              <ul className="text-gray-700 text-sm list-disc list-inside text-left w-full">
                {todayMenu.menuB.map((item) => (
                  <li key={item} className="py-1">
                    <span className="ml-2">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 다음 버튼 */}
            <div className="md:col-span-2 flex justify-center mt-8">
              <button
                onClick={handleNextClick}
                disabled={!selectedMenuOption}
                className={`
                  px-8 py-3 rounded-xl font-bold text-lg
                  transition-colors duration-300
                  ${selectedMenuOption ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}
                `}
              >
                다음
              </button>
            </div>
          </div>

          {/* 평가 폼 (showReviewForm 상태에 따라 조건부 렌더링 및 애니메이션) */}
          <div
            ref={reviewFormRef}
            className={`
              absolute top-0 w-full bg-white p-6 rounded-lg shadow-md
              transition-transform duration-700 ease-in-out
              ${showReviewForm ? 'translate-x-0 opacity-100 z-10' : 'translate-x-full opacity-0 pointer-events-none'}
            `}
          >
            {showReviewForm && (
              <>
                {/* 날짜 및 문구 (평가 폼용) */}
                <div className="text-center mb-8">
                  <p className="text-gray-600 text-lg font-medium">
                    <span className="text-black font-bold">{month}월 {date}일 {dayOfWeekLabel}요일</span>
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800 mt-2">
                    오늘 식사 선택이 만족스러우셨나요?
                  </h2>
                </div>

                {/* 만족도 선택 카드 */}
                <div className="flex justify-center gap-4 mb-6">
                  <div
                    onClick={() => setIsSatisfied(true)}
                    className={`
                      flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer
                      transition-all duration-300 border-2 w-full max-w-[150px]
                      ${isSatisfied === true ? 'border-orange-500 bg-red-100 shadow-lg' : 'border-gray-200 bg-white hover:shadow-md'}
                    `}
                  >
                    <FaRegSmileBeam size={40} className={`mb-2 ${isSatisfied === true ? 'text-orange-500' : 'text-gray-400'}`} />
                    <span className={`font-semibold ${isSatisfied === true ? 'text-orange-600' : 'text-gray-700'}`}>만족해요</span>
                  </div>
                  <div
                    onClick={() => setIsSatisfied(false)}
                    className={`
                      flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer
                      transition-all duration-300 border-2 w-full max-w-[150px]
                      ${isSatisfied === false ? 'border-orange-500 bg-gray-100 shadow-lg' : 'border-gray-200 bg-white hover:shadow-md'}
                    `}
                  >
                    <FaRegFrownOpen size={40} className={`mb-2 ${isSatisfied === false ? 'text-orange-500' : 'text-gray-400'}`} />
                    <span className={`font-semibold ${isSatisfied === false ? 'text-orange-600' : 'text-gray-700'}`}>후회돼요</span>
                  </div>
                </div>

                {/* 각 음식별 별점 */}
                <div className="mb-6 space-y-3">
                  <h5 className="text-base font-semibold text-gray-800">음식별 별점</h5>
                  {(selectedMenuOption === 'A' ? todayMenu.menuA : todayMenu.menuB).map((item) => (
                    <div key={item} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700">{item}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FaStar
                            key={star}
                            className={`cursor-pointer ${star <= (itemRatings[item] || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            onClick={(e) => { e.stopPropagation(); handleStarClick(item, star); }}
                            size={20}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 한 줄 평 입력 */}
                <div className="mb-6 text-left">
                  <p className="text-base font-semibold text-gray-800 mb-2">한 줄 평을 자유롭게 남겨주세요.</p>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="예) 반찬 구성이 좋았고, 메인 메뉴도 맛있었어요!"
                    value={oneLineReview}
                    onChange={(e) => setOneLineReview(e.target.value)}
                  ></textarea>
                </div>

                <button
                  onClick={handleSubmitReview}
                  className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors w-full"
                >
                  제출하기
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 취소 확인 모달 */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">정말 취소하시겠어요?</h3>
            <p className="text-gray-600 mb-8">작성하던 모든 내용이 사라져요.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={cancelCancel}
                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
              >
                계속 작성
              </button>
              <button
                onClick={confirmCancel}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                작성 취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 제출 확인 모달 */}
      {showConfirmSubmitModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{confirmMessage}</h3>
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => setShowConfirmSubmitModal(false)}
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
          {/* Confetti 애니메이션 */}
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
  );
}