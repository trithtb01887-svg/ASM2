<script setup>
import { authState } from '@/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

function logout() {
  authState.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
    <div class="container">
      <!-- LOGO -->
      <router-link class="navbar-brand fw-bold text-uppercase brand-logo" to="/">BÁO LÁ CẢI</router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Trang chủ</router-link>
          </li>
          <!-- Show for logged in users -->
          <li class="nav-item" v-if="authState.user">
             <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
          </li>
          <!-- Show for Admin -->
          <li class="nav-item" v-if="authState.user && authState.user.role === 'admin'">
             <router-link class="nav-link" to="/admin">Quản trị</router-link>
          </li>
        </ul>
        
        <div class="d-flex">
          <template v-if="!authState.user">
            <router-link to="/login" class="btn btn-primary btn-pill btn-sm me-2 fw-bold">Đăng nhập</router-link>
            <router-link to="/register" class="btn btn-outline-primary btn-pill btn-sm">Đăng ký</router-link>
          </template>
          <template v-else>
            <div class="dropdown">
              <button class="btn btn-light btn-pill btn-sm dropdown-toggle d-flex align-items-center" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                <img :src="authState.user.avatar" class="rounded-circle me-2" alt="Avatar" width="24" height="24">
                {{ authState.user.full_name }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                <li><router-link class="dropdown-item" to="/profile">Hồ sơ cá nhân</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger" @click="logout">Đăng xuất</button></li>
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
    font-size: 1.8rem;
    letter-spacing: 1px;
}
.navbar {
    border-bottom: 2px solid #D32F2F;
}
</style>
