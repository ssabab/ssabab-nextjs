'use client'

import { useState } from "react"
import axios from "axios"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  })

  // e는 <input> 요소의 onChange 이벤트 객체
  // React.ChangeEvent<HTMLInputElement>는 타입스크립트에서 타입 명시임
  // e.target은 <input> 그 자체를 의미함
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // id: e.target.id, value: e.target.value
    const { id, value } = e.target
    // prev는 기존 상태값(formData)를 의미함
    // ...prev -> 기존 데이터를 복사, [id]: value -> 해당 input의 id에 해당하는 value를 갱신
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const submitSignupForm = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post("http://localhost:8080/account/signup", formData)
      alert("회원가입 성공!")
      window.location.href = "/login"
    } catch (error: any) {
      console.error("회원가입 실패", error)
      const errorMessage = error.response?.data?.message || "서버 오류가 발생했습니다."
      alert("회원가입 실패: " + errorMessage)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">회원가입</CardTitle>
          {/* <CardDescription>
            Create a new account
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <form onSubmit={submitSignupForm}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">비밀번호</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="username">이름 또는 닉네임</Label>
                </div>
                <Input 
                  id="username" 
                  type="text" 
                  value={formData.username}
                  onChange={handleInputChange}
                  required />
              </div>
              <Button type="submit" className="w-full">
                가입하기
              </Button>
              {/* <div className="grid gap-4 sm:grid-cols-2">
                <Button variant="outline" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    fill="currentColor"
                  />
                </svg>
                  Signup with GitHub
                </Button>
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                    Signup with Google
                </Button>
              </div> */}
            </div>
            <div className="mt-4 text-center text-sm">
              계정이 있으신가요?{" "}
              <a href="login" className="underline underline-offset-4">
                로그인
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
