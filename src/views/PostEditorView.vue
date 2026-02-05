<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostService from '@/services/PostService'

const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => !!route.params.id)
const loading = ref(false)
const submitting = ref(false)
const form = ref({
  title: '',
  category: '',
  thumbnail_url: '',
  content: '',
  author_id: null
})
const currentUser = ref(null)

const categories = ['Tin Sốc', 'Đời sống', 'Pháp luật', 'Du lịch', 'Giải trí', 'Công nghệ']

onMounted(async () => {
    // 1. Get User
    const userStr = localStorage.getItem('user_info') || localStorage.getItem('user')
    if (!userStr) {
        alert("Vui lòng đăng nhập!")
        return router.push('/login')
    }
    currentUser.value = JSON.parse(userStr)

    // 2. Load Data if Edit
    if (isEditMode.value) {
        loading.value = true
        try {
            const post = await PostService.getPostById(route.params.id)
            form.value = {
                title: post.title,
                category: post.category,
                thumbnail_url: post.thumbnail || post.thumbnail_url,
                content: post.content,
                author_id: post.author_id
            }
        } catch (e) { alert("Lỗi tải bài") }
        finally { loading.value = false }
    } else {
        form.value.author_id = currentUser.value.id
    }
})

async function submitPost() {
    if (!form.value.title || !form.value.content) return alert("Thiếu tiêu đề hoặc nội dung!")

    submitting.value = true
    try {
        // --- LOGIC PHÂN QUYỀN TRẠNG THÁI (STRICT) ---
        // Admin -> published
        // User -> pending
        const postStatus = (currentUser.value.role === 'admin') ? 'published' : 'pending';

        const payload = {
            ...form.value,
            thumbnail: form.value.thumbnail_url,
            status: postStatus // <-- Set Status here
        }

        if (isEditMode.value) {
            await PostService.updatePost(route.params.id, payload)
            alert("Cập nhật thành công!")
        } else {
            // Create New
            payload.views = 0;
            payload.created_at = new Date().toISOString().split('T')[0];
            
            await PostService.createPost(payload)
            
            // --- THÔNG BÁO THEO ROLE ---
            if (currentUser.value.role === 'admin') {
                alert("Đã đăng bài thành công! (Trạng thái: Đã đăng)")
            } else {
                alert("Bài viết đã được gửi duyệt!")
            }
        }
        // --- REDIRECT LOGIC FIX ---
    if (currentUser.value.role === 'admin') {
        router.push('/admin')
    } else {
        router.push('/dashboard')
    }
    } catch (err) {
        alert("Có lỗi xảy ra!")
    } finally {
        submitting.value = false
    }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
       <div class="card shadow border-0 mt-4">
           <div class="card-header bg-primary text-white">
               <h4 class="mb-0 fw-bold">{{ isEditMode ? 'SỬA BÀI VIẾT' : 'ĐĂNG BÀI MỚI' }}</h4>
           </div>
           <div class="card-body p-4">
               <form @submit.prevent="submitPost">
                   <div class="mb-3">
                       <label class="fw-bold">Tiêu đề:</label>
                       <input v-model="form.title" class="form-control" required placeholder="Nhập tiêu đề bài viết...">
                   </div>
                   
                   <div class="row mb-3">
                       <div class="col-md-6">
                           <label class="fw-bold">Chuyên mục:</label>
                           <select v-model="form.category" class="form-select" required>
                               <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
                           </select>
                       </div>
                       <div class="col-md-6">
                           <label class="fw-bold">Ảnh Thumbnail (URL):</label>
                           <input v-model="form.thumbnail_url" class="form-control" placeholder="http://...">
                       </div>
                   </div>

                   <div class="mb-3">
                       <label class="fw-bold">Nội dung:</label>
                       <textarea v-model="form.content" class="form-control" rows="8" required></textarea>
                   </div>
                   
                   <div class="text-end">
                       <router-link to="/dashboard" class="btn btn-secondary me-2">Hủy</router-link>
                       <button type="submit" class="btn btn-primary fw-bold px-4" :disabled="submitting">
                           {{ submitting ? 'ĐANG GỬI...' : (isEditMode ? 'LƯU LẠI' : 'ĐĂNG BÀI') }}
                       </button>
                   </div>
               </form>
           </div>
       </div>
    </div>
  </div>
</template>
