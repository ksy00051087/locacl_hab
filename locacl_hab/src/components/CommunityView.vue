<template>
  <div class="space-y-6 animate-fade-in">
    <div class="bg-white rounded-3xl p-5 shadow-xs border border-slate-200">
      <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-5 space-y-1.5 text-xs">
        <h4 class="font-extrabold text-slate-800 flex items-center gap-1.5"><i class="fa-solid fa-triangle-exclamation text-amber-500 animate-pulse"></i> LocalHub 커뮤니티 이용 수칙 및 안내</h4>
        <p class="text-slate-600 font-semibold leading-relaxed">
          로컬허브 구미/경북은 따뜻하고 예의 바른 여행 문화를 장려합니다. 본 게시판은 익명 기반으로 작성되며, 4자리 비밀번호 확인을 통해 삭제 및 수정이 안전하게 제어됩니다. 도배, 비방, 허위 모집글 작성 시 이용 정지 조치가 동반될 수 있으니 서로 배려하는 안전 여행을 함께 만들어 주세요.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3 mb-4">
        <div>
          <h3 class="font-black text-xl text-slate-800 flex items-center gap-2"><i class="fa-solid fa-comments text-accent"></i> 실시간 익명 소통 보드</h3>
          <p class="text-xs text-slate-400 font-semibold mt-1">제목을 터치하여 글 내용을 활성화하고 동행 매칭 및 댓글 대화를 나누어보세요.</p>
        </div>
        <button @click="community.openPostModal" class="bg-primary hover:bg-primarydark text-slate-900 text-xs font-black py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-xs transition-all self-stretch sm:self-auto text-center justify-center">
          <i class="fa-solid fa-feather"></i> 게시글 등록하기
        </button>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div class="flex space-x-1.5 overflow-x-auto pb-1">
          <button @click="community.state.communityTypeFilter = 'all'" class="text-xs font-extrabold px-3.5 py-1.5 rounded-xl border shrink-0 transition-all" :class="community.state.communityTypeFilter === 'all' ? 'bg-primary border-primary text-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">전체보기</button>
          <button @click="community.state.communityTypeFilter = 'general'" class="text-xs font-extrabold px-3.5 py-1.5 rounded-xl border shrink-0 transition-all" :class="community.state.communityTypeFilter === 'general' ? 'bg-accent border-accent text-white' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">일반 자유글</button>
          <button @click="community.state.communityTypeFilter = 'recruitment'" class="text-xs font-extrabold px-3.5 py-1.5 rounded-xl border shrink-0 transition-all" :class="community.state.communityTypeFilter === 'recruitment' ? 'bg-primary border-primary text-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">동행 모집글</button>
        </div>
        <div class="flex items-center space-x-2 text-xs">
          <span class="text-slate-400 font-bold shrink-0">지역구 필터:</span>
          <select v-model="community.state.selectedRegionFilter" class="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none text-xs font-bold text-slate-700">
            <option v-for="reg in community.filterRegions" :key="reg" :value="reg">{{ reg }}</option>
          </select>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="post in community.sortedPosts.value"
          :key="post.id"
          :id="'post-' + post.id"
          class="bg-white rounded-2xl border transition-all duration-300 relative"
          :class="post.isOpen ? 'border-primary shadow-sm ring-1 ring-slate-200' : 'border-slate-200 hover:border-primary'"
        >
          <div @click="community.togglePostAccordion(post.id)" class="p-4 cursor-pointer flex items-start justify-between gap-3 select-none">
            <div class="space-y-2 min-w-0 flex-grow">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[9px] font-black px-2 py-0.5 rounded-md border" :class="post.type === 'recruitment' ? 'bg-emerald-50 border-emerald-200 text-accent' : 'bg-slate-100 border-slate-200 text-slate-700'">{{ post.type === 'recruitment' ? '모집' : '일반' }}</span>
                <span class="text-[9px] bg-slate-50 border border-slate-200 font-bold text-slate-500 px-2 py-0.5 rounded-md">{{ post.region }}</span>
                <span v-if="post.type === 'recruitment'" class="text-[9px] bg-emerald-50 text-accent border border-emerald-200 font-bold px-2 py-0.5 rounded-md"><i class="fa-regular fa-calendar-check text-[8px]"></i> 출발: {{ post.travelDate }}</span>
              </div>
              <h4 class="font-black text-base md:text-lg text-slate-800 flex items-center gap-2">
                <span v-if="post.type === 'recruitment'" class="text-accent"><i class="fa-solid fa-users"></i></span>
                <span v-else class="text-slate-400"><i class="fa-solid fa-message"></i></span>
                <span class="hover:underline">{{ post.title }}</span>
              </h4>
            </div>
            <div class="flex items-center space-x-3 shrink-0 self-center">
              <span v-if="post.type === 'recruitment'" class="text-[10px] bg-slate-100 text-accent border border-emerald-100 font-black px-2 py-0.5 rounded-lg">👥 {{ post.currentCount }} / {{ post.maxCount }}</span>
              <span class="text-slate-400 text-xs"><i class="fa-solid" :class="post.isOpen ? 'fa-chevron-up' : 'fa-chevron-down'"></i></span>
            </div>
          </div>

          <div v-show="post.isOpen" class="border-t border-slate-200 p-4 bg-slate-50/50 rounded-b-2xl animate-fade-in space-y-3.5">
            <div v-if="post.type === 'recruitment'" class="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="text-xs">
                <p class="font-black text-slate-800">🤝 함께 가고 싶은 일정에 모집 지원하시겠습니까?</p>
                <p class="text-slate-400 text-[10px] mt-0.5">매칭 완료 후 오프라인에서 안전하고 쾌적한 만남을 조율해 보세요.</p>
              </div>
              <button
                @click="community.enrollInRecruitment(post)"
                :disabled="community.hasAlreadyJoined(post.id) || post.currentCount >= post.maxCount"
                class="text-xs font-black px-3 py-2 rounded-xl transition-all shadow-xs shrink-0"
                :class="community.hasAlreadyJoined(post.id) ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : post.currentCount >= post.maxCount ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-accent hover:bg-accenthover text-white'"
              >
                <span v-if="community.hasAlreadyJoined(post.id)"><i class="fa-solid fa-check"></i> 참여 완료</span>
                <span v-else-if="post.currentCount >= post.maxCount"><i class="fa-solid fa-ban"></i> 모집 마감</span>
                <span v-else><i class="fa-solid fa-user-plus text-[10px]"></i> 메이트 참여 ({{ post.currentCount }}/{{ post.maxCount }})</span>
              </button>
            </div>

            <div class="text-sm md:text-base text-slate-700 font-semibold whitespace-pre-wrap leading-relaxed">{{ post.content }}</div>

            <div v-if="post.imageFile" class="max-w-md rounded-xl overflow-hidden border border-slate-200 mt-2 bg-slate-100">
              <img :src="post.imageFile" class="w-full h-auto object-cover max-h-80" alt="게시물 첨부 이미지" />
            </div>

            <div class="flex items-center justify-between text-xs text-slate-400 border-t border-slate-200 pt-3 flex-wrap gap-2">
              <div class="flex items-center space-x-2">
                <span class="font-extrabold text-slate-500"><i class="fa-solid fa-user-secret text-accent"></i> 익명메이트</span>
                <span>•</span>
                <span>{{ post.createdDate }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <button @click="community.togglePostLike(post)" class="hover:text-red-500 flex items-center gap-0.5 font-bold">
                  <i class="fa-solid fa-heart" :class="{ 'text-red-500': post.liked }"></i> {{ post.likes }}
                </button>
                <span>•</span>
                <button @click="community.initiateEdit(post)" class="text-slate-400 hover:text-accent font-bold">수정</button>
                <button @click="community.initiateDelete(post)" class="text-slate-400 hover:text-red-600 font-bold">삭제</button>
              </div>
            </div>

            <div class="border-t border-slate-200 pt-3 space-y-2.5">
              <h5 class="text-xs font-extrabold text-slate-700 flex items-center gap-1.5"><i class="fa-regular fa-comments"></i> 익명 실시간 댓글 ({{ post.comments ? post.comments.length : 0 }})</h5>

              <div v-if="post.comments && post.comments.length > 0" class="space-y-2 bg-white p-3 rounded-2xl border border-slate-200 max-h-48 overflow-y-auto">
                <div v-for="(comment, cIdx) in post.comments" :key="cIdx" class="text-xs leading-relaxed border-b border-slate-100 pb-1.5 last:border-b-0 last:pb-0">
                  <div class="flex justify-between items-center text-[10px] text-slate-400 font-semibold mb-0.5">
                    <span class="text-accent font-bold"><i class="fa-solid fa-reply"></i> 익명 여행가</span>
                    <span>{{ comment.date }}</span>
                  </div>
                  <p class="text-slate-700 font-bold text-xs">{{ comment.content }}</p>
                </div>
              </div>
              <div v-else class="text-[11px] text-slate-400 font-semibold py-1">작성된 댓글이 없습니다. 첫 익명 소통 한마디를 나누어보세요!</div>

              <div class="flex gap-2">
                <input
                  type="text"
                  v-model="post.newComment"
                  @keyup.enter="community.submitComment(post)"
                  placeholder="질문이나 따뜻한 격려 메시지를 남겨주세요..."
                  class="flex-grow bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary font-semibold"
                />
                <button @click="community.submitComment(post)" class="bg-accent hover:bg-accenthover text-white text-xs font-bold px-3 rounded-xl transition-colors shrink-0">등록</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="community.sortedPosts.value.length === 0" class="py-12 text-center text-slate-400 text-xs bg-white rounded-3xl border border-dashed border-slate-200">
          <i class="fa-solid fa-file-excel text-2xl text-accent/40 mb-1.5 block"></i>
          해당 조건 또는 지역에 등록된 익명 게시물이 없습니다.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCommunity } from '../composables/useCommunity'

const community = useCommunity()
</script>
