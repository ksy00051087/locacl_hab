import { reactive } from 'vue'

// ─────────────────────────────────────────────────────────────
// 한국관광공사 TourAPI (data.go.kr) 연동
//
// 1) data.go.kr 에서 "한국관광공사_국문 관광정보 서비스" 활용신청 (자동승인)
// 2) 발급받은 서비스키를 프로젝트 루트에 .env 파일로 저장:
//      VITE_TOUR_API_KEY=발급받은_인코딩된_서비스키
// 3) npm run dev 재시작하면 자동으로 실데이터가 연동됩니다.
//
// 키가 없거나 호출이 실패하면 자동으로 안내 문구를 보여주는 폴백 모드로 동작합니다.
// ─────────────────────────────────────────────────────────────

const BASE_URL = 'https://apis.data.go.kr/B551011/KorService2'

const state = reactive({
  showModal: false,
  isLoading: false,
  place: null, // 원본 GEOPLACES_DATABASE 항목
  intro: null, // detailIntro2 결과 (이용시간/휴무일/요금/문의처 등)
  common: null, // detailCommon2 결과 (홈페이지 등 추가 개요)
  error: null,
})

function buildUrl(operation, params) {
  const serviceKey = import.meta.env.VITE_TOUR_API_KEY
  const query = new URLSearchParams({
    serviceKey,
    MobileOS: 'ETC',
    MobileApp: 'LocalHub',
    _type: 'json',
    ...params,
  })
  return `${BASE_URL}/${operation}?${query.toString()}`
}

async function fetchDetailIntro(contentId, contentTypeId) {
  const url = buildUrl('detailIntro2', { contentId, contentTypeId })
  const res = await fetch(url)
  const data = await res.json()
  const item = data?.response?.body?.items?.item
  return Array.isArray(item) ? item[0] : item
}

async function fetchDetailCommon(contentId) {
  const url = buildUrl('detailCommon2', { contentId, defaultYN: 'Y', overviewYN: 'Y', firstImageYN: 'N', addrinfoYN: 'N', mapinfoYN: 'N' })
  const res = await fetch(url)
  const data = await res.json()
  const item = data?.response?.body?.items?.item
  return Array.isArray(item) ? item[0] : item
}

export function usePlaceDetail() {
  async function openPlaceDetail(place) {
    state.place = place
    state.showModal = true
    state.intro = null
    state.common = null
    state.error = null

    const apiKey = import.meta.env.VITE_TOUR_API_KEY
    if (!apiKey) {
      state.error = 'no-key'
      return
    }

    state.isLoading = true
    try {
      const [intro, common] = await Promise.all([
        fetchDetailIntro(place.contentid, place.contenttypeid),
        fetchDetailCommon(place.contentid),
      ])
      state.intro = intro || null
      state.common = common || null
      if (!intro && !common) state.error = 'empty'
    } catch (e) {
      state.error = 'fetch-failed'
    } finally {
      state.isLoading = false
    }
  }

  function closePlaceDetail() {
    state.showModal = false
  }

  // contentTypeId별로 이용시간/요금 필드명이 다름 (12=관광지, 28=레포츠, 39=음식점 등)
  function getUseTimeLabel() {
    if (!state.intro) return null
    return state.intro.usetime || state.intro.usetimeculture || state.intro.usetimeleports || state.intro.opentimefood || null
  }

  function getRestDateLabel() {
    if (!state.intro) return null
    return state.intro.restdate || state.intro.restdateculture || state.intro.restdateleports || state.intro.restdatefood || null
  }

  function getFeeLabel() {
    if (!state.intro) return null
    return state.intro.usefee || state.intro.usefeeleports || state.intro.usetimefestival || null
  }

  function getParkingLabel() {
    if (!state.intro) return null
    return state.intro.parking || state.intro.parkingculture || state.intro.parkingleports || state.intro.parkingfood || null
  }

  function getInfoCenterLabel() {
    if (!state.intro) return null
    return state.intro.infocenter || state.intro.infocenterculture || state.intro.infocenterleports || state.intro.infocenterfood || null
  }

  return {
    state,
    openPlaceDetail,
    closePlaceDetail,
    getUseTimeLabel,
    getRestDateLabel,
    getFeeLabel,
    getParkingLabel,
    getInfoCenterLabel,
  }
}
