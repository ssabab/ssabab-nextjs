// src/components/analysis/AnalysisContentLayout.tsx
import React from 'react';

// 임시 데이터 및 그래프 컴포넌트 (하단에 정의)
import TempDonutChart from '@/components/analysis/TempDonutChart';
import TempBarChart from '@/components/analysis/TempBarChart';

export default function AnalysisContentLayout() {
  // 임시 데이터: 식단 투표 결과
  const foodPollResults = [
    { name: "대한국", rating: 3.3, star: 5 },
    { name: "맘스터치", rating: 2.2, star: 4 },
    { name: "소복이닭구이무한", rating: 1.6, star: 3 },
    { name: "지연소스", rating: 2.4, star: 4 },
    { name: "쿠폰농장", rating: 2.4, star: 4 },
    { name: "모아미용", rating: 3.8, star: 5 },
    { name: "보리미역", rating: 2.9, star: 4 },
  ];

  // 임시 데이터: 분포 그래프 (기수, 나이, 성별, 분별)
  const distributionData = {
    term: [30, 70], // 1기:30, 2기:70 (단순화)
    age: [15, 25, 30, 20, 10], // 20대:15, 30대:25 등 (단순화)
    gender: [40, 60], // 남:40, 여:60
    division: [20, 25, 15, 20, 20], // 1분과:20, 2분과:25 등 (단순화)
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 좌측 컬럼: 식단 투표 결과 */}
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">식단 투표 결과를 확인해 보세요</h3>
        <div className="space-y-3 mb-6">
          {foodPollResults.map((food, index) => (
            <div key={index} className="flex justify-between items-center text-sm text-gray-600">
              <span className="flex items-center">
                <span className="mr-1 text-yellow-400">{'★'.repeat(food.star)}</span>
                {food.name}
              </span>
              <span>{food.rating}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-around items-center space-x-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">식단 투표 결과</p>
            <TempDonutChart percentage={75} color="#FF7F50" /> {/* 이미지 색상에 맞춰 오렌지 계열 */}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">실재 재능 선택 결과</p>
            <TempDonutChart percentage={60} color="#FF7F50" /> {/* 이미지 색상에 맞춰 오렌지 계열 */}
          </div>
        </div>
      </div>

      {/* 중앙 컬럼: 기수, 나이, 성별, 분별 분포 */}
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          기수, 나이, 성별, 분별 <br/> 선택 분포를 한눈에 확인할 수 있어요
        </h3>
        <div className="space-y-6">
          {/* 기수 */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">기수</p>
            <div className="flex justify-around items-end h-20 bg-gray-50 rounded p-2">
              <TempBarChart value={distributionData.term[0]} label="1기" />
              <TempBarChart value={distributionData.term[1]} label="2기" />
            </div>
          </div>
          {/* 성별 */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">성별</p>
            <div className="flex justify-around items-end h-20 bg-gray-50 rounded p-2">
              <TempBarChart value={distributionData.gender[0]} label="남" />
              <TempBarChart value={distributionData.gender[1]} label="여" />
            </div>
          </div>
          {/* 나이 */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">나이</p>
            <div className="flex justify-around items-end h-20 bg-gray-50 rounded p-2">
              <TempBarChart value={distributionData.age[0]} label="20대" />
              <TempBarChart value={distributionData.age[1]} label="30대" />
              <TempBarChart value={distributionData.age[2]} label="40대" />
              <TempBarChart value={distributionData.age[3]} label="50대" />
              <TempBarChart value={distributionData.age[4]} label="60대" />
            </div>
          </div>
          {/* 분별 */}
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">분별</p>
            <div className="flex justify-around items-end h-20 bg-gray-50 rounded p-2">
              <TempBarChart value={distributionData.division[0]} label="1분과" />
              <TempBarChart value={distributionData.division[1]} label="2분과" />
              <TempBarChart value={distributionData.division[2]} label="3분과" />
              <TempBarChart value={distributionData.division[3]} label="4분과" />
              <TempBarChart value={distributionData.division[4]} label="5분과" />
            </div>
          </div>
        </div>
      </div>

      {/* 우측 컬럼: 한 줄씩 워드 카운트 */}
      <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">워드 카운트</h3>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 h-64 flex items-center justify-center text-gray-500 text-sm italic">
          워드 클라우드 또는 키워드 분석 결과가 여기에 표시됩니다.
          <br/>
          (추후 실제 컴포넌트로 대체 예정)
        </div>
      </div>
    </div>
  );
}

