<script>
import { inject, nextTick } from 'vue'

export default {
  name: 'LoginView',
  data() {
    return {
      currentUsername: '',
      username: '',
      password: ''
    }
  },
  setup() {
    const updateLoginState = inject('updateLoginState')
    return { updateLoginState }
  },
  mounted() {
    const foodIcon = document.querySelector('.icon img')
    foodIcon.style.animation = 'bounce 2s ease infinite'

    document.getElementById('login-form').addEventListener('submit', this.handleSubmit)

    // Check if user is already logged in
    this.checkLoginState()
  },
  methods: {
    async makeRequest(url, method, body = null) {
      const headers = {
        'Content-Type': 'application/json',
        'X-Username': this.currentUsername
      }
      const options = { method, headers }
      if (body) options.body = JSON.stringify(body)
      try {
        const response = await fetch(`http://157.245.198.241:5000/api${url}`, options)
        return await response.json()
      } catch (error) {
        console.error('Error during fetch:', error)
        return { error: 'An error occurred while trying to log in.' }
      }
    },
    async handleSubmit(event) {
      event.preventDefault()
      const result = await this.makeRequest('/login', 'POST', {
        username: this.username,
        password: this.password
      })

      if (result.username) {
        this.currentUsername = result.username
        // Save login state
        this.saveLoginState(this.currentUsername)
        alert(`Logged in as ${this.currentUsername}`)
        // Use nextTick to ensure DOM has updated before navigation
        nextTick(() => {
          this.$router.push('/profile')
        })
      } else {
        alert(result.error)
      }
    },
    saveLoginState(username) {
      localStorage.setItem('loggedInUser', username)
      localStorage.setItem('isLoggedIn', 'true')
      this.updateLoginState(true, username)
    },
    checkLoginState() {
      const loggedInUser = localStorage.getItem('loggedInUser')
      const isLoggedIn = localStorage.getItem('isLoggedIn')

      if (isLoggedIn === 'true' && loggedInUser) {
        this.currentUsername = loggedInUser
        this.updateLoginState(true, loggedInUser)
        this.$router.push('/profile')
      }
    },
    logout() {
      localStorage.removeItem('loggedInUser')
      localStorage.removeItem('isLoggedIn')
      this.currentUsername = ''
      this.updateLoginState(false)
      this.$router.push('/')
    }
  }
}
</script>

<template>
  <div id="login-page">
    <div id="login-container">
      <div class="icon">
        <img src="../assets/icon.png" alt="icon" width="200px" />
      </div>
      <h1 class="title">Login</h1>
      <form id="login-form">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" v-model="username" required />
        <label for="password">Password</label>
        <input type="password" id="password" name="password" v-model="password" required />
        <button type="submit">Log In</button>
      </form>
      <div class="signup-link">
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  </div>
</template>

<style>
#login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#login-container {
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

form {
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
  margin-bottom: 1rem;
  border: 1px solid gray;
  border-radius: 4px;
  font-size: 1rem;
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

button:hover {
  background-color: #3d6a52;
}

.signup-link {
  margin-top: 20px;
}

.signup-link a {
  color: #795548;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
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
