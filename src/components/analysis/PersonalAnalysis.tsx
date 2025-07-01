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
        const res = await api.get<PersonalAnalysisResponse>('api/analysis/personal');
        setData(res.data);
      } catch (err: unknown) {
        if (isAxiosError(err)) {
          console.error("API 요청 오류:", err.response?.data || err.message, err);
          setError(err.response?.data?.message || err.message || '데이터를 불러오는 데 실패했습니다.');
        } else if (err instanceof Error) {
          console.error("일반 오류:", err);
          setError(err.message);
        } else {
          console.error("알 수 없는 오류:", err);
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
    dm_user_summary,
    dm_user_food_rating_rank_best,
    dm_user_food_rating_rank_worst,
    dm_user_category_stats,
    dm_user_tag_stats,
    dm_user_review_word,
    dm_user_insight,
    dm_user_group_comparison,
  } = data;

  const tagCloudOptions = {
    minSize: 12,
    maxSize: 48,
  };
  
  // 워드 클라우드 데이터 가공
  const maxTagCount = Math.max(...dm_user_tag_stats.map(t => t.count), 1);
  const tagColors = ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#3B82F6', '#6366F1', '#EC4899'];


  return (
    <div className="space-y-8">
      {/* 새로운 Personal Dashboard Summary 섹션 추가 */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">나의 분석 대시보드</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">평균 평점</p>
            <p className="text-3xl font-bold text-blue-700">{dm_user_summary.avgScore.toFixed(2)} <span className="text-xl">/ 5</span></p>
            <p className="text-xs text-gray-500">총 {dm_user_summary.totalReviews}개 리뷰</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">커뮤니티 대비 평균 평점</p>
            <p className="text-lg font-bold text-purple-700">
              나: {dm_user_group_comparison.userAvgScore.toFixed(2)} vs 커뮤니티: {dm_user_group_comparison.groupAvgScore.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">평균 평점 비교</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">개인 인사이트</p>
            <p className="text-md font-semibold text-green-700 line-clamp-2">{dm_user_insight.insight || '아직 인사이트가 없습니다.'}</p>
          </div>
          {dm_user_food_rating_rank_best.length > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">최고 평가 음식</p>
              <p className="text-lg font-bold text-yellow-700">{dm_user_food_rating_rank_best[0].foodName}</p>
              <p className="text-xs text-gray-500">{dm_user_food_rating_rank_best[0].foodScore.toFixed(1)} ★</p>
            </div>
          )}
          {dm_user_food_rating_rank_worst.length > 0 && (
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600">최악 평가 음식</p>
              <p className="text-lg font-bold text-red-700">{dm_user_food_rating_rank_worst[0].foodName}</p>
              <p className="text-xs text-gray-500">{dm_user_food_rating_rank_worst[0].foodScore.toFixed(1)} ★</p>
            </div>
          )}
        </div>
      </div>

      {/* 1. 평균 평점 및 전체 리뷰 수 */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">⭐ 평균 평점 및 전체 리뷰 수</h3>
          <p className="text-5xl font-bold text-indigo-600">{dm_user_summary.avgScore.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">총 {dm_user_summary.totalReviews}개 리뷰</p>
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
              strokeDashoffset={(1 - (dm_user_summary.avgScore / 5)) * 282.7} // 5점 만점
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{dm_user_summary.avgScore.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* 2. 가장 높게 평가한 음식 TOP 5 / 3. 가장 낮게 평가한 음식 TOP 5 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💯 가장 높게 평가한 음식 TOP 5</h3>
          <div className="space-y-4">
            {dm_user_food_rating_rank_best.slice(0, 5).map((food, index) => (
              <div key={index} className="flex items-center space-x-4 border-b pb-3 last:border-b-0 last:pb-0">
                <p className="font-semibold text-gray-700">{food.foodName}</p>
                <p className="text-sm text-yellow-500">{food.foodScore.toFixed(1)} ★</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💔 가장 낮게 평가한 음식 TOP 5</h3>
          <div className="space-y-4">
            {dm_user_food_rating_rank_worst.slice(0, 5).map((food, idx) => (
              <div key={idx} className="flex items-center space-x-4 border-b pb-3 last:border-b-0 last:pb-0">
                <p className="font-semibold text-gray-700">{food.foodName}</p>
                <p className="text-sm text-red-500">{food.foodScore.toFixed(1)} ★</p>
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
                  return dm_user_category_stats.map((category, index) => {
                    // 카테고리 percentage가 없으므로 count를 기반으로 전체 대비 비율 계산
                    const totalCategoryCount = dm_user_category_stats.reduce((sum, c) => sum + c.count, 0);
                    const percentage = totalCategoryCount > 0 ? (category.count / totalCategoryCount) * 100 : 0;
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
              {dm_user_category_stats.map((category, index) => {
                const totalCategoryCount = dm_user_category_stats.reduce((sum, c) => sum + c.count, 0);
                const percentage = totalCategoryCount > 0 ? (category.count / totalCategoryCount) * 100 : 0;
                return (
                  <li key={index} className="flex items-center">
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#3B82F6'][index % 5] }}
                    ></span>
                      {category.category} ({percentage.toFixed(1)}%)
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-sm text-gray-500 mt-4">평점 기반 선호 카테고리 비중 시각화</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🏷️ 선호 키워드 (워드클라우드)</h3>
          <div className="h-60 w-full flex items-center justify-center bg-gray-50 rounded-md border border-gray-200 p-2 overflow-hidden">
            <div className="flex flex-wrap justify-center items-center gap-2 max-w-full">
              {dm_user_tag_stats.map((tag, index) => {
                const fontSize = tagCloudOptions.minSize + (tag.count / maxTagCount) * (tagCloudOptions.maxSize - tagCloudOptions.minSize);
                // 새로운 데이터에 tag.color가 없으므로 tagColors 배열 사용
                const color = tagColors[index % tagColors.length];
                return (
                  <span
                    key={`tag-${index}-${tag.tag}`}
                    style={{ fontSize: `${fontSize}px`, color: color }}
                    className="inline-block m-1 px-3 py-1 bg-blue-100 rounded-full font-semibold cursor-default transition-all duration-300 hover:bg-blue-200"
                  >
                    #{tag.tag}
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
            {dm_user_insight.insight}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 전체 평균과의 차이</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">평균 평점</span>
              <div className="text-right">
                <p className="font-bold text-lg text-blue-600">{dm_user_group_comparison.userAvgScore.toFixed(2)} (나)</p>
                <p className="text-sm text-gray-500">{dm_user_group_comparison.groupAvgScore.toFixed(2)} (전체)</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">다양성 추구</span>
              <div className="text-right">
                <p className="font-bold text-lg text-red-600">{dm_user_group_comparison.userDiversityScore.toFixed(2)} (나)</p>
                <p className="text-sm text-gray-500">{dm_user_group_comparison.groupDiversityScore.toFixed(2)} (전체)</p>
              </div>
            </div>
            {/* 매운맛 선호도 관련 데이터는 현재 dm_user_group_comparison에 명확히 없으므로,
                다양성 추구와 동일한 데이터를 사용하거나 이 섹션을 제거할 수 있습니다.
                여기서는 다양성 추구 데이터로 대체했습니다. */}
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">선호도 다양성</span>
              <div className="text-right">
                <p className="font-bold text-lg text-green-600">{dm_user_group_comparison.userDiversityScore.toFixed(2)} (나)</p>
                <p className="text-sm text-gray-500">{dm_user_group_comparison.groupDiversityScore.toFixed(2)} (전체)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. 자주 사용한 리뷰 단어 */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">💬 자주 사용한 리뷰 단어</h3>
        {dm_user_review_word && dm_user_review_word.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {dm_user_review_word.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                <span className="font-medium text-gray-700">'{item.word}'</span>
                <span className="text-sm text-gray-500">({item.count}회)</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">아직 자주 사용한 리뷰 단어가 없습니다.</p>
        )}
      </div>
    </div>
  );
}