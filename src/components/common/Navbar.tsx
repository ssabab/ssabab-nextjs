import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-50 py-4">
      <div className="container mx-auto px-6 flex items-center">
        <Link href="/">
          <Image
            src="/icons/ssbab_logo.png"
            alt="Logo"
            width={120}
            height={40}
            className="object-contain cursor-pointer"
          />
        </Link>
      </div>
    </nav>
  )
}
