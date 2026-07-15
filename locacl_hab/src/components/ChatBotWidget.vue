<template>
  <div class="fixed bottom-6 right-6 z-50">
    <button @click="chat.toggleChatbotWindow" class="bg-primary hover:bg-slate-800 text-slate-900 hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all relative border border-primary">
      <span class="absolute -top-1 -right-1 bg-accent text-white text-[8px] px-1.5 py-0.5 rounded-full font-black shadow-xs">AI</span>
      <i class="fa-solid fa-robot text-lg"></i>
    </button>

    <div v-if="chat.state.chatbotOpen" class="absolute bottom-14 right-0 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-fade-in">
      <div class="bg-primary text-slate-900 p-3.5 flex items-center justify-between">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-xl bg-white/45 flex items-center justify-center"><i class="fa-solid fa-robot text-sm text-slate-800"></i></div>
          <div>
            <h4 class="text-xs font-black">LocalHub AI 여행 비서</h4>
            <p class="text-[9px] text-slate-700 font-semibold">구미/경북 1:1 하이브리드 자동응답 가이드</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="chat.toggleChatKeySettings" class="text-slate-600 hover:text-slate-950 p-1 text-xs" title="API 설정"><i class="fa-solid fa-gears"></i></button>
          <button @click="chat.state.chatbotOpen = false" class="text-slate-600 hover:text-slate-950 p-1 text-xs"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>

      <div v-if="chat.state.chatbotSettingsOpen" class="bg-slate-50 p-4 border-b border-slate-200 text-xs text-slate-800 space-y-2 animate-fade-in">
        <div class="flex items-center justify-between">
          <span class="font-bold text-[10px] text-accent uppercase">사용자 OpenAI API Key</span>
          <span class="text-[9px] text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">Secure Client Storage</span>
        </div>
        <p class="text-[10px] text-slate-500 leading-normal">
          API Key를 비워둘 경우, 구미/경북 18개 대표 관광 데이터셋에 특화된 스마트 룰 기반 로컬 자연어 엔진이 무상 가이드 처리를 신속하게 대리 지원합니다.
        </p>
        <div class="flex gap-2">
          <input type="password" v-model="chat.state.userApiKey" placeholder="sk-..." class="flex-grow bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary font-mono" />
          <button @click="handleSaveKey" class="bg-primary text-slate-900 text-xs font-bold px-3 rounded-xl hover:bg-primarydark">저장</button>
        </div>
      </div>

      <div class="p-3.5 space-y-3 h-64 overflow-y-auto bg-slate-50" ref="chatScrollArea">
        <div v-for="msg in chat.state.chatLogs" :key="msg.id" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
          <div class="flex items-start space-x-2 max-w-[85%]" :class="msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'">
            <div v-if="msg.role !== 'user'" class="w-5 h-5 rounded-lg bg-primary text-slate-900 flex items-center justify-center text-[9px] flex-shrink-0 mt-0.5 shadow-xs"><i class="fa-solid fa-robot"></i></div>
            <div class="rounded-2xl p-2.5 text-[11px] shadow-xs font-semibold" :class="msg.role === 'user' ? 'bg-primary text-slate-900 rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'">
              <span class="whitespace-pre-wrap leading-relaxed">{{ msg.content }}</span>
            </div>
          </div>
        </div>
        <div v-if="chat.state.chatbotLoading" class="flex justify-start">
          <div class="flex items-center space-x-2 bg-white border border-slate-200 p-2.5 rounded-2xl rounded-tl-none shadow-xs text-xs text-slate-400">
            <span>분석 중...</span>
            <div class="flex space-x-1">
              <span class="w-1 h-1 bg-accent rounded-full animate-bounce" style="animation-delay: 0.1s"></span>
              <span class="w-1 h-1 bg-accent rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
              <span class="w-1 h-1 bg-accent rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-2.5 border-t border-slate-200 bg-white flex items-center gap-2">
        <input type="text" v-model="chat.state.chatbotTextInput" @keyup.enter="chat.handleSendChat" placeholder="명소 정보나 코스를 질문해 보세요..." class="flex-grow bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary rounded-xl px-3 py-1.5 text-xs outline-none transition-all font-bold" />
        <button @click="chat.handleSendChat" class="bg-primary hover:bg-primarydark text-slate-900 w-7 h-7 rounded-xl flex items-center justify-center shrink-0"><i class="fa-solid fa-paper-plane text-xs"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useChat } from '../composables/useChat'
import { useCommunity } from '../composables/useCommunity'

const chat = useChat()
const community = useCommunity()

const chatScrollArea = ref(null)

function handleSaveKey() {
  chat.saveUserApiKey(community.triggerFloatingAlert)
}

watch(
  () => chat.state.chatLogs.length,
  () => nextTick(() => { if (chatScrollArea.value) chatScrollArea.value.scrollTop = chatScrollArea.value.scrollHeight })
)

watch(
  () => chat.state.chatbotOpen,
  (open) => { if (open) nextTick(() => { if (chatScrollArea.value) chatScrollArea.value.scrollTop = chatScrollArea.value.scrollHeight }) }
)
</script>
