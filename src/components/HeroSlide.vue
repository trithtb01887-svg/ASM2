<script setup>
const slides = [
  {
    id: 1,
    image: 'https://picsum.photos/1200/500?random=10',
    title: 'Sốc: Người ngoài hành tinh mua đất tại Thủ Thiêm?',
    description: 'Người dân xôn xao vì ánh sáng lạ xuất hiện trên bầu trời...'
  },
  {
    id: 2,
    image: 'https://picsum.photos/1200/500?random=20',
    title: 'Bí kíp trúng số độc đắc nhờ ngủ mơ thấy... con vịt',
    description: 'Chuyên gia giải mã giấc mơ tiết lộ con số may mắn hôm nay.'
  },
  {
    id: 3,
    image: 'https://picsum.photos/1200/500?random=30',
    title: 'Chấn động: Mèo cưng biết nói tiếng người đòi ăn Pate',
    description: 'Clip livestream triệu view ghi lại cảnh chú mèo "mắng" chủ...'
  }
]
</script>

<template>
  <div id="heroCarousel" class="carousel slide shadow-lg mb-4 rounded-4 overflow-hidden" data-bs-ride="carousel">
    <!-- Indicators -->
    <div class="carousel-indicators">
      <button 
        v-for="(slide, index) in slides" 
        :key="index"
        type="button" 
        data-bs-target="#heroCarousel" 
        :data-bs-slide-to="index" 
        :class="{ active: index === 0 }" 
        :aria-current="index === 0 ? 'true' : undefined"
        :aria-label="'Slide ' + (index + 1)"
      ></button>
    </div>

    <!-- Slides -->
    <div class="carousel-inner">
      <div 
        v-for="(slide, index) in slides" 
        :key="slide.id" 
        class="carousel-item" 
        :class="{ active: index === 0 }"
        data-bs-interval="3000"
      >
        <!-- Clickable Area -->
        <router-link :to="{ name: 'post-detail', params: { id: slide.id } }" class="text-decoration-none slide-link">
          <div class="slide-container">
            <img :src="slide.image" class="d-block w-100 object-fit-cover fixed-height" :alt="slide.title">
            
            <!-- Overlay -->
            <div class="carousel-overlay"></div>
            
            <!-- Caption -->
            <div class="carousel-caption d-none d-md-block text-start pb-5">
              <span class="badge bg-danger mb-2 text-uppercase fw-bold shadow-sm">Tin Nóng Nhất</span>
              <h2 class="display-4 fw-bold text-white text-shadow slide-title">{{ slide.title }}</h2>
              <p class="lead text-white-50 text-shadow">{{ slide.description }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Controls -->
    <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon p-3 bg-dark bg-opacity-50 rounded-circle" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon p-3 bg-dark bg-opacity-50 rounded-circle" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<style scoped>
.fixed-height {
  height: 500px;
}

/* Gradient Overlay */
.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70%;
  background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0));
  pointer-events: none;
}

.text-shadow {
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.9);
}

.slide-title {
  font-family: 'Playfair Display', serif;
  transition: color 0.3s;
}

/* Cursor & Hover */
.slide-link {
  cursor: pointer;
}

.slide-link:hover .slide-title {
  color: #ffcccc; /* Light red/pink tint on hover */
}
</style>
