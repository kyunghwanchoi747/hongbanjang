'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Scale, Gavel, Users, TrendingUp, ChevronRight } from 'lucide-react'

// 시뮬레이션 데이터
const MOCK_CASES = [
  {
    id: '2024-seongnam-001',
    title: '분당구 정자동 보도블록 파손 방치 사건',
    defendant: '도로관리과',
    status: 'IN_TRIAL',
    guiltyVotes: 127,
    notGuiltyVotes: 43,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2024-seongnam-002',
    title: '모란시장 주차장 부족 사건',
    defendant: '도시교통과',
    status: 'VOTING',
    guiltyVotes: 89,
    notGuiltyVotes: 56,
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '2024-seongnam-003',
    title: '공립어린이집 대기 장기화 사건',
    defendant: '보육정책과',
    status: 'PENDING',
    guiltyVotes: 0,
    notGuiltyVotes: 0,
    createdAt: new Date('2024-02-01'),
  },
]

const CITY_NAME = process.env.CITY_NAME || '성남시'

export default function HomePage() {
  const [cases, setCases] = useState(MOCK_CASES)

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return '대기 중'
      case 'IN_TRIAL': return '재판 진행 중'
      case 'VOTING': return '투표 진행 중'
      case 'CLOSED': return '종결'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-gray-400'
      case 'IN_TRIAL': return 'text-court-gold'
      case 'VOTING': return 'text-green-400'
      case 'CLOSED': return 'text-court-silver'
      default: return 'text-gray-400'
    }
  }

  const getVotePercentage = (guilty: number, notGuilty: number) => {
    const total = guilty + notGuilty
    if (total === 0) return 50
    return Math.round((guilty / total) * 100)
  }

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <header className="border-b border-court-gold/20 bg-court-dark/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8 text-court-gold" />
              <div>
                <h1 className="text-xl font-bold text-court-gold">
                  {CITY_NAME} AI 민심 법정
                </h1>
                <p className="text-xs text-court-silver/60">
                  시민이 판사다
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Gavel className="w-4 h-4 text-court-gold" />
                <span>{cases.length}건 재판</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-court-gold" />
                <span>315명 참여</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 배너 */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-court-crimson/10 to-transparent" />
        <div className="relative z-10 container mx-auto">
          <div className="mb-6">
            <Gavel className="w-16 h-16 mx-auto text-court-gold gavel-animation" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-court-gold">행정</span>을{' '}
            <span className="text-court-crimson">심판</span>하라
          </h2>
          <p className="text-lg text-court-silver/80 max-w-2xl mx-auto mb-8">
            AI 검사와 변호인의 치열한 공방을 지켜보고,<br />
            시민 배심원으로서 당신의 판결을 내리세요.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="#cases"
              className="court-button bg-court-gold text-court-black hover:bg-yellow-500"
            >
              재판 목록 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 재판 목록 */}
      <section id="cases" className="py-12 px-4">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Scale className="w-6 h-6 text-court-gold" />
            현재 진행 중인 재판
          </h3>

          <div className="grid gap-6">
            {cases.map((caseItem) => {
              const guiltyPercent = getVotePercentage(
                caseItem.guiltyVotes,
                caseItem.notGuiltyVotes
              )

              return (
                <Link
                  key={caseItem.id}
                  href={`/trial/${caseItem.id}`}
                  className="court-card p-6 hover:court-glow transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-sm font-medium ${getStatusColor(caseItem.status)}`}>
                          {getStatusLabel(caseItem.status)}
                        </span>
                        <span className="text-xs text-court-silver/50">
                          사건번호: {caseItem.id}
                        </span>
                      </div>
                      <h4 className="text-xl font-bold mb-2 group-hover:text-court-gold transition-colors">
                        {caseItem.title}
                      </h4>
                      <p className="text-sm text-court-silver/70">
                        피고: {caseItem.defendant}
                      </p>
                    </div>

                    <div className="w-full md:w-64">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-court-crimson">유죄 {guiltyPercent}%</span>
                        <span className="text-court-blue">무죄 {100 - guiltyPercent}%</span>
                      </div>
                      <div className="vote-gauge">
                        <div
                          className="vote-gauge-guilty"
                          style={{ width: `${guiltyPercent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs mt-1 text-court-silver/50">
                        <span>{caseItem.guiltyVotes}표</span>
                        <span>{caseItem.notGuiltyVotes}표</span>
                      </div>
                    </div>

                    <ChevronRight className="w-6 h-6 text-court-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 통계 섹션 */}
      <section className="py-12 px-4 bg-court-gray/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-court-gold mb-2">
                {cases.length}
              </div>
              <div className="text-sm text-court-silver/70">총 재판 건수</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-court-crimson mb-2">
                {cases.reduce((sum, c) => sum + c.guiltyVotes, 0)}
              </div>
              <div className="text-sm text-court-silver/70">유죄 투표</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-court-blue mb-2">
                {cases.reduce((sum, c) => sum + c.notGuiltyVotes, 0)}
              </div>
              <div className="text-sm text-court-silver/70">무죄 투표</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                315
              </div>
              <div className="text-sm text-court-silver/70">참여 시민</div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-8 px-4 border-t border-court-gold/20">
        <div className="container mx-auto text-center text-sm text-court-silver/50">
          <p>
            {CITY_NAME} AI 민심 법정 | 시민 참여형 AI 재판 시뮬레이션
          </p>
          <p className="mt-2">
            본 서비스는 실제 법적 효력이 없으며, 시민 의견 수렴 목적으로 운영됩니다.
          </p>
        </div>
      </footer>
    </div>
  )
}
