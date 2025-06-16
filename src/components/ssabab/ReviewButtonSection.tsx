'use client'

import React from 'react';
import Link from 'next/link'; // Next.js의 Link 컴포넌트 임포트
import { MdOutlineRateReview } from 'react-icons/md'; // 아이콘 추가

export default function ReviewButtonSection() {
  return (
    <section className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center font-sans">
      <Link
        href="/review"
        className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-full text-lg font-bold
                   transition-all duration-300 ease-in-out
                   hover:bg-gray-800 hover:scale-105 hover:shadow-lg"
        aria-label="평가하러 가기"
      >
        <MdOutlineRateReview size={24} className="mr-3" />
        <span>오늘의 점심 평가하러 가기</span>
      </Link>
    </section>
  );
}