import { NextResponse } from 'next/server'

// 간단한 인메모리 저장소 (실제로는 DB 사용)
const votes: Record<string, { guilty: number; notGuilty: number }> = {}
const votedSessions: Set<string> = new Set()

// POST: 투표 처리
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { caseId, verdict, sessionId } = body as {
      caseId: string
      verdict: 'guilty' | 'notGuilty'
      sessionId: string
    }

    // 중복 투표 체크
    const voteKey = `${caseId}:${sessionId}`
    if (votedSessions.has(voteKey)) {
      return NextResponse.json(
        { error: '이미 투표하셨습니다.' },
        { status: 400 }
      )
    }

    // 투표 기록
    if (!votes[caseId]) {
      votes[caseId] = { guilty: 0, notGuilty: 0 }
    }

    if (verdict === 'guilty') {
      votes[caseId].guilty++
    } else {
      votes[caseId].notGuilty++
    }

    votedSessions.add(voteKey)

    return NextResponse.json({
      success: true,
      votes: votes[caseId],
    })
  } catch (error) {
    console.error('투표 처리 실패:', error)
    return NextResponse.json(
      { error: '투표 처리에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// GET: 투표 현황 조회
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const caseId = searchParams.get('caseId')

  if (!caseId) {
    return NextResponse.json(
      { error: 'caseId가 필요합니다.' },
      { status: 400 }
    )
  }

  const caseVotes = votes[caseId] || { guilty: 0, notGuilty: 0 }

  return NextResponse.json({ votes: caseVotes })
}
