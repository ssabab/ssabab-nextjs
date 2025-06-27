'use client'

import React, { useState, useEffect, useMemo } from 'react'; // useState와 useEffect 임포트
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function InsightSection() {
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentRecommendation = useMemo(() => menuRecommendations[currentIndex], [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % menuRecommendations.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + menuRecommendations.length) % menuRecommendations.length);
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % menuRecommendations.length);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>오늘의 메뉴 추천</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center text-center">
        <p className="text-xl font-semibold mb-2">{currentRecommendation.menu}</p>
        <p className="text-gray-500 mb-4">{currentRecommendation.reason}</p>
        <div className="flex gap-4">
          <Button onClick={handlePrev}>이전</Button>
          <Button onClick={handleNext}>다음</Button>
        </div>
      </CardContent>
    </Card>
  );
}