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
        <h2>Profile Information</h2>
        <div class="profile-section">
          <h3>Dietary Restrictions</h3>
          <p v-if="dietaryRestrictions.length > 0">
            {{ dietaryRestrictions.join(', ') }}
          </p>
          <p v-else>No dietary restrictions set.</p>
        </div>

        <div class="profile-section">
          <h3>Allergies</h3>
          <p v-if="allergies.length > 0">
            {{ allergies.join(', ') }}
          </p>
          <p v-else>No allergies set.</p>
        </div>

        <!-- Placeholder for User Points and Redeem Button -->
        <div class="profile-section">
          <h3>Your Points</h3>
          <p>Points: <span class="points-placeholder">1200</span></p>
          <button class="redeem-btn">Redeem Points</button>
        </div>

        <!-- Button to Update Dietary Restrictions -->
        <button class="update-btn" @click="goToDietaryRestrictions">
          Update Dietary Restrictions
        </button>

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
  setup() {
    const router = useRouter()
    const dietaryRestrictions = ref([])
    const allergies = ref([])
    const loading = ref(true)
    const error = ref(null)
    const currentUsername = ref(localStorage.getItem('loggedInUser'))

    const fetchDietaryRestrictions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dietary-info', {
          headers: { 'X-Username': localStorage.getItem('loggedInUser') }
        })
        if (response.ok) {
          dietaryRestrictions.value = await response.json()
          dietaryRestrictions.value = dietaryRestrictions.value.split(',')
        } else {
          throw new Error('Failed to fetch dietary restrictions')
        }
      } catch (err) {
        error.value = 'An error occurred while fetching dietary restrictions.'
      } finally {
        loading.value = false
      }
    }
    const fetchAllergies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/allergy-info', {
          headers: { 'X-Username': localStorage.getItem('loggedInUser') }
        })
        if (response.ok) {
          const data = await response.json()
          const allergiesList = data.Allergies
          allergies.value = allergiesList.split(',')
          selectedAllergies.value = allergies.value
        } else {
          throw new Error('Failed to fetch allergies')
        }
      } catch (err) {
        error.value = 'An error occurred while fetching allergies.'
      } finally {
        loading.value = false
        console.log(selectedAllergies)
      }
    }
    const goToDietaryRestrictions = () => {
      router.push('/dietary-restrictions')
    }
    const logout = () => {
      localStorage.removeItem('loggedInUser')
      localStorage.removeItem('isLoggedIn')
      currentUsername.value = '' // Update reactive variable
      router.push('/') // Redirect to login page
    }

    onMounted(() => {
      fetchDietaryRestrictions()
      fetchAllergies()
    })

    return {
      dietaryRestrictions,
      allergies,
      loading,
      error,
      currentUsername,
      goToDietaryRestrictions,
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
  height: 100vh;
  background-color: #f5f5f5;
}

#profile-container {
  display: flex;
  background-color: #ffe0b2;
  color: #795548;
  border-radius: 8px;
  padding: 20px;
  max-width: 800px;
  width: 100%;
}

.profile-left {
  text-align: center;
  flex: 1;
  padding: 20px;
}

.icon {
  width: 150px;
  border-radius: 50%;
}

.username {
  color: #5d4037;
  margin-top: 15px;
  font-size: 1.8rem;
}

.profile-right {
  flex: 2;
  padding: 20px;
}

h2 {
  color: #5d4037;
  margin-bottom: 15px;
}

.profile-section {
  margin-bottom: 20px;
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
  background-color: #ffa726;
  color: #5d4037;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #ffcc80;
}

.logout-btn {
  background-color: #e57373;
}

.logout-btn:hover {
  background-color: #ef9a9a;
}

.redeem-btn {
  background-color: #4caf50;
}

.redeem-btn:hover {
  background-color: #66bb6a;
}
</style>
