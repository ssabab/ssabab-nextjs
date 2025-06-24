import React, { useEffect, useState } from 'react';
import { usePersonalAnalysisStore } from '@/stores/usePersonalAnalysisStore'
import api from '@/lib/api'

export function PersonalAnalysis() {
  const { data, setData } = usePersonalAnalysisStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get('/api/analysis/personal')
      .then(res => {
        setData(res.data)
      })
      .catch(err => {
        if (err.response) {
          setError(`요청 실패: ${err.response.status} ${err.response.statusText}`)
        } else {
          setError(err.message)
        }
      })
  }, [setData])
  
  if (error) return <div>에러: {error}</div>
  if (!data) return <div>로딩중...</div>

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


  return (
    <div className="space-y-8">
      {/* 1. 평균 평점 및 전체 리뷰 수 (숫자 카드 + 게이지 차트) */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">⭐ 평균 평점 및 전체 리뷰 수</h3>
          <p className="text-5xl font-bold text-indigo-600">{data.ratingData.averageRating}</p>
          <p className="text-sm text-gray-500 mt-1">총 {data.ratingData.totalReviews}개 리뷰</p>
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
              strokeDashoffset={(1 - (data.ratingData.averageRating / 5)) * 282.7} // 5점 만점
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{data.ratingData.averageRating}</span>
          </div>
        </div>
      </div>

      {/* 2. 가장 높게 평가한 음식 TOP 3 / 3. 가장 낮게 평가한 음식 TOP 3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 가장 높게 평가한 음식 TOP 3 */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💯 가장 높게 평가한 음식 TOP 3</h3>
          <div className="space-y-4">
            {(data.topRatedFoods ?? []).map((food, index) => (
              <div key={index} className="flex items-center space-x-4 border-b pb-3 last:border-b-0 last:pb-0">
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
            {(data.lowestRatedFoods ?? []).map((food, idx) => (
              <div key={idx} className="flex items-center space-x-4 border-b pb-3 last:border-b-0 last:pb-0">
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
                  return data.preferredCategories.map((category, index) => {
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
              {(data.preferredCategories ?? []).map((category, index) => (
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

        {/* 선호 키워드 (커스텀 워드클라우드) */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🏷️ 선호 키워드 (워드클라우드)</h3>
          {/* 커스텀 워드 클라우드 컨테이너 */}
          <div className="h-60 w-full flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 p-2 overflow-hidden">
            <div className="flex flex-wrap justify-center items-center gap-2 max-w-full">
              {(data.preferredKeywordsForCloud ?? []).map((tag, index) => {
                const fontSize = tagCloudOptions.minSize + (tag.count / 10) * (tagCloudOptions.maxSize - tagCloudOptions.minSize);
                return (
                  <span
                    key={`tag-${index}-${tag.value}`}
                    style={{
                      fontSize: `${fontSize}px`,
                      color: tag.color,
                    }}
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

      {/* 6. 개인 인사이트 요약 & 8. 전체 평균과의 차이 - 한 행에 배치 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 개인 인사이트 요약 (텍스트 박스) */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🧠 개인 인사이트 요약</h3>
          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-200 min-h-[150px]">
            {data.personalInsight}
          </p>
          <p className="text-sm text-gray-500 mt-2">전처리된 자연어 요약 문장</p>
        </div>

        {/* 전체 평균과의 차이 (간단 비교 텍스트) */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🆚 전체 평균과의 차이</h3>
          <div className="space-y-3 bg-gray-50 p-4 rounded-md border border-gray-200 min-h-[150px] flex flex-col justify-center">
            <p className="text-gray-700">
              <span className="font-semibold">평점:</span> 내 평균 평점({data.comparisonData.myRating}점)은 커뮤니티 평균({data.comparisonData.avgRatingCommunity}점)보다
              <span className={`font-bold ${data.comparisonData.myRating > data.comparisonData.avgRatingCommunity ? 'text-green-600' : 'text-red-600'}`}>
                {data.comparisonData.myRating > data.comparisonData.avgRatingCommunity ? ' 높습니다.' : ' 낮습니다.'}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">매운맛 선호도:</span> 저는 커뮤니티 평균보다
              <span className={`font-bold ${data.comparisonData.mySpicyPreference > data.comparisonData.avgSpicyCommunity ? 'text-green-600' : 'text-red-600'}`}>
                {data.comparisonData.mySpicyPreference > data.comparisonData.avgSpicyCommunity ? ' 매운맛을 더 선호합니다.' : ' 덜 선호합니다.'}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">다양성 추구:</span> 새로운 음식을 시도하는 정도가 커뮤니티 평균보다
              <span className={`font-bold ${data.comparisonData.myVarietySeeking < data.comparisonData.avgVarietyCommunity ? 'text-green-600' : 'text-red-600'}`}>
                {data.comparisonData.myVarietySeeking < data.comparisonData.avgVarietyCommunity ? ' 낮은 편입니다.' : ' 높은 편입니다.'}
              </span>
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2">동일 음식군 대비 나의 평점 및 선호도 위치 비교</p>
        </div>
      </div>
    </div>
  );
}