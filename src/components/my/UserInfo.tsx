'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface UserInfo {
  username: string
  ssafyRegion: string
  ssafyYear: string
  classNum: string
  profileImageUrl?: string
}

export default function UserInfo() {
  const { token, logout } = useAuthStore()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [editUsername, setEditUsername] = useState('')
  const [editClassNum, setEditClassNum] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const fetchUserInfo = async () => {
    if (!token) return
    try {
      const res = await fetch('http://localhost:8080/account/info', {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      })
      const data = await res.json()
      setUserInfo(data)
      setEditUsername(data.username)
      setEditClassNum(data.classNum)
    } catch (err) {
      console.error('유저 정보 조회 실패', err)
    }
  }

  useEffect(() => {
    fetchUserInfo()
  }, [token])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const handleUpdate = async () => {
    try {
      const res = await fetch('http://localhost:8080/account/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          username: editUsername,
          classNum: editClassNum,
        }),
      })

      if (res.ok) {
        setIsOpen(false)
        fetchUserInfo()
      } else {
        const error = await res.json()
        alert(error.message || '수정 실패')
      }
    } catch (err) {
      alert('수정 중 오류 발생')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {userInfo?.profileImageUrl ? (
            <img
              src={userInfo.profileImageUrl}
              alt="프로필 이미지"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200" />
          )}
          <div>
            <div className="text-sm text-gray-400">
              {userInfo?.ssafyYear}기 {userInfo?.ssafyRegion} {userInfo?.classNum}반
            </div>
            <div className="text-xl font-semibold">{userInfo?.username}</div>
          </div>
        </div>

        {/* ⚙ 수정 다이얼로그 트리거 */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Settings className="w-5 h-5 text-gray-500 cursor-pointer" />
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>회원 정보 수정</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm text-gray-500 mb-1">유저명</label>
                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">반</label>
                <input
                  value={editClassNum}
                  onChange={(e) => setEditClassNum(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                취소
              </Button>
              <Button
                className="bg-orange-500 text-white hover:bg-orange-600"
                onClick={handleUpdate}
              >
                저장
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Button
        className="w-full mt-4 bg-orange-500 text-white hover:bg-orange-600"
        onClick={handleLogout}
      >
        로그아웃
      </Button>
    </div>
  )
}
