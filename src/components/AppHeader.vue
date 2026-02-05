<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)

onMounted(() => {
  const userStr = localStorage.getItem('user_info') || localStorage.getItem('user')
  if (userStr) {
    try {
      currentUser.value = JSON.parse(userStr)
    } catch (e) {
      console.error("Lỗi parse user info", e)
      localStorage.removeItem('user_info')
    }
  }
})

function logout() {
  localStorage.removeItem('user_info')
  localStorage.removeItem('user')
  currentUser.value = null
  
  if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      alert("Đã đăng xuất!")
      router.push('/login').then(() => {
        window.location.reload()
      })
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm py-3">
    <div class="container">
      <!-- LOGO -->
      <router-link class="navbar-brand fw-bold text-uppercase brand-logo" to="/">
        <i class="bi bi-newspaper me-2"></i>BÁO LÁ CẢI
      </router-link>
      
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 fw-semibold">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Trang chủ</router-link>
          </li>
          
          <!-- Show Dashboard if Logged In -->
          <li class="nav-item" v-if="currentUser">
             <!-- LOGIC FIX FOR ADMIN REDIRECT -->
             <router-link class="nav-link" :to="currentUser.role === 'admin' ? '/admin' : '/dashboard'">{{ currentUser.role === 'admin' ? 'Quản trị (Admin)' : 'Dashboard' }}</router-link>
          </li>
        </ul>
        
        <div class="d-flex align-items-center">
             <!-- NEW POST BUTTON (ADMIN ONLY) -->
             <router-link 
                v-if="currentUser && currentUser.role === 'admin'" 
                to="/posts/new" 
                class="btn btn-success rounded-pill me-3 shadow-sm fw-bold"
             >
                <i class="bi bi-plus-lg me-1"></i> Đăng Bài Mới
             </router-link>

          <!-- TRẠNG THÁI CHƯA ĐĂNG NHẬP -->
          <template v-if="!currentUser">
             <router-link to="/login" class="btn btn-outline-primary rounded-pill me-2 px-4 fw-bold">Đăng nhập</router-link>
             <router-link to="/register" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Đăng ký</router-link>
          </template>

          <!-- TRẠNG THÁI ĐÃ ĐĂNG NHẬP -->
          <template v-else>
            <div class="dropdown">
              <button class="btn btn-light rounded-pill dropdown-toggle d-flex align-items-center border shadow-sm px-3" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                <img :src="currentUser.avatar || 'https://via.placeholder.com/30'" class="rounded-circle me-2 border" alt="Avatar" width="30" height="30">
                <span class="fw-bold text-dark">Xin chào, {{ currentUser.full_name }}</span>
              </button>
              
              <ul class="dropdown-menu dropdown-menu-end border-0 shadow mt-2" aria-labelledby="userMenu">
                <li><div class="dropdown-header text-muted small">Tài khoản</div></li>
                
                <!-- PROFILE LINK -->
                <li><router-link class="dropdown-item" to="/profile"><i class="bi bi-person-circle me-2"></i>Hồ sơ của tôi</router-link></li>
                
                <!-- ADMIN USER MANAGER -->
                <li v-if="currentUser.role === 'admin'">
                    <router-link class="dropdown-item" to="/admin/users"><i class="bi bi-people-fill me-2"></i>Quản lý người dùng</router-link>
                </li>
                
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button class="dropdown-item text-danger fw-bold" @click="logout">
                    <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.brand-logo {
    font-family: 'Playfair Display', serif;
    color: #D32F2F !important; /* Deep Red */
    font-size: 1.5rem;
    letter-spacing: 1px;
}
.nav-link {
  font-size: 1.05rem;
  transition: color 0.2s;
}
.nav-link:hover {
  color: #D32F2F !important;
}
</style>
