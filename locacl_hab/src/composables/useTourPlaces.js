import { reactive, computed, nextTick } from 'vue'
import { GEOPLACES_DATABASE } from '../data/tourData'
import { useTabs } from './useTabs'

export const categories = [
  { id: 'nature', name: '자연/힐링', icon: 'fa-solid fa-tree' },
  { id: 'history', name: '역사/문화', icon: 'fa-solid fa-scroll' },
  { id: 'park', name: '공원/레저', icon: 'fa-solid fa-baseball' },
  { id: 'cafe', name: '감성카페', icon: 'fa-solid fa-coffee' },
  { id: 'food', name: '로컬맛집', icon: 'fa-solid fa-utensils' },
  { id: 'experience', name: '체험/레저', icon: 'fa-solid fa-person-hiking' },
]

const baseSpots = GEOPLACES_DATABASE.items
const cardWidth = 280
const cardGap = 16
const cardUnit = cardWidth + cardGap
let isTransitioning = false
let consecutiveExpansions = 0

const state = reactive({
  searchQuery: '',
  showSuggestions: false,
  loopSpots: [...baseSpots, ...baseSpots, ...baseSpots],
  trackOffset: baseSpots.length * cardUnit,
  exploreSearch: '',
  selectedCategory: null,
  expandedPlaceId: null,
})

export function useTourPlaces() {
  const { changeTab } = useTabs()

  const filteredSuggestions = computed(() => {
    const q = state.searchQuery.trim().toLowerCase()
    if (!q) return []
    return baseSpots.filter((item) => item.title.toLowerCase().includes(q) || item.zipcode.toLowerCase().includes(q)).slice(0, 5)
  })

  const filteredPlaces = computed(() => {
    return baseSpots.filter((p) => {
      const matchesCat = !state.selectedCategory || p.category === state.selectedCategory
      const q = state.exploreSearch.trim().toLowerCase()
      if (!q) return matchesCat
      const matchesSearch = p.title.toLowerCase().includes(q) || p.addr1.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.zipcode.toLowerCase().includes(q)
      return matchesCat && matchesSearch
    })
  })

  function selectSuggestion(title) {
    state.searchQuery = title
    state.showSuggestions = false
    executeSearch()
  }

  function executeSearch() {
    const query = state.searchQuery.trim()
    if (!query) return
    state.exploreSearch = query
    state.searchQuery = ''
    state.showSuggestions = false
    state.selectedCategory = null
    changeTab('explore')
    nextTick(() => {
      if (filteredPlaces.value.length > 0) state.expandedPlaceId = filteredPlaces.value[0].contentid
    })
  }

  function checkBoundaries() {
    const maxLimit = baseSpots.length * 2 * cardUnit
    const minLimit = baseSpots.length * cardUnit
    if (state.trackOffset >= maxLimit) {
      isTransitioning = true
      setTimeout(() => { state.trackOffset = minLimit; isTransitioning = false }, 400)
    } else if (state.trackOffset < minLimit) {
      isTransitioning = true
      setTimeout(() => { state.trackOffset = baseSpots.length * 2 * cardUnit - cardUnit; isTransitioning = false }, 400)
    }
  }

  function slideNext() {
    if (isTransitioning) return
    state.trackOffset += cardUnit
    checkBoundaries()
  }

  function slidePrev() {
    if (isTransitioning) return
    state.trackOffset -= cardUnit
    checkBoundaries()
  }

  function toggleCategoryFilter(catId) {
    state.selectedCategory = state.selectedCategory === catId ? null : catId
    state.exploreSearch = ''
    state.expandedPlaceId = null
  }

  function togglePlaceExpansion(contentid, onAutoTrigger) {
    if (state.expandedPlaceId === contentid) {
      state.expandedPlaceId = null
    } else {
      state.expandedPlaceId = contentid
      consecutiveExpansions++
      if (consecutiveExpansions >= 2) {
        consecutiveExpansions = 0
        if (onAutoTrigger) onAutoTrigger()
      }
    }
  }

  function exploreTargetSpot(title) {
    state.exploreSearch = title
    state.selectedCategory = null
    changeTab('explore')
    nextTick(() => {
      const target = filteredPlaces.value[0]
      if (target) state.expandedPlaceId = target.contentid
    })
  }

  function redirectToExternalMap(title) {
    window.open(`https://map.kakao.com/?q=${encodeURIComponent('구미 ' + title)}`, '_blank')
  }

  function handleImageError(e) {
    e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400'
  }

  return {
    state,
    baseSpots,
    categories,
    filteredSuggestions,
    filteredPlaces,
    selectSuggestion,
    executeSearch,
    slideNext,
    slidePrev,
    toggleCategoryFilter,
    togglePlaceExpansion,
    exploreTargetSpot,
    redirectToExternalMap,
    handleImageError,
  }
}
