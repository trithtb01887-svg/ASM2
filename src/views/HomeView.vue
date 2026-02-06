<script setup>
import { ref, computed, onMounted } from 'vue'
import PostService from '@/services/PostService'
import HeroSlide from '@/components/HeroSlide.vue'

// GLOBAL STATE
const posts = ref([])
const loading = ref(true)
const selectedCategory = ref('Tất cả')
const searchQuery = ref('')
const categories = ['Tất cả', 'Đời Sống', 'Chuyện Lạ', 'Showbiz', 'Tâm Linh', 'Ẩm Thực', 'Công Nghệ', 'Thể Thao']

// FETCH API
const getAllPosts = async () => {
    try {
        loading.value = true
        // Gọi Service lấy bài published
        const data = await PostService.getPublishedPosts()
        
        // CLIENT-SIDE SORT: Mới nhất lên đầu
        posts.value = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } catch (err) {
        console.error('Error in getAllPosts:', err)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    getAllPosts()
})

// FILTER LOGIC
const filteredPosts = computed(() => {
    return posts.value.filter(post => {
        const matchSearch = post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchCat = selectedCategory.value === 'Tất cả' || (post.category && post.category.includes(selectedCategory.value))
        return matchSearch && matchCat
    })
})
</script>

<template>
  <div class="page-container py-4">
    <!-- 1. HERO SLIDE (Full Width) -->
    <div class="container mb-5">
         <HeroSlide />
    </div>

    <!-- 2. MAIN CONTENT -->
    <div class="container">
        
        <!-- Filter & Search Bar -->
        <div class="filter-bar p-4 mb-5 rounded-4 d-flex flex-wrap justify-content-between align-items-center gap-3 shadow-sm bg-white border border-light">
            <div class="d-flex flex-wrap gap-2">
                <button 
                    v-for="cat in categories" 
                    :key="cat"
                    class="btn rounded-pill fw-bold px-4 py-2 transition-all"
                    :class="selectedCategory === cat ? 'btn-dark shadow' : 'btn-outline-light text-dark border-0 hover-bg-light'"
                    @click="selectedCategory = cat"
                >
                    {{ cat }}
                </button>
            </div>
            <div class="search-box position-relative" style="min-width: 300px;">
                 <i class="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                 <input 
                    type="text" 
                    class="form-control rounded-pill bg-light border-0 py-2 ps-5" 
                    placeholder="Tìm kiếm bài viết..." 
                    v-model="searchQuery"
                 >
            </div>
        </div>

        <!-- Section Title -->
        <div class="d-flex align-items-center mb-4 ps-2">
            <div class="bg-danger rounded-pill" style="width: 6px; height: 32px;"></div>
            <h2 class="ms-3 fw-bold text-uppercase mb-0 text-dark font-heading">
                {{ selectedCategory === 'Tất cả' ? 'Tin Mới Nhất' : selectedCategory }}
            </h2>
        </div>

        <!-- LOADING STATE -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-danger" role="status"></div>
            <p class="mt-3 text-muted">Đang tải nội dung...</p>
        </div>

        <!-- POSTS GRID -->
        <div v-else-if="filteredPosts.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div class="col" v-for="post in filteredPosts" :key="post.id">
                
                <!-- MODERN CARD -->
                <router-link :to="'/posts/' + post.id" class="text-decoration-none text-dark">
                    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden modern-card bg-white position-relative">
                        
                        <!-- Thumbnail -->
                        <div class="card-img-wrapper position-relative">
                            <img 
                                :src="post.thumbnail || post.thumbnail_url || 'https://placehold.co/600x400'" 
                                class="card-img-top object-fit-cover transition-transform" 
                                alt="thumbnail" 
                                style="height: 240px; width: 100%;"
                            >
                            
                            <!-- Category Badge -->
                            <span class="badge bg-white text-dark position-absolute top-0 start-0 m-3 shadow-sm rounded-pill px-3 py-2 fw-bold text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                                {{ post.category }}
                            </span>
                        </div>

                        <!-- Content -->
                        <div class="card-body p-4 d-flex flex-column">
                            <h5 class="card-title fw-bold mb-3 lh-sm text-truncate-2 font-heading" style="min-height: 2.8rem;">
                                {{ post.title }}
                            </h5>
                            
                            <div class="mt-auto pt-3 border-top border-light d-flex justify-content-between align-items-center text-secondary small">
                                 <span class="d-flex align-items-center">
                                    <i class="bi bi-calendar3 me-2"></i> {{ post.created_at || 'Vừa xong' }}
                                 </span>
                                 <span class="d-flex align-items-center">
                                    <i class="bi bi-eye me-2"></i> {{ post.views }}
                                 </span>
                            </div>
                        </div>

                    </div>
                </router-link>

            </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-else class="text-center py-5">
            <div class="py-5 bg-light rounded-4 border-dash">
                <i class="bi bi-journal-x fs-1 text-muted mb-3 d-block"></i>
                <h4 class="text-muted fw-bold">Không tìm thấy bài viết nào</h4>
                <p class="text-secondary">Thử tìm kiếm với từ khóa khác xem sao!</p>
            </div>
        </div>

    </div>
  </div>
</template>

<style scoped>
.page-container {
    background-color: #f8f9fa; /* Light Gray Background for contrast */
    min-height: 100vh;
}

.font-heading {
    font-family: 'Playfair Display', serif;
}

/* CARD HOVER EFFECTS */
.modern-card {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.modern-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.12) !important; /* Soft deep shadow */
}

.card-img-wrapper {
    overflow: hidden;
}

.card-img-top {
    transition: transform 0.5s ease;
}

.modern-card:hover .card-img-top {
    transform: scale(1.05); /* Zoom image slightly */
}

/* Hover bg light for filters */
.hover-bg-light:hover {
    background-color: #e9ecef !important;
}

/* Text Truncate 2 dòng */
.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.border-dash {
    border: 2px dashed #dee2e6;
}

.filter-bar {
    backdrop-filter: blur(10px);
}
</style>
