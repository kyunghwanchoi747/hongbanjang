'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Scale,
  Gavel,
  ArrowLeft,
  UserCircle,
  Shield,
  Crown,
  ThumbsUp,
  ThumbsDown,
  Clock,
  MessageSquare
} from 'lucide-react'

// 시뮬레이션 재판 데이터
const MOCK_TRIAL = {
  id: '2024-seongnam-001',
  caseNumber: '2024-seongnam-001',
  title: '분당구 정자동 보도블록 파손 방치 사건',
  defendant: '도로관리과',
  issue: '정자동 카페거리 보도블록이 6개월째 파손 방치, 시민 안전 위협',
  relatedLaws: ['도로법', '민원처리에 관한 법률'],
  status: 'IN_TRIAL',
  guiltyVotes: 127,
  notGuiltyVotes: 43,
  messages: [
    {
      id: 1,
      role: 'JUDGE',
      content: `[의사봉 세 번]

지금부터 사건번호 2024-민심-001호,
"분당구 정자동 보도블록 파손 방치" 건에 대한 심리를 시작하겠습니다.

피고는 도로관리과이며,
본 재판의 핵심 쟁점은 다음과 같습니다:

"시민 안전을 위협하는 보도블록 파손을 6개월간 방치한 책임"

검사 측은 시민의 피해와 행정 실패를 입증하고,
변호인 측은 불가피한 사정과 개선 노력을 소명하시기 바랍니다.

먼저, 검사 측 모두진술을 허가합니다.`,
      timestamp: new Date('2024-01-15T10:00:00'),
    },
    {
      id: 2,
      role: 'PROSECUTOR',
      content: `존경하는 재판장님, 그리고 방청석의 시민 여러분.

오늘 이 법정에 선 도로관리과의 직무 유기는 명백합니다.

정자동 카페거리의 보도블록은 **6개월째** 파손된 상태로 방치되고 있습니다.
이 기간 동안 어르신 2명이 넘어져 부상을 입었고,
유모차를 끌고 다니는 부모들은 차도로 내려가야 하는 위험을 감수하고 있습니다.

시민들은 민원을 **3번이나** 제기했습니다.
그러나 돌아오는 답변은 매번 동일했습니다:
"예산 검토 중입니다."

도로법 제42조에 따르면, 도로관리청은 도로를 항상 양호한 상태로 유지하여야 합니다.
6개월의 방치가 '양호한 상태'입니까?

피고 도로관리과는 시민의 안전보다 예산을 핑계로 책임을 회피했습니다.
이것이 우리가 낸 세금으로 운영되는 행정기관의 모습입니까?

**유죄입니다.** 시민 여러분의 현명한 판단을 촉구합니다.`,
      timestamp: new Date('2024-01-15T10:05:00'),
    },
    {
      id: 3,
      role: 'DEFENDER',
      content: `재판장님, 시민 여러분.

먼저, 불편을 겪으신 시민 여러분께 깊은 유감을 표합니다.
도로관리과는 이 문제를 결코 가볍게 여기지 않았습니다.

그러나 현실적인 제약 조건을 말씀드려야 할 것 같습니다.

**첫째, 예산의 문제입니다.**
2024년 도로보수 예산은 전년 대비 30% 삭감되었습니다.
분당구 전역에 접수된 보도블록 관련 민원만 47건입니다.
한정된 예산으로 모든 민원을 즉각 처리하기에는 물리적 한계가 있습니다.

**둘째, 절차의 문제입니다.**
정자동 해당 구역은 지하 통신 케이블 매설 구역입니다.
보도블록 교체를 위해서는 KT, SKT 등 통신사와의 협의가 필수적이며,
이 과정에서 3개월 이상의 시간이 소요되었습니다.

**셋째, 개선 계획입니다.**
현재 협의가 완료되어 다음 달 착공 예정입니다.

행정의 느림을 질책하시는 것은 당연합니다.
그러나 구조적 문제를 담당 부서 하나의 책임으로 돌리는 것은
진정한 해결책이 아닙니다.

시민 여러분의 공정한 판단을 부탁드립니다.`,
      timestamp: new Date('2024-01-15T10:10:00'),
    },
    {
      id: 4,
      role: 'JUDGE',
      content: `양측의 주장을 정리하겠습니다.

**검사 측 핵심 주장:**
- 6개월간 보도블록 파손 방치로 시민 안전 위협
- 3회 민원에도 성실한 조치 없이 "예산 검토 중" 답변만 반복
- 도로법 위반 및 직무 유기

**변호인 측 핵심 주장:**
- 예산 30% 삭감으로 물리적 한계 존재
- 지하 통신 케이블로 인한 협의 절차 필요
- 다음 달 착공 예정으로 개선 계획 수립 완료

양측 모두 일리 있는 주장을 펼쳤습니다.
계속해서 심리를 진행하겠습니다.`,
      timestamp: new Date('2024-01-15T10:15:00'),
    },
  ],
}

const roleConfig = {
  JUDGE: {
    icon: Crown,
    label: '판사',
    color: 'text-court-gold',
    bgClass: 'agent-judge',
  },
  PROSECUTOR: {
    icon: UserCircle,
    label: '검사',
    color: 'text-court-crimson',
    bgClass: 'agent-prosecutor',
  },
  DEFENDER: {
    icon: Shield,
    label: '변호인',
    color: 'text-court-blue',
    bgClass: 'agent-defender',
  },
}

export default function TrialPage() {
  const params = useParams()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [trial, setTrial] = useState(MOCK_TRIAL)
  const [hasVoted, setHasVoted] = useState(false)
  const [selectedVote, setSelectedVote] = useState<'guilty' | 'notGuilty' | null>(null)
  const [isVoting, setIsVoting] = useState(false)

  const totalVotes = trial.guiltyVotes + trial.notGuiltyVotes
  const guiltyPercent = totalVotes > 0 ? Math.round((trial.guiltyVotes / totalVotes) * 100) : 50

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [trial.messages])

  const handleVote = async (verdict: 'guilty' | 'notGuilty') => {
    if (hasVoted || isVoting) return

    setIsVoting(true)
    setSelectedVote(verdict)

    // 시뮬레이션: 투표 처리
    await new Promise(resolve => setTimeout(resolve, 1000))

    setTrial(prev => ({
      ...prev,
      guiltyVotes: verdict === 'guilty' ? prev.guiltyVotes + 1 : prev.guiltyVotes,
      notGuiltyVotes: verdict === 'notGuilty' ? prev.notGuiltyVotes + 1 : prev.notGuiltyVotes,
    }))

    setHasVoted(true)
    setIsVoting(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <header className="border-b border-court-gold/20 bg-court-dark/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-court-silver/70 hover:text-court-gold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>목록으로</span>
              </Link>
              <div className="w-px h-6 bg-court-gold/20" />
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-court-gold" />
                <span className="text-sm text-court-silver/60">
                  사건번호: {trial.caseNumber}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-court-gold" />
              <span className="text-court-gold">재판 진행 중</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* 메인 재판 영역 */}
        <main className="flex-1 flex flex-col">
          {/* 사건 정보 */}
          <div className="bg-court-gray/50 border-b border-court-gold/20 p-6">
            <h1 className="text-2xl font-bold mb-2">{trial.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-court-silver/70">
              <span>피고: <span className="text-court-crimson">{trial.defendant}</span></span>
              <span>관련 법령: {trial.relatedLaws.join(', ')}</span>
            </div>
            <p className="mt-3 text-court-silver/80">
              쟁점: {trial.issue}
            </p>
          </div>

          {/* 공방 메시지 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {trial.messages.map((message) => {
              const config = roleConfig[message.role as keyof typeof roleConfig]
              const Icon = config.icon

              return (
                <div
                  key={message.id}
                  className={`agent-message ${config.bgClass}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={`w-6 h-6 ${config.color}`} />
                    <span className={`font-bold ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-court-silver/50">
                      {new Date(message.timestamp).toLocaleTimeString('ko-KR')}
                    </span>
                  </div>
                  <div className="text-court-silver/90 whitespace-pre-line leading-relaxed">
                    {message.content}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* 사이드바: 투표 */}
        <aside className="lg:w-80 border-t lg:border-t-0 lg:border-l border-court-gold/20 bg-court-gray/30 p-6">
          <div className="sticky top-24">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Gavel className="w-5 h-5 text-court-gold" />
              국민 참여 판결
            </h3>

            {/* 실시간 투표 현황 */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-court-crimson font-bold">유죄 {guiltyPercent}%</span>
                <span className="text-court-blue font-bold">무죄 {100 - guiltyPercent}%</span>
              </div>
              <div className="vote-gauge h-6">
                <div
                  className="vote-gauge-guilty"
                  style={{ width: `${guiltyPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-2 text-court-silver/60">
                <span>{trial.guiltyVotes}표</span>
                <span>총 {totalVotes}표</span>
                <span>{trial.notGuiltyVotes}표</span>
              </div>
            </div>

            {/* 투표 버튼 */}
            {!hasVoted ? (
              <div className="space-y-3">
                <p className="text-sm text-court-silver/70 mb-4">
                  양측의 주장을 듣고 당신의 판결을 내려주세요.
                </p>
                <button
                  onClick={() => handleVote('guilty')}
                  disabled={isVoting}
                  className="w-full court-button court-button-guilty flex items-center justify-center gap-2"
                >
                  <ThumbsDown className="w-5 h-5" />
                  유죄 (행정 실패)
                </button>
                <button
                  onClick={() => handleVote('notGuilty')}
                  disabled={isVoting}
                  className="w-full court-button court-button-innocent flex items-center justify-center gap-2"
                >
                  <ThumbsUp className="w-5 h-5" />
                  무죄 (불가피한 상황)
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className={`text-4xl mb-3 ${selectedVote === 'guilty' ? 'text-court-crimson' : 'text-court-blue'}`}>
                  {selectedVote === 'guilty' ? <ThumbsDown className="w-12 h-12 mx-auto" /> : <ThumbsUp className="w-12 h-12 mx-auto" />}
                </div>
                <p className="font-bold text-lg">
                  {selectedVote === 'guilty' ? '유죄' : '무죄'}에 투표하셨습니다
                </p>
                <p className="text-sm text-court-silver/60 mt-2">
                  당신의 한 표가 민심을 만듭니다.
                </p>
              </div>
            )}

            {/* 참여 정보 */}
            <div className="mt-8 pt-6 border-t border-court-gold/20">
              <div className="flex items-center gap-2 text-sm text-court-silver/60">
                <MessageSquare className="w-4 h-4" />
                <span>{trial.messages.length}개의 발언</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
