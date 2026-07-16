<template>
  <div class="space-y-6 animate-fade-in max-w-4xl mx-auto">
    <div class="bg-white rounded-3xl p-5 shadow-xs border border-slate-200">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
        <div>
          <h3 class="font-bold text-xl text-slate-800 flex items-center gap-2"><i class="fa-solid fa-calendar-days text-accent"></i> 같이 여행 일정 달력</h3>
          <p class="text-xs text-slate-400 font-semibold mt-1">출발 예정 날짜를 선택하여 일정을 조회하세요.</p>
        </div>
        <div class="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-2xl p-1.5 self-stretch sm:self-auto justify-between">
          <button @click="community.adjustCalendarMonth(-1)" class="w-8 h-8 hover:bg-slate-100 text-slate-500 hover:text-accent rounded-xl flex items-center justify-center transition-colors"><i class="fa-solid fa-chevron-left text-xs"></i></button>
          <span class="text-sm font-black text-slate-700 px-4">{{ community.state.currentYear }}년 {{ community.state.currentMonth + 1 }}월</span>
          <button @click="community.adjustCalendarMonth(1)" class="w-8 h-8 hover:bg-slate-100 text-slate-500 hover:text-accent rounded-xl flex items-center justify-center transition-colors"><i class="fa-solid fa-chevron-right text-xs"></i></button>
        </div>
      </div>

      <div class="grid grid-cols-7 text-center text-[17px] font-bold text-slate-400 mb-2 py-1.5 border-b border-slate-100">
        <div class="text-red-500">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div class="text-sky-500">토</div>
      </div>

      <div class="grid grid-cols-7 gap-1 text-sm md:text-base">
        <div v-for="blank in community.calendarOffsetBlanks.value" :key="'blank-' + blank" class="aspect-square bg-slate-100 rounded-2xl border border-transparent pointer-events-none cursor-default"></div>

        <div
          v-for="day in community.calendarActiveDays.value"
          :key="day.dateString"
          @click="community.onSelectCalendarDate(day.dateString)"
          class="aspect-square rounded-2xl p-1.5 text-left relative flex flex-col justify-between transition-all duration-200 cursor-pointer border"
          :class="community.getCalendarCellClass(day)"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center">
              <span v-if="day.isToday" class="flex items-center justify-center w-8 h-8 rounded-full bg-[#0a6e54] text-white text-lg font-bold leading-none">
                {{ day.day }}
              </span>
              <span v-else class="text-lg font-bold" :class="{ 'text-red-500': day.dayOfWeek === 0, 'text-sky-500': day.dayOfWeek === 6 }">
                {{ day.day }}
              </span>
            </div>

            <div class="flex items-center">
              <span v-if="day.isToday" class="text-[14px] font-extrabold tracking-tight" style="color: #0a6e54;">Today</span>
            </div>
          </div>

          <!-- Today인 경우 숫자와 Today 아래에 하나의 중앙 정렬 가로줄 -->
          <div v-if="day.isToday" class="absolute left-1/2 transform -translate-x-1/2 top-10 w-28 h-[2px] bg-[#0a6e54] rounded-full pointer-events-none"></div>
          <div class="mt-1 flex items-end">
            <div v-if="community.getPostsForSelectedDate(day.dateString).length > 0"
                class="inline-flex items-center shadow gap-2 px-2 py-0.3 rounded-full bg-emerald-50 border border-emerald-100">
                <span class="w-2 h-2 rounded-full" style="background:#0a6e54;"></span> <span class="text-[12px] font-bold text-[#0a6e54]"> {{ community.getPostsForSelectedDate(day.dateString).length }}개 일정 </span>
            </div>
          </div>
        </div>
        <div v-for="n in (7 - (community.calendarOffsetBlanks.value.length + community.calendarActiveDays.value.length) % 7) % 7"
            :key="'trailing-' + n"
            class="aspect-square bg-slate-100 rounded-2xl border border-transparent pointer-events-none cursor-default">
        </div>
      </div>

      <div v-if="community.state.selectedCalendarDate" class="mt-4 bg-slate-50 rounded-3xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
        <div class="min-w-0 flex-grow space-y-1.5">
          <span class="text-[14px] bg-primary text-slate-900 font-bold px-2 py-1 rounded-full">{{ community.formatSelectedKoreanDate(community.state.selectedCalendarDate) }} 모집 내역</span>
          <div class="pt-1 space-y-1.5">
            <div
              v-for="p in community.getPostsForSelectedDate(community.state.selectedCalendarDate)"
              :key="p.id"
              @click="community.jumpToCommunityPost(p.id)"
              class="text-xs text-slate-700 hover:text-accent font-bold flex items-center space-x-2 cursor-pointer border-b border-dashed border-slate-200 pb-1"
            >
              <i class="fa-solid fa-arrow-right-long text-accent"></i>
              <span class="underline underline-offset-2 truncate">{{ p.title }}</span>
              <span class="text-[10px] text-slate-400 shrink-0">({{ p.region }}) • 👥 {{ p.currentCount }}/{{ p.maxCount }}</span>
            </div>
            <p v-if="community.getPostsForSelectedDate(community.state.selectedCalendarDate).length === 0" class="text-xs text-slate-400 font-semibold py-1">
              이 날짜에 등록된 실시간 모집 일정이 없습니다. 커뮤니티 탭에서 첫 일정을 모집해보세요!
            </p>
          </div>
        </div>
        <button @click="community.state.selectedCalendarDate = null" class="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 w-7 h-7 rounded-full flex items-center justify-center shadow-xs"><i class="fa-solid fa-xmark text-xs"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCommunity } from '../composables/useCommunity'

const community = useCommunity()
</script>
