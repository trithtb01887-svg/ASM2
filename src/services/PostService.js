import api from './api';

const PostService = {
    async getAllPosts() {
        const response = await api.get('/posts?_sort=created_at&_order=desc');
        // Handle json-server v1 beta response variations
        if (Array.isArray(response.data)) {
            return response.data;
        }
        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    },

    async getPosts(page = 1, limit = 6, search = '', category = '') {
        let url = `/posts?_page=${page}&_limit=${limit}&_sort=created_at&_order=desc`;
        if (search) url += `&q=${search}`;
        if (category && category !== 'Tất cả') url += `&category=${category}`;

        const response = await api.get(url);

        // CASE 1: Standard Array Response (json-server v0 or v1-beta without pagination wrapper sometimes)
        if (Array.isArray(response.data)) {
            return {
                data: response.data,
                total: parseInt(response.headers['x-total-count']) || 999
            };
        }

        // CASE 2: Wrapped Object Response (json-server v1 beta with pagination)
        if (response.data && Array.isArray(response.data.data)) {
            return {
                data: response.data.data,
                total: response.data.items || 0
            };
        }

        // Fallback: Empty
        return { data: [], total: 0 };
    },

    async getRelatedPosts(category, excludeId, limit = 3) {
        const response = await api.get(`/posts?category=${category}&id_ne=${excludeId}&_limit=${limit}&_sort=created_at&_order=desc`);

        if (Array.isArray(response.data)) {
            return response.data;
        }

        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }
        return [];
    },

    async getPostById(id) {
        const response = await api.get(`/posts?id=${id}`);
        const post = response.data[0];
        if (post) {
            try {
                const userId = post.userId || post.author_id;
                const userRes = await api.get(`/users?id=${userId}`);
                post.user = userRes.data[0];

                const commentsRes = await api.get(`/comments?post_id=${id}`);
                post.comments = commentsRes.data;
            } catch (e) {
                console.error("Failed to fetch details", e);
            }
        }
        return post;
    },

    async createPost(post) {
        const newPost = {
            title: post.title,
            category: post.category,
            thumbnail_url: post.thumbnail_url || 'https://placehold.co/600x400',
            content: post.content,
            author_id: post.userId || post.author_id,
            created_at: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            views: 0
        };
        const response = await api.post('/posts', newPost);
        return response.data;
    },

    async updatePost(id, post) {
        const response = await api.put(`/posts/${id}`, post);
        return response.data;
    },

    async deletePost(id) {
        await api.delete(`/posts/${id}`);
    },

    async getPostsByUser(userId) {
        const response = await api.get(`/posts?userId=${userId}`);
        return response.data;
    },

    async addComment(comment) {
        const newComment = {
            ...comment,
            created_at: new Date().toISOString()
        };
        const response = await api.post('/comments', newComment);
        return response.data;
    }
};

export default PostService;
