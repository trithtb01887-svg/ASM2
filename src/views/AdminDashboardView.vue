<script setup>
import { ref, onMounted, computed } from 'vue'
import PostService from '@/services/PostService'
import { useRouter } from 'vue-router'

const router = useRouter()
const posts = ref([])
const loading = ref(false)
const activeTab = ref('pending') 

// --- COMPUTED PROPERTIES ---
// Tab 1: CHỜ DUYỆT (Chỉ pending)
const pendingPosts = computed(() => {
  return posts.value.filter(post => post.status === 'pending')
})

// Tab 2: KHO BÀI VIẾT (TẤT CẢ nhữn bài KHÔNG PHẢI pending)
// Bao gồm: published, rejected, và cả bài lỗi không có status (undefined)
const processedPosts = computed(() => {
  return posts.value.filter(post => post.status !== 'pending')
})

// --- LIFECYCLE ---
onMounted(async () => {
  const userStr = localStorage.getItem('user_info')
  if (!userStr) return router.push('/login')
  
  const user = JSON.parse(userStr)
  if (user.role !== 'admin') {
    alert("BẠN KHÔNG PHẢI ADMIN!")
    return router.push('/')
  }

  await fetchPosts()
})

// --- ACTIONS ---
async function fetchPosts() {
  loading.value = true
  try {
    // Use PostService instead of direct axios
    posts.value = await PostService.getAllPosts()
    console.log("Loaded posts:", posts.value.length)
  } catch (err) {
    alert("Lỗi tải dữ liệu!")
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function approvePost(id) {
  try {
    await PostService.updatePost(id, { status: 'published' })
    alert("ĐÃ DUYỆT BÀI THÀNH CÔNG")
    await fetchPosts() 
  } catch (err) {
    alert("Lỗi API khi duyệt bài!")
  }
}

async function rejectPost(id) {
  const reason = prompt("Nhập lý do từ chối:")
  if (!reason) return

  try {
    await PostService.updatePost(id, { 
      status: 'rejected', 
      rejection_reason: reason 
    })
    alert("ĐÃ TỪ CHỐI BÀI VIẾT")
    await fetchPosts() 
  } catch (err) {
    alert("Lỗi API khi từ chối bài!")
  }
}

async function deletePost(id) {
  if (!confirm("BẠN CÓ CHẮC MUỐN XÓA BÀI NÀY?")) return

  try {
    await PostService.deletePost(id)
    alert("ĐÃ XÓA BÀI VIẾT")
    posts.value = posts.value.filter(p => p.id !== id)
  } catch (err) {
    alert("Lỗi khi xóa!")
  }
}

function getStatusBadge(status) {
    if (status === 'published') return 'bg-success'
    if (status === 'rejected') return 'bg-danger'
    if (!status) return 'bg-secondary' // Cho bài lỗi không có status
    return 'bg-warning text-dark'
}

function getStatusLabel(status) {
     if (status === 'published') return 'ĐÃ ĐĂNG'
     if (status === 'rejected') return 'TỪ CHỐI'
     if (status === 'pending') return 'CHỜ DUYỆT'
     return 'KHÔNG RÕ' // Cho bài lỗi
}
</script>

<template>
  <div class="container py-5">
    
    <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
      <h2 class="fw-bold text-primary">TRANG QUẢN TRỊ ADMIN</h2>
      <router-link to="/posts/new" class="btn btn-dark fw-bold">VIẾT BÀI MỚI</router-link>
    </div>

    <!-- TABS -->
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white border-bottom-0 pb-0">
        <ul class="nav nav-tabs card-header-tabs border-bottom-0">
          <li class="nav-item">
            <button 
              class="nav-link fw-bold px-4 py-3 border-bottom-0" 
              :class="{ active: activeTab === 'pending', 'text-primary border shadow-sm rounded-top': activeTab === 'pending', 'text-dark opacity-50': activeTab !== 'pending' }" 
              @click="activeTab = 'pending'"
            >
              CẦN DUYỆT ({{ pendingPosts.length }})
            </button>
          </li>
          <li class="nav-item">
            <button 
              class="nav-link fw-bold px-4 py-3 border-bottom-0" 
              :class="{ active: activeTab === 'published', 'text-success border shadow-sm rounded-top': activeTab === 'published', 'text-dark opacity-50': activeTab !== 'published' }" 
              @click="activeTab = 'published'"
            >
              KHO BÀI VIẾT ({{ processedPosts.length }})
            </button>
          </li>
        </ul>
      </div>

      <div class="card-body p-0 border-top">
        
        <!-- LOADING -->
        <div v-if="loading" class="text-center py-5">
           <strong class="text-primary">Đang tải dữ liệu...</strong>
        </div>

        <div v-else>
          <!-- TAB 1: PENDING -->
          <div v-if="activeTab === 'pending'">
             <div v-if="pendingPosts.length === 0" class="text-center py-5 bg-light">
                <h4 class="text-muted">Không có bài nào cần duyệt.</h4>
             </div>
             
             <table v-else class="table table-bordered mb-0 align-middle table-hover">
               <thead class="bg-light text-uppercase small text-secondary">
                 <tr>
                   <th class="ps-3 py-3">TIÊU ĐỀ</th>
                   <th>AUTHOR ID</th>
                   <th>CHUYÊN MỤC</th>
                   <th class="text-center" style="width: 250px;">HÀNH ĐỘNG</th>
                 </tr>
               </thead>
               <tbody>
                 <tr v-for="post in pendingPosts" :key="post.id">
                   <td class="ps-3 fw-bold text-primary">{{ post.title }}</td>
                   <td><span class="badge bg-secondary">{{ post.author_id }}</span></td>
                   <td>{{ post.category }}</td>
                   <td class="text-center">
                      <button class="btn btn-primary btn-sm me-2 fw-bold" @click="approvePost(post.id)">
                        DUYỆT BÀI
                      </button>
                      <button class="btn btn-warning btn-sm fw-bold" @click="rejectPost(post.id)">
                        TỪ CHỐI
                      </button>
                   </td>
                 </tr>
               </tbody>
             </table>
          </div>

          <!-- TAB 2: PROCESSED (Published + Rejected + Unknown) -->
          <div v-if="activeTab === 'published'">
             <div v-if="processedPosts.length === 0" class="text-center py-5 bg-light">
                <h4 class="text-muted">Kho bài viết trống.</h4>
             </div>

             <table v-else class="table table-bordered mb-0 align-middle table-hover">
                <thead class="bg-light text-uppercase small text-secondary">
                  <tr>
                    <th class="ps-3 py-3">TIÊU ĐỀ</th>
                    <th>TRẠNG THÁI</th>
                    <th>VIEWS</th>
                    <th class="text-center" style="width: 150px;">HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="post in processedPosts" :key="post.id">
                    <td class="ps-3 fw-bold text-dark">{{ post.title }}</td>
                    <td>
                        <span class="badge" :class="getStatusBadge(post.status)">
                            {{ getStatusLabel(post.status) }}
                        </span>
                        <div v-if="!post.status" class="small text-danger mt-1 fst-italic">Lỗi: Mất status</div>
                    </td>
                    <td class="text-success fw-bold">{{ post.views || 0 }}</td>
                    <td class="text-center">
                       <router-link :to="'/posts/edit/' + post.id" class="btn btn-outline-primary btn-sm me-2 fw-bold">SỬA</router-link>
                       <button class="btn btn-danger btn-sm fw-bold" @click="deletePost(post.id)">
                         XÓA
                       </button>
                    </td>
                  </tr>
                </tbody>
             </table>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
