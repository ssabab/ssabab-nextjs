import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
// TempDonutChart는 이 파일에서 사용되지 않으므로 임시로 주석 처리하거나, 실제 사용처에 따라 관리합니다.
// import TempDonutChart from './TempDonutChart'; // 도넛 차트 컴포넌트 임포트 (다른 곳에서 사용될 수 있으므로 유지)

// 데이터 구조에 대한 인터페이스 정의
interface Food {
  name: string;
  reviews: number;
  rating: number;
}

interface MonthlyVisitors {
  current: number;
  previous: number;
  totalCumulative: number;
  previousMonthCumulative: number;
}

interface CumulativeEvaluations {
  currentMonth: number;
  totalCumulative: number;
  previousMonthCumulative: number;
}

interface RatingDistribution {
  min: number;
  max: number;
  avg: number;
  iqrStart: number;
  iqrEnd: number;
  variance: number;
  stdDev: number;
}

interface FrequentVisitor {
  name: string;
  visits: number;
  lastVisit: string;
}

interface MonthlyOverallRating {
  average: number;
  totalEvaluations: number;
}

interface MonthlyAnalysisData {
  topFoods: Food[];
  worstFoods: Food[];
  monthlyVisitors: MonthlyVisitors;
  cumulativeEvaluations: CumulativeEvaluations;
  ratingDistribution: RatingDistribution;
  frequentVisitors: FrequentVisitor[];
  monthlyOverallRating: MonthlyOverallRating;
}

export default function MonthlyAnalysis() {
  const [analysisData, setAnalysisData] = useState<MonthlyAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMonthlyAnalysis = async () => {
      try {
        const response = await api.get<MonthlyAnalysisData>('/api/analysis/monthly');
        setAnalysisData(response.data);
      } catch (err) {
        setError('월간 분석 데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyAnalysis();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">월간 분석 데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">오류: {error}</div>;
  }

  if (!analysisData) {
    return <div className="p-8 text-center">데이터가 없습니다.</div>;
  }

  const {
    topFoods,
    worstFoods,
    monthlyVisitors,
    cumulativeEvaluations,
    ratingDistribution,
    frequentVisitors,
    monthlyOverallRating,
  } = analysisData;

  const maxReviews = Math.max(...topFoods.map(food => food.reviews), 0);
  const maxWorstReviews = Math.max(...worstFoods.map(food => food.reviews), 0);

  const visitorIncrease = monthlyVisitors.totalCumulative - monthlyVisitors.previousMonthCumulative;
  const visitorChangePercentage = monthlyVisitors.previousMonthCumulative > 0 ? (
    (visitorIncrease / monthlyVisitors.previousMonthCumulative) * 100
  ).toFixed(2) : "0.00";


  const evaluationIncrease = cumulativeEvaluations.totalCumulative - cumulativeEvaluations.previousMonthCumulative;
  const evaluationChangePercentage = cumulativeEvaluations.previousMonthCumulative > 0 ? (
    (evaluationIncrease / cumulativeEvaluations.previousMonthCumulative) * 100
  ).toFixed(2) : "0.00";

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
          <div className={`text-lg font-semibold mt-2 ${evaluationIncrease >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
            {evaluationIncrease >= 0 ? '▲' : '▼'} {evaluationIncrease.toLocaleString()}개 ({evaluationChangePercentage}%)
          </div>
        </div>

        {/* 월간 누적 방문자 수 */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📈 월간 누적 방문자 수</h3>
          <p className="text-5xl font-bold text-blue-600 mb-2">{monthlyVisitors.totalCumulative.toLocaleString()}명</p>
          <div className={`text-lg font-semibold mt-2 ${visitorIncrease >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>
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
                    style={{ width: `${maxReviews > 0 ? (food.reviews / maxReviews) * 100 : 0}%` }}
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
                    style={{ width: `${maxWorstReviews > 0 ? (food.reviews / maxWorstReviews) * 100 : 0}%` }}
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