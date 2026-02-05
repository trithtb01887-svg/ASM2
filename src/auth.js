import { reactive } from 'vue'

export const authState = reactive({
    user: JSON.parse(localStorage.getItem('user')) || null,
    login(user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
    },
    logout() {
        this.user = null;
        localStorage.removeItem('user');
    }
})
