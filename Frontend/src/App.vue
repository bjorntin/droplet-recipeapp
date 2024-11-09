<script setup>
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { computed, ref, onMounted, provide, readonly, watch } from 'vue'

const route = useRoute()
const router = useRouter()

const homePage = computed(() => route.path === '/')
const loginSignup = computed(() => route.path === '/login' || route.path === '/signup')

const isLoggedIn = ref(false)
const currentUsername = ref('')

provide('loginState', readonly(isLoggedIn))
provide('currentUsername', readonly(currentUsername))
provide('updateLoginState', updateLoginState)

onMounted(() => {
  updateLoginState()
})

watch(
  () => route.path,
  () => {
    updateLoginState()
  }
)

function updateLoginState(loggedIn, username) {
  const loggedInState = localStorage.getItem('isLoggedIn')
  const loggedInUser = localStorage.getItem('loggedInUser')

  if (loggedIn !== undefined && username !== undefined) {
    isLoggedIn.value = loggedIn
    currentUsername.value = username
    if (loggedIn) {
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('loggedInUser', username)
    } else {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('loggedInUser')
    }
  } else if (loggedInState === 'true' && loggedInUser) {
    isLoggedIn.value = true
    currentUsername.value = loggedInUser
  } else {
    isLoggedIn.value = false
    currentUsername.value = ''
  }
}

function closeNavbar() {
  const navbarToggler = document.querySelector('.navbar-toggler')
  if (navbarToggler) {
    navbarToggler.click()
  }
}

function logout() {
  updateLoginState(false, '')
  closeNavbar()
  router.push('/')
}
</script>

<template>
  <!-- Main app layout -->
  <div v-if="!loginSignup" class="vh-100">
    <!-- Navigation for non-home pages -->
    <nav v-if="!homePage" class="navbar navbar-expand-lg custom-navbar app-navbar fixed-top p-0">
      <div class="container-fluid p-0">
        <div>
          <button
            class="navbar-toggler border-0 shadow-sm"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        <div class="collapse navbar-collapse" id="navbarContent">
          <div class="nav-container app-nav-container px-3">
            <ul class="navbar-nav app-navbar-nav flex-column align-items-stretch w-100 gap-1">
              <li class="nav-item">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/" @click="closeNavbar">Home</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/profile" @click="closeNavbar"
                  >Profile</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/recipe-search" @click="closeNavbar"
                  >Recipe Search</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/community-recipes" @click="closeNavbar"
                  >Community Recipes</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/favourites" @click="closeNavbar"
                  >Favourites</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/personal-recipes" @click="closeNavbar"
                  >Personal Recipes</RouterLink
                >
              </li>
              <li class="nav-item" v-if="isLoggedIn">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/create-recipe" @click="closeNavbar"
                  >Create Recipe</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/shopping-list" @click="closeNavbar"
                  >Shopping List</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/vouchers" @click="closeNavbar"
                  >Redeem Vouchers</RouterLink
                >
              </li>
              <template v-if="isLoggedIn">
                <li class="nav-item">
                  <a class="nav-link app-nav-link rounded-2" href="#" @click.prevent="logout">Logout</a>
                </li>
              </template>
              <template v-else>
                <li class="nav-item">
                  <RouterLink class="nav-link app-nav-link rounded-2" to="/signup" @click="closeNavbar"
                    >Sign Up</RouterLink
                  >
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link app-nav-link rounded-2" to="/login" @click="closeNavbar"
                    >Login</RouterLink
                  >
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <!-- Home page layout -->
    <div v-if="homePage" class="w-100">
      <section class="app-video-section">
        <video class="app-video-bright" autoplay loop muted>
          <source src="./assets/vid.mp4" type="video/mp4" />
        </video>
        <div class="app-overlay-content">
          <div class="app-intro-text">
            <strong>Healthy meals for</strong><br />
            <strong class="app-intro-highlight">
              <span class="typed-text">{{ typeValue }}</span>
              <span class="app-blinking-cursor">|</span>
              <span class="cursor" :class="{ typing: typeStatus }">&nbsp;</span>
            </strong>
          </div>
          <div class="app-second-column">
            <div class="app-climate-text">Making a difference with every meal.</div>
            <div class="app-auth-buttons">
              <router-link to="/login" class="app-auth-link">
                <button class="app-home-button">Login</button>
              </router-link>
              <router-link to="/signup" class="app-auth-link">
                <button class="app-home-button">Sign Up</button>
              </router-link>
            </div>
          </div>
        </div>
      </section>
      <nav class="navbar navbar-expand custom-navbar-home app-navbar-home shadow-sm">
        <div class="container-fluid">
          <div class="app-navbar-icon-box">
            <div class="app-navbar-icon-wrapper">
              <img src="./assets/icon.png" alt="logo" class="app-navbar-icon" />
            </div>
            <p class="app-navbar-brand">QuickEats</p>
          </div>
          <ul class="navbar-nav ms-auto d-flex align-items-center gap-3">
            <template v-if="isLoggedIn">
              <li class="nav-item">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/recipe-search" @click="closeNavbar"
                  >Recipe Search</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/profile" @click="closeNavbar"
                  >Profile</RouterLink
                >
              </li>
              <li class="nav-item">
                <a class="nav-link app-nav-link rounded-2" href="#" @click.prevent="logout">Logout</a>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/signup">Sign Up</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link app-nav-link rounded-2" to="/login">Login</RouterLink>
              </li>
            </template>
          </ul>
        </div>
      </nav>
      <RouterView />
    </div>

    <!-- Content area for other pages -->
    <div v-else class="app-content-area">
      <RouterView />
    </div>
  </div>

  <!-- Login and signup pages (no navbar) -->
  <div v-else class="vh-100">
    <RouterView />
  </div>
</template>

<script>
export default {
  data() {
    return {
      auth: false,
      typeValue: '',
      typeStatus: false,
      displayTextArray: ['you 🌟', 'our communities 🌈', 'our planet 🌏'],
      typingSpeed: 70,
      erasingSpeed: 50,
      newTextDelay: 2000,
      displayTextArrayIndex: 0,
      charIndex: 0
    }
  },
  created() {
    setTimeout(this.typeText, this.newTextDelay + 200)
  },
  methods: {
    typeText() {
      if (this.charIndex < this.displayTextArray[this.displayTextArrayIndex].length) {
        if (!this.typeStatus) this.typeStatus = true
        this.typeValue += this.displayTextArray[this.displayTextArrayIndex].charAt(this.charIndex)
        this.charIndex += 1
        setTimeout(this.typeText, this.typingSpeed)
      } else {
        this.typeStatus = false
        setTimeout(this.eraseText, this.newTextDelay)
      }
    },
    eraseText() {
      if (this.charIndex > 0) {
        if (!this.typeStatus) this.typeStatus = true
        this.typeValue = this.displayTextArray[this.displayTextArrayIndex].substring(
          0,
          this.charIndex - 1
        )
        this.charIndex -= 1
        setTimeout(this.eraseText, this.erasingSpeed)
      } else {
        this.typeStatus = false
        this.displayTextArrayIndex += 1
        if (this.displayTextArrayIndex >= this.displayTextArray.length)
          this.displayTextArrayIndex = 0
        setTimeout(this.typeText, this.typingSpeed + 1000)
      }
    }
  }
}
</script>
