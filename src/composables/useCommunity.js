import { reactive, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useTabs } from './useTabs'

const STORAGE_KEY = 'localhub_v3_posts'
const JOINED_KEY = 'localhub_v3_enrolled_posts'

export const filterRegions = ['전체', '원평동(금리단길)', '선산읍(금오서원)', '양호동(체육공원)', '남통동(금오산)', '문성리(문성지)', '임은동(카약체험)']

function loadPosts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored).map((p) => ({ ...p, isOpen: p.isOpen || false, newComment: '' }))
  } catch (e) { /* ignore */ }

  return [
    {
      id: 101, type: 'recruitment',
      title: '이번주 주말 금오산 둘레길 돌고 감자전 먹을 파티원 구해요!',
      content: '가벼운 힐링 트래킹 수준으로 갑니다. 완등하고 항아리 수제비에 감자전 먹으며 이야기 꽃 피워요! 편안하게 참가 댓글 주세요.',
      region: '남통동(금오산)', travelDate: '2026-07-18', createdDate: '2026-07-15', password: '1234',
      likes: 15, liked: false, currentCount: 2, maxCount: 4, isOpen: false,
      imageFile: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80&w=400',
      comments: [{ content: '수제비 킬러입니다. 조심스럽게 한자리 지원해봅니다!', date: '2026-07-15' }],
    },
    {
      id: 102, type: 'general',
      title: '금리단길 멜트하우스 수제 파스타 후기입니다 🍝',
      content: '뇨끼 반죽이 진짜 장난 아니게 쫀득하고 크림 소스 풍미가 너무 깊어요! 데이트 코스로 최적입니다. 다들 가보세요.',
      region: '원평동(금리단길)', travelDate: '', createdDate: '2026-07-14', password: '4321',
      likes: 9, liked: false, currentCount: 0, maxCount: 0, isOpen: false,
      imageFile: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=400',
      comments: [],
    },
    {
      id: 103, type: 'recruitment',
      title: '낙동강 카약 체험 같이 타실 초보분 2명 탑승 대기중',
      content: '햇살 맞으며 구미 낙동강 시원하게 패들링 하실 초보분 모집합니다. 구명조끼 기본 지급이니 걱정 말고 오세요!',
      region: '임은동(카약체험)', travelDate: '2026-07-25', createdDate: '2026-07-13', password: '0000',
      likes: 6, liked: false, currentCount: 1, maxCount: 3, isOpen: false, imageFile: '', comments: [],
    },
  ]
}

function savePostsToLocalStorage() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.posts)) } catch (e) { /* ignore */ }
}

function saveJoined() {
  try { localStorage.setItem(JOINED_KEY, JSON.stringify(state.userJoinedList)) } catch (e) { /* ignore */ }
}

const state = reactive({
  posts: loadPosts(),
  selectedRegionFilter: '전체',
  communityTypeFilter: 'all',

  postModalOpen: false,
  isEditMode: false,
  targetEditPostId: null,
  newPostForm: {
    type: 'general', title: '', content: '', region: filterRegions[1],
    travelDate: new Date().toISOString().split('T')[0], maxCount: 4, password: '', imageFile: '', imageName: '',
  },

  passwordPromptOpen: false,
  passwordConfirmInput: '',
  passwordConfirmAction: '',
  targetPasswordPost: null,
  passwordConfirmError: false,

  userJoinedList: (() => { try { return JSON.parse(localStorage.getItem(JOINED_KEY) || '[]') } catch { return [] } })(),

  alertState: { show: false, message: '', isSuccess: true },

  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(),
  todayDate: new Date(),
  selectedCalendarDate: null,
})

export function useCommunity() {
  const { changeTab } = useTabs()

    let midnightTimer = null

  function refreshTodayDate() {
    state.todayDate = new Date()
  }

  onMounted(() => {
    refreshTodayDate()

    const now = new Date()
    const nextMidnight = new Date(now)
    nextMidnight.setHours(24, 0, 0, 0)

    midnightTimer = setTimeout(() => {
      refreshTodayDate()
      midnightTimer = setTimeout(refreshTodayDate, 24 * 60 * 60 * 1000)
    }, nextMidnight - now)
  })

  onBeforeUnmount(() => {
    if (midnightTimer) clearTimeout(midnightTimer)
  })

  const sortedPosts = computed(() => {
    let list = state.posts
    if (state.selectedRegionFilter !== '전체') list = list.filter((p) => p.region.includes(state.selectedRegionFilter))
    if (state.communityTypeFilter !== 'all') list = list.filter((p) => p.type === state.communityTypeFilter)
    return list.slice().sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
  })

  const recruitmentPosts = computed(() => state.posts.filter((p) => p.type === 'recruitment'))

  function triggerFloatingAlert(message, isSuccess = true) {
    state.alertState = { show: true, message, isSuccess }
    setTimeout(() => { state.alertState.show = false }, 3000)
  }

  function jumpToCommunityPost(postId) {
    changeTab('community')
    state.posts.forEach((p) => { p.isOpen = p.id === postId })
    nextTick(() => {
      const el = document.getElementById(`post-${postId}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  function togglePostAccordion(postId) {
    state.posts.forEach((p) => { if (p.id === postId) p.isOpen = !p.isOpen })
  }

  function openPostModal() {
    state.isEditMode = false
    state.newPostForm = {
      type: 'general', title: '', content: '', region: filterRegions[1],
      travelDate: new Date().toISOString().split('T')[0], maxCount: 4, password: '', imageFile: '', imageName: '',
    }
    state.postModalOpen = true
  }

  function closePostModal() { state.postModalOpen = false }

  function jumpToCommunityAndWrite() {
    changeTab('community')
    openPostModal()
  }

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    state.newPostForm.imageName = file.name
    const reader = new FileReader()
    reader.onload = (event) => { state.newPostForm.imageFile = event.target.result }
    reader.readAsDataURL(file)
  }

  function clearUploadedImage() {
    state.newPostForm.imageFile = ''
    state.newPostForm.imageName = ''
  }

  function saveNewPost() {
    const form = state.newPostForm
    if (!form.title || !form.content || !form.password) return triggerFloatingAlert('필수 요소를 입력해 주세요.', false)
    if (form.password.length !== 4 || isNaN(form.password)) return triggerFloatingAlert('관리용 암호는 숫자 4자리여야 합니다.', false)

    if (state.isEditMode) {
      const idx = state.posts.findIndex((p) => p.id === state.targetEditPostId)
      if (idx !== -1) {
        state.posts[idx].title = form.title
        state.posts[idx].content = form.content
        state.posts[idx].region = form.region
        state.posts[idx].type = form.type
        state.posts[idx].imageFile = form.imageFile
        if (form.type === 'recruitment') {
          state.posts[idx].travelDate = form.travelDate
          state.posts[idx].maxCount = form.maxCount
        }
        triggerFloatingAlert('성공적으로 글이 수정되었습니다!')
      }
    } else {
      state.posts.push({
        id: Date.now(), type: form.type, title: form.title, content: form.content, region: form.region,
        travelDate: form.type === 'recruitment' ? form.travelDate : '',
        createdDate: new Date().toISOString().split('T')[0], password: form.password,
        likes: 0, liked: false, currentCount: 1, maxCount: form.type === 'recruitment' ? form.maxCount : 0,
        isOpen: true, comments: [], imageFile: form.imageFile,
      })
      triggerFloatingAlert('신규 소통 글이 작성 완료되었습니다!')
    }
    savePostsToLocalStorage()
    closePostModal()
  }

  function initiateEdit(post) {
    state.passwordConfirmAction = 'edit'; state.targetPasswordPost = post
    state.passwordConfirmInput = ''; state.passwordConfirmError = false; state.passwordPromptOpen = true
  }

  function initiateDelete(post) {
    state.passwordConfirmAction = 'delete'; state.targetPasswordPost = post
    state.passwordConfirmInput = ''; state.passwordConfirmError = false; state.passwordPromptOpen = true
  }

  function closePasswordPrompt() { state.passwordPromptOpen = false }

  function executeVerifiedAction() {
    const post = state.targetPasswordPost
    if (state.passwordConfirmInput === post.password) {
      state.passwordPromptOpen = false
      if (state.passwordConfirmAction === 'edit') {
        state.isEditMode = true
        state.targetEditPostId = post.id
        state.newPostForm = {
          type: post.type, title: post.title, content: post.content, region: post.region,
          travelDate: post.travelDate || new Date().toISOString().split('T')[0], maxCount: post.maxCount || 4,
          password: post.password, imageFile: post.imageFile || '', imageName: post.imageFile ? '기존 업로드 완료된 사진' : '',
        }
        state.postModalOpen = true
      } else if (state.passwordConfirmAction === 'delete') {
        state.posts = state.posts.filter((p) => p.id !== post.id)
        savePostsToLocalStorage()
        triggerFloatingAlert('게시글이 성공적으로 삭제되었습니다.')
      }
    } else {
      state.passwordConfirmError = true
    }
  }

  function hasAlreadyJoined(postId) { return state.userJoinedList.includes(postId) }

  function enrollInRecruitment(post) {
    if (hasAlreadyJoined(post.id)) return triggerFloatingAlert('이미 참여를 신청하신 게시물입니다.', false)
    if (post.currentCount >= post.maxCount) return triggerFloatingAlert('모집 정원이 마감되었습니다.', false)
    post.currentCount += 1
    state.userJoinedList.push(post.id)
    saveJoined()
    savePostsToLocalStorage()
    triggerFloatingAlert('성공적으로 메이트 그룹에 참여되었습니다! 🎉')
  }

  function togglePostLike(post) {
    post.liked = !post.liked
    post.likes += post.liked ? 1 : -1
    savePostsToLocalStorage()
  }

  function submitComment(post) {
    if (!post.newComment || !post.newComment.trim()) return
    if (!post.comments) post.comments = []
    post.comments.push({ content: post.newComment, date: new Date().toISOString().split('T')[0] })
    post.newComment = ''
    savePostsToLocalStorage()
    triggerFloatingAlert('소통 한마디 답변이 성공적으로 기록되었습니다!')
  }

  function getPostCategoryDetails(post) {
    const text = (post.title + post.content + post.region).toLowerCase()
    if (text.includes('금오산') || text.includes('산성') || text.includes('둘레길')) return { name: '자연/힐링', icon: 'fa-solid fa-tree text-accent', bg: 'bg-emerald-50', iconOnly: '🌲' }
    if (text.includes('서원') || text.includes('역사') || text.includes('사찰')) return { name: '역사/문화', icon: 'fa-solid fa-scroll text-amber-600', bg: 'bg-amber-50', iconOnly: '📜' }
    if (text.includes('카페') || text.includes('금리단')) return { name: '감성카페', icon: 'fa-solid fa-coffee text-amber-600', bg: 'bg-amber-50/50', iconOnly: '☕' }
    if (text.includes('체육') || text.includes('공원') || text.includes('라이딩')) return { name: '공원/레저', icon: 'fa-solid fa-baseball text-sky-600', bg: 'bg-sky-50', iconOnly: '⚾' }
    if (text.includes('뇨끼') || text.includes('맛집') || text.includes('수제비')) return { name: '로컬맛집', icon: 'fa-solid fa-utensils text-rose-600', bg: 'bg-rose-50', iconOnly: '🍜' }
    return { name: '체험/레저', icon: 'fa-solid fa-person-hiking text-teal-600', bg: 'bg-teal-50', iconOnly: '🎒' }
  }

  // ---- Calendar ----
  const calendarOffsetBlanks = computed(() => {
    const firstDay = new Date(state.currentYear, state.currentMonth, 1).getDay()
    return Array.from({ length: firstDay }, (_, i) => i)
  })

  const calendarActiveDays = computed(() => {
    const total = new Date(state.currentYear, state.currentMonth + 1, 0).getDate()
    const list = []
    const today = state.todayDate
    for (let i = 1; i <= total; i++) {
      const dateString = `${state.currentYear}-${String(state.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      const isToday = today.getFullYear() === state.currentYear && today.getMonth() === state.currentMonth && today.getDate() === i
      const dayOfWeek = new Date(state.currentYear, state.currentMonth, i).getDay()
      list.push({ day: i, dateString, isToday, dayOfWeek })
    }
    return list
  })

  function adjustCalendarMonth(val) {
    state.currentMonth += val
    if (state.currentMonth > 11) { state.currentMonth = 0; state.currentYear += 1 }
    else if (state.currentMonth < 0) { state.currentMonth = 11; state.currentYear -= 1 }
  }

  function onSelectCalendarDate(dateStr) { state.selectedCalendarDate = dateStr }

  function getPostsForSelectedDate(dateStr) { return state.posts.filter((p) => p.travelDate === dateStr && p.type === 'recruitment') }

  function getCalendarCellClass(day) {
    let cls = 'bg-white border-slate-100 hover:border-primary '
    if (getPostsForSelectedDate(day.dateString).length > 0) cls += 'bg-emerald-50/40 border-primary/60 font-bold '
    if (day.dateString === state.selectedCalendarDate) cls += 'ring-2 ring-primary border-primary '
    return cls
  }

  function formatSelectedKoreanDate(dateStr) {
    const p = dateStr.split('-')
    return `${p[1]}월 ${p[2]}일`
  }

  return {
    state, filterRegions,
    sortedPosts, recruitmentPosts, getPostCategoryDetails,
    triggerFloatingAlert, jumpToCommunityPost, togglePostAccordion,
    openPostModal, closePostModal, jumpToCommunityAndWrite,
    handleFileUpload, clearUploadedImage, saveNewPost,
    initiateEdit, initiateDelete, closePasswordPrompt, executeVerifiedAction,
    hasAlreadyJoined, enrollInRecruitment, togglePostLike, submitComment,
    calendarOffsetBlanks, calendarActiveDays, adjustCalendarMonth,
    onSelectCalendarDate, getPostsForSelectedDate, getCalendarCellClass, formatSelectedKoreanDate,
  }
}
