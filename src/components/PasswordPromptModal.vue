<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 z-50 animate-fade-in">
    <div class="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl overflow-hidden">
      <div class="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
        <h4 class="font-extrabold text-xs md:text-sm text-slate-800"><i class="fa-solid fa-lock text-accent"></i> 익명 관리 인증</h4>
        <button @click="community.closePasswordPrompt" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="p-4 space-y-2.5">
        <p class="text-xs text-slate-500 font-bold leading-normal">글 작성시 기입한 4자리 암호를 기입해 주세요.</p>
        <input
          type="password"
          v-model="community.state.passwordConfirmInput"
          maxlength="4"
          placeholder="숫자 4자리"
          @keydown.enter="community.executeVerifiedAction"
          class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-center text-xs md:text-sm font-black tracking-widest outline-none focus:border-primary focus:bg-white"
        />
        <p v-if="community.state.passwordConfirmError" class="text-[9px] text-red-500 text-center font-bold">암호가 틀렸습니다. 다시 확인해 보세요.</p>
      </div>
      <div class="bg-slate-50 p-3 flex justify-end space-x-2 border-t border-slate-100">
        <button @click="community.closePasswordPrompt" class="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold py-1.5 px-3 rounded-lg">취소</button>
        <button @click="community.executeVerifiedAction" class="bg-primary hover:bg-primarydark text-slate-900 text-xs font-bold py-1.5 px-3 rounded-lg">인증 확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCommunity } from '../composables/useCommunity'

const community = useCommunity()
</script>
