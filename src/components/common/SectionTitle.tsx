interface SectionTitleProps {
  title: string
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h2 className="text-lg font-semibold text-gray-900">
      {title}
    </h2>
  )
}
