'use client'

import React, { useState } from "react"
import { register } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SignupFormProps {
  onClose: () => void
}

export function SignupForm({ onClose }: SignupFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const submitSignupForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }
    setIsSubmitting(true)
    try {
      await register({
        email: formData.email,
        password: formData.password,
        username: formData.username,
      })
      alert('회원가입 성공!')
      onClose()
      router.push('/login')
    } catch (error: any) {
      const status = error.response?.status
      const msg = error.response?.data?.message || ''
      if (status === 409 || /already exists|이미 가입/.test(msg)) {
        alert('이미 가입된 이메일입니다. 로그인 페이지로 이동합니다.')
        onClose()
        router.push('/login')
      } else {
        alert('회원가입 실패: ' + (msg || '서버 오류'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        className={cn('w-full max-w-md', 'flex flex-col gap-6')}
        onClick={e => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="text-2xl text-center">회원가입</CardTitle>
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
                  required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">이름 또는 닉네임</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  required />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? '가입 중…' : '가입하기'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              계정이 있으신가요?{" "}
                <button
                  type="button"
                  className="underline underline-offset-4"
                  onClick={() => {
                    onClose()
                    router.push('/login')
                  }}
                >
                  로그인
                </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
