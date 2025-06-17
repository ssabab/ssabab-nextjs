'use client'

import UserInfo from '@/components/my/UserInfo'
import FriendList from '@/components/my/FriendList'

export default function My() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 px-4 pt-10">
      <div className="w-full max-w-md">
        <UserInfo />
        <FriendList />
      </div>
    </div>
  )
}
