<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authState } from '@/auth'
import UserService from '@/services/UserService'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  try {
    const user = await UserService.login(email.value, password.value)
    authState.login(user)
    router.push('/')
  } catch (err) {
    error.value = 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-5 col-lg-4">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h3 class="text-center mb-4">Login</h3>
          
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input type="email" class="form-control" v-model="email" required autofocus>
            </div>
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input type="password" class="form-control" v-model="password" required>
            </div>
            
            <div v-if="error" class="alert alert-danger py-2 small">
              {{ error }}
            </div>
            
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
            
            <div class="text-center mt-3">
              <small class="text-muted">Don't have an account? <router-link to="/register">Register</router-link></small>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
