<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-fade-in" @click="detail.closePlaceDetail">
    <div class="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col" @click.stop>
      <!-- Image header -->
      <div class="relative h-48 shrink-0 bg-slate-200">
        <img :src="place.firstimage" :alt="place.title" class="w-full h-full object-cover" @error="tour.handleImageError" />
        <button @click="detail.closePlaceDetail" class="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center">
          <i class="fa-solid fa-xmark text-sm"></i>
        </button>
        <span class="absolute bottom-3 left-3 bg-primary text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
          <i class="fa-solid fa-compass"></i> {{ place.zipcode }}
        </span>
      </div>

      <div class="p-5 space-y-4 overflow-y-auto">
        <div>
          <h3 class="font-black text-xl text-slate-800">{{ place.title }}</h3>
          <p class="text-xs text-slate-400 font-semibold mt-1"><i class="fa-solid fa-location-dot"></i> {{ place.addr1 }}</p>
        </div>

        <p class="text-xs text-slate-600 font-semibold leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">{{ place.desc }}</p>

        <!-- Loading -->
        <div v-if="detail.state.isLoading" class="flex items-center justify-center gap-2 py-8 text-xs text-slate-400 font-bold">
          <i class="fa-solid fa-spinner fa-spin"></i> 실시간 상세정보를 불러오는 중...
        </div>

        <!-- No API key configured -->
        <div v-else-if="detail.state.error === 'no-key'" class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 font-semibold leading-relaxed space-y-1.5">
          <p class="font-black flex items-center gap-1.5"><i class="fa-solid fa-triangle-exclamation"></i> 실시간 상세정보 미연동</p>
          <p>영업시간·휴무일·이용요금 등은 공공데이터포털(data.go.kr) "한국관광공사_국문 관광정보 서비스" API 키가 있어야 표시됩니다.</p>
          <p class="text-[10px] text-amber-600">.env 파일에 VITE_TOUR_API_KEY 를 설정하면 자동으로 연동됩니다.</p>
        </div>

        <!-- Fetch failed -->
        <div v-else-if="detail.state.error === 'fetch-failed'" class="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700 font-semibold">
          <i class="fa-solid fa-circle-exclamation"></i> 상세정보를 불러오지 못했습니다. API 키 또는 콘텐츠 ID를 확인해 주세요.
        </div>

        <!-- Empty result -->
        <div v-else-if="detail.state.error === 'empty'" class="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 font-semibold">
          이 장소는 상세정보가 등록되어 있지 않습니다.
        </div>

        <!-- Real data -->
        <div v-else class="space-y-2.5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <p class="text-[10px] font-black text-accent uppercase mb-1"><i class="fa-solid fa-clock"></i> 이용시간</p>
              <p class="text-xs text-slate-700 font-semibold" v-html="useTime || '정보 없음'"></p>
            </div>
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <p class="text-[10px] font-black text-slate-500 uppercase mb-1"><i class="fa-solid fa-calendar-xmark"></i> 휴무일</p>
              <p class="text-xs text-slate-700 font-semibold" v-html="restDate || '정보 없음'"></p>
            </div>
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <p class="text-[10px] font-black text-slate-500 uppercase mb-1"><i class="fa-solid fa-won-sign"></i> 이용요금 / 매표정보</p>
              <p class="text-xs text-slate-700 font-semibold" v-html="fee || '정보 없음 (무료 또는 미등록)'"></p>
            </div>
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3">
              <p class="text-[10px] font-black text-slate-500 uppercase mb-1"><i class="fa-solid fa-square-parking"></i> 주차</p>
              <p class="text-xs text-slate-700 font-semibold" v-html="parking || '정보 없음'"></p>
            </div>
          </div>

          <div class="bg-white border border-slate-200 rounded-xl p-3">
            <p class="text-[10px] font-black text-slate-500 uppercase mb-1"><i class="fa-solid fa-phone"></i> 문의처</p>
            <p class="text-xs text-slate-700 font-semibold" v-html="infoCenter || '정보 없음'"></p>
          </div>

          <!-- Travel agency products: intentionally not wired to a live API -->
          <div class="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3">
            <p class="text-[10px] font-black text-slate-400 uppercase mb-1"><i class="fa-solid fa-suitcase-rolling"></i> 여행사 상품정보</p>
            <p class="text-xs text-slate-400 font-semibold">공공데이터포털에서는 제공하지 않는 정보입니다 (여행사 자체 제휴 API 필요).</p>
          </div>
        </div>

        <button @click="tour.redirectToExternalMap(place.title)" class="w-full bg-accent hover:bg-accenthover text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5">
          <i class="fa-solid fa-location-arrow text-[10px]"></i> 지도에서 길찾기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePlaceDetail } from '../composables/usePlaceDetail'
import { useTourPlaces } from '../composables/useTourPlaces'

const detail = usePlaceDetail()
const tour = useTourPlaces()

const place = computed(() => detail.state.place)
const useTime = computed(() => detail.getUseTimeLabel())
const restDate = computed(() => detail.getRestDateLabel())
const fee = computed(() => detail.getFeeLabel())
const parking = computed(() => detail.getParkingLabel())
const infoCenter = computed(() => detail.getInfoCenterLabel())
</script>
