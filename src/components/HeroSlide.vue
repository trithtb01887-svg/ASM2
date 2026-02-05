<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const featuredPosts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    // Gọi API lấy 5 bài viết Xem Nhiều Nhất (Top Trending)
    const response = await axios.get('http://localhost:3000/posts?_limit=5&_sort=views&_order=desc')
    featuredPosts.value = response.data
  } catch (error) {
    console.error('Lỗi tải Hero Slide:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="text-center py-5">
     <div class="spinner-border text-secondary" role="status"></div>
  </div>

  <div 
    v-else-if="featuredPosts.length > 0" 
    id="heroCarousel" 
    class="carousel slide mb-5" 
    data-bs-ride="carousel"
  >
    <!-- Indicators -->
    <div class="carousel-indicators">
      <button 
        v-for="(post, index) in featuredPosts" 
        :key="index"
        type="button" 
        data-bs-target="#heroCarousel" 
        :data-bs-slide-to="index" 
        :class="{ active: index === 0 }"
        class="rounded-circle p-1 mx-1 border-0"
        style="width: 10px; height: 10px;"
      ></button>
    </div>

    <!-- Slides -->
    <div class="carousel-inner rounded-4 shadow-sm overflow-hidden">
      <div 
        v-for="(post, index) in featuredPosts" 
        :key="post.id" 
        class="carousel-item" 
        :class="{ active: index === 0 }"
        data-bs-interval="4000"
      >
        <router-link :to="'/posts/' + post.id" class="hero-item-link">
          <div class="hero-img-wrapper">
             <img :src="post.thumbnail" class="d-block w-100 hero-img" :alt="post.title">
             <div class="hero-overlay"></div>
          </div>
          
          <div class="carousel-caption d-none d-md-block text-start p-5 mb-3">
             <span class="badge bg-danger text-uppercase mb-3 px-3 py-2 fw-bold tracking-wide shadow-sm">
                Top Trending
             </span>
             <h2 class="display-4 fw-bold text-white mb-2 hero-title">
                {{ post.title }}
             </h2>
             <p class="text-white-50 fs-5">
                <i class="bi bi-eye-fill me-2"></i> {{ post.views }} lượt xem
             </p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Controls -->
    <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon bg-dark bg-opacity-25 rounded-circle p-4" aria-hidden="true"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon bg-dark bg-opacity-25 rounded-circle p-4" aria-hidden="true"></span>
    </button>
  </div>
</template>

<style scoped>
/* 1. Chiều cao cố định 60vh */
.hero-img-wrapper {
  height: 60vh;
  position: relative;
  overflow: hidden;
}

/* 2. Style ảnh & Hiệu ứng Zoom khi hover */
.hero-img {
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease; /* Mượt mà */
}

/* Kích hoạt zoom khi hover vào link bao quanh */
.hero-item-link:hover .hero-img {
  transform: scale(1.05);
}

/* 3. Overlay Gradient sang trọng */
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%);
}

/* 4. Typography & Shadow */
.hero-title {
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);
  line-height: 1.2;
}

.tracking-wide {
  letter-spacing: 1px;
}

/* Customize Indicators */
.carousel-indicators [data-bs-target] {
  background-color: rgba(255,255,255,0.8);
}
.carousel-indicators .active {
  background-color: #dc3545; /* Red accent */
}
</style>
