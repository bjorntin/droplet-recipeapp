<template>
  <div id="points-redemption-page">
    <div id="redemption-container">
      <div class="icon">
        <img src="../assets/icon.png" alt="icon" width="150px" />
      </div>
      <h2 class="title">Points Redemption</h2>
      <p><strong>Username:</strong> {{ currentUsername }}</p>

      <!-- Display user's points balance -->
      <h4>Your Points Balance:</h4>
      <p v-if="pointsBalance >= 0">{{ pointsBalance }} Points</p>
      <p v-else>No points available.</p>

      <!-- Redemption options -->
      <h4>Available Redemption Options:</h4>
      <ul>
        <li v-for="option in redemptionOptions" :key="option.id">
          {{ option.description }} - {{ option.pointsRequired }} Points
          <button @click="redeemPoints(option)">Redeem</button>
        </li>
      </ul>

      <p v-if="redemptionMessage">{{ redemptionMessage }}</p>

      <!-- Button to navigate back to profile -->
      <button @click="goToProfile">Back to Profile</button>

      <!-- Logout Button -->
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    // Declare reactive variables
    const pointsBalance = ref(0)
    const redemptionOptions = ref([])
    const redemptionMessage = ref('')
    const currentUsername = ref(localStorage.getItem('loggedInUser'))

    // Function to fetch user points from the server
    const fetchUserPoints = async () => {
      try {
        const response = await fetch('http://157.245.198.241:5000/api/user-points', {
          headers: { 'X-Username': localStorage.getItem('loggedInUser') }
        })
        if (response.ok) {
          const data = await response.json()
          pointsBalance.value = data.points
        } else {
          throw new Error('Failed to fetch points balance')
        }
      } catch (err) {
        console.error(err)
      }
    }

    // Function to fetch redemption options from the server
    const fetchRedemptionOptions = async () => {
      // Mock redemption options; replace this with a server call if needed
      redemptionOptions.value = [
        { id: 1, description: '10% Off Voucher', pointsRequired: 100 },
        { id: 2, description: 'Free Coffee', pointsRequired: 50 },
        { id: 3, description: 'Gift Card', pointsRequired: 200 }
      ]
    }

    // Function to redeem points
    const redeemPoints = async (option) => {
      try {
        const response = await fetch('http://157.245.198.241:5000/api/redeem-points', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Username': localStorage.getItem('loggedInUser')
          },
          body: JSON.stringify({ pointsToRedeem: option.pointsRequired })
        })
        if (response.ok) {
          const result = await response.json()
          redemptionMessage.value = `Successfully redeemed ${option.pointsRequired} points for ${option.description}. Remaining Points: ${result.remainingPoints}.`
          pointsBalance.value = result.remainingPoints // Update balance
        } else {
          const errorData = await response.json()
          redemptionMessage.value = errorData.error || 'An error occurred while redeeming points.'
        }
      } catch (err) {
        redemptionMessage.value = 'An error occurred while redeeming points.'
        console.error(err)
      }
    }

    // Function to navigate back to the profile page
    const goToProfile = () => {
      router.push('/profile')
    }

    // Logout function
    const logout = () => {
      localStorage.removeItem('loggedInUser')
      localStorage.removeItem('isLoggedIn')
      currentUsername.value = ''
      router.push('/login')
    }

    // Fetch user points and redemption options when the component is mounted
    onMounted(() => {
      fetchUserPoints()
      fetchRedemptionOptions()
    })

    return {
      pointsBalance,
      redemptionOptions,
      redemptionMessage,
      currentUsername,
      goToProfile,
      logout,
      redeemPoints
    }
  }
}
</script>

<style scoped>
#points-redemption-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* padding: 20px; */
}

#redemption-container {
  background-color: #e0ebe4;
  color: #795548;
  border-radius: 8px;
  text-align: center;
  width: 60%;
  padding: 10px;
}

.title {
  color: #5d4037;
}

button {
  background-color: #5e9b77;
  color: #e6e6e6;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin: 10px;
  transition: background-color 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #4b8063;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.logout-btn {
  background-color: #e57373;
}

.logout-btn:hover {
  background-color: #ef9a9a;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #edf4ef;
  padding: 0.5rem;
  margin: 0rem 2rem 0.75rem 2rem;
  border-radius: 4px;
}
</style>
