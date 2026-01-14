import { NextResponse } from 'next/server'
import { TrialEngine } from '@/agents/engine'
import { StructuredCase } from '@/types'

// POST: 재판 시뮬레이션 실행
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { caseData, action } = body as {
      caseData: StructuredCase
      action: 'start' | 'round' | 'end'
    }

    const engine = new TrialEngine(caseData, `trial-${Date.now()}`)

    let result

    switch (action) {
      case 'start':
        result = await engine.startTrial()
        break
      case 'round':
        result = await engine.runRound()
        break
      case 'end':
        result = await engine.endTrial()
        break
      default:
        return NextResponse.json(
          { error: '유효하지 않은 action입니다.' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      messages: Array.isArray(result) ? result : [result],
      state: engine.getState(),
    })
  } catch (error) {
    console.error('재판 시뮬레이션 실패:', error)
    return NextResponse.json(
      { error: '재판 시뮬레이션에 실패했습니다.' },
      { status: 500 }
    )
  }
}
