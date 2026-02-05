<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  }
})

const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/600x400?text=No+Image';
}
</script>

<template>
  <div class="card h-100 border-0 shadow-sm card-hover-effect">
    <div class="position-relative overflow-hidden">
       <img :src="post.thumbnail_url || post.thumbnail || 'https://placehold.co/600x400?text=No+Image'" class="card-img-top" :alt="post.title" style="height: 220px; object-fit: cover; transition: all 0.5s ease;" @error="handleImageError">
       <span class="badge bg-danger position-absolute top-0 end-0 m-3 shadow-sm">{{ post.category }}</span>
    </div>
    <div class="card-body d-flex flex-column p-4">
      <h5 class="card-title fw-bold mb-3">
        <router-link :to="{ name: 'post-detail', params: { id: post.id } }" class="text-decoration-none text-dark stretched-link title-hover">
           {{ post.title }}
        </router-link>
      </h5>
      <p class="card-text text-muted small flex-grow-1" v-html="post.content.replace(/<[^>]*>?/gm, '').substring(0, 90) + '...'"></p>
      
      <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
         <div class="d-flex align-items-center text-muted small">
            <i class="bi bi-clock me-1"></i>
            {{ post.created_at || new Date().toISOString().split('T')[0] }}
         </div>
         <div class="d-flex align-items-center text-muted small">
            <i class="bi bi-eye-fill me-1 text-danger"></i>
            {{ post.views }}
         </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-hover-effect {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
/* Global card styles handle translateY and shadow, but we can enhance here if needed.
   Let's trust main.css for the card container hover, and just handle the image zoom here.
*/
.card:hover .card-img-top {
  transform: scale(1.05); /* Slightly subtler zoom */
}

.title-hover {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  transition: color 0.2s;
}

.title-hover:hover {
  color: var(--primary-color) !important;
}
</style>
