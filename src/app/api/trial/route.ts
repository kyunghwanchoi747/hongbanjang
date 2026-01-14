import { NextResponse } from 'next/server'

export const runtime = 'edge'

// 시뮬레이션 응답 생성
function generateProsecutorResponse(caseTitle: string, defendant: string): string {
  return `존경하는 재판장님, 그리고 방청석의 시민 여러분.

오늘 이 법정에 선 ${defendant}의 직무 유기는 명백합니다.

"${caseTitle}"

시민들은 수개월간 이 문제로 고통받았습니다. 민원을 넣어도 돌아오는 것은
"검토 중입니다", "예산이 없습니다"라는 천편일률적인 답변뿐이었습니다.

피고 ${defendant}은 시민의 안전과 편의를 뒷전으로 미루고,
책임 회피에만 급급했습니다.

**유죄입니다.** 시민 여러분의 현명한 판단을 촉구합니다.`
}

function generateDefenderResponse(defendant: string): string {
  return `재판장님, 시민 여러분.

먼저, 불편을 겪으신 시민 여러분께 깊은 유감을 표합니다.
${defendant}은 이 문제를 결코 가볍게 여기지 않았습니다.

**첫째, 예산의 문제입니다.**
올해 관련 예산은 전년 대비 30% 삭감되었습니다.
한정된 예산으로 모든 민원을 즉각 처리하기에는 물리적 한계가 있습니다.

**둘째, 절차의 문제입니다.**
관련 법적 절차를 준수해야 하며, 이 과정에서 불가피한 시간이 소요되었습니다.

**셋째, 개선 계획입니다.**
현재 개선 계획을 수립하여 진행 중입니다.

시민 여러분의 공정한 판단을 부탁드립니다.`
}

function generateJudgeResponse(phase: string, caseTitle: string): string {
  if (phase === 'opening') {
    return `[의사봉 세 번]

지금부터 "${caseTitle}" 건에 대한 심리를 시작하겠습니다.

검사 측은 시민의 피해와 행정 실패를 입증하고,
변호인 측은 불가피한 사정과 개선 노력을 소명하시기 바랍니다.

먼저, 검사 측 모두진술을 허가합니다.`
  }

  return `[의사봉 한 번]

양측의 주장을 모두 청취하였습니다.

이제 최종 판결은 시민 여러분께 맡기겠습니다.

**유죄**: 행정 실패가 명백하며, 책임을 물어야 한다
**무죄**: 불가피한 상황이었으며, 개선 노력을 인정한다

국민 여러분의 현명한 판단을 기다리겠습니다.

[의사봉 세 번]
휴정합니다.`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { caseTitle, defendant, action } = body

    const messages = []

    if (action === 'start') {
      messages.push({
        role: 'JUDGE',
        content: generateJudgeResponse('opening', caseTitle),
        timestamp: new Date().toISOString(),
      })
    } else if (action === 'round') {
      messages.push({
        role: 'PROSECUTOR',
        content: generateProsecutorResponse(caseTitle, defendant),
        timestamp: new Date().toISOString(),
      })
      messages.push({
        role: 'DEFENDER',
        content: generateDefenderResponse(defendant),
        timestamp: new Date().toISOString(),
      })
    } else if (action === 'end') {
      messages.push({
        role: 'JUDGE',
        content: generateJudgeResponse('closing', caseTitle),
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({ messages })
  } catch {
    return NextResponse.json(
      { error: '재판 시뮬레이션에 실패했습니다.' },
      { status: 500 }
    )
  }
}
