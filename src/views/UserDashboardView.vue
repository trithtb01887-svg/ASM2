<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PostService from '@/services/PostService' // Keep for deletePost if needed, or implement delete with axios too

const posts = ref([])
const loading = ref(true)
const isAdmin = ref(false)

onMounted(async () => {
  await loadMyPosts()
})

async function loadMyPosts() {
  // 1. Lấy User từ localStorage
  const userStr = localStorage.getItem('user_info') || localStorage.getItem('user');
  if (!userStr) {
    alert("Vui lòng đăng nhập!");
    return;
  }
  const currentUser = JSON.parse(userStr);
  
  // Xác định quyền Admin để hiển thị giao diện
  isAdmin.value = currentUser.role === 'admin';

  loading.value = true;
  try {
    // 2. Gọi API lấy TẤT CẢ bài viết
    const res = await axios.get('http://localhost:3000/posts');
    const allPosts = res.data;

    // 3. Phân quyền hiển thị (Logic quan trọng)
    if (currentUser.role === 'admin') {
      // Admin: Thấy toàn bộ bài viết
      posts.value = allPosts;
      console.log("Admin: Xem tất cả", allPosts.length, "bài.");
    } else {
      // User thường: Chỉ thấy bài có author_id trùng với mình
      // Lưu ý: Dùng '==' để so sánh lỏng (vd: 2 == "2")
      posts.value = allPosts.filter(post => post.author_id == currentUser.id);
      console.log("User: Lọc bài của ID", currentUser.id, "- Tìm thấy:", posts.value.length, "bài.");
    }
  } catch (err) {
    console.error("Lỗi khi tải bài viết:", err);
  } finally {
    loading.value = false;
  }
}

async function deletePost(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
  
  try {
    // Dùng axios trực tiếp hoặc AuthService đều được, ở đây dùng PostService cho gọn
    await PostService.deletePost(id);
    // Cập nhật lại list client-side
    posts.value = posts.value.filter(p => p.id !== id);
    alert("Đã xóa bài viết.");
  } catch (err) {
    console.error(err);
    alert("Lỗi khi xóa bài viết.");
  }
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-danger">{{ isAdmin ? 'Admin Dashboard (Tất Cả Bài Viết)' : 'My Dashboard (Bài Của Tôi)' }}</h2>
      <router-link to="/posts/new" class="btn btn-success shadow-sm">
        <i class="bi bi-plus-lg"></i> Đăng Bài Mới
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-danger" role="status"></div>
      <p class="text-muted mt-2">Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-5 bg-white rounded shadow-sm">
      <p class="mb-3 text-muted">Chưa có bài viết nào.</p>
      <router-link to="/posts/new" class="btn btn-primary">Viết bài ngay</router-link>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover bg-white shadow-sm rounded align-middle border">
        <thead class="bg-light text-uppercase small fw-bold text-secondary">
          <tr>
            <th scope="col" class="ps-3">Tiêu đề</th>
            <!-- Cột dành riêng cho Admin -->
            <th scope="col" v-if="isAdmin">Author ID</th>
            <th scope="col">Chuyên mục</th>
            <th scope="col">Ngày đăng</th>
            <th scope="col">Views</th>
            <th scope="col" class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td class="ps-3">
              <router-link :to="{ name: 'post-detail', params: { id: post.id } }" class="text-decoration-none fw-bold text-dark">
                {{ post.title }}
              </router-link>
            </td>
            <!-- Hiển thị Author ID cho Admin -->
            <td v-if="isAdmin">
              <span class="badge bg-secondary text-white">{{ post.author_id }}</span>
            </td>
            <td><span class="badge bg-danger bg-opacity-75">{{ post.category }}</span></td>
            <td class="text-muted small">{{ post.created_at }}</td> <!-- Display raw or format if needed -->
            <td class="fw-bold text-primary">{{ post.views }}</td>
            <td class="text-center">
              <router-link :to="{ name: 'edit-post', params: { id: post.id } }" class="btn btn-sm btn-outline-primary me-2">
                <i class="bi bi-pencil-fill"></i>
              </router-link>
              <button @click="deletePost(post.id)" class="btn btn-sm btn-outline-danger">
                <i class="bi bi-trash-fill"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
