<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const user = ref({
    id: '',
    email: '',
    full_name: '',
    avatar: '',
    role: '',
    password: ''
})
const loading = ref(false)
const router = useRouter()

onMounted(() => {
    const userStr = localStorage.getItem('user_info');
    if (!userStr) {
        alert("Vui lòng đăng nhập!");
        router.push('/login');
        return;
    }
    user.value = JSON.parse(userStr);
})

async function updateProfile() {
    loading.value = true;
    try {
        // 1. Gọi API cập nhật
        await axios.put(`http://localhost:3000/users/${user.value.id}`, user.value);

        // 2. Cập nhật lại LocalStorage
        localStorage.setItem('user_info', JSON.stringify(user.value));

        alert("Cập nhật hồ sơ thành công!");
        
        // 3. Reload để Header cập nhật avatar/tên mới
        window.location.reload();
        
    } catch (error) {
        console.error("Lỗi update:", error);
        alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
        loading.value = false;
    }
}
</script>

<template>
  <div class="row justify-content-center mt-4">
    <div class="col-md-8 col-lg-6">
       <!-- Profile Card -->
       <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
           <div class="card-header bg-primary text-white text-center py-5 position-relative">
               <div class="position-absolute top-50 start-50 translate-middle">
                   <img 
                    :src="user.avatar || 'https://via.placeholder.com/150'" 
                    class="rounded-circle border border-4 border-white shadow" 
                    width="120" 
                    height="120" 
                    style="object-fit: cover;"
                   >
               </div>
           </div>
           
           <div class="card-body pt-5 mt-4 px-5">
               <div class="text-center mb-4">
                   <h3 class="fw-bold">{{ user.full_name }}</h3>
                   <span class="badge rounded-pill text-uppercase px-3 py-2" :class="user.role === 'admin' ? 'bg-danger' : 'bg-success'">
                       {{ user.role }}
                   </span>
               </div>
               
               <form @submit.prevent="updateProfile">
                   <div class="mb-3">
                       <label class="form-label fw-bold">Email (Không thể sửa)</label>
                       <input type="email" class="form-control bg-light" v-model="user.email" disabled>
                   </div>
                   
                   <div class="mb-3">
                       <label class="form-label fw-bold">Họ và Tên</label>
                       <input type="text" class="form-control" v-model="user.full_name" required>
                   </div>
                   
                   <div class="mb-3">
                       <label class="form-label fw-bold">Link Avatar</label>
                       <input type="url" class="form-control" v-model="user.avatar">
                   </div>
                   
                   <div class="mb-4">
                        <label class="form-label fw-bold">Mật khẩu</label>
                        <input type="password" class="form-control" v-model="user.password" required>
                   </div>
                   
                   <div class="d-grid">
                       <button type="submit" class="btn btn-primary fw-bold py-2 shadow-sm" :disabled="loading">
                           {{ loading ? 'Đang lưu...' : 'Lưu Thay Đổi' }}
                       </button>
                   </div>
               </form>
           </div>
       </div>
    </div>
  </div>
</template>
