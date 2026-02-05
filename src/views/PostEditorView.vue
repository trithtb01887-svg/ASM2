<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authState } from '@/auth'
import PostService from '@/services/PostService'

const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => !!route.params.id)
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const successMessage = ref('')

const form = ref({
  title: '',
  category: '',
  thumbnail_url: '',
  content: '',
  author_id: authState.user?.id
})

// Validation state
const wasValidated = ref(false)

const categories = ['Tin Sốc', 'Đời sống', 'Pháp luật', 'Du lịch', 'Giải trí', 'Công nghệ', 'Ẩm thực', 'Khoa học', 'Tài chính', 'Chuyện lạ', 'Sức khỏe']

onMounted(async () => {
  if (isEditMode.value) {
    loading.value = true
    try {
      const post = await PostService.getPostById(route.params.id)
      
      // Authorization Check
      if (post.author_id !== authState.user.id && authState.user.role !== 'admin') {
        alert('Bạn không có quyền sửa bài viết này!')
        router.push('/dashboard')
        return
      }
      
      form.value = {
        title: post.title,
        category: post.category,
        thumbnail_url: post.thumbnail_url || post.thumbnail, // Handle both name conventions if needed
        content: post.content,
        author_id: post.author_id
      }
    } catch (err) {
      error.value = 'Không thể tải bài viết.'
    } finally {
      loading.value = false
    }
  }
})

async function submitPost() {
  wasValidated.value = true
  
  // Basic validation check
  if (!form.value.title || !form.value.category || !form.value.content) {
    return
  }
  
  submitting.value = true
  error.value = ''
  successMessage.value = ''

  try {
    if (isEditMode.value) {
      await PostService.updatePost(route.params.id, form.value)
      alert('Cập nhật bài viết thành công!')
    } else {
      await PostService.createPost(form.value)
      alert('Đăng bài viết mới thành công!')
    }
    router.push('/dashboard')
  } catch (err) {
    console.error(err)
    error.value = 'Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-lg-8">
      <div class="card shadow-lg border-0 rounded-3">
        <div class="card-header bg-danger text-white p-3">
          <h3 class="mb-0 fw-bold">{{ isEditMode ? 'Sửa Bài Viết' : 'Đăng Bài Mới' }}</h3>
        </div>
        <div class="card-body p-4">
          
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-danger" role="status"></div>
          </div>
          
          <form v-else @submit.prevent="submitPost" class="needs-validation" :class="{ 'was-validated': wasValidated }" novalidate>
            <!-- Title -->
            <div class="mb-3">
              <label class="form-label fw-bold">Tiêu đề giật gân <span class="text-danger">*</span></label>
              <input type="text" class="form-control form-control-lg" v-model="form.title" required placeholder="Ví dụ: SỐC: Mèo biết nói...">
              <div class="invalid-feedback">
                Vui lòng nhập tiêu đề bài viết.
              </div>
            </div>
            
            <!-- Category -->
            <div class="mb-3">
              <label class="form-label fw-bold">Chuyên mục <span class="text-danger">*</span></label>
              <select class="form-select" v-model="form.category" required>
                <option value="" disabled>Chọn chuyên mục</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <div class="invalid-feedback">
                Vui lòng chọn chuyên mục.
              </div>
            </div>
            
            <!-- Thumbnail -->
            <div class="mb-3">
              <label class="form-label fw-bold">Link Ảnh Thumbnail</label>
              <input type="url" class="form-control" v-model="form.thumbnail_url" placeholder="https://placehold.co/600x400">
              <div v-if="form.thumbnail_url" class="mt-3 text-center">
                <img :src="form.thumbnail_url" alt="Preview" class="img-thumbnail shadow" style="max-height: 200px;">
              </div>
            </div>
            
            <!-- Content -->
            <div class="mb-4">
              <label class="form-label fw-bold">Nội dung (HTML) <span class="text-danger">*</span></label>
              <textarea class="form-control" v-model="form.content" rows="10" required placeholder="Nhập nội dung bài viết..." style="min-height: 200px;"></textarea>
              <div class="invalid-feedback">
                Nội dung không được để trống.
              </div>
              <div class="form-text text-muted">Có thể sử dụng thẻ &lt;p&gt;, &lt;b&gt;, &lt;img&gt;...</div>
            </div>
            
            <!-- Actions -->
            <div class="d-flex justify-content-between align-items-center">
              <router-link to="/dashboard" class="btn btn-outline-secondary px-4">Hủy bỏ</router-link>
              <button type="submit" class="btn btn-danger btn-lg px-5 fw-bold shadow-sm" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ submitting ? 'Đang lưu...' : (isEditMode ? 'Cập Nhật' : 'Đăng Ngay') }}
              </button>
            </div>
            
            <div v-if="error" class="alert alert-danger mt-3">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>{{ error }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
