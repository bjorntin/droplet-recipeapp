<template>
  <div id="signup-page">
    <div id="signup-container">
      <div class="icon">
        <img src="../assets/icon.png" alt="icon" width="200px" />
      </div>
      <h1 class="title">Sign Up</h1>
      <form @submit.prevent="handleSignup" class="signup-form">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
          @blur="checkUsername"
          required
          minlength="3"
          maxlength="20"
        />
        <small v-if="usernameError" class="error-message">{{ usernameError }}</small>
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required minlength="8" />
        <small>Password must be at least 8 characters long.</small>
        <button type="submit" :disabled="isLoading || !isFormValid">
          {{ isLoading ? 'Signing up...' : 'Sign Up' }}
        </button>
      </form>
      <div v-if="message" :class="['message', messageType]">{{ message }}</div>
      <div class="login-link">
        <p>Already have an account? <router-link to="/login">Login here</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_BASE_URL = 'http://157.245.198.241:5000/api'

export default {
  data() {
    return {
      username: '',
      password: '',
      message: '',
      messageType: '',
      isLoading: false,
      usernameError: ''
    }
  },
  computed: {
    isFormValid() {
      return (
        this.username.length >= 3 &&
        this.username.length <= 20 &&
        this.password.length >= 8 &&
        !this.usernameError
      )
    }
  },
  mounted() {
    const foodIcon = document.querySelector('.icon img')
    foodIcon.style.animation = 'bounce 2s ease infinite'
  },
  methods: {
    async checkUsername() {
      if (this.username.length < 3 || this.username.length > 20) {
        this.usernameError = 'Username must be 3-20 characters long.'
        return
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/check-username/${this.username}`)
        if (response.data.exists) {
          this.usernameError = 'This username is already taken.'
        } else {
          this.usernameError = ''
        }
      } catch (error) {
        console.error('Error checking username:', error)
        this.usernameError = 'Error checking username availability.'
      }
    },
    async handleSignup() {
      if (!this.isFormValid) {
        this.message = 'Please ensure all fields are filled correctly.'
        this.messageType = 'error'
        return
      }

      this.isLoading = true
      this.message = ''
      try {
        const response = await axios.post(`${API_BASE_URL}/signup`, {
          username: this.username,
          password: this.password,
          dietaryRestrictions: ''
        })
        this.message = 'Signup successful! You can now login.'
        this.messageType = 'success'
        // Clear the form
        this.username = ''
        this.password = ''
        // Redirect to login page after a short delay
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
      } catch (error) {
        this.message = error.response?.data?.error || 'An error occurred during signup.'
        this.messageType = 'error'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
#signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#signup-container {
  background-color: #e0ebe4;
  color: #795548;
  border-radius: 8px;
  text-align: center;
  width: 40%;
  padding: 20px;
}

.title {
  margin-top: -5px;
  color: #5d4037;
}

.signup-form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: start;
}

input {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 1px solid #795548;
  border-radius: 4px;
  font-size: 1rem;
}

small {
  display: block;
  margin-bottom: 1rem;
  color: #795548;
  text-align: left;
}

button {
  background-color: #5e9b77;
  color: #e6e6e6;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #4b8063;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.login-link {
  margin-top: 20px;
}

.login-link a {
  color: #795548;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

.message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 4px;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.error-message {
  color: #721c24;
  font-weight: bold;
  margin-bottom: 1rem;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
}
</style>
