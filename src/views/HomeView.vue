<script setup>
import { ref, computed, onMounted } from 'vue'
import PostService from '@/services/PostService'
import HeroSlide from '@/components/HeroSlide.vue'

// GLOBAL STATE
const posts = ref([])
const loading = ref(true)
const getError = ref(null) // Added for debug
const selectedCategory = ref('Tất cả')
const searchQuery = ref('')
const categories = ['Tất cả', 'Đời Sống', 'Chuyện Lạ', 'Showbiz', 'Tâm Linh', 'Ẩm Thực', 'Công Nghệ', 'Thể Thao']

// FETCH API
const getAllPosts = async () => {
    try {
        console.log('Starting getAllPosts...');
        loading.value = true
        // Gọi Service lấy bài published
        console.log('Calling PostService.getPublishedPosts()...');
        const data = await PostService.getPublishedPosts()
        console.log('Data received from service:', data);
        
        if (!data || data.length === 0) {
            console.warn('No data received or empty array');
        }

        // CLIENT-SIDE SORT: Mới nhất lên đầu (already sorted by API but kept for safety)
        posts.value = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        console.log('Posts updated:', posts.value);

    } catch (err) {
        console.error('Error in getAllPosts:', err)
        getError.value = err.message || JSON.stringify(err)
    } finally {
        loading.value = false
        console.log('Loading set to false');
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
  <!-- 1. HERO SLIDE FULL WIDTH -->
  <div class="container py-4">
    <HeroSlide />

    <!-- 2. FILTER & SEARCH BAR (Glassmorphism) -->
    <div class="filter-bar p-3 mb-5 rounded-4 d-flex flex-wrap justify-content-between align-items-center gap-3 shadow-sm bg-white">
        <div class="d-flex flex-wrap gap-2">
            <button 
                v-for="cat in categories" 
                :key="cat"
                class="btn rounded-pill fw-bold px-3 transition-colors"
                :class="selectedCategory === cat ? 'btn-dark' : 'btn-light text-secondary'"
                @click="selectedCategory = cat"
            >
                {{ cat }}
            </button>
        </div>
        <div class="search-box">
             <input type="text" class="form-control rounded-pill bg-light border-0 px-4" placeholder="Tìm kiếm nhanh..." v-model="searchQuery">
        </div>
    </div>

    <!-- 3. TITLE HEADING -->
    <div class="d-flex align-items-center mb-4">
        <div class="bg-danger rounded-pill" style="width: 5px; height: 30px;"></div>
        <h2 class="ms-3 fw-bold text-uppercase mb-0 text-dark heading-font">
            {{ selectedCategory === 'Tất cả' ? 'Tin Mới Cập Nhật' : selectedCategory }}
        </h2>
    </div>

    <!-- 4. MAIN GRID -->
    <div v-if="loading" class="text-center py-5">
        <div class="spinner-grow text-dark" role="status"></div>
    </div>

    <div v-else-if="filteredPosts.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div class="col" v-for="post in filteredPosts" :key="post.id">
            
            <!-- MODERN POST CARD -->
            <router-link :to="'/posts/' + post.id" class="text-decoration-none text-dark">
                <div class="card h-100 border-0 shadow-sm modern-card overflow-hidden rounded-4 cursor-pointer bg-white">
                    
                    <!-- Card Image Wrapper -->
                    <div class="card-img-wrapper position-relative">
                        <img :src="post.thumbnail" class="card-img-top object-fit-cover" alt="thumbnail" style="height: 220px;">
                        
                        <!-- Floating Category Badge -->
                        <span class="badge bg-white text-dark position-absolute top-0 start-0 m-3 shadow-sm rounded-pill px-3 py-2 fw-bold text-uppercase" style="font-size: 0.75rem;">
                            {{ post.category }}
                        </span>

                        <!-- Date Overlay on Hover -->
                        <div class="date-overlay position-absolute bottom-0 start-0 p-2 w-100 text-white small bg-dark bg-opacity-75 text-center opacity-0 transition-opacity">
                             {{ post.created_at || 'Mới cập nhật' }}
                        </div>
                    </div>

                    <!-- Card Body -->
                    <div class="card-body p-4">
                        <h5 class="card-title fw-bold mb-3 lh-base text-truncate-2">
                            {{ post.title }}
                        </h5>
                        <div class="d-flex justify-content-between align-items-center text-muted small">
                             <span><i class="bi bi-person-circle me-1"></i> Admin</span>
                             <span><i class="bi bi-eye me-1"></i> {{ post.views }}</span>
                        </div>
                    </div>

                </div>
            </router-link>

        </div>
    </div>

    <div v-else class="text-center py-5 text-muted">
        <h4>Chưa có bài viết nào ở mục này.</h4>
        
        <!-- DEBUG SECTION: REMOVE BEFORE PRODUCTION -->
        <div class="mt-5 p-3 bg-warning bg-opacity-10 border border-warning rounded text-start">
            <h5 class="text-danger fw-bold">🛠 DEBUG INFO</h5>
            <p><strong>Loading:</strong> {{ loading }}</p>
            <p><strong>Total Posts Fetched:</strong> {{ posts.length }}</p>
            <p><strong>Filtered Posts:</strong> {{ filteredPosts.length }}</p>
            <p><strong>Selected Category:</strong> {{ selectedCategory }}</p>
            <p><strong>Search Query:</strong> "{{ searchQuery }}"</p>
            <div v-if="getError" class="text-danger"><strong>Error:</strong> {{ getError }}</div>
            <details class="mt-2">
                <summary>Raw Data (First Post)</summary>
                <pre class="small mt-2 bg-light p-2 rounded">{{ posts.length > 0 ? JSON.stringify(posts[0], null, 2) : 'No data' }}</pre>
            </details>
        </div>
    </div>

  </div>
</template>

<style scoped>
.heading-font {
    font-family: 'Playfair Display', serif; /* Font sang trọng */
}

/* CARD HOVER EFFECTS */
.modern-card {
    transition: all 0.3s ease;
}

.modern-card:hover {
    transform: translateY(-5px); /* Nổi lên */
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.15) !important; /* Bóng đậm */
}

.modern-card:hover .date-overlay {
    opacity: 1 !important;
}

/* Text Truncate 2 dòng */
.text-truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.transition-colors {
    transition: all 0.2s;
}

/* Input search focus */
.form-control:focus {
    box-shadow: none;
    background-color: #fff;
    border: 1px solid #ddd !important;
}
</style>
