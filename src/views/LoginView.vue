<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { authState } from '@/auth' // Only used for type safety or app flow, logic mainly here

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    // 1. Gọi API tìm user
    const res = await axios.get(`http://localhost:3000/users?email=${email.value}&password=${password.value}`)
    
    // 2. Kiểm tra kết quả
    if (res.data.length > 0) {
      const user = res.data[0]
      
      // 3. Lưu vào localStorage
      // Lưu dưới dạng chuỗi JSON
      localStorage.setItem('user_info', JSON.stringify(user)) // Main key as requested
      // Also set authState if app uses it reactively without reload (optional but good practice)
      if (authState) authState.login(user)

      alert("Đăng nhập thành công!")
      
      // 4. Chuyển hướng & Reload
      router.push('/').then(() => {
         window.location.reload() // Force reload để Header cập nhật
      })
      
    } else {
      error.value = "Sai email hoặc mật khẩu!"
    }
  } catch (err) {
    console.error(err)
    error.value = 'Lỗi kết nối server'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-5 col-lg-4">
      <div class="card shadow border-0 rounded-4">
        <div class="card-body p-4">
          <h3 class="text-center mb-4 fw-bold text-primary">Đăng Nhập</h3>
          
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label fw-bold">Email</label>
              <input type="email" class="form-control" v-model="email" required autofocus placeholder="email@example.com">
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold">Mật khẩu</label>
              <input type="password" class="form-control" v-model="password" required placeholder="Nhập mật khẩu">
            </div>
            
            <div v-if="error" class="alert alert-danger py-2 small text-center">
              <i class="bi bi-exclamation-triangle-fill"></i> {{ error }}
            </div>
            
            <button type="submit" class="btn btn-primary w-100 fw-bold py-2 shadow-sm" :disabled="loading">
              {{ loading ? 'Đang kiểm tra...' : 'Đăng Nhập' }}
            </button>
            
            <div class="text-center mt-4">
              <small class="text-muted">Chưa có tài khoản? <router-link to="/register" class="text-decoration-none fw-bold">Đăng ký ngay</router-link></small>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
