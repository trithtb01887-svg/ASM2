<script setup>
import { ref, computed } from 'vue'
import { authState } from '@/auth'
import PostService from '@/services/PostService'

const props = defineProps({
  postId: {
    type: Number,
    required: true
  },
  initialComments: {
    type: Array,
    default: () => []
  }
})

const comments = ref([...props.initialComments])
const newCommentContent = ref('')
const submitting = ref(false)

const sortedComments = computed(() => {
  return [...comments.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

async function submitComment() {
  if (!newCommentContent.value.trim()) return
  
  submitting.value = true
  try {
    const comment = {
      postId: props.postId,
      user_id: authState.user.id,
      content: newCommentContent.value,
      user: authState.user // optimizing display for immediate update
    }
    
    // In real app, we might need to refresh or backend returns expanded user
    const savedComment = await PostService.addComment(comment)
    
    // Mocking the expand for immediate display since json-server expand works on read
    savedComment.user = authState.user 
    
    comments.value.unshift(savedComment)
    newCommentContent.value = ''
  } catch (error) {
    console.error('Failed to post comment', error)
    alert('Failed to post comment')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mt-5">
    <h4 class="mb-4">Comments ({{ comments.length }})</h4>
    
    <!-- Comment Form -->
    <div v-if="authState.user" class="card mb-4">
      <div class="card-body">
        <h6 class="card-title mb-3">Leave a comment</h6>
        <div class="mb-3">
          <textarea 
            class="form-control" 
            rows="3" 
            v-model="newCommentContent"
            placeholder="Share your thoughts..."
          ></textarea>
        </div>
        <button 
          class="btn btn-primary" 
          @click="submitComment" 
          :disabled="submitting || !newCommentContent.trim()"
        >
          {{ submitting ? 'Posting...' : 'Post Comment' }}
        </button>
      </div>
    </div>
    <div v-else class="alert alert-info py-2">
      Please <router-link to="/login">login</router-link> to leave a comment.
    </div>

    <!-- Comment List -->
    <div class="comment-list">
      <div v-for="comment in sortedComments" :key="comment.id" class="d-flex mb-4">
        <div class="flex-shrink-0">
          <img class="rounded-circle" :src="comment.user?.avatar || 'https://via.placeholder.com/50'" alt="..." width="50" height="50">
        </div>
        <div class="ms-3 flex-grow-1">
          <div class="fw-bold">{{ comment.user?.full_name || 'Anonymous' }}</div>
          <p class="mb-1 text-break">{{ comment.content }}</p>
          <small class="text-muted">{{ new Date(comment.created_at).toLocaleString() }}</small>
        </div>
      </div>
      
      <div v-if="comments.length === 0" class="text-muted text-center py-3">
        Be the first to comment!
      </div>
    </div>
  </div>
</template>
