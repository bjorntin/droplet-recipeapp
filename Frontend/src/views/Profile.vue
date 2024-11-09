<template>
  <div id="profile-page">
    <div id="profile-container">
      <!-- Left Column: Icon and Username -->
      <div class="profile-left">
        <img src="../assets/icon.png" alt="icon" class="icon" />
        <h1 class="username">{{ currentUsername }}</h1>
      </div>

      <!-- Right Column: User Information -->
      <div class="profile-right">
        <div class="profile-section">
          <h3>Diet Type</h3>
          <p v-if="dietaryRestrictions && dietaryRestrictions.length > 0">
            {{ dietaryRestrictions.join(', ') }}
          </p>
          <p v-else>No diet type set.</p>
        </div>

        <div class="profile-section">
          <h3>Allergies</h3>
          <p v-if="allergies && allergies.length > 0">
            {{ allergies.join(', ') }}
          </p>
          <p v-else>No allergies set.</p>

          <!-- Button to Update Dietary Restrictions -->
          <button class="update-btn" @click="goToDietaryRestrictions">
            Update Dietary Restrictions
          </button>
        </div>

        <!-- Placeholder for User Points and Redeem Button -->
        <div class="profile-section">
          <h3>Your Points</h3>
          <p v-if="pointsBalance >= 0">
            <span class="points-placeholder">{{ pointsBalance }}</span> Points
          </p>
          <p v-else>No points available.</p>
          <button @click="goToVouchers">Redeem Points</button>
        </div>

        <!-- Logout Button -->
        <button class="logout-btn" @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'UserProfile',
  setup() {
    const router = useRouter()
    const dietaryRestrictions = ref([])
    const allergies = ref([])
    const selectedAllergies = ref([])
    const pointsBalance = ref(0)
    const loading = ref(true)
    const error = ref(null)
    const currentUsername = ref(localStorage.getItem('loggedInUser'))

    const fetchDietaryRestrictions = async () => {
      try {
        const response = await fetch('http://157.245.198.241:5000/api/dietary-info', {
          headers: { 'X-Username': localStorage.getItem('loggedInUser') }
        })
        if (response.ok) {
          const data = await response.json()
          if (data && typeof data === 'string' && data.trim() !== '') {
            dietaryRestrictions.value = data.split(',')
          } else {
            dietaryRestrictions.value = []
          }
        } else {
          dietaryRestrictions.value = []
        }
      } catch (err) {
        console.error('Error fetching dietary restrictions:', err)
        dietaryRestrictions.value = []
      } finally {
        loading.value = false
      }
    }

    const fetchAllergies = async () => {
      try {
        const response = await fetch('http://157.245.198.241:5000/api/allergy-info', {
          headers: { 'X-Username': localStorage.getItem('loggedInUser') }
        })
        if (response.ok) {
          const data = await response.json()
          if (data && data.Allergies && typeof data.Allergies === 'string' && data.Allergies.trim() !== '') {
            allergies.value = data.Allergies.split(',')
            selectedAllergies.value = allergies.value
          } else {
            allergies.value = []
            selectedAllergies.value = []
          }
        } else {
          allergies.value = []
          selectedAllergies.value = []
        }
      } catch (err) {
        console.error('Error fetching allergies:', err)
        allergies.value = []
        selectedAllergies.value = []
      } finally {
        loading.value = false
      }
    }

    const fetchUserPoints = async () => {
      try {
        const response = await fetch('http://157.245.198.241:5000/api/user-points', {
          headers: { 'X-Username': localStorage.getItem('loggedInUser') }
        })
        if (response.ok) {
          const data = await response.json()
          pointsBalance.value = data.points || 0
        } else {
          pointsBalance.value = 0
        }
      } catch (err) {
        console.error('Error fetching points:', err)
        pointsBalance.value = 0
      }
    }

    const goToDietaryRestrictions = () => {
      router.push('/dietary-restrictions')
    }

    const goToVouchers = () => {
      router.push('/vouchers')
    }

    const logout = () => {
      localStorage.removeItem('loggedInUser')
      localStorage.removeItem('isLoggedIn')
      currentUsername.value = ''
      router.push('/')
    }

    onMounted(() => {
      if (!localStorage.getItem('loggedInUser')) {
        router.push('/login')
        return
      }
      fetchDietaryRestrictions()
      fetchAllergies()
      fetchUserPoints()
    })

    return {
      dietaryRestrictions,
      allergies,
      pointsBalance,
      loading,
      error,
      currentUsername,
      goToDietaryRestrictions,
      goToVouchers,
      logout
    }
  }
}
</script>

<style scoped>
#profile-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

#profile-container {
  display: flex;
  background-color: #e0ebe4;
  color: #795548;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 1000px;
  position: relative;
  flex-wrap: wrap;
  gap: 20px;
}

.profile-left {
  flex: 1;
  min-width: 200px;
  text-align: center;
  padding: 20px;
}

.icon {
  width: 150px;
  max-width: 100%;
  border-radius: 50%;
}

.username {
  color: #5d4037;
  margin-top: 15px;
  font-size: 1.8rem;
  word-break: break-word;
}

.profile-right {
  flex: 2;
  min-width: 300px;
  padding: 20px;
  position: relative;
  padding-bottom: 80px;
}

.profile-section {
  margin-bottom: 20px;
  background-color: rgba(255, 255, 255, 0.5);
  padding: 15px;
  border-radius: 8px;
}

.profile-section h3 {
  color: #5d4037;
  margin-bottom: 8px;
}

.points-placeholder {
  font-weight: bold;
}

button {
  display: inline-block;
  background-color: #5e9b77;
  color: #e6e6e6;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #4b8063;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.logout-btn {
  background-color: #e57373;
  position: absolute;
  bottom: 20px;
  right: 20px;
  margin: 0;
}

.logout-btn:hover {
  background-color: #ef9a9a;
}

/* Mobile Styles */
@media (max-width: 768px) {
  #profile-page {
    padding: 10px;
  }

  #profile-container {
    flex-direction: column;
  }

  .profile-left,
  .profile-right {
    width: 100%;
    padding: 15px;
  }

  .profile-right {
    padding-bottom: 70px;
  }

  .icon {
    width: 120px;
  }

  .username {
    font-size: 1.5rem;
  }

  button {
    width: 100%;
    margin-right: 0;
  }

  .logout-btn {
    width: calc(100% - 40px);
    position: absolute;
    bottom: 20px;
    right: 20px;
    left: 20px;
  }
}

/* Small Mobile Styles */
@media (max-width: 480px) {
  #profile-page {
    padding: 5px;
  }

  .profile-section {
    padding: 10px;
  }

  .username {
    font-size: 1.3rem;
  }

  button {
    padding: 8px 12px;
    font-size: 0.9rem;
  }
}
</style>
