import React from 'react';
// TempDonutChart는 이 파일에서 사용되지 않으므로 임시로 주석 처리하거나, 실제 사용처에 따라 관리합니다.
// import TempDonutChart from './TempDonutChart'; // 도넛 차트 컴포넌트 임포트 (다른 곳에서 사용될 수 있으므로 유지)

export default function MonthlyAnalysis() {
  // 임시 데이터: 이달의 총 인기 음식 TOP 5 (리뷰 수 기준)
  const topFoods = [
    { name: "맛있는 불고기", reviews: 120, rating: 4.8 },
    { name: "신선한 샐러드", reviews: 95, rating: 4.5 },
    { name: "든든한 제육볶음", reviews: 80, rating: 4.3 },
    { name: "매콤한 떡볶이", reviews: 70, rating: 4.0 },
    { name: "시원한 냉면", reviews: 65, rating: 4.2 },
  ];
  const maxReviews = Math.max(...topFoods.map(food => food.reviews));

  // 임시 데이터: 이달의 총 최악 음식 TOP 5 (리뷰 수 기준, 낮은 평점)
  const worstFoods = [
    { name: "비린내 나는 생선구이", reviews: 15, rating: 2.1 },
    { name: "싱거운 된장찌개", reviews: 20, rating: 2.5 },
    { name: "딱딱한 탕수육", reviews: 25, rating: 2.8 },
    { name: "기름진 볶음밥", reviews: 30, rating: 3.0 },
    { name: "늦게 나온 파스타", reviews: 35, rating: 3.2 },
  ];
  const maxWorstReviews = Math.max(...worstFoods.map(food => food.reviews));

  // 임시 데이터: 월간 방문자 수 (누적 및 상승분 포함)
  const monthlyVisitors = {
    current: 15200, // 이달의 순수 방문자 수 (히스토그램용)
    previous: 14500, // 이전달 순수 방문자 수 (히스토그램용)
    monthlyTrend: [12000, 12500, 13000, 13500, 14000, 14500, 15200], // 7개월치 데이터 (히스토그램용)
    totalCumulative: 152000, // 전체 누적 방문자 수
    previousMonthCumulative: 140000, // 이전 달까지의 누적 방문자 수
  };
  const visitorIncrease = monthlyVisitors.totalCumulative - monthlyVisitors.previousMonthCumulative;
  const visitorChangePercentage = (
    (visitorIncrease / monthlyVisitors.previousMonthCumulative) * 100
  ).toFixed(2);


  // 임시 데이터: 누적 평가 수
  const cumulativeEvaluations = {
    currentMonth: 5011, // 이번 달에 발생한 평가 수
    totalCumulative: 15611, // 전체 누적 평가 수
    previousMonthCumulative: 10600, // 이전 달까지의 누적 평가 수
  };
  const evaluationIncrease = cumulativeEvaluations.totalCumulative - cumulativeEvaluations.previousMonthCumulative;
  const evaluationChangePercentage = (
    (evaluationIncrease / cumulativeEvaluations.previousMonthCumulative) * 100
  ).toFixed(2);

  // 임시 데이터: 평점 분포 통계 데이터 (분산 및 표준편차는 임시 값)
  const ratingDistribution = {
    min: 2.5,
    max: 5.0,
    avg: 4.1,
    iqrStart: 3.8, // 1분위수 (Q1)
    iqrEnd: 4.5,   // 3분위수 (Q3)
    variance: 0.35, // 임시 값 (실제 데이터로 계산 필요)
    stdDev: 0.59,   // 임시 값 (실제 데이터로 계산 필요)
  };

  // 임시 데이터: 최빈 방문 유저 Top 5
  const frequentVisitors = [
    { name: "김*원", visits: 30, lastVisit: "2024.06.14" },
    { name: "이*희", visits: 28, lastVisit: "2024.06.13" },
    { name: "박*호", visits: 25, lastVisit: "2024.06.12" },
    { name: "최*영", visits: 22, lastVisit: "2024.06.11" },
    { name: "정*진", visits: 20, lastVisit: "2024.06.10" },
  ];

  // 이달의 평점 (전체 평균)
  const monthlyOverallRating = {
    average: 4.1,
    totalEvaluations: cumulativeEvaluations.currentMonth,
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 md:p-8"> {/* 전체 레이아웃을 위한 패딩 추가 */}
      {/* 첫 번째 행: 이달의 평점, 누적 평가 수, 월간 누적 방문자 수 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"> {/* mt-6 추가 */}
        {/* 이달의 평점 */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">✨ 이달의 평점</h3>
          <p className="text-5xl font-bold text-yellow-500 mb-2">{monthlyOverallRating.average.toFixed(1)} ★</p>
          <p className="text-sm text-gray-600 mt-1">총 {monthlyOverallRating.totalEvaluations.toLocaleString()}개 평가</p>
        </div>

        {/* 누적 평가 수 */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">⭐ 누적 평가 수</h3>
          <p className="text-5xl font-bold text-orange-500 mb-2">{cumulativeEvaluations.totalCumulative.toLocaleString()}개</p>
          {/* 누적 평가 상승분 색상 변경 */}
          <div className="text-lg font-semibold mt-2 ${evaluationIncrease >= 0 ? 'text-blue-500' : 'text-orange-500'}">
            {evaluationIncrease >= 0 ? '▲' : '▼'} {evaluationIncrease.toLocaleString()}개
          </div>
        </div>

        {/* 월간 누적 방문자 수 */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 월간 누적 방문자 수</h3>
          <p className="text-5xl font-bold text-blue-600 mb-2">{monthlyVisitors.totalCumulative.toLocaleString()}명</p>
          <div className="text-lg font-semibold mt-2 ${visitorIncrease >= 0 ? 'text-blue-500' : 'text-orange-500'}">
            이번 달 {visitorIncrease >= 0 ? '▲' : '▼'} {visitorIncrease.toLocaleString()}명 (
            {Math.abs(parseFloat(visitorChangePercentage))}%
            )
          </div>
        </div>
      </div>

      {/* 두 번째 행: 이달의 총 인기 음식 Top5, 이달의 총 최악 음식 Top5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"> {/* mt-6 추가 */}
        {/* 이달의 총 인기 음식 TOP 5 */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🔝 이달의 인기 음식 TOP 5</h3>
          <div className="space-y-3">
            {topFoods.map((food, index) => (
              <div key={index} className="flex items-center">
                <span className="w-24 text-sm font-medium text-gray-700 truncate">{food.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative ml-4">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(food.reviews / maxReviews) * 100}%` }}
                  ></div>
                  <span className="absolute right-2 top-0 text-xs text-white leading-4 font-bold">
                    {food.reviews}
                  </span>
                </div>
                <span className="ml-4 text-sm text-gray-600">{food.rating.toFixed(1)} ★</span>
              </div>
            ))}
          </div>
        </div>

        {/* 이달의 총 최악 음식 TOP 5 */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💔 이달의 최악 음식 TOP 5</h3>
          <div className="space-y-3">
            {worstFoods.map((food, index) => (
              <div key={index} className="flex items-center">
                <span className="w-24 text-sm font-medium text-gray-700 truncate">{food.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative ml-4">
                  <div
                    className="bg-red-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(food.reviews / maxWorstReviews) * 100}%` }}
                  ></div>
                    <span className="absolute right-2 top-0 text-xs text-white leading-4 font-bold">
                      {food.reviews}
                    </span>
                </div>
                <span className="ml-4 text-sm text-gray-600">{food.rating.toFixed(1)} ★</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* 세 번째 행: 평점 분포 통계, 최빈 방문 유저 Top 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"> {/* mt-6 추가 */}
        {/* 평점 분포 통계 - 심플 버전 (업데이트) */}
        <div className="bg-white pt-12 px-8 pb-8 rounded-lg shadow border border-gray-200 min-h-[260px]">
          <h3 className="text-xl font-semibold text-gray-800 mb-12">🧾 평점 분포 통계</h3>
          <div className="grid grid-cols-2 gap-4 gap-y-10 text-center">
            <div className="flex flex-col items-center">
              <p className="text-base text-gray-500">1분위수 (Q1)</p>
              <p className="text-2xl font-bold text-blue-600">{ratingDistribution.iqrStart.toFixed(1)}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-base text-gray-500">3분위수 (Q3)</p>
              <p className="text-2xl font-bold text-blue-600">{ratingDistribution.iqrEnd.toFixed(1)}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-base text-gray-500">분산</p>
              <p className="text-2xl font-bold text-purple-600">{ratingDistribution.variance.toFixed(2)}</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-base text-gray-500">표준편차</p>
              <p className="text-2xl font-bold text-purple-600">{ratingDistribution.stdDev.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* 최빈 방문 유저 Top 5 */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">👑 최빈 방문 유저 Top 5</h3>
          <div className="space-y-3">
            {frequentVisitors.map((visitor, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                <span className="text-lg font-medium text-gray-700">{index + 1}. {visitor.name}</span>
                <span className="text-sm text-gray-600">{visitor.visits}회 방문 (마지막: {visitor.lastVisit})</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">월간 가장 많이 방문한 사용자 목록</p>
        </div>
      </div>
    </div>
  );
}