'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import api from '@/lib/api'
import { AxiosError } from 'axios'

interface Friend {
  userId: number
  username: string
  ssafyYear: string
  ssafyRegion: string
  classNum: string
}

export default function FriendList() {
  const { token } = useAuthStore()
  const [friends, setFriends] = useState<Friend[]>([])
  const [visibleCount, setVisibleCount] = useState(10)
  const [newFriendName, setNewFriendName] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchFriends = useCallback(async () => {
    try {
      const res = await api.get('/friends', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFriends(res.data.friends || [])
    } catch (err) {
      console.error('친구 목록 불러오기 실패', err)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchFriends()
  }, [token, fetchFriends])

  const handleAddFriend = async () => {
    if (!newFriendName.trim()) return
    try {
      const res = await api.post(
        '/friends',
        { username: newFriendName },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (res.status === 200 || res.status === 201) {
        setNewFriendName('')
        setIsDialogOpen(false)
        fetchFriends()
      } else {
        alert(res.data.error || '친구 추가 실패')
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        alert(err.response.data?.error || '친구 추가 실패')
      } else {
        alert('친구 추가 중 알 수 없는 오류 발생')
      }
      console.error('친구 추가 실패', err)
    }
  }

  const handleDeleteFriend = async (friendId: number) => {
    if (!window.confirm('정말 이 친구를 삭제하시겠습니까?')) return
    try {
      const res = await api.delete(`/friends/${friendId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.status === 200) {
        setFriends(prev => prev.filter(f => f.userId !== friendId))
      } else {
        alert(res.data.error || '친구 삭제 실패')
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        alert(err.response.data?.error || '친구 삭제 중 오류 발생')
      } else {
        alert('친구 삭제 중 알 수 없는 오류 발생')
      }
      console.error(err)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center pb-2 border-b border-gray-200 mb-2">
        <h2 className="text-sm text-gray-700 font-medium">친구 목록</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Plus className="w-4 h-4 text-gray-500 cursor-pointer" />
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>친구 추가</DialogTitle>
            </DialogHeader>

            <input
              type="text"
              placeholder="유저명 입력"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mt-2"
            />

            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                취소
              </Button>
              <Button
                onClick={handleAddFriend}
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                추가
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {friends.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          친구를 추가하면 이곳에 표시돼요
        </p>
      ) : (
        <>
          {friends.slice(0, visibleCount).map(friend => (
            <div key={friend.userId} className="text-sm text-gray-800 py-0.5">
              <span>
                {friend.ssafyYear}기 {friend.ssafyRegion} {friend.classNum}반 {friend.username}
              </span>
              <button
                onClick={() => handleDeleteFriend(friend.userId)}
                className="ml-2 px-2 py-0.5 text-xs rounded bg-red-100 text-red-600 hover:bg-red-200 transition"
              >
                삭제
              </button>
            </div>
          ))}

          {visibleCount < friends.length && (
            <button
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="text-xs text-gray-500 mt-3 hover:underline mx-auto block"
            >
              더보기 ▼
            </button>
          )}
        </>
      )}
    </div>
  )
}
