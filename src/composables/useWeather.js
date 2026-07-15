import { reactive, computed } from 'vue'

const weatherLoading = reactive({ value: false })
const weatherData = reactive({
  condition: '구름조금 흐림',
  tempMin: 18,
  tempMax: 29,
  cached: true,
})

export function useWeather() {
  const weatherIcon = computed(() => {
    const cond = weatherData.condition
    if (cond.includes('맑음')) return { cls: 'fa-solid fa-sun', color: 'text-amber-500 animate-pulse' }
    if (cond.includes('비')) return { cls: 'fa-solid fa-cloud-showers-heavy', color: 'text-slate-500' }
    return { cls: 'fa-solid fa-cloud-sun', color: 'text-slate-400 animate-pulse' }
  })

  function updateCachedWeather() {
    const storageKey = 'localhub_weather_cache_date'
    const todayStr = new Date().toISOString().split('T')[0]
    weatherLoading.value = true

    let cachedDate = null
    let cachedData = null
    try {
      cachedDate = localStorage.getItem(storageKey)
      cachedData = localStorage.getItem('localhub_weather_cache_payload')
    } catch (e) { /* ignore */ }

    if (cachedDate === todayStr && cachedData) {
      Object.assign(weatherData, JSON.parse(cachedData))
      weatherLoading.value = false
    } else {
      setTimeout(() => {
        const fresh = { condition: '화창하고 맑음', tempMin: 20, tempMax: 31, cached: false }
        try {
          localStorage.setItem(storageKey, todayStr)
          localStorage.setItem('localhub_weather_cache_payload', JSON.stringify(fresh))
        } catch (e) { /* ignore */ }
        Object.assign(weatherData, fresh)
        weatherLoading.value = false
      }, 1200)
    }
  }

  return { weatherLoading, weatherData, weatherIcon, updateCachedWeather }
}
