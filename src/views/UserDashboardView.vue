<script setup>
import { ref, onMounted } from 'vue'
import { authState } from '@/auth'
import PostService from '@/services/PostService'

const posts = ref([])
const loading = ref(true)

onMounted(async () => {
  if (authState.user) {
    await loadMyPosts()
  }
})

async function loadMyPosts() {
  loading.value = true
  try {
    posts.value = await PostService.getPostsByUser(authState.user.id)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function deletePost(id) {
  if (!confirm('Are you sure you want to delete this post?')) return
  
  try {
    await PostService.deletePost(id)
    posts.value = posts.value.filter(p => p.id !== id)
  } catch (err) {
    alert('Failed to delete post')
  }
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>My Dashboard</h2>
      <router-link to="/posts/new" class="btn btn-success">
        <i class="bi bi-plus-lg"></i> New Post
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-5 bg-white rounded shadow-sm">
      <p class="mb-3">You haven't posted any articles yet.</p>
      <router-link to="/posts/new" class="btn btn-primary">Write your first post</router-link>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover bg-white shadow-sm rounded">
        <thead class="table-light">
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Category</th>
            <th scope="col">Created At</th>
            <th scope="col">Views</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td>
              <router-link :to="{ name: 'post-detail', params: { id: post.id } }" class="text-decoration-none fw-bold">
                {{ post.title }}
              </router-link>
            </td>
            <td><span class="badge bg-secondary">{{ post.category }}</span></td>
            <td>{{ new Date(post.created_at).toLocaleDateString() }}</td>
            <td>{{ post.views }}</td>
            <td>
              <router-link :to="{ name: 'edit-post', params: { id: post.id } }" class="btn btn-sm btn-outline-primary me-2">
                Edit
              </router-link>
              <button @click="deletePost(post.id)" class="btn btn-sm btn-outline-danger">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
