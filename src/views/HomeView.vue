<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import PostCard from '@/components/PostCard.vue'
import HeroSlide from '@/components/HeroSlide.vue'

// -- GLOBAL STATE --
const posts = ref([])
const loading = ref(true)
const error = ref(null)

// -- FILTER STATE --
const searchQuery = ref('')
const selectedCategory = ref('Tất cả')

// -- CATEGORIES --
const categories = [
    'Tất cả', 
    'Đời Sống', 
    'Chuyện Lạ', 
    'Showbiz', 
    'Tâm Linh', 
    'Ẩm Thực', 
    'Công Nghệ', 
    'Tình Yêu', 
    'Thể Thao'
]

// -- FETCH DATA --
const getAllPosts = async () => {
    try {
        loading.value = true
        console.log("Bắt đầu gọi API lấy TẤT CẢ bài viết...");
        
        // QUAN TRỌNG: Không thêm params gì cả (Sạch 100%)
        const response = await axios.get('http://localhost:3000/posts');
        
        console.log("Dữ liệu Home lấy được (Raw):", response);
        
        const data = response.data;

        // Xử lý dữ liệu (Array hoặc Object)
        if (Array.isArray(data)) {
            posts.value = data;
        } else if (data && Array.isArray(data.data)) {
            posts.value = data.data;
        } else {
            console.error("Data is not an array:", data);
            posts.value = [];
        }
        
        console.log("Dữ liệu đã về:", posts.value);

    } catch (err) {
        console.error("Lỗi API:", err);
        error.value = "Lỗi: Không thể lấy bài viết! Xem console để biết chi tiết.";
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    getAllPosts()
})

// -- FILTER LOGIC --
const filteredPosts = computed(() => {
    return posts.value.filter(post => {
        // 1. Lọc theo từ khóa tìm kiếm
        const query = searchQuery.value ? searchQuery.value.toLowerCase() : '';
        const title = post.title ? post.title.toLowerCase() : '';
        const matchSearch = title.includes(query);
        
        // 2. Lọc theo danh mục
        let matchCategory = true;
        
        if (selectedCategory.value && selectedCategory.value !== 'Tất cả') {
           if (post.category) {
               matchCategory = post.category.toLowerCase().includes(selectedCategory.value.toLowerCase());
           } else {
               matchCategory = false; 
           }
        }

        return matchSearch && matchCategory;
    });
})
</script>

<template>
  <div class="home-container">
    
    <!-- HERO SLIDE -->
    <HeroSlide />

    <!-- FILTER BAR -->
    <div class="card border-0 shadow-sm mb-5 rounded-4 overflow-hidden">
        <div class="card-body p-4 bg-white">
            <div class="row g-3">
                <!-- Category Pills -->
                <div class="col-lg-8">
                    <div class="d-flex flex-wrap gap-2">
                        <button 
                            v-for="cat in categories" 
                            :key="cat"
                            class="btn rounded-pill fw-bold transition-all px-3 py-2"
                            :class="selectedCategory === cat ? 'btn-danger shadow' : 'btn-light text-secondary bg-light-subtle'"
                            @click="selectedCategory = cat"
                        >
                            {{ cat }}
                        </button>
                    </div>
                </div>

                <!-- Search -->
                <div class="col-lg-4">
                    <div class="input-group">
                        <span class="input-group-text bg-light border-0"><i class="bi bi-search text-muted"></i></span>
                        <input 
                            type="text" 
                            class="form-control bg-light border-0 py-2" 
                            placeholder="Tìm kiếm tin tức..." 
                            v-model="searchQuery"
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- STATUS MESSAGES -->
    <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-danger" role="status"></div>
        <p class="mt-2 text-muted">Đang tải tin nóng...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center">
        {{ error }}
    </div>

    <!-- POST LIST -->
    <div v-else>
        <h3 class="mb-4 fw-bold text-uppercase border-start border-5 border-danger ps-3 font-heading text-dark">
            {{ selectedCategory === 'Tất cả' ? 'Tin Nổi Bật' : selectedCategory }}
        </h3>

        <!-- Grid -->
        <div v-if="filteredPosts.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div class="col fade-in" v-for="post in filteredPosts" :key="post.id">
                <PostCard :post="post" />
            </div>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-5">
            <h4 class="text-muted">Không tìm thấy bài viết nào.</h4>
            <div class="mt-3">
                <button class="btn btn-outline-secondary" @click="selectedCategory = 'Tất cả'; searchQuery = ''">
                    Xem tất cả bài viết
                </button>
            </div>
        </div>
    </div>

  </div>
</template>

<style scoped>
.font-heading {
    font-family: 'Playfair Display', serif;
}
.transition-all {
    transition: all 0.2s ease;
}
/* Animation */
.fade-in {
    animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
