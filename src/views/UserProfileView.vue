<script setup>
import { ref, onMounted } from 'vue'
import { authState } from '@/auth'
import UserService from '@/services/UserService'

const user = ref({ ...authState.user })
const loading = ref(false)
const success = ref('')

async function updateProfile() {
  loading.value = true
  success.value = ''
  try {
    const updatedUser = await UserService.updateUser(user.value.id, user.value)
    authState.login(updatedUser) // Update local state
    success.value = 'Profile updated successfully!'
  } catch (err) {
    alert('Failed to update profile')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h3 class="mb-4">My Profile</h3>
          
           <div class="mb-4 text-center">
             <img :src="user.avatar" class="rounded-circle mb-3" width="100" height="100" style="object-fit: cover;">
             <p class="text-muted">{{ user.role.toUpperCase() }}</p>
           </div>
           
           <form @submit.prevent="updateProfile">
             <div class="mb-3">
               <label class="form-label">Full Name</label>
               <input type="text" class="form-control" v-model="user.full_name" required>
             </div>
             
             <div class="mb-3">
               <label class="form-label">Email (Read Only)</label>
               <input type="email" class="form-control" :value="user.email" disabled>
             </div>
             
             <div class="mb-3">
               <label class="form-label">Avatar URL</label>
               <input type="url" class="form-control" v-model="user.avatar">
             </div>
             
             <div class="mb-3">
               <label class="form-label">Password</label>
               <input type="password" class="form-control" v-model="user.password" required>
             </div>
             
             <div v-if="success" class="alert alert-success mt-3">
               {{ success }}
             </div>
             
             <button type="submit" class="btn btn-primary w-100" :disabled="loading">
               {{ loading ? 'Updating...' : 'Save Changes' }}
             </button>
           </form>
        </div>
      </div>
    </div>
  </div>
</template>
