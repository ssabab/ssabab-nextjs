import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import api from '@/lib/api';
import { AxiosError } from 'axios';

// API 응답 데이터 타입 정의
interface UserSummary {
  avgScore: number;
  totalReviews: number;
}

interface FoodRank {
  foodName: string;
  foodScore: number;
}

interface CategoryStat {
  category: string;
  count: number;
}

interface TagStat {
  tag: string;
  count: number;
}

interface UserInsight {
  insight: string;
}

interface GroupComparison {
  userAvgScore: number;
  userDiversityScore: number;
  groupAvgScore: number;
  groupDiversityScore: number;
}

interface PersonalAnalysisData {
  dm_user_summary: UserSummary;
  dm_user_food_rating_rank_best: FoodRank[];
  dm_user_food_rating_rank_worst: FoodRank[];
  dm_user_category_stats: CategoryStat[];
  dm_user_tag_stats: TagStat[];
  dm_user_insight: UserInsight;
  dm_user_group_comparison: GroupComparison;
}


export function PersonalAnalysis() {
  const { token } = useAuthStore();
  const [data, setData] = useState<PersonalAnalysisData | null>(null);
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
        const res = await api.get<PersonalAnalysisData>('/api/analysis/personal', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (err) {
        if (err instanceof AxiosError && err.response) {
            setError(err.response.data?.message || '데이터를 불러오는 데 실패했습니다.');
        } else if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('알 수 없는 오류가 발생했습니다.');
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
    dm_user_insight,
    dm_user_group_comparison,
  } = data;

  const tagCloudOptions = {
    minSize: 12,
    maxSize: 48,
  };
  
  const totalCategoryCount = dm_user_category_stats.reduce((sum, cat) => sum + cat.count, 0);
  const preferredCategories = totalCategoryCount > 0 ? dm_user_category_stats.map(cat => ({
    name: cat.category,
    percentage: parseFloat(((cat.count / totalCategoryCount) * 100).toFixed(1)),
  })) : [];
  
  // 워드 클라우드 데이터 가공
  const maxTagCount = Math.max(...dm_user_tag_stats.map(t => t.count), 1);
  const preferredKeywordsForCloud = dm_user_tag_stats.map(tag => ({
    value: tag.tag,
    count: tag.count,
    // count에 따라 색상이나 다른 스타일을 동적으로 부여할 수 있습니다.
    // 예시: color: `rgba(34, 197, 94, ${tag.count / maxTagCount})`
  }));


  return (
    <div className="space-y-8">
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
                    style={{ fontSize: `${fontSize}px` }}
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
            {dm_user_insight.insight}
          </p>
          <p className="text-sm text-gray-500 mt-2">전처리된 자연어 요약 문장</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🆚 전체 평균과의 차이</h3>
          <div className="space-y-3 bg-gray-50 p-4 rounded-md border border-gray-200 min-h-[150px] flex flex-col justify-center">
            <p className="text-gray-700">
              <span className="font-semibold">평점:</span> 내 평균 평점({dm_user_group_comparison.userAvgScore.toFixed(2)}점)은 전체 평균({dm_user_group_comparison.groupAvgScore.toFixed(2)}점)보다
              <span className={`font-bold ${dm_user_group_comparison.userAvgScore >= dm_user_group_comparison.groupAvgScore ? 'text-green-600' : 'text-red-600'}`}>
                {dm_user_group_comparison.userAvgScore >= dm_user_group_comparison.groupAvgScore ? ' 높거나 같습니다.' : ' 낮습니다.'}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">다양성:</span> 나의 식사 다양성 점수({dm_user_group_comparison.userDiversityScore.toFixed(2)})는 전체 평균({dm_user_group_comparison.groupDiversityScore.toFixed(2)})보다
              <span className={`font-bold ${dm_user_group_comparison.userDiversityScore >= dm_user_group_comparison.groupDiversityScore ? 'text-green-600' : 'text-red-600'}`}>
                {dm_user_group_comparison.userDiversityScore >= dm_user_group_comparison.groupDiversityScore ? ' 높거나 같습니다.' : ' 낮습니다.'}
              </span>
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-2">나의 식사 평점 및 다양성 위치 비교</p>
        </div>
      </div>
    </div>
  );
}