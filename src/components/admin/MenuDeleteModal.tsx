"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

type Props = {
  onDelete: () => void
}

export default function MenuDeleteModal({ onDelete }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex justify-end">
      <Button variant="destructive" onClick={() => setOpen(true)}>
        삭제하기
      </Button>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl space-y-4 max-w-sm w-full">
            <p>정말 삭제하시겠습니까?</p>
            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                취소
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete()
                  setOpen(false)
                }}
              >
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
