<template>
  <div v-if="community.state.alertState.show" class="fixed top-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-full flex items-center space-x-3 z-50 shadow-2xl border border-slate-700 animate-slide-down">
    <span :class="community.state.alertState.isSuccess ? 'text-emerald-400' : 'text-amber-400'">
      <i :class="community.state.alertState.isSuccess ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation'"></i>
    </span>
    <span class="text-xs font-bold">{{ community.state.alertState.message }}</span>
  </div>
</template>

<script setup>
import { useCommunity } from '../composables/useCommunity'

const community = useCommunity()
</script>
