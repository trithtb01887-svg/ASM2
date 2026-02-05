<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import UserService from '@/services/UserService'

const form = ref({
  email: '',
  password: '',
  full_name: '',
  avatar: 'https://via.placeholder.com/150' // Default
})

const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleRegister() {
  if (form.value.password !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await UserService.register(form.value)
    alert('Registration successful! Please login.')
    router.push('/login')
  } catch (err) {
    error.value = err.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h3 class="text-center mb-4">Create Account</h3>
          
          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" v-model="form.full_name" required>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input type="email" class="form-control" v-model="form.email" required>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                 <label class="form-label">Password</label>
                 <input type="password" class="form-control" v-model="form.password" required minlength="6">
              </div>
              <div class="col-md-6 mb-3">
                 <label class="form-label">Confirm Password</label>
                 <input type="password" class="form-control" v-model="confirmPassword" required>
              </div>
            </div>
            
            <div v-if="error" class="alert alert-danger py-2 small">
              {{ error }}
            </div>
            
            <button type="submit" class="btn btn-success w-100" :disabled="loading">
              {{ loading ? 'Creating Account...' : 'Register' }}
            </button>
            
            <div class="text-center mt-3">
              <small class="text-muted">Already have an account? <router-link to="/login">Login</router-link></small>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
