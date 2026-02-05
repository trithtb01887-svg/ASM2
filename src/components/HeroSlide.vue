<script setup>
const slides = [
  {
    image: 'https://picsum.photos/1200/500?random=1',
    title: 'SỐC: Phát hiện kho báu nghìn tỷ dưới lòng đất Sài Gòn?',
    description: 'Chuyên gia khảo cổ bàng hoàng khi tìm thấy di tích lạ, nghi là kho báu của vua chúa ngày xưa...'
  },
  {
    image: 'https://picsum.photos/1200/500?random=2',
    title: 'CẢNH BÁO: Mùa mưa bão sắp tới, người dân cần làm ngay điều này!',
    description: 'Dự báo thời tiết mới nhất cho thấy siêu bão đang hình thành, chuyên gia khuyến cáo 5 việc cấp bách.'
  },
  {
    image: 'https://picsum.photos/1200/500?random=3',
    title: 'SHOWBIZ: Ca sĩ X lộ bằng chứng hẹn hò bí mật tại Paris',
    description: 'Fan hâm mộ "soi" ra chi tiết đắt giá trong bức ảnh mới nhất, danh tính "người ấy" gây chấn động.'
  },
  {
    image: 'https://picsum.photos/1200/500?random=4',
    title: 'CÔNG NGHỆ: AI sắp thay thế lập trình viên vào năm 2030?',
    description: 'Cuộc tranh luận nảy lửa về tương lai của ngành IT khi trí tuệ nhân tạo ngày càng thông minh vượt bậc.'
  }
]
</script>

<template>
  <div id="heroCarousel" class="carousel slide shadow-lg mb-5 rounded-4 overflow-hidden" data-bs-ride="carousel">
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
        :key="index" 
        class="carousel-item" 
        :class="{ active: index === 0 }"
        data-bs-interval="4000"
      >
        <div class="ratio ratio-21x9">
          <img :src="slide.image" class="d-block w-100 object-fit-cover" :alt="slide.title">
        </div>
        
        <!-- Overlay -->
        <div class="carousel-overlay"></div>
        
        <!-- Caption -->
        <div class="carousel-caption d-none d-md-block text-start pb-5">
          <span class="badge bg-danger mb-2 text-uppercase fw-bold shadow-sm">Tin Nổi Bật</span>
          <h2 class="display-5 fw-bold text-white text-shadow slide-title">{{ slide.title }}</h2>
          <p class="lead text-white-50 text-shadow description">{{ slide.description }}</p>
          <button class="btn btn-outline-light rounded-pill px-4 fw-bold mt-2 hover-zoom">Đọc Tiếp <i class="bi bi-arrow-right"></i></button>
        </div>
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
.ratio-21x9 {
  --bs-aspect-ratio: 42.85%; /* 9 / 21 * 100 */
}

/* Gradient Overlay */
.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%; /* Cover bottom 60% */
  background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0));
  pointer-events: none;
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.slide-title {
  font-family: 'Playfair Display', serif; /* Or whatever fancy font is used */
  letter-spacing: -0.5px;
  max-width: 80%;
}

.description {
  max-width: 70%;
}

/* Hover Effect for Button */
.hover-zoom {
  transition: transform 0.3s ease;
}
.hover-zoom:hover {
  transform: scale(1.05);
  background: white;
  color: black;
}
</style>
