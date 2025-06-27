import React from "react"

interface SectionTitleProps {
  title: string
  // 선택 : 제목 아래에 들어갈 부제목 혹은 설명
  description?: string
}

export default function SectionTitle({
  title,
  description,
}: SectionTitleProps) {
  const titleLines = title.split("\n")

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 leading-snug">
        {titleLines.map((line, idx) => (
          <React.Fragment key={idx}>
            {line}
            {idx < titleLines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
    </div>
  )
}
