import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 민심 법정 | 시민이 판사다',
  description: '시민 참여형 AI 재판 시뮬레이션 - 행정을 심판하라',
  keywords: ['AI법정', '민심', '시민참여', '행정심판', '투표'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-court-black text-court-silver antialiased">
        <div className="relative">
          {/* 배경 그라데이션 효과 */}
          <div className="fixed inset-0 bg-gradient-to-b from-court-dark via-court-black to-court-dark opacity-50" />

          {/* 메인 컨텐츠 */}
          <main className="relative z-10">
            {children}
          </main>

          {/* 하단 법정 장식 */}
          <div className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-court-gold to-transparent opacity-30" />
        </div>
      </body>
    </html>
  )
}
