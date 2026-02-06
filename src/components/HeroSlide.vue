<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const featuredPosts = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    // Gọi API lấy TẤT CẢ bài viết và xử lý client-side (để tránh lỗi json-server sorting)
    const response = await axios.get('http://localhost:3000/posts')
    
    let allPosts = []
    
    // Check data format (json-server v1 beta vs stable)
    if (Array.isArray(response.data)) {
        allPosts = response.data
    } else if (response.data && Array.isArray(response.data.data)) {
        allPosts = response.data.data
    }

    // Client-side Sort (Most Views) & Limit 5
    featuredPosts.value = allPosts
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

    console.log("HeroSlide loaded:", featuredPosts.value.length, "posts");

  } catch (error) {
    console.error('Lỗi tải Hero Slide:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="text-center py-5" style="height: 65vh; display: flex; align-items: center; justify-content: center;">
     <div class="spinner-border text-secondary" role="status"></div>
  </div>

  <div 
    v-else-if="featuredPosts.length > 0" 
    id="heroCarousel" 
    class="carousel slide mb-5" 
    data-bs-ride="carousel"
  >
    <!-- Indicators -->
    <div class="carousel-indicators mb-4">
      <button 
        v-for="(post, index) in featuredPosts" 
        :key="index"
        type="button" 
        data-bs-target="#heroCarousel" 
        :data-bs-slide-to="index" 
        :class="{ active: index === 0 }"
        class="rounded px-2 mx-1 border-0 transition-all"
        style="width: 30px; height: 4px;"
      ></button>
    </div>

    <!-- Slides -->
    <div class="carousel-inner rounded-4 shadow-lg overflow-hidden">
      <div 
        v-for="(post, index) in featuredPosts" 
        :key="post.id" 
        class="carousel-item" 
        :class="{ active: index === 0 }"
        data-bs-interval="5000"
      >
        <router-link :to="'/posts/' + post.id" class="hero-item-link text-decoration-none">
          <div class="hero-img-wrapper">
             <img :src="post.thumbnail || 'https://placehold.co/1200x800'" class="d-block w-100 hero-img" :alt="post.title">
             <div class="hero-overlay"></div>
          </div>
          
          <div class="carousel-caption d-none d-md-block text-start p-5 mb-4">
             <div class="animate-up">
                 <span class="badge bg-danger text-uppercase mb-3 px-3 py-2 fw-bold tracking-wide shadow-sm">
                    {{ post.category }}
                 </span>
                 <h2 class="display-4 fw-bold text-white mb-2 hero-title text-shadow">
                    {{ post.title }}
                 </h2>
                 <p class="text-white-50 fs-5 mt-3">
                    <i class="bi bi-eye-fill me-2"></i> {{ post.views }} lượt xem
                 </p>
             </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Controls -->
    <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon bg-white bg-opacity-10 rounded-circle p-4 backdrop-blur" aria-hidden="true"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon bg-white bg-opacity-10 rounded-circle p-4 backdrop-blur" aria-hidden="true"></span>
    </button>
  </div>
</template>

<style scoped>
/* 1. Chiều cao cố định 65vh */
.hero-img-wrapper {
  height: 65vh;
  position: relative;
  overflow: hidden;
}

/* 2. Style ảnh & Hiệu ứng Zoom khi hover */
.hero-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 3s ease-out; /* Slow zoom cinematic effect */
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
  /* Gradient từ đen dưới lên trong suốt trên */
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, transparent 100%);
}

/* 4. Typography & Shadow */
.hero-title {
  text-shadow: 0 4px 10px rgba(0,0,0,0.8);
  line-height: 1.1;
  font-family: 'Playfair Display', serif; /* Font sang trọng */
}

.text-shadow {
    text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
}

.tracking-wide {
  letter-spacing: 1.5px;
}

.backdrop-blur {
    backdrop-filter: blur(4px);
}

/* Animation Text */
.animate-up {
    animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Customize Indicators */
.carousel-indicators .active {
  background-color: #dc3545; /* Red accent */
  width: 40px; /* Active indicator wider */
}
</style>
