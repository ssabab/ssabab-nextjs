import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import api, { PersonalAnalysisResponse } from '@/lib/api';
import { isAxiosError } from 'axios';

export function PersonalAnalysis() {
  const { token } = useAuthStore();
  const [data, setData] = useState<PersonalAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
        setLoading(false);
        setError("개인 분석을 보려면 로그인이 필요합니다.");
        return;
    }

    const fetchPersonalAnalysis = async () => {
      try {
        setLoading(true);
        const res = await api.get<{ personalAnalysis: PersonalAnalysisResponse }>('/analysis/personal');
        setData(res.data.personalAnalysis);
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          setError(err.response?.data?.message || err.message || '데이터를 불러오는 데 실패했습니다.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('데이터를 불러오는 데 실패했습니다.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalAnalysis();
  }, [token]);

  if (loading) return <div className="p-8 text-center">개인화 분석 데이터를 불러오는 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">오류: {error}</div>;
  if (!data) return <div className="p-8 text-center">분석 데이터가 없습니다.</div>;
  
  const {
    ratingData,
    topRatedFoods,
    lowestRatedFoods,
    preferredCategories,
    preferredKeywordsForCloud,
    personalInsight,
    comparisonData,
  } = data;

  const tagCloudOptions = {
    minSize: 12,
    maxSize: 48,
  };
  
  // 워드 클라우드 데이터 가공
  const maxTagCount = Math.max(...preferredKeywordsForCloud.map(t => t.count), 1);


  return (
    <div className="space-y-8">
      {/* 1. 평균 평점 및 전체 리뷰 수 */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">⭐ 평균 평점 및 전체 리뷰 수</h3>
          <p className="text-5xl font-bold text-indigo-600">{ratingData.averageRating.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">총 {ratingData.totalReviews}개 리뷰</p>
        </div>
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
            <span className="text-2xl font-bold text-gray-800">{ratingData.averageRating.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 2. 가장 높게 평가한 음식 TOP 5 / 3. 가장 낮게 평가한 음식 TOP 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💯 가장 높게 평가한 음식 TOP 5</h3>
          <div className="space-y-4">
            {topRatedFoods.slice(0, 5).map((food, index) => (
              <div key={index} className="flex items-center space-x-4 border-b pb-3 last:border-b-0 last:pb-0">
                <p className="font-semibold text-gray-700">{food.name}</p>
                <p className="text-sm text-yellow-500">{food.rating.toFixed(1)} ★</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💔 가장 낮게 평가한 음식 TOP 5</h3>
          <div className="space-y-4">
            {lowestRatedFoods.slice(0, 5).map((food, idx) => (
              <div key={idx} className="flex items-center space-x-4 border-b pb-3 last:border-b-0 last:pb-0">
                <p className="font-semibold text-gray-700">{food.name}</p>
                <p className="text-sm text-red-500">{food.rating.toFixed(1)} ★</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. 선호 카테고리 & 5. 선호 키워드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📌 선호 카테고리</h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {(() => {
                  let cumulativePercentage = 0;
                  const colors = ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#3B82F6'];
                  return preferredCategories.map((category, index) => {
                    const percentage = category.percentage;
                    if (percentage === 0) return null;
                    
                    const startAngle = cumulativePercentage * 3.6;
                    cumulativePercentage += percentage;
                    const endAngle = cumulativePercentage * 3.6;

                    const largeArcFlag = percentage > 50 ? 1 : 0;
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
                <circle cx="50" cy="50" r="25" fill="#fff" />
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

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🏷️ 선호 키워드 (워드클라우드)</h3>
          <div className="h-60 w-full flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 p-2 overflow-hidden">
            <div className="flex flex-wrap justify-center items-center gap-2 max-w-full">
              {preferredKeywordsForCloud.map((tag, index) => {
                const fontSize = tagCloudOptions.minSize + (tag.count / maxTagCount) * (tagCloudOptions.maxSize - tagCloudOptions.minSize);
                return (
                  <span
                    key={`tag-${index}-${tag.value}`}
                    style={{ fontSize: `${fontSize}px`, color: tag.color }}
                    className="inline-block m-1 px-3 py-1 bg-blue-100 rounded-full font-semibold cursor-default transition-all duration-300 hover:bg-blue-200"
                  >
                    #{tag.value}
                  </span>
                );
              })}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">리뷰에서 추출된 태그 강조 (빈도에 따른 크기)</p>
        </div>
      </div>

      {/* 6. 개인 인사이트 요약 & 8. 전체 평균과의 차이 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🧠 개인 인사이트 요약</h3>
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-200 min-h-[150px]">
            {personalInsight}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 전체 평균과의 차이</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">평균 평점</span>
              <div className="text-right">
                <p className="font-bold text-lg text-blue-600">{comparisonData.myRating.toFixed(2)} (나)</p>
                <p className="text-sm text-gray-500">{comparisonData.avgRatingCommunity.toFixed(2)} (전체)</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">매운맛 선호도</span>
              <div className="text-right">
                <p className="font-bold text-lg text-red-600">{comparisonData.mySpicyPreference.toFixed(2)} (나)</p>
                <p className="text-sm text-gray-500">{comparisonData.avgSpicyCommunity.toFixed(2)} (전체)</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">다양성 추구</span>
              <div className="text-right">
                <p className="font-bold text-lg text-green-600">{comparisonData.myVarietySeeking.toFixed(2)} (나)</p>
                <p className="text-sm text-gray-500">{comparisonData.avgVarietyCommunity.toFixed(2)} (전체)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}