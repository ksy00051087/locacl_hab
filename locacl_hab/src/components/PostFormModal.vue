<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-fade-in">
    <div class="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
      <div class="bg-primary text-slate-900 p-4 flex items-center justify-between">
        <h3 class="font-extrabold text-sm md:text-base flex items-center gap-1.5">
          <i class="fa-solid fa-file-pen"></i>
          <span>{{ community.state.isEditMode ? '수다 및 모집글 수정' : '새로운 게시글 및 동행 모집 등록' }}</span>
        </h3>
        <button @click="community.closePostModal" class="text-slate-700 hover:text-slate-950"><i class="fa-solid fa-xmark text-lg"></i></button>
      </div>

      <div class="p-4 space-y-3.5 max-h-[460px] overflow-y-auto">
        <div>
          <label class="block text-xs font-black text-slate-600 mb-1">소통 주제 선택 *</label>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" @click="community.state.newPostForm.type = 'general'" class="py-2 rounded-xl border font-bold text-xs transition-all" :class="community.state.newPostForm.type === 'general' ? 'bg-slate-700 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'">일반 수다 / 소통</button>
            <button type="button" @click="community.state.newPostForm.type = 'recruitment'" class="py-2 rounded-xl border font-bold text-xs transition-all" :class="community.state.newPostForm.type === 'recruitment' ? 'bg-primary border-primary text-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'">동행 모집 참여글</button>
          </div>
        </div>

        <div v-if="community.state.newPostForm.type === 'recruitment'" class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-emerald-50/40 rounded-xl border border-emerald-100">
          <div>
            <label class="block text-[10px] font-bold text-accent mb-1">여행 출발 날짜 *</label>
            <input type="date" v-model="community.state.newPostForm.travelDate" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-primary font-bold" />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-accent mb-1">모집 인원 (정원 제한) *</label>
            <input type="number" v-model="community.state.newPostForm.maxCount" min="2" max="30" class="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-primary font-bold" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-black text-slate-600 mb-1">대상 구미/경북 지역위치 *</label>
          <select v-model="community.state.newPostForm.region" class="w-full bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs outline-none focus:border-primary font-bold">
            <option v-for="reg in community.filterRegions.slice(1)" :key="reg" :value="reg">{{ reg }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-black text-slate-600 mb-1">현지 풍경 및 일정표 이미지 (선택)</label>
          <div class="flex items-center gap-2">
            <input type="file" ref="fileUploader" @change="community.handleFileUpload" accept="image/*" class="hidden" />
            <button type="button" @click="fileUploader.click()" class="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-1 px-3 rounded-lg border border-slate-300">
              <i class="fa-solid fa-camera mr-1 text-[10px]"></i> 파일 선택
            </button>
            <span class="text-xs text-slate-400 font-bold truncate max-w-[200px]">{{ community.state.newPostForm.imageName || '등록된 사진 없음' }}</span>
          </div>
          <div v-if="community.state.newPostForm.imageFile" class="mt-2 relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200">
            <img :src="community.state.newPostForm.imageFile" class="w-full h-full object-cover" />
            <button @click="community.clearUploadedImage" class="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-[8px] rounded-bl"><i class="fa-solid fa-x"></i></button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-black text-slate-600 mb-1">소통 게시글 제목 *</label>
          <input type="text" v-model="community.state.newPostForm.title" placeholder="예: 이번주 토요일 금오산 완등하고 칼국수 부실 파티원 모집!" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-primary font-bold" />
        </div>

        <div>
          <label class="block text-xs font-black text-slate-600 mb-1">여행 내용 / 가벼운 자기소개 *</label>
          <textarea v-model="community.state.newPostForm.content" rows="4" placeholder="희망하는 연령대나 세부 계획 코스를 간략히 써주시면 매칭률이 훨씬 높아집니다." class="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-primary resize-none font-bold"></textarea>
        </div>

        <div>
          <label class="block text-xs font-black text-slate-600 mb-1">익명 관리용 패스워드 (숫자 4자리) *</label>
          <input type="password" v-model="community.state.newPostForm.password" maxlength="4" placeholder="글의 안전한 수정/삭제를 제어합니다" class="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-primary font-bold" />
        </div>
      </div>

      <div class="bg-slate-50 p-4 border-t border-slate-100 flex justify-end space-x-2">
        <button @click="community.closePostModal" class="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black py-1.5 px-4 rounded-xl">취소</button>
        <button @click="community.saveNewPost" class="bg-primary hover:bg-primarydark text-slate-900 text-xs font-black py-1.5 px-4 rounded-xl shadow-sm">{{ community.state.isEditMode ? '수정 저장' : '등록 완료' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCommunity } from '../composables/useCommunity'

const community = useCommunity()
const fileUploader = ref(null)
</script>
