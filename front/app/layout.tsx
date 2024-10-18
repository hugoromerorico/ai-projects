import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Tools',
  description: 'Personal AI projects and tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100 min-h-screen bg-dotted-pattern`}>
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo.png" alt="AI Tools Logo" width={40} height={40} />
              <span className="text-xl font-bold">AI Tools</span>
            </Link>
            <ul className="flex space-x-4">
              <li><Link href="/prompt-price" className="hover:text-gray-300">Prompt Price</Link></li>
              <li><Link href="/llm-playground" className="hover:text-gray-300">LLM Playground</Link></li>
              <li><Link href="/prompt-saver" className="hover:text-gray-300">Prompt Saver</Link></li>
            </ul>
          </div>
        </nav>
        <main className="container mx-auto mt-8 px-4">
          {children}
        </main>
      </body>
    </html>
  )
}
