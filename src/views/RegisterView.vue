<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)
const serverError = ref('')

const form = ref({
  full_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  avatar: 'https://ui-avatars.com/api/?background=random',
  role: 'user'
})

// Error state object
const errors = ref({
  full_name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// --- VALIDATION LOGIC ---

// 1. Validate Full Name
function validateName() {
  if (!form.value.full_name.trim()) {
    errors.value.full_name = "Họ và tên không được để trống."
  } else {
    errors.value.full_name = ""
  }
}

// 2. Validate Email
function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email) {
    errors.value.email = "Email không được để trống."
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = "Email không đúng định dạng (ví dụ: abc@domain.com)."
  } else {
    errors.value.email = ""
  }
}

// 3. Validate Password (Strict)
function validatePassword() {
  const pwd = form.value.password;
  errors.value.password = ""; // Reset
  
  if (!pwd) {
    errors.value.password = "Mật khẩu không được để trống.";
    return;
  }

  // Check criteria individually for better UX
  const issues = [];
  if (pwd.length <= 6) issues.push("dài hơn 6 ký tự");
  if (!/[A-Z]/.test(pwd)) issues.push("chứa chữ HOA");
  if (!/[!@#$%^&*]/.test(pwd)) issues.push("chứa ký tự đặc biệt (!@#...)");

  if (issues.length > 0) {
    errors.value.password = "Mật khẩu yếu: Cần " + issues.join(", ") + ".";
  }
  
  // Re-validate confirm password whenever password changes
  if (form.value.confirmPassword) validateConfirmPassword();
}

// 4. Validate Confirm Password
function validateConfirmPassword() {
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = "Vui lòng nhập lại mật khẩu."
  } else if (form.value.confirmPassword !== form.value.password) {
    errors.value.confirmPassword = "Mật khẩu nhập lại không khớp."
  } else {
    errors.value.confirmPassword = ""
  }
}

// Computed property to disable Submit button
const isFormInvalid = computed(() => {
  // Return true if any field has error OR any field is empty
  return (
    !!errors.value.full_name || 
    !!errors.value.email || 
    !!errors.value.password || 
    !!errors.value.confirmPassword ||
    !form.value.full_name ||
    !form.value.email ||
    !form.value.password ||
    !form.value.confirmPassword
  );
})

// --- SUBMIT LOGIC ---
async function handleRegister() {
  // Final check before submit
  validateName();
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  if (isFormInvalid.value) return;

  loading.value = true
  serverError.value = ''

  try {
    // Check Email Exists
    const checkRes = await axios.get(`http://localhost:3000/users?email=${form.value.email}`)
    if (checkRes.data.length > 0) {
      serverError.value = "Email này đã được sử dụng!"
      loading.value = false
      return
    }

    // Create User
    const newUser = {
      email: form.value.email,
      password: form.value.password,
      full_name: form.value.full_name,
      avatar: form.value.avatar + '&name=' + encodeURIComponent(form.value.full_name),
      role: 'user'
    }

    await axios.post('http://localhost:3000/users', newUser)
    
    alert('Đăng ký thành công! Vui lòng đăng nhập.')
    router.push('/login')

  } catch (err) {
    console.error(err)
    serverError.value = "Lỗi kết nối server. Vui lòng thử lại."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-6 col-lg-5">
      <div class="card shadow-lg border-0 rounded-4">
        <div class="card-body p-4">
          <h3 class="text-center mb-4 fw-bold text-success">Đăng Ký Tài Khoản</h3>
          
          <form @submit.prevent="handleRegister" novalidate>
            
            <!-- Full Name -->
            <div class="mb-3">
              <label class="form-label fw-bold">Họ và Tên</label>
              <input 
                type="text" 
                class="form-control" 
                :class="{ 'is-invalid': errors.full_name }"
                v-model="form.full_name" 
                @blur="validateName"
                @input="validateName"
                placeholder="Nguyen Van A"
              >
              <div class="invalid-feedback">{{ errors.full_name }}</div>
            </div>
            
            <!-- Email -->
            <div class="mb-3">
              <label class="form-label fw-bold">Email</label>
              <input 
                type="email" 
                class="form-control" 
                :class="{ 'is-invalid': errors.email }"
                v-model="form.email" 
                @blur="validateEmail"
                @input="validateEmail"
                placeholder="email@example.com"
              >
              <div class="invalid-feedback">{{ errors.email }}</div>
            </div>
            
            <!-- Password -->
            <div class="mb-3">
              <label class="form-label fw-bold">Mật khẩu</label>
              <input 
                type="password" 
                class="form-control" 
                :class="{ 'is-invalid': errors.password }"
                v-model="form.password" 
                @blur="validatePassword"
                @input="validatePassword"
                placeholder=">6 ký tự, có Hoa & đặc biệt"
              >
              <div class="invalid-feedback">{{ errors.password }}</div>
            </div>

            <!-- Confirm Password -->
            <div class="mb-3">
              <label class="form-label fw-bold">Nhập lại mật khẩu</label>
              <input 
                type="password" 
                class="form-control" 
                :class="{ 'is-invalid': errors.confirmPassword }"
                v-model="form.confirmPassword" 
                @blur="validateConfirmPassword"
                @input="validateConfirmPassword"
                placeholder="Xác nhận mật khẩu"
              >
              <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
            </div>
            
            <!-- Global Server Error -->
            <div v-if="serverError" class="alert alert-danger py-2 small text-center">
              <i class="bi bi-exclamation-triangle-fill me-1"></i> {{ serverError }}
            </div>
            
            <!-- Submit Button -->
            <button 
              type="submit" 
              class="btn btn-success w-100 fw-bold py-2 shadow-sm" 
              :disabled="loading || isFormInvalid"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              {{ loading ? 'Đang xử lý...' : 'Đăng Ký Ngay' }}
            </button>
            
            <div class="text-center mt-4">
              <small class="text-muted">Đã có tài khoản? <router-link to="/login" class="text-decoration-none fw-bold">Đăng nhập</router-link></small>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
