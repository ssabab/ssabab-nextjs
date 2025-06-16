'use client'

import React, { useState, useEffect } from 'react'; // useState와 useEffect 임포트

export default function InsightSection() {
  // 임시 메뉴 추천 인사이트 데이터
  const menuRecommendations = [
    {
      menu: "A메뉴",
      reason: "오늘은 깔끔한 한식이 당기는 날! 담백한 국물과 정갈한 반찬으로 편안한 한 끼를 즐겨보세요.",
      highlight: "깔끔한 한식"
    },
    {
      menu: "B메뉴",
      reason: "색다른 맛이 필요한 당신에게! 이국적인 향과 풍부한 재료로 특별한 점심을 경험해보세요.",
      highlight: "색다른 맛"
    },
    {
      menu: "A메뉴",
      reason: "든든하게 힘내고 싶다면 A메뉴를 추천해요! 푸짐한 고기와 야채가 에너지를 채워줄 거예요.",
      highlight: "든든한 한 끼"
    },
    {
      menu: "B메뉴",
      reason: "가볍지만 맛있게! 신선한 재료들로 이루어진 B메뉴는 오후를 상쾌하게 시작하는 데 도움을 줄 거예요.",
      highlight: "가볍고 신선"
    },
    {
      menu: "A메뉴",
      reason: "비오는 날엔 역시 따뜻한 A메뉴죠! 얼큰하고 따끈한 국물이 몸과 마음을 녹여줄 거예요.",
      highlight: "따뜻한 국물"
    },
    {
      menu: "B메뉴",
      reason: "지치고 피곤할 땐 B메뉴로 기분 전환! 달콤하고 바삭한 식감으로 스트레스를 날려버리세요.",
      highlight: "기분 전환"
    },
  ];

  // 1. 임시 인사이트를 저장할 상태
  const [currentRecommendation, setCurrentRecommendation] = useState(menuRecommendations[0]); // 기본값 설정 (서버 렌더링 시 사용될 값)

  // 2. 컴포넌트가 클라이언트에서 마운트된 후에만 무작위 값 설정
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * menuRecommendations.length);
    setCurrentRecommendation(menuRecommendations[randomIndex]);
  }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 실행

  return (
    <section className="bg-white shadow rounded-lg p-6 space-y-4 font-sans">
      <h3 className="text-lg font-semibold text-gray-800">오늘의 점심 추천 인사이트</h3>
      <div className="bg-blue-50 border border-blue-100 text-blue-800 rounded-md p-4 text-center">
        <p className="text-sm mb-2">
          <span className="font-bold text-base">{currentRecommendation.menu}</span>
          을(를) 추천합니다!
        </p>
        <p className="text-sm">
          <span className="font-medium text-blue-700">"{currentRecommendation.highlight}"</span>
          {currentRecommendation.reason.replace(currentRecommendation.highlight, '')}
        </p>
      </div>
    </section>
  );
}