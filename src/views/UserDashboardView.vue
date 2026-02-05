<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PostService from '@/services/PostService'

const posts = ref([])
const loading = ref(true)
const isAdmin = ref(false)

onMounted(async () => {
  await loadMyPosts()
})

async function loadMyPosts() {
  const userStr = localStorage.getItem('user_info') || localStorage.getItem('user');
  if (!userStr) {
    alert("Vui lòng đăng nhập!");
    return;
  }
  const currentUser = JSON.parse(userStr);
  isAdmin.value = currentUser.role === 'admin';

  loading.value = true;
  try {
    const res = await axios.get('http://localhost:3000/posts');
    const allPosts = res.data;

    // Filter logic
    if (currentUser.role === 'admin') {
      posts.value = allPosts;
    } else {
      posts.value = allPosts.filter(post => post.author_id == currentUser.id);
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
    await PostService.deletePost(id);
    posts.value = posts.value.filter(p => p.id !== id);
    alert("Đã xóa bài viết.");
  } catch (err) {
    alert("Lỗi khi xóa bài viết.");
  }
}

// Helper badge color
function getStatusBadge(status) {
    switch (status) {
        case 'published': return 'bg-success';
        case 'rejected': return 'bg-danger';
        default: return 'bg-warning text-dark'; // pending
    }
}

function getStatusLabel(status) {
    switch (status) {
        case 'published': return 'Đã Đăng';
        case 'rejected': return 'Bị Từ Chối';
        default: return 'Chờ Duyệt';
    }
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-danger">{{ isAdmin ? 'Admin Dashboard - Tất Cả Bài Viết' : 'Bài Viết Của Tôi' }}</h2>
      <router-link to="/posts/new" class="btn btn-success shadow-sm fw-bold">
        <i class="bi bi-plus-lg"></i> Đăng Bài Mới
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-danger" role="status"></div>
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
            <th scope="col" v-if="isAdmin">Author ID</th>
            <th scope="col">Trạng thái</th> <!-- NEW COLUMN -->
            <th scope="col">Ngày đăng</th>
            <th scope="col">Views</th>
            <th scope="col" class="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td class="ps-3" style="max-width: 300px;">
              <div class="fw-bold text-dark text-truncate">{{ post.title }}</div>
              <!-- REJECTION REASON -->
              <div v-if="post.status === 'rejected'" class="small text-danger mt-1">
                  <i class="bi bi-exclamation-circle-fill me-1"></i>
                  Lý do: {{ post.rejection_reason || 'Không rõ' }}
              </div>
            </td>
            
            <td v-if="isAdmin">
              <span class="badge bg-secondary text-white">{{ post.author_id }}</span>
            </td>
            
            <!-- STATUS BADGE -->
            <td>
                <span class="badge rounded-pill px-3 py-2" :class="getStatusBadge(post.status)">
                    {{ getStatusLabel(post.status) }}
                </span>
            </td>
            
            <td class="text-muted small">{{ post.created_at }}</td>
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
