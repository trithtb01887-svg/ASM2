<script setup>
import { ref, onMounted, defineProps, watch } from 'vue'
import { useRoute } from 'vue-router'
import PostService from '@/services/PostService'
import CommentSection from '@/components/CommentSection.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const route = useRoute()
const post = ref(null)
const loading = ref(true)
const error = ref(null)

// Reaction Data (Client-side simulation)
const reactions = ref([
  { emoji: '👍', label: 'Like', count: 1205, active: false },
  { emoji: '😂', label: 'Haha', count: 856, active: false },
  { emoji: '😮', label: 'Sốc', count: 342, active: false },
  { emoji: '😢', label: 'Buồn', count: 45, active: false },
  { emoji: '😡', label: 'Phẫn nộ', count: 23, active: false },
])

const handleReaction = (index) => {
  console.log('Reaction clicked:', index);
  const reaction = reactions.value[index]
  if (reaction.active) {
    reaction.count--
    reaction.active = false
  } else {
    reaction.count++
    reaction.active = true
  }
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
    })
}

const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/800x450?text=No+Image';
}

const relatedPosts = ref([])

const fetchPostData = async (postId) => {
  try {
    loading.value = true
    window.scrollTo(0, 0) // Scroll to top immediately when fetching new data
    
    const fetchedPost = await PostService.getPostById(postId)
    
    if (!fetchedPost) {
      error.value = 'Bài viết không tồn tại.'
      return
    }
    
    post.value = fetchedPost
    
    // Fetch related posts
    try {
        relatedPosts.value = await PostService.getRelatedPosts(post.value.category, post.value.id, 3)
    } catch (e) {
        console.error('Failed to load related posts', e)
    }
    
    // Simulate view increment start
    try {
        await PostService.updatePost(postId, { ...post.value, views: (post.value.views || 0) + 1 })
    } catch (e) {
        // Quietly fail for view counting
    }
    
  } catch (err) {
    error.value = 'Có lỗi xảy ra khi tải bài viết.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Watch for route interval changes
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchPostData(newId)
    // Reset reactions for new post (optional, just randomize slightly for effect)
    reactions.value.forEach(r => {
      r.active = false
      r.count = Math.floor(Math.random() * 1000)
    })
  }
})

onMounted(() => {
  const postId = props.id || route.params.id
  fetchPostData(postId)
})
</script>

<template>
  <div class="page-background pb-5">
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5" style="min-height: 50vh; display: flex; flex-direction: column; justify-content: center;">
      <div class="spinner-grow text-danger mb-3 mx-auto" role="status"></div>
      <p class="text-muted fst-italic">Đang tải bản tin...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container py-5">
      <div class="alert alert-light border-danger border-start border-5 shadow-sm" role="alert">
        <h4 class="text-danger fw-bold"><i class="bi bi-newspaper me-2"></i>Tòa soạn thông báo</h4>
        <p class="fs-5">{{ error }}</p>
        <router-link to="/" class="btn btn-dark rounded-0 px-4 mt-2">
          ← Quay về trang chủ
        </router-link>
      </div>
    </div>

    <!-- Post Content -->
    <div v-else-if="post" class="container main-content-wrapper mt-4">
      
      <article class="bg-white p-4 p-md-5 shadow-sm border border-light rounded-1">
        
        <!-- Header Section -->
        <header class="mb-4 text-center text-md-start">
          <div class="mb-3">
             <span class="badge bg-danger rounded-0 text-uppercase px-3 py-2 fw-bold" style="letter-spacing: 1px;">
               {{ post.category }}
             </span>
          </div>
          
          <h1 class="post-title mb-3">{{ post.title }}</h1>
          
          <div class="d-flex flex-wrap align-items-center text-secondary meta-data border-top border-bottom py-3 mt-4">
            <div class="me-4 d-flex align-items-center mb-2 mb-md-0">
               <i class="bi bi-person-fill text-danger fs-5 me-2"></i>
               <span class="fw-bold text-dark text-uppercase">{{ post.user?.full_name || 'Phóng viên' }}</span>
            </div>
            
            <div class="me-4 d-flex align-items-center">
               <i class="bi bi-calendar3 me-2"></i>
               <span>{{ formatDate(post.created_at) }}</span>
            </div>
            
            <div class="ms-md-auto d-flex align-items-center">
               <i class="bi bi-eye me-2"></i>
               <span>{{ post.views }} lượt đọc</span>
            </div>
          </div>
        </header>

        <!-- Thumbnail -->
        <div class="mb-5 position-relative">
          <div class="ratio-custom shadow hover-shadow transition-all">
            <img 
              :src="post.thumbnail || 'https://placehold.co/800x450?text=Fallback+Image'" 
              class="post-thumbnail" 
              :alt="post.title"
              @error="handleImageError"
            >
          </div>
          <p class="text-center text-muted fst-italic mt-2 small bg-light py-1 d-inline-block px-3 rounded-pill position-absolute start-50 translate-middle-x" style="bottom: -15px; white-space: nowrap;">
            Ảnh minh họa: {{ post.title }}
          </p>
        </div>

        <!-- Article Body -->
        <div class="content-body">
           <div class="first-letter-big" v-html="post.content"></div>
        </div>

        <!-- Share & Tags -->
        <div class="mt-5 pt-4 border-top">
           <div class="d-flex align-items-center mb-3">
             <strong class="me-3 text-uppercase text-danger">Từ khóa:</strong>
             <div class="d-flex flex-wrap gap-2">
                <span class="badge bg-light text-dark border rounded-pill px-3 py-2">#TinNong</span>
                <span class="badge bg-light text-dark border rounded-pill px-3 py-2">#{{ post.category }}</span>
                <span class="badge bg-light text-dark border rounded-pill px-3 py-2">#BaoLaCai</span>
             </div>
           </div>
        </div>

        <!-- Reaction Bar (New Feature) -->
        <div class="reaction-section text-center my-5 py-4 bg-light rounded-3 border">
            <h5 class="fw-bold mb-4 text-secondary">Bạn cảm thấy thế nào về bài viết này?</h5>
            <div class="d-flex justify-content-center flex-wrap gap-3 gap-md-4">
                <button 
                  v-for="(reaction, index) in reactions" 
                  :key="index"
                  type="button"
                  class="reaction-item d-flex flex-column align-items-center bg-transparent border-0 p-2"
                  :class="{ 'active': reaction.active }"
                  @click="handleReaction(index)"
                >
                    <div class="emoji-icon shadow-sm">{{ reaction.emoji }}</div>
                    <span class="reaction-count mt-2 fw-bold text-muted">{{ reaction.count }}</span>
                    <span class="reaction-label small text-secondary">{{ reaction.label }}</span>
                </button>
            </div>
        </div>

      </article>

      <!-- Related Posts Section -->
      <section v-if="relatedPosts.length > 0" class="mt-5">
        <h3 class="fw-bold mb-4 border-start border-5 border-primary ps-3 font-heading text-uppercase">Bài Viết Liên Quan</h3>
        <div class="row row-cols-1 row-cols-md-3 g-4">
            <div class="col" v-for="rPost in relatedPosts" :key="rPost.id">
                <div class="card h-100 border-0 shadow-sm hover-up transition-all">
                    <div class="overflow-hidden rounded-top-3">
                         <img :src="rPost.thumbnail || 'https://placehold.co/600x400'" class="card-img-top object-fit-cover" alt="Thumbnail" style="height: 180px;">
                    </div>
                    <div class="card-body">
                        <h6 class="card-title fw-bold mb-0">
                            <router-link :to="{ name: 'post-detail', params: { id: rPost.id } }" class="text-decoration-none text-dark stretched-link hover-text-primary">
                                {{ rPost.title }}
                            </router-link>
                        </h6>
                        <small class="text-muted mt-2 d-block">{{ formatDate(rPost.created_at) }}</small>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <!-- Comments Section -->
      <section class="mt-5 mb-5">
        <div class="bg-light p-4 rounded-3 border-top border-5 border-danger shadow-sm">
           <h3 class="fw-bold mb-4 font-serif">Bình Luận Độc Giả</h3>
           <CommentSection :post-id="post.id" :initial-comments="post.comments" />
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
/* Font Imports */
@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');

.page-background {
  background-color: #f4f4f4;
  font-family: 'Merriweather', serif;
}

.main-content-wrapper {
  max-width: 960px;
}

/* Header Styles */
.post-title {
  font-family: 'Playfair Display', serif; /* Classic Newspaper Font */
  font-size: 2.8rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.2;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.05);
}

@media (max-width: 768px) {
  .post-title {
    font-size: 2rem;
  }
}

.meta-data {
  font-family: sans-serif;
  font-size: 0.9rem;
}

/* Thumbnail Styles */
.post-thumbnail {
  width: 100%;
  min-height: 400px;
  object-fit: cover;
  border-radius: 4px;
}

/* Content Body Styles */
.content-body {
  font-family: 'Merriweather', serif;
  font-size: 1.2rem; /* approx 19px */
  line-height: 1.8;
  color: #2c2c2c;
  text-align: justify;
}

/* Deep Selectors for v-html content */
:deep(.content-body p) {
  margin-bottom: 24px;
}

:deep(.content-body h3),
:deep(.content-body h2) {
  font-family: 'Playfair Display', serif;
  color: #b71c1c; /* Deep Red */
  font-weight: bold;
  font-size: 1.8rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ddd;
}

:deep(.content-body strong) {
  font-weight: 900;
  color: #111;
}

:deep(.content-body em) {
  background-color: #fff9c4; /* Highlight yellow */
  padding: 0 4px;
  font-style: italic;
  border-radius: 2px;
}

:deep(.content-body blockquote) {
  margin: 2rem 0;
  padding: 1.5rem 2rem;
  background-color: #fafafa;
  border-left: 5px solid #b71c1c;
  font-style: italic;
  font-size: 1.25rem;
  color: #555;
  position: relative;
}

:deep(.content-body blockquote::before) {
  content: '“';
  font-size: 4rem;
  color: #ffd7d7;
  position: absolute;
  top: -10px;
  left: 10px;
  z-index: 0;
}

:deep(.content-body img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin: 1.5rem auto;
  display: block;
}

:deep(.content-body a) {
  color: #b71c1c;
  text-decoration: underline;
  text-underline-offset: 3px;
}

:deep(.content-body a:hover) {
  color: #000;
  background-color: #ffd7d7;
}

.font-serif {
    font-family: 'Playfair Display', serif;
}

/* Reaction Bar Styles */
.reaction-section {
    position: relative;
    z-index: 50; /* Ensure on top of content */
}

.reaction-item {
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    z-index: 10;
    user-select: none;
    -webkit-user-select: none;
    outline: none !important; /* Remove focus outline */
}

.reaction-item:active {
    transform: scale(0.95); /* Click feedback */
}

.emoji-icon {
    font-size: 2.5rem;
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    border-radius: 50%;
    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 2px solid transparent;
}

.reaction-item:hover .emoji-icon {
    transform: scale(1.2);
    border-color: #ffe0e0;
}

.reaction-item.active .emoji-icon {
    transform: scale(1.2) translateY(-5px);
    background-color: #fff5f5;
    border-color: #dc3545; /* Red border for active */
    box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3) !important;
}

.reaction-item.active .reaction-count {
    color: #dc3545 !important;
}

@media (max-width: 576px) {
    .emoji-icon {
        font-size: 2rem;
        width: 50px;
        height: 50px;
    }
}
</style>
