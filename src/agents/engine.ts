import { StructuredCase, AgentMessage, AgentRole, TrialState } from '@/types'
import { AI_CONFIG, TRIAL_CONFIG } from '@/lib/config'
import {
  PROSECUTOR_PROMPT,
  DEFENDER_PROMPT,
  JUDGE_PROMPT,
  generateProsecutorContext,
  generateDefenderContext,
  generateJudgeContext
} from './prompts'

// 시뮬레이션용 응답 생성기
class SimulatedAgent {
  private role: AgentRole

  constructor(role: AgentRole) {
    this.role = role
  }

  generateResponse(caseData: StructuredCase, context?: string): string {
    switch (this.role) {
      case 'PROSECUTOR':
        return this.generateProsecutorResponse(caseData)
      case 'DEFENDER':
        return this.generateDefenderResponse(caseData, context)
      case 'JUDGE':
        return this.generateJudgeResponse(caseData, context)
      default:
        return ''
    }
  }

  private generateProsecutorResponse(caseData: StructuredCase): string {
    return `존경하는 재판장님, 그리고 방청석의 시민 여러분.

오늘 이 법정에 선 ${caseData.defendant}의 직무 유기는 명백합니다.
"${caseData.issue}"

시민들은 수개월간 이 문제로 고통받았습니다. 민원을 넣어도 돌아오는 것은
"검토 중입니다", "예산이 없습니다"라는 천편일률적인 답변뿐이었습니다.

${caseData.relatedLaws.join(', ')}에 따르면, 행정기관은 시민의 민원에
성실히 답변하고 합리적인 기간 내에 조치를 취해야 할 의무가 있습니다.

피고 ${caseData.defendant}은 이 의무를 저버렸습니다.
시민의 안전과 편의는 뒷전이고, 책임 회피에만 급급했습니다.
이것이 우리가 낸 세금으로 운영되는 행정기관의 모습입니까?

**유죄입니다.** 시민 여러분의 현명한 판단을 촉구합니다.`
  }

  private generateDefenderResponse(caseData: StructuredCase, _context?: string): string {
    return `재판장님, 시민 여러분.

먼저, 불편을 겪으신 시민 여러분께 깊은 유감을 표합니다.
${caseData.defendant}은 이 문제를 결코 가볍게 여기지 않았습니다.

그러나 현실적인 제약 조건을 말씀드려야 할 것 같습니다.

첫째, 예산의 문제입니다. 올해 배정된 관련 예산은 전년 대비 20% 삭감되었습니다.
한정된 예산으로 모든 민원을 즉각 처리하기에는 물리적 한계가 있습니다.

둘째, 법적 절차의 문제입니다. ${caseData.relatedLaws[0] || '관련 법률'}에 따른
행정 절차를 준수해야 하며, 이 과정에서 불가피한 시간이 소요됩니다.

셋째, 저희는 현재 개선 계획을 수립하여 진행 중입니다.
내년 상반기까지 단계적으로 문제를 해결할 로드맵이 마련되어 있습니다.

행정의 느림을 질책하시는 것은 당연합니다.
그러나 구조적 문제를 담당 부서 하나의 책임으로 돌리는 것은
진정한 해결책이 아닙니다.

시민 여러분의 공정한 판단을 부탁드립니다.`
  }

  private generateJudgeResponse(caseData: StructuredCase, context?: string): string {
    if (!context || context === 'opening') {
      return `[의사봉 세 번]

지금부터 사건번호 2024-민심-${String(Date.now()).slice(-4)}호,
"${caseData.caseName}" 건에 대한 심리를 시작하겠습니다.

피고는 ${caseData.defendant}이며,
본 재판의 핵심 쟁점은 다음과 같습니다:

"${caseData.issue}"

검사 측은 시민의 피해와 행정 실패를 입증하고,
변호인 측은 불가피한 사정과 개선 노력을 소명하시기 바랍니다.

먼저, 검사 측 모두진술을 허가합니다.`
    }

    if (context === 'closing') {
      return `[의사봉 한 번]

양측의 주장을 모두 청취하였습니다.

검사 측은 시민의 피해 사실과 행정기관의 책임을 주장하였고,
변호인 측은 현실적 제약과 개선 노력을 항변하였습니다.

이제 최종 판결은 이 자리에 계신 시민 여러분께 맡기겠습니다.

**유죄**: 행정 실패가 명백하며, 책임을 물어야 한다
**무죄**: 불가피한 상황이었으며, 개선 노력을 인정한다

국민 여러분의 현명한 판단을 기다리겠습니다.
투표는 24시간 동안 진행됩니다.

[의사봉 세 번]
휴정합니다.`
    }

    return `양측의 주장을 정리하겠습니다.

검사 측 핵심 주장:
- 시민 피해가 실제로 발생하였다
- 행정기관이 성실히 대응하지 않았다
- 관련 법규를 위반하였다

변호인 측 핵심 주장:
- 예산 및 인력의 현실적 제약이 있었다
- 법적 절차를 준수하느라 시간이 소요되었다
- 개선 계획을 수립하여 진행 중이다

양측 모두 일리 있는 주장을 펼쳤습니다.
계속해서 심리를 진행하겠습니다.`
  }
}

// AI 에이전트 (OpenAI API 사용)
class AIAgent {
  private role: AgentRole
  private systemPrompt: string

  constructor(role: AgentRole) {
    this.role = role
    this.systemPrompt = this.getSystemPrompt()
  }

  private getSystemPrompt(): string {
    switch (this.role) {
      case 'PROSECUTOR':
        return PROSECUTOR_PROMPT
      case 'DEFENDER':
        return DEFENDER_PROMPT
      case 'JUDGE':
        return JUDGE_PROMPT
    }
  }

  async generateResponse(userPrompt: string): Promise<string> {
    try {
      const { OpenAI } = await import('openai')
      const openai = new OpenAI()

      const response = await openai.chat.completions.create({
        model: AI_CONFIG.model,
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens
      })

      return response.choices[0].message.content || ''
    } catch (error) {
      console.error('AI 응답 생성 실패:', error)
      throw error
    }
  }
}

// 재판 엔진
export class TrialEngine {
  private caseData: StructuredCase
  private state: TrialState
  private useAI: boolean

  constructor(caseData: StructuredCase, caseId: string) {
    this.caseData = caseData
    this.useAI = AI_CONFIG.useOpenAI
    this.state = {
      caseId,
      status: 'PENDING',
      currentRound: 0,
      messages: [],
      votes: { guilty: 0, notGuilty: 0 }
    }
  }

  async startTrial(): Promise<AgentMessage> {
    this.state.status = 'IN_TRIAL'
    this.state.currentRound = 1

    const judgeMessage = await this.getJudgeOpening()
    this.state.messages.push(judgeMessage)

    return judgeMessage
  }

  async runRound(): Promise<AgentMessage[]> {
    if (this.state.currentRound > TRIAL_CONFIG.maxRounds) {
      return [await this.getJudgeClosing()]
    }

    const messages: AgentMessage[] = []

    // 검사 발언
    const prosecutorMsg = await this.getProsecutorArgument()
    this.state.messages.push(prosecutorMsg)
    messages.push(prosecutorMsg)

    // 변호인 반박
    const defenderMsg = await this.getDefenderArgument(prosecutorMsg.content)
    this.state.messages.push(defenderMsg)
    messages.push(defenderMsg)

    // 판사 정리 (마지막 라운드가 아닌 경우)
    if (this.state.currentRound < TRIAL_CONFIG.maxRounds) {
      const judgeSummary = await this.getJudgeSummary(
        prosecutorMsg.content,
        defenderMsg.content
      )
      this.state.messages.push(judgeSummary)
      messages.push(judgeSummary)
    }

    this.state.currentRound++
    return messages
  }

  async endTrial(): Promise<AgentMessage> {
    const closingMessage = await this.getJudgeClosing()
    this.state.messages.push(closingMessage)
    this.state.status = 'VOTING'
    return closingMessage
  }

  private async getJudgeOpening(): Promise<AgentMessage> {
    let content: string

    if (this.useAI) {
      const agent = new AIAgent('JUDGE')
      const context = generateJudgeContext(this.caseData, '', '', 'opening')
      content = await agent.generateResponse(context)
    } else {
      const agent = new SimulatedAgent('JUDGE')
      content = agent.generateResponse(this.caseData, 'opening')
    }

    return {
      role: 'JUDGE',
      content,
      timestamp: new Date()
    }
  }

  private async getProsecutorArgument(): Promise<AgentMessage> {
    let content: string

    if (this.useAI) {
      const agent = new AIAgent('PROSECUTOR')
      const context = generateProsecutorContext(this.caseData)
      content = await agent.generateResponse(context)
    } else {
      const agent = new SimulatedAgent('PROSECUTOR')
      content = agent.generateResponse(this.caseData)
    }

    return {
      role: 'PROSECUTOR',
      content,
      timestamp: new Date()
    }
  }

  private async getDefenderArgument(prosecutorArg: string): Promise<AgentMessage> {
    let content: string

    if (this.useAI) {
      const agent = new AIAgent('DEFENDER')
      const context = generateDefenderContext(this.caseData, prosecutorArg)
      content = await agent.generateResponse(context)
    } else {
      const agent = new SimulatedAgent('DEFENDER')
      content = agent.generateResponse(this.caseData, prosecutorArg)
    }

    return {
      role: 'DEFENDER',
      content,
      timestamp: new Date()
    }
  }

  private async getJudgeSummary(
    prosecutorArg: string,
    defenderArg: string
  ): Promise<AgentMessage> {
    let content: string

    if (this.useAI) {
      const agent = new AIAgent('JUDGE')
      const context = generateJudgeContext(
        this.caseData,
        prosecutorArg,
        defenderArg,
        'summary'
      )
      content = await agent.generateResponse(context)
    } else {
      const agent = new SimulatedAgent('JUDGE')
      content = agent.generateResponse(this.caseData, 'summary')
    }

    return {
      role: 'JUDGE',
      content,
      timestamp: new Date()
    }
  }

  private async getJudgeClosing(): Promise<AgentMessage> {
    const lastProsecutor = this.state.messages
      .filter(m => m.role === 'PROSECUTOR')
      .pop()?.content || ''
    const lastDefender = this.state.messages
      .filter(m => m.role === 'DEFENDER')
      .pop()?.content || ''

    let content: string

    if (this.useAI) {
      const agent = new AIAgent('JUDGE')
      const context = generateJudgeContext(
        this.caseData,
        lastProsecutor,
        lastDefender,
        'closing'
      )
      content = await agent.generateResponse(context)
    } else {
      const agent = new SimulatedAgent('JUDGE')
      content = agent.generateResponse(this.caseData, 'closing')
    }

    return {
      role: 'JUDGE',
      content,
      timestamp: new Date()
    }
  }

  getState(): TrialState {
    return { ...this.state }
  }
}
