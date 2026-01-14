// 도시별 설정 - 변수 하나로 전국 복제 가능
export const CITY_CONFIG = {
  code: process.env.CITY_CODE || 'seongnam',
  name: process.env.CITY_NAME || '성남시',
}

// AI 설정
export const AI_CONFIG = {
  useOpenAI: !!process.env.OPENAI_API_KEY,
  model: 'gpt-4-turbo-preview',
  temperature: 0.8,
  maxTokens: 1000,
}

// 재판 설정
export const TRIAL_CONFIG = {
  maxRounds: 3,           // 최대 공방 라운드
  votingDurationHours: 24, // 투표 기간
  minVotesForVerdict: 10,  // 최소 투표 수
}
