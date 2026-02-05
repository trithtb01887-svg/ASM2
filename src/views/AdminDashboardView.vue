<script setup>
import { ref, onMounted } from 'vue'
import PostService from '@/services/PostService'
import UserService from '@/services/UserService'
import { authState } from '@/auth'

const posts = ref([])
const users = ref([])
const activeTab = ref('posts')
const loading = ref(false)

onMounted(async () => {
  await loadData()
})

async function loadData() {
  loading.value = true
  try {
    if (activeTab.value === 'posts') {
      posts.value = await PostService.getAllPosts()
    } else {
      users.value = await UserService.getAllUsers()
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function switchTab(tab) {
  activeTab.value = tab
  loadData()
}

async function deletePost(id) {
  if (!confirm('Admin Action: Delete this post?')) return
  await PostService.deletePost(id)
  posts.value = posts.value.filter(p => p.id !== id)
}

async function deleteUser(id) {
  if (id === authState.user.id) {
    alert("You cannot delete yourself.")
    return
  }
  if (!confirm('Admin Action: Delete this user account? This cannot be undone.')) return
  await UserService.deleteUser(id)
  users.value = users.value.filter(u => u.id !== id)
}
</script>

<template>
  <div>
    <h2 class="mb-4 text-danger">Admin Dashboard</h2>
    
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'posts' }" @click="switchTab('posts')">Manage Posts</button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'users' }" @click="switchTab('users')">Manage Users</button>
      </li>
    </ul>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Posts Management -->
    <div v-else-if="activeTab === 'posts'">
      <div class="table-responsive">
        <table class="table table-striped text-center align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th class="text-start">Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Views</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td class="text-start text-truncate" style="max-width: 300px;">
                <router-link :to="{ name: 'post-detail', params: { id: post.id } }">{{ post.title }}</router-link>
              </td>
              <td>{{ post.user?.full_name }}</td>
              <td>{{ post.category }}</td>
              <td>{{ post.views }}</td>
              <td>
                <button @click="deletePost(post.id)" class="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- User Management -->
    <div v-else>
       <div class="table-responsive">
        <table class="table table-striped text-center align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Avatar</th>
              <th class="text-start">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td><img :src="user.avatar" class="rounded-circle" width="30" height="30"></td>
              <td class="text-start">{{ user.full_name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="badge" :class="user.role === 'admin' ? 'bg-danger' : 'bg-secondary'">{{ user.role }}</span>
              </td>
              <td>
                <button @click="deleteUser(user.id)" class="btn btn-sm btn-danger" :disabled="user.role === 'admin' && user.id === authState.user .id">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
