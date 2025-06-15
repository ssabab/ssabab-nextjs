'use client'

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { HiXMark } from "react-icons/hi2";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface LoginFormProps {
  className?: string;
  onClose: () => void;
}

export function LoginForm({ className, onClose, ...props }: LoginFormProps) {
  // Google 로그인 버튼 클릭 핸들러
  const handleGoogleLogin = () => {
    // alert('Google 로그인 페이지로 이동합니다.'); // 필요하다면 메시지 추가
    window.location.href = 'http://localhost:8080/account/login'; // 지정된 URL로 GET 요청
    // onClose(); // 페이지 이동 후 모달은 자동으로 닫힐 것이므로 주석 처리
  };

  // GitHub 로그인 버튼 클릭 핸들러
  const handleGithubLogin = () => {
    alert('아직 준비중입니다. 구글 로그인을 사용해주세요!');
    // GitHub 로그인은 현재 기능이 없으므로 페이지 이동이나 다른 액션은 하지 않습니다.
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/50 backdrop-blur-sm",
        className
      )}
      onClick={onClose}
      {...props}
    >
      <Card
        className={cn("w-full max-w-sm relative", "flex flex-col gap-4 p-6")}
        onClick={e => e.stopPropagation()}
      >
        {/* 우측 상단 X 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="닫기"
        >
          <HiXMark size={28} />
        </Button>

        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-3xl text-center">로그인</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center p-0 gap-3">
          <p className="text-center text-xl font-semibold mb-4">
            간편로그인 후<br />이용이 가능해요
          </p>

          {/* GitHub 로그인 버튼 */}
          <Button
            onClick={handleGithubLogin} // GitHub 로그인 핸들러 연결
            className="w-full py-2 flex items-center justify-center space-x-3 bg-gray-800 text-white hover:bg-gray-700 text-lg"
          >
            <FaGithub size={28} />
            <span>GitHub Login</span>
          </Button>

          {/* Google 로그인 버튼 */}
          <Button
            onClick={handleGoogleLogin} // Google 로그인 핸들러 연결
            className="w-full py-2 flex items-center justify-center space-x-3 bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 text-lg"
          >
            <FcGoogle size={28} />
            <span>Google Login</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}