<template>
  <header class="border-b transition-all duration-500 sticky top-0 z-40 bg-white border-slate-200 text-slate-800 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row justify-between items-center gap-4">
      <div class="flex items-center space-x-3 w-full lg:w-auto cursor-pointer" @click="changeTab('home')">
        <div class="bg-primary text-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-sm transition-all duration-500 transform hover:rotate-3">
          <i class="fa-solid fa-compass text-slate-800"></i>
        </div>
        <div>
          <h1 class="text-2xl font-black tracking-tight flex items-center gap-2 text-slate-800">
            LocalHub <span class="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1.5 rounded-full border border-slate-200">구미/경북</span>
          </h1>
          <p class="text-xs text-slate-500 font-semibold tracking-wide">설레는 동행 매칭 & 스마트 명소 정보 가이드</p>
        </div>
      </div>

      <nav class="flex items-center space-x-2 w-full lg:w-auto justify-center">
        <button
          v-for="tab in tabMenu"
          :key="tab.id"
          @click="changeTab(tab.id)"
          class="px-5 py-3 rounded-xl font-bold text-sm md:text-base transition-all flex items-center gap-2 border"
          :class="state.activeTab === tab.id ? 'bg-primary border-primary text-slate-900 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.name }}</span>
        </button>
      </nav>

      <div class="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-4">
        <div class="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl text-xs shadow-xs">
          <div class="flex items-center gap-1.5 font-bold text-slate-600">
            <i class="fa-solid fa-calendar-days text-accent"></i>
            <span>{{ todayLabel }} Live</span>
          </div>
          <div class="w-[1px] h-3 bg-slate-300"></div>
          <div class="flex items-center gap-2 text-slate-700" :title="weatherData.cached ? '24시간 고정 데이터 사용중' : '실시간 정보'">
            <i :class="[weatherIcon.cls, weatherIcon.color, 'text-base']"></i>
            <div class="text-left font-semibold">
              <div class="flex items-center gap-1 text-[11px] text-slate-500">
                <span>구미/경북 날씨</span>
                <span v-if="weatherLoading.value" class="w-1.5 h-1.5 bg-accent rounded-full animate-ping"></span>
              </div>
              <div class="text-[11px] font-bold text-slate-800">{{ weatherData.condition }} ({{ weatherData.tempMin }}°C / {{ weatherData.tempMax }}°C)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTabs, tabMenu } from '../composables/useTabs'
import { useWeather } from '../composables/useWeather'

const { state, changeTab } = useTabs()
const { weatherLoading, weatherData, weatherIcon, updateCachedWeather } = useWeather()

const todayLabel = new Date().toISOString().split('T')[0].replaceAll('-', '.')

onMounted(() => { updateCachedWeather() })
</script>
