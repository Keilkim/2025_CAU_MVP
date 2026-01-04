import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '맛남의 광장 - 동네 맛집에서 새로운 인연을',
  description: '맛집을 매개로 새로운 사람들과 자연스럽게 만나는 소셜 미팅 플랫폼',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
