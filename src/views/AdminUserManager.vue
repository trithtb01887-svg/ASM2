<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const users = ref([])
const loading = ref(true)
const currentUser = ref(null)
const router = useRouter()

onMounted(async () => {
    // 1. Check quyền Admin
    const userStr = localStorage.getItem('user_info');
    if (userStr) {
        currentUser.value = JSON.parse(userStr);
    }
    
    if (!currentUser.value || currentUser.value.role !== 'admin') {
        alert("Bạn không có quyền truy cập trang này!");
        router.push('/');
        return;
    }

    // 2. Fetch Users
    await fetchUsers();
})

async function fetchUsers() {
    try {
        const res = await axios.get('http://localhost:3000/users');
        users.value = res.data;
    } catch (error) {
        console.error("Lỗi lấy danh sách user:", error);
    } finally {
        loading.value = false;
    }
}

async function deleteUser(id) {
    if (id === currentUser.value.id) {
        alert("Không thể xóa chính mình!");
        return;
    }

    if (!confirm("Bạn có chắc chắn muốn xóa thành viên này? Hành động này không thể hoàn tác.")) {
        return;
    }

    try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        // Xóa client-side
        users.value = users.value.filter(u => u.id !== id);
        alert("Đã xóa thành viên.");
    } catch (error) {
        console.error("Lỗi xóa user:", error);
        alert("Xóa thất bại!");
    }
}
</script>

<template>
  <div class="container-fluid">
     <h2 class="mb-4 fw-bold text-danger border-start border-5 border-danger ps-3">Quản Lý Thành Viên</h2>
     
     <div v-if="loading" class="text-center py-5">
         <div class="spinner-border text-danger" role="status"></div>
     </div>

     <div v-else class="card border-0 shadow-sm rounded-4 overflow-hidden">
         <div class="card-body p-0">
             <div class="table-responsive">
                 <table class="table table-hover align-middle mb-0">
                     <thead class="bg-light text-uppercase small text-secondary fw-bold">
                         <tr>
                             <th scope="col" class="py-3 ps-4">ID</th>
                             <th scope="col" class="py-3">Thành Viên</th>
                             <th scope="col" class="py-3">Email</th>
                             <th scope="col" class="py-3">Vai Trò</th>
                             <th scope="col" class="py-3 text-center">Hành Động</th>
                         </tr>
                     </thead>
                     <tbody>
                         <tr v-for="user in users" :key="user.id">
                             <td class="ps-4 fw-bold text-muted">#{{ user.id }}</td>
                             <td>
                                 <div class="d-flex align-items-center">
                                     <img :src="user.avatar || 'https://via.placeholder.com/40'" class="rounded-circle border me-3" width="40" height="40" style="object-fit: cover;">
                                     <span class="fw-bold text-dark">{{ user.full_name }}</span>
                                 </div>
                             </td>
                             <td>{{ user.email }}</td>
                             <td>
                                 <span class="badge rounded-pill px-3 py-2 shadow-sm" 
                                    :class="user.role === 'admin' ? 'bg-danger text-white' : 'bg-primary text-white'">
                                     {{ user.role ? user.role.toUpperCase() : 'USER' }}
                                 </span>
                             </td>
                             <td class="text-center">
                                 <button 
                                    v-if="user.id !== currentUser.id" 
                                    @click="deleteUser(user.id)" 
                                    class="btn btn-sm btn-outline-danger" 
                                    title="Xóa thành viên"
                                 >
                                     <i class="bi bi-trash-fill"></i> Xóa
                                 </button>
                                 <span v-else class="text-muted small fst-italic">Tôi</span>
                             </td>
                         </tr>
                     </tbody>
                 </table>
             </div>
         </div>
     </div>
  </div>
</template>
