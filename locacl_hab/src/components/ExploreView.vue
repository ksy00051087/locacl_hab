<template>
  <div class="space-y-6 animate-fade-in">
    <div class="bg-white rounded-3xl p-5 shadow-xs border border-slate-200">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div>
          <h3 class="font-black text-xl text-slate-800 flex items-center gap-2"><i class="fa-solid fa-map-location-dot text-accent"></i> 테마별 명소 가이드</h3>
          <p class="text-xs text-slate-400 font-semibold mt-1">카테고리를 누른 뒤 장소 카드를 터치하여 세부 설명과 지도를 확인하세요.</p>
        </div>
        <div class="relative w-full md:w-80">
          <input type="text" v-model="tour.state.exploreSearch" placeholder="관광지 명칭, 도로명, 상세 정보 검색..." class="w-full bg-slate-50 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none border border-slate-200 focus:border-primary transition-all font-bold" />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><i class="fa-solid fa-magnifying-glass text-xs"></i></span>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <button
          v-for="cat in tour.categories"
          :key="cat.id"
          @click="tour.toggleCategoryFilter(cat.id)"
          class="py-2.5 px-2 rounded-2xl text-center flex flex-col items-center justify-center transition-all relative group border"
          :class="tour.state.selectedCategory === cat.id ? 'bg-primary border-primary text-slate-900 shadow-xs font-bold' : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600 hover:text-accent'"
        >
          <span class="text-xl mb-1"><i :class="cat.icon"></i></span>
          <span class="text-xs tracking-tight font-extrabold">{{ cat.name }}</span>
          <span v-if="tour.state.selectedCategory === cat.id" class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45"></span>
        </button>
      </div>

      <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 animate-fade-in">
        <div class="flex items-center justify-between mb-4 border-b border-slate-200 pb-2">
          <h4 class="text-xs font-black text-slate-700 flex items-center gap-1.5"><i class="fa-solid fa-compass text-accent"></i> 테마 추천 상세 정보</h4>
          <span class="text-xs text-slate-400 font-bold">결과 {{ tour.filteredPlaces.value.length }}건 조회됨</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="place in tour.filteredPlaces.value" :key="place.contentid" class="bg-white rounded-2xl p-4 border border-slate-200 hover:border-primary shadow-xs transition-all flex flex-col group relative overflow-hidden">
            <div class="flex space-x-4 items-center">
              <div class="w-20 h-20 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 relative border border-slate-100">
                <img :src="place.firstimage" class="w-full h-full object-cover transition-transform group-hover:scale-105" :alt="place.title" @error="tour.handleImageError" />
              </div>
              <div class="flex-grow min-w-0">
                <span class="bg-slate-100 text-slate-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">{{ place.zipcode }}</span>
                <h4 class="font-extrabold text-sm md:text-base text-slate-800 group-hover:text-accent transition-colors mt-1">{{ place.title }}</h4>
                <p class="text-xs text-slate-400 mt-0.5 truncate"><i class="fa-solid fa-location-dot"></i> {{ place.addr1 }}</p>
                <div class="flex items-center gap-3 mt-1.5">
                  <button @click="tour.togglePlaceExpansion(place.contentid, chat.handleAdvisorAutoTrigger)" class="text-xs text-accent hover:text-accenthover font-bold flex items-center gap-1">
                    <span>{{ tour.state.expandedPlaceId === place.contentid ? '요약 닫기' : '요약 보기' }}</span>
                    <i class="fa-solid" :class="tour.state.expandedPlaceId === place.contentid ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                  </button>
                  <button @click="detail.openPlaceDetail(place)" class="text-xs text-slate-500 hover:text-accent font-bold flex items-center gap-1 border-l border-slate-200 pl-3">
                    <i class="fa-solid fa-circle-info"></i> 상세정보
                  </button>
                </div>
              </div>
            </div>

            <div v-if="tour.state.expandedPlaceId === place.contentid" class="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 font-semibold space-y-2 animate-fade-in">
              <p class="leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs">{{ place.desc }}</p>
              <div class="flex items-center justify-between">
                <span class="text-[10px] text-slate-400 truncate max-w-[200px]"><i class="fa-solid fa-map-pin"></i> {{ place.addr1 }}</span>
                <button @click="tour.redirectToExternalMap(place.title)" class="bg-accent hover:bg-accenthover text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors">
                  <i class="fa-solid fa-location-arrow text-[10px]"></i> 지도 보기
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="tour.filteredPlaces.value.length === 0" class="text-center py-10 text-slate-400 text-xs">
          <i class="fa-solid fa-folder-open text-2xl mb-1 block text-slate-300"></i>
          일치하는 명소가 없습니다. 다른 검색어나 카테고리로 필터링해 보세요.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTourPlaces } from '../composables/useTourPlaces'
import { useChat } from '../composables/useChat'
import { usePlaceDetail } from '../composables/usePlaceDetail'

const tour = useTourPlaces()
const chat = useChat()
const detail = usePlaceDetail()
</script>
