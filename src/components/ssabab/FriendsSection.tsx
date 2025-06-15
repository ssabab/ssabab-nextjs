'use client'

import React from 'react';

export default function FriendsSection() {
  // 임시 친구들의 메뉴 선택 데이터 (A, B 메뉴를 선택한 친구 수)
  // 실제로는 서버에서 현재 로그인한 사용자의 친구들이 어떤 메뉴를 선택했는지
  // 집계된 데이터를 받아와야 합니다.
  const friendChoices = {
    menuASelected: 7, // A 메뉴를 선택한 친구 수
    menuBSelected: 3, // B 메뉴를 선택한 친구 수
  };

  return (
    <section className="bg-white shadow rounded-lg p-6 space-y-4 font-sans"> {/* font-sans 적용 */}
      <h3 className="text-lg font-semibold text-gray-800">친구들의 선택</h3>
      <div className="flex justify-around items-center py-4">
        {/* A 메뉴 선택 친구 수 */}
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-blue-600">A</span>
          <span className="text-3xl font-extrabold text-blue-600 mt-1">
            {friendChoices.menuASelected}
            <span className="text-xl">명</span>
          </span>
        </div>

        {/* 비교 구분선 또는 텍스트 */}
        <span className="text-3xl font-bold text-gray-400 mx-6">VS</span>

        {/* B 메뉴 선택 친구 수 */}
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-green-600">B</span>
          <span className="text-3xl font-extrabold text-green-600 mt-1">
            {friendChoices.menuBSelected}
            <span className="text-xl">명</span>
          </span>
        </div>
      </div>
      <p className="text-center text-gray-500 text-sm mt-4">
        총 {friendChoices.menuASelected + friendChoices.menuBSelected}명의 친구가 오늘 메뉴를 선택했어요!
      </p>
    </section>
  );
}