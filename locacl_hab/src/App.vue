<template>
  <div id="app" class="min-h-screen flex flex-col text-lg md:text-xl">
    <AppHeader />

    <main class="flex-grow max-w-7xl w-full mx-auto p-4 lg:p-6">
      <HomeView v-if="state.activeTab === 'home'" />
      <ExploreView v-if="state.activeTab === 'explore'" />
      <CommunityView v-if="state.activeTab === 'community'" />
      <CalendarView v-if="state.activeTab === 'calendar'" />
    </main>

    <ChatBotWidget />

    <PostFormModal v-if="community.state.postModalOpen" />
    <PasswordPromptModal v-if="community.state.passwordPromptOpen" />
    <PlaceDetailModal v-if="detail.state.showModal" />
    <AlertToast />

    <footer class="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-auto">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="flex items-center space-x-2 text-slate-300">
          <span class="font-black text-slate-200 text-xs md:text-sm">LocalHub Gumi/Gyeongbuk</span>
          <span>|</span>
          <span class="font-semibold text-xs text-slate-500">대구/경북 연동형 스마트 탐색 맵</span>
        </div>
        <div class="text-[10px] text-slate-500 font-medium">&copy; 2026 LocalHub. All Rights Reserved.</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import HomeView from './components/HomeView.vue'
import ExploreView from './components/ExploreView.vue'
import CommunityView from './components/CommunityView.vue'
import CalendarView from './components/CalendarView.vue'
import ChatBotWidget from './components/ChatBotWidget.vue'
import PostFormModal from './components/PostFormModal.vue'
import PasswordPromptModal from './components/PasswordPromptModal.vue'
import PlaceDetailModal from './components/PlaceDetailModal.vue'
import AlertToast from './components/AlertToast.vue'
import { useTabs } from './composables/useTabs'
import { useCommunity } from './composables/useCommunity'
import { usePlaceDetail } from './composables/usePlaceDetail'

const { state } = useTabs()
const community = useCommunity()
const detail = usePlaceDetail()
</script>
