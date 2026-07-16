import { reactive } from 'vue'

const state = reactive({
  chatbotOpen: false,
  chatbotSettingsOpen: false,
  userApiKey: (() => {
    try {
      return import.meta.env.VITE_OPENAI_API_KEY || localStorage.getItem('localhub_v3_api_key') || ''
    } catch {
      return ''
    }
  })(),
  chatbotLoading: false,
  chatbotTextInput: '',
  chatLogs: [
    { id: 1, role: 'assistant', content: '안녕하세요! LocalHub AI 여행 파트너입니다. 🌲\n명소의 세세한 이야기나 맛집 정보 등 궁금한 점을 질문해 보세요!' },
  ],
})

export function useChat() {
  function toggleChatbotWindow() { state.chatbotOpen = !state.chatbotOpen }
  function toggleChatKeySettings() { state.chatbotSettingsOpen = !state.chatbotSettingsOpen }

  function saveUserApiKey(triggerAlert) {
    try { localStorage.setItem('localhub_v3_api_key', state.userApiKey) } catch (e) { /* ignore */ }
    if (triggerAlert) triggerAlert('API Key가 브라우저에 안전히 저장되었습니다.')
    state.chatbotSettingsOpen = false
  }

  // Called from Explore when a place card is expanded twice in a row
  function handleAdvisorAutoTrigger() {
    if (!state.chatbotOpen) {
      state.chatbotOpen = true
      state.chatLogs.push({
        id: Date.now(),
        role: 'assistant',
        content: '여러 구미/경북의 추천 명소를 연속해서 탐색 중이시군요! 😊 혹시 원하시는 취향에 딱 맞춘 맞춤형 당일치기 코스를 제가 제안해 드릴까요? 무엇이든 말씀해 주세요!',
      })
    }
  }

  async function handleSendChat() {
    const query = state.chatbotTextInput.trim()
    if (!query) return

    state.chatLogs.push({ id: Date.now(), role: 'user', content: query })
    state.chatbotTextInput = ''
    state.chatbotLoading = true

    if (state.userApiKey) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${state.userApiKey}` },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: "당신은 구미/경북권 역사문화 가이드 및 맛집 전문가인 'LocalHub AI 비서'입니다. 항상 친근하고 품격 있는 경상도 사투리나 공손한 구미 사투리가 섞인 어투를 활용해 2~3줄 요약 답변해 주세요." },
              { role: 'user', content: query },
            ],
            max_tokens: 250,
          }),
        })
        const data = await res.json()
        const text = data.choices[0].message.content
        state.chatLogs.push({ id: Date.now() + 1, role: 'assistant', content: text })
      } catch (e) {
        state.chatLogs.push({ id: Date.now() + 1, role: 'assistant', content: 'API 호출 에러가 감지되었습니다. 키 설정을 다시 검수해 주세요.' })
      } finally {
        state.chatbotLoading = false
      }
    } else {
      setTimeout(() => {
        let response = '질문하신 지점은 대중교통 및 라이딩 수변 데크 코스로 연계가 매우 훌륭합니다. 상세 이동 경로는 탐색 탭의 길 찾기를 함께 확인해 보세요!'
        if (query.includes('금오산')) {
          response = '🏔️ 영남의 명물 금오산은 도선굴과 대혜폭포 기암절벽 코스가 환상적입니다! 하산하신 후 아래 감자전 가로수 길에서 항아리 수제비와 막걸리를 곁들이시는 여행 루틴을 강력히 권장합니다.'
        } else if (query.includes('금리단')) {
          response = '🍝 금리단길은 예쁜 인테리어의 양식 레스토랑들과 트렌디한 로컬 감성 카페들이 활짝 열려 있습니다. 근처 금오천 벚꽃 산책로와 함께 걸어보시면 힐링 코스로 최고의 궁합입니다.'
        } else if (query.includes('에코랜드')) {
          response = '🌲 구미 에코랜드는 시원하게 펼쳐진 모노레일을 탑승하여 산동 생태 숲 자생식물원을 공중 관람할 수 있습니다. 어린이를 동반한 가족이나 연인들의 힐링 피크닉 장소로 단연 으뜸입니다.'
        }
        state.chatLogs.push({ id: Date.now() + 1, role: 'assistant', content: response })
        state.chatbotLoading = false
      }, 1000)
    }
  }

  return { state, toggleChatbotWindow, toggleChatKeySettings, saveUserApiKey, handleAdvisorAutoTrigger, handleSendChat }
}
