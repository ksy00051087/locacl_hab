<template>
  <div class="space-y-6 animate-fade-in">
    <div class="bg-primary/20 text-slate-800 p-5 rounded-3xl shadow-xs border border-primary/60 space-y-2.5">
      <h4 class="font-black text-base uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
        <i class="fa-solid fa-location-dot text-accent animate-bounce"></i> 경북 전역 주요 연계 안내
      </h4>
      <p class="text-sm md:text-base text-slate-600 leading-normal font-semibold">
        구미뿐 아니라 군위 화본역 등 경북 인근 명소가 포함되어 있으며, 탐색 탭 연계 길 안내와 AI 하이브리드 자동응답 시스템을 제공합니다.
      </p>
    </div>

    <div class="bg-white p-5 lg:p-7 rounded-3xl shadow-xs border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 relative">
      <div class="space-y-3.5 z-10 max-w-2xl">
        <span class="bg-primary text-slate-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">Gumi & Gyeongbuk Gateway</span>
        <h2 class="text-3xl lg:text-4xl font-black text-slate-800 leading-tight">구미/경북의 새로운 여행 파트너</h2>
        <p class="text-slate-600 text-base leading-relaxed font-medium">
          <span class="text-slate-800 font-extrabold text-lg">"새로운 로컬 인연과의 만남"</span><br />
          로컬허브는 구미와 경북 지역 곳곳에 숨겨진 보석 같은 자연경관, 아날로그 간이역, 트렌디한 감성골목을 자유롭게 탐방하며 일정을 연동해 나만의 여행 메이트를 실시간으로 찾고 이야기를 나눌 수 있는 웰메이드 소통 플랫폼입니다.
        </p>
      </div>

      <div class="w-full md:w-80 bg-slate-50 p-4 rounded-2xl border border-slate-200 z-10 space-y-2.5 relative">
        <label class="block text-xs font-extrabold text-slate-700 uppercase tracking-wider"><i class="fa-solid fa-magnifying-glass text-accent"></i> 통합 명소 검색</label>
        <div class="relative">
          <input
            type="text"
            v-model="tour.state.searchQuery"
            @keyup.enter="tour.executeSearch"
            @focus="tour.state.showSuggestions = true"
            placeholder="어디로 가고 싶으신가요?"
            class="w-full bg-white text-slate-800 rounded-xl pl-3 pr-10 py-2.5 text-sm outline-none border border-slate-200 focus:border-primary focus:ring-2 focus:ring-emerald-50 transition-all font-bold"
          />
          <button @click="tour.executeSearch" class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-slate-900 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-primarydark">
            <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>

        <div v-if="tour.state.showSuggestions && tour.filteredSuggestions.value.length > 0" class="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
          <div
            v-for="suggestion in tour.filteredSuggestions.value"
            :key="suggestion.title"
            @mousedown="tour.selectSuggestion(suggestion.title)"
            class="px-3 py-2 hover:bg-slate-100 text-xs text-slate-700 cursor-pointer flex justify-between font-bold"
          >
            <span>{{ suggestion.title }}</span>
            <span class="text-[10px] text-accent bg-emerald-50 px-2 py-0.5 rounded-full">{{ suggestion.zipcode }}</span>
          </div>
        </div>
        <p class="text-xs text-slate-400 font-semibold">금오산, 금리단길, 화본역, 에코랜드 등 입력 후 엔터!</p>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-5 shadow-xs border border-slate-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-black text-xl text-slate-800 flex items-center gap-2">
          <span class="text-accent text-lg"><i class="fa-solid fa-circle-play"></i></span> 여행 추천 스팟 둘러보기
        </h3>
        <div class="flex space-x-2">
          <button @click="tour.slidePrev" class="w-8 h-8 bg-slate-50 hover:bg-primary hover:text-slate-900 rounded-lg flex items-center justify-center transition-all border border-slate-200"><i class="fa-solid fa-arrow-left text-xs"></i></button>
          <button @click="tour.slideNext" class="w-8 h-8 bg-slate-50 hover:bg-primary hover:text-slate-900 rounded-lg flex items-center justify-center transition-all border border-slate-200"><i class="fa-solid fa-arrow-right text-xs"></i></button>
        </div>
      </div>

      <div class="infinite-viewport rounded-2xl">
        <div class="infinite-track" :style="{ transform: `translateX(-${tour.state.trackOffset}px)` }">
          <div
            v-for="(spot, index) in tour.state.loopSpots"
            :key="index"
            @click="detail.openPlaceDetail(spot)"
            class="w-[calc(100%-0px)] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] flex-shrink-0 bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 hover:border-primary hover:scale-[1.01] transition-all duration-300 shadow-xs relative group cursor-pointer"
          >
            <div class="aspect-video sm:aspect-square w-full relative overflow-hidden bg-slate-200">
              <img :src="spot.firstimage" :alt="spot.title" @error="tour.handleImageError" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute top-2.5 left-2.5 bg-primary text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-full border border-white/20 shadow-sm">
                <i class="fa-solid fa-compass"></i> {{ spot.zipcode }}
              </div>
            </div>
            <div class="p-3.5 bg-white border-t border-slate-100">
              <h4 class="font-extrabold text-base text-slate-800 line-clamp-1 group-hover:text-accent transition-colors">{{ spot.title }}</h4>
              <p class="text-xs text-slate-400 truncate mt-1"><i class="fa-solid fa-location-dot text-accent"></i> {{ spot.addr1 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-4 bg-white rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 class="font-black text-lg text-slate-800 flex items-center gap-1.5"><i class="fa-solid fa-people-group text-accent"></i> 같이 여행 일정</h3>
              <p class="text-xs text-slate-500 font-semibold mt-0.5">여행 메이트 탐색</p>
            </div>
            <button @click="changeTab('calendar')" class="bg-slate-100 hover:bg-primary hover:text-slate-900 text-slate-700 font-extrabold text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 transition-all flex items-center gap-1 shadow-xs">
              <i class="fa-solid fa-calendar-days"></i> 달력보기
            </button>
          </div>

          <div class="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            <div
              v-for="post in community.recruitmentPosts.value"
              :key="post.id"
              @click="community.jumpToCommunityPost(post.id)"
              class="bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-primary/50 rounded-2xl p-3 flex flex-col gap-2 cursor-pointer transition-all"
            >
              <div class="flex items-start space-x-2.5 min-w-0">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center text-base shadow-xs shrink-0" :class="community.getPostCategoryDetails(post).bg">
                  <i :class="community.getPostCategoryDetails(post).icon"></i>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span class="bg-primary text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase">{{ community.getPostCategoryDetails(post).name }}</span>
                    <span class="text-xs text-accent font-bold"><i class="fa-regular fa-calendar"></i> {{ post.travelDate }}</span>
                  </div>
                  <h4 class="font-extrabold text-sm md:text-base text-slate-800 truncate">{{ post.title }}</h4>
                </div>
              </div>
              <div class="text-right border-t border-slate-100 pt-2 flex justify-between items-center">
                <span class="text-xs text-slate-400 font-semibold"><i class="fa-solid fa-map-pin"></i> {{ post.region }}</span>
                <span class="inline-flex items-center gap-1 text-xs font-black px-2 py-1 rounded-full" :class="post.currentCount >= post.maxCount ? 'bg-slate-200 text-slate-500' : 'bg-emerald-50 text-accent border border-emerald-200'">
                  <i class="fa-solid fa-users"></i> {{ post.currentCount }} / {{ post.maxCount }} 명
                </span>
              </div>
            </div>
            <div v-if="community.recruitmentPosts.value.length === 0" class="text-center py-8 text-slate-400 text-xs font-semibold">
              현재 등록된 활성 여행메이트 일정이 없습니다. 커뮤니티 탭에서 새 모집글을 작성해 보세요!
            </div>
          </div>
        </div>

        <div class="bg-emerald-50/50 border border-emerald-100 p-3 rounded-2xl text-xs text-slate-600 font-semibold mt-4">
          💡 <span class="text-slate-800 font-bold">일정 연동 가이드:</span> 원하는 모집 일정을 누르면 커뮤니티 상세 창으로 이동하여 본문을 확인하고 동행 참여 댓글을 등록할 수 있습니다.
        </div>
      </div>

      <div class="lg:col-span-8 space-y-4 flex flex-col justify-between">
        <div class="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs flex-grow flex flex-col justify-between">
          <div>
            <h4 class="font-black text-lg text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-3"><i class="fa-solid fa-fire text-amber-500 animate-pulse"></i> 최신 익명 커뮤니티 소식</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
              <div
                v-for="post in community.sortedPosts.value.slice(0, 4)"
                :key="'latest-' + post.id"
                @click="community.jumpToCommunityPost(post.id)"
                class="group cursor-pointer hover:bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:border-primary/50 transition-all flex flex-col justify-between bg-slate-50/30"
              >
                <div>
                  <div class="flex items-center gap-2 mb-1.5">
                    <span class="text-[10px] font-extrabold px-1.5 py-0.5 rounded" :class="post.type === 'recruitment' ? 'bg-emerald-50 text-accent border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'">
                      {{ post.type === 'recruitment' ? '모집' : '일반' }}
                    </span>
                    <span class="text-xs text-slate-400 font-medium">{{ post.createdDate }}</span>
                  </div>
                  <h5 class="text-sm font-bold text-slate-800 group-hover:text-accent transition-colors line-clamp-1">{{ post.title }}</h5>
                  <p class="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-semibold">{{ post.content }}</p>
                </div>
                <div class="mt-2 pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                  <span><i class="fa-solid fa-user-secret"></i> 익명메이트</span>
                  <span><i class="fa-solid fa-heart text-rose-500"></i> {{ post.likes }}</span>
                </div>
              </div>
              <div v-if="community.sortedPosts.value.length === 0" class="col-span-2 text-center py-8 text-xs text-slate-400 font-semibold">작성된 소통 글이 아직 없습니다.</div>
            </div>
          </div>
          <div class="flex justify-end mt-4">
            <button @click="community.jumpToCommunityAndWrite" class="bg-primary hover:bg-primarydark text-slate-900 text-xs font-black py-2.5 px-6 rounded-xl shadow-xs transition-colors text-center">
              <i class="fa-solid fa-feather mr-1"></i> 새 글 등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTabs } from '../composables/useTabs'
import { useTourPlaces } from '../composables/useTourPlaces'
import { useCommunity } from '../composables/useCommunity'
import { usePlaceDetail } from '../composables/usePlaceDetail'

const { changeTab } = useTabs()
const tour = useTourPlaces()
const community = useCommunity()
const detail = usePlaceDetail()
</script>
