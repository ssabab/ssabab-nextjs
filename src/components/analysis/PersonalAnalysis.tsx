// src/components/analysis/PersonalAnalysis.tsx
import React from 'react';
import { TagCloud } from 'react-tagcloud'; // react-tagcloud 임포트 (네임드 임포트)

export default function PersonalAnalysis() {
  // 임시 데이터: 평균 평점 및 전체 리뷰 수
  const ratingData = {
    averageRating: 4.2,
    totalReviews: 52,
  };

  // 임시 데이터: 가장 높게/낮게 평가한 음식 TOP 3
  const topRatedFoods = [
    { name: "프리미엄 스테이크", rating: 5.0, date: "2024.05.10", imageUrl: "https://placehold.co/100x100/A0DAA0/FFFFFF?text=STEAK" },
    { name: "수제버거 세트", rating: 4.9, date: "2024.04.22", imageUrl: "https://placehold.co/100x100/F0E68C/000000?text=BURGER" },
    { name: "시금치 파스타", rating: 4.8, date: "2024.03.15", imageUrl: "https://placehold.co/100x100/ADD8E6/000000?text=PASTA" },
  ];

  const lowestRatedFoods = [
    { name: "일반 백반", rating: 2.1, date: "2024.02.01", imageUrl: "https://placehold.co/100x100/DDA0DD/000000?text=RICE" },
    { name: "해산물 볶음밥", rating: 2.5, date: "2024.01.18", imageUrl: "https://placehold.co/100x100/FFB6C1/000000?text=SEAFOOD" },
    { name: "특선 돈까스", rating: 2.8, date: "2023.12.05", imageUrl: "https://placehold.co/100x100/D3D3D3/000000?text=TONKASU" },
  ];

  // 임시 데이터: 선호 카테고리
  const preferredCategories = [
    { name: "한식", percentage: 40 },
    { name: "일식", percentage: 25 },
    { name: "양식", percentage: 20 },
    { name: "중식", percentage: 10 },
    { name: "기타", percentage: 5 },
  ];

  // react-tagcloud를 위한 데이터 형식: value(텍스트)와 count(빈도/가중치)
  // `color` 속성을 각 태그에 직접 지정하여 색상을 제어할 수 있습니다.
  const preferredKeywordsForCloud = [
    { value: "맛있는", count: 10, color: '#EF4444' }, // 빨강
    { value: "가성비", count: 8, color: '#F97316' },  // 주황
    { value: "친절한", count: 6, color: '#F59E0B' },  // 노랑
    { value: "깔끔한", count: 5, color: '#22C55E' },  // 초록
    { value: "분위기", count: 4, color: '#3B82F6' },  // 파랑
    { value: "재방문", count: 7, color: '#EC4899' },  // 분홍
    { value: "신선한", count: 3, color: '#A855F7' },  // 보라
    { value: "푸짐한", count: 5.5, color: '#10B981' }, // 에메랄드
    { value: "빠른", count: 2, color: '#6B7280' },    // 회색
    { value: "혼밥", count: 3.5, color: '#F472B6' },
    { value: "단체", count: 2.5, color: '#C084FC' },
    { value: "데이트", count: 4.5, color: '#EAB308' },
    { value: "존맛탱", count: 9, color: '#0EA5E9' },
    { value: "웨이팅", count: 2.8, color: '#9CA3AF' },
    { value: "혜자", count: 7.5, color: '#D946EF' },
    { value: "인생맛집", count: 8.5, color: '#84CC16' },
  ];

  // react-tagcloud 옵션 설정
  const tagCloudOptions = {
    // minSize와 maxSize는 px 단위로 직접 설정합니다.
    minSize: 12,
    maxSize: 48,
    // 랜덤 회전 여부
    // randomizeRotation: true,
    // 정렬 방식 (word, weight)
    // sortBy: 'weight',
  };


  // 임시 데이터: 개인 인사이트 요약
  const personalInsight = "OO님은 평소 한식 중에서도 국물 요리를 선호하시며, 특히 가성비와 음식의 '맛'을 중요하게 평가하는 경향이 있습니다. 주말에 새로운 맛집을 탐방하는 것을 즐기시며, 친구들과 함께 방문하는 경우가 많습니다.";

  // 임시 데이터: 전체 평균과의 차이 (예시)
  const comparisonData = {
    myRating: 4.2,
    avgRatingCommunity: 3.9,
    mySpicyPreference: 4, // 1-5
    avgSpicyCommunity: 3,
    myVarietySeeking: 2, // 1-5 (낮을수록 반복 선호)
    avgVarietyCommunity: 3,
  };


  return (
    <div className="space-y-8">
      {/* 1. 평균 평점 및 전체 리뷰 수 (숫자 카드 + 게이지 차트) */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">⭐ 평균 평점 및 전체 리뷰 수</h3>
          <p className="text-5xl font-bold text-indigo-600">{ratingData.averageRating}</p>
          <p className="text-sm text-gray-500 mt-1">총 {ratingData.totalReviews}개 리뷰</p>
        </div>
        {/* 간단한 게이지 차트 시뮬레이션 (SVG 아크) */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="45"
              fill="none" stroke="#E5E7EB" strokeWidth="10"
              strokeDasharray="282.7" strokeDashoffset="0"
            />
            <circle
              cx="50" cy="50" r="45"
              fill="none" stroke="#8B5CF6" strokeWidth="10"
              strokeDasharray="282.7" // 2 * PI * 45
              strokeDashoffset={(1 - (ratingData.averageRating / 5)) * 282.7} // 5점 만점
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{ratingData.averageRating}</span>
          </div>
        </div>
      </div>

      {/* 2. 가장 높게 평가한 음식 TOP 3 / 3. 가장 낮게 평가한 음식 TOP 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 가장 높게 평가한 음식 TOP 3 */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💯 가장 높게 평가한 음식 TOP 3</h3>
          <div className="space-y-4">
            {topRatedFoods.map((food, index) => (
              <div key={index} className="flex items-center space-x-4 border-b pb-3 last:border-b-0 last:pb-0">
                <img src={food.imageUrl} alt={food.name} className="w-16 h-16 rounded-md object-cover" />
                <div>
                  <p className="font-semibold text-gray-700">{food.name}</p>
                  <p className="text-sm text-yellow-500">{food.rating} ★</p>
                  <p className="text-xs text-gray-500">{food.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 가장 낮게 평가한 음식 TOP 3 */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💔 가장 낮게 평가한 음식 TOP 3</h3>
          <div className="space-y-4">
            {lowestRatedFoods.map((food, index) => (
              <div key={index} className="flex items-center space-x-4 border-b pb-3 last:border-b-0 last:pb-0">
                <img src={food.imageUrl} alt={food.name} className="w-16 h-16 rounded-md object-cover" />
                <div>
                  <p className="font-semibold text-gray-700">{food.name}</p>
                  <p className="text-sm text-red-500">{food.rating} ★</p>
                  <p className="text-xs text-gray-500">{food.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. 선호 카테고리 (도넛 차트) & 5. 선호 키워드 (워드클라우드) - 한 행에 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 선호 카테고리 */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📌 선호 카테고리</h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {(() => {
                  let cumulativePercentage = 0;
                  const colors = ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#3B82F6']; // Tailwind colors
                  return preferredCategories.map((category, index) => {
                    const startAngle = cumulativePercentage * 3.6; // Degrees
                    cumulativePercentage += category.percentage;
                    const endAngle = cumulativePercentage * 3.6;

                    const largeArcFlag = category.percentage > 50 ? 1 : 0;
                    const x1 = 50 + 40 * Math.cos((Math.PI / 180) * startAngle);
                    const y1 = 50 + 40 * Math.sin((Math.PI / 180) * startAngle);
                    const x2 = 50 + 40 * Math.cos((Math.PI / 180) * endAngle);
                    const y2 = 50 + 40 * Math.sin((Math.PI / 180) * endAngle);

                    return (
                      <path
                        key={index}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                        fill={colors[index % colors.length]}
                        stroke="#fff"
                        strokeWidth="0.5"
                      />
                    );
                  });
                })()}
                <circle cx="50" cy="50" r="25" fill="#fff" /> {/* 중앙의 흰색 원 */}
              </svg>
            </div>
            <ul className="text-sm text-gray-700 space-y-2">
              {preferredCategories.map((category, index) => (
                <li key={index} className="flex items-center">
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#3B82F6'][index % 5] }}
                  ></span>
                  {category.name} ({category.percentage}%)
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-gray-500 mt-4">평점 기반 선호 카테고리 비중 시각화</p>
        </div>

        {/* 선호 키워드 (react-tagcloud 적용) */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🏷️ 선호 키워드 (워드클라우드)</h3>
          {/* 워드 클라우드가 렌더링될 컨테이너에 높이를 지정해야 합니다. */}
          <div className="h-60 w-full flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 p-2 overflow-hidden">
            <TagCloud
              minSize={tagCloudOptions.minSize}
              maxSize={tagCloudOptions.maxSize}
              tags={preferredKeywordsForCloud}
              // 단어별 색상 적용을 위해 renderer prop 사용
              renderer={({ value, count, key, color }) => (
                <span
                  key={key}
                  style={{
                    fontSize: `${tagCloudOptions.minSize + (count / 10) * (tagCloudOptions.maxSize - tagCloudOptions.minSize)}px`,
                    margin: '5px',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    backgroundColor: 'rgb(224, 242, 254)', // light blue background (Tailwind bg-blue-100)
                    color: color || 'rgb(37, 99, 235)', // primary blue text (Tailwind text-blue-600)
                    fontWeight: '600',
                    cursor: 'default',
                    transition: 'all 0.3s ease-in-out',
                    display: 'inline-block', // inline-block으로 설정하여 margin 적용
                  }}
                >
                  #{value}
                </span>
              )}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">리뷰에서 추출된 태그 강조 (빈도에 따른 크기)</p>
        </div>
      </div>

      {/* 6. 개인 인사이트 요약 & 8. 전체 평균과의 차이 - 한 행에 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 개인 인사이트 요약 (텍스트 박스) */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🧠 개인 인사이트 요약</h3>
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-200 min-h-[150px]">
            {personalInsight}
          </p>
          <p className="text-sm text-gray-500 mt-2">전처리된 자연어 요약 문장</p>
        </div>

        {/* 전체 평균과의 차이 (간단 비교 텍스트) */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🆚 전체 평균과의 차이</h3>
          <div className="space-y-3 bg-gray-50 p-4 rounded-md border border-gray-200 min-h-[150px] flex flex-col justify-center">
            <p className="text-gray-700">
              <span className="font-semibold">평점:</span> 내 평균 평점({comparisonData.myRating}점)은 커뮤니티 평균({comparisonData.avgRatingCommunity}점)보다
              <span className={`font-bold ${comparisonData.myRating > comparisonData.avgRatingCommunity ? 'text-green-600' : 'text-red-600'}`}>
                {comparisonData.myRating > comparisonData.avgRatingCommunity ? ' 높습니다.' : ' 낮습니다.'}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">매운맛 선호도:</span> 저는 커뮤니티 평균보다
              <span className={`font-bold ${comparisonData.mySpicyPreference > comparisonData.avgSpicyCommunity ? 'text-green-600' : 'text-red-600'}`}>
                {comparisonData.mySpicyPreference > comparisonData.avgSpicyCommunity ? ' 매운맛을 더 선호합니다.' : ' 덜 선호합니다.'}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">다양성 추구:</span> 새로운 음식을 시도하는 정도가 커뮤니티 평균보다
              <span className={`font-bold ${comparisonData.myVarietySeeking < comparisonData.avgVarietyCommunity ? 'text-green-600' : 'text-red-600'}`}>
                {comparisonData.myVarietySeeking < comparisonData.avgVarietyCommunity ? ' 낮은 편입니다.' : ' 높은 편입니다.'}
              </span>
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2">동일 음식군 대비 나의 평점 및 선호도 위치 비교</p>
        </div>
      </div>
    </div>
  );
}