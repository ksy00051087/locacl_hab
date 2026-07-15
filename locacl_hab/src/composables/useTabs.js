import { reactive } from 'vue'

const state = reactive({ activeTab: 'home' })

export const tabMenu = [
  { id: 'home', name: '홈', icon: 'fa-solid fa-house' },
  { id: 'explore', name: '탐색', icon: 'fa-solid fa-compass' },
  { id: 'community', name: '커뮤니티', icon: 'fa-solid fa-comments' },
  { id: 'calendar', name: '캘린더', icon: 'fa-solid fa-calendar-days' },
]

export function useTabs() {
  function changeTab(tabId) {
    state.activeTab = tabId
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return { state, tabMenu, changeTab }
}
