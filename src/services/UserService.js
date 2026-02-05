import api from './api';

const UserService = {
    async register(user) {
        const res = await api.get(`/users?email=${user.email}`);
        if (res.data.length > 0) {
            throw new Error('Email already exists');
        }
        // Default role is user
        const newUser = { ...user, role: 'user', avatar: 'https://via.placeholder.com/150' };
        const response = await api.post('/users', newUser);
        return response.data;
    },

    async login(email, password) {
        const res = await api.get(`/users?email=${email}&password=${password}`);
        if (res.data.length > 0) {
            const user = res.data[0];
            // Store in localStorage
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        }
        throw new Error('Invalid email or password');
    },

    logout() {
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    async getAllUsers() {
        const response = await api.get('/users');
        return response.data;
    },

    async deleteUser(id) {
        await api.delete(`/users/${id}`);
    },

    async updateUser(id, data) {
        const response = await api.patch(`/users/${id}`, data);
        // Update local storage if current user is updated
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === id) {
            const updatedUser = { ...currentUser, ...response.data };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        return response.data;
    }
};

export default UserService;
