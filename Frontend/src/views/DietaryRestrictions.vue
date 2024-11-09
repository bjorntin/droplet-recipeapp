<template>
  <div id="dietary-page">
    <div id="dietary-container">
      <div class="icon">
        <img src="../assets/icon.png" alt="icon" width="150px" />
      </div>
      <h1 class="title">Dietary Restrictions</h1>

      <!-- Tabs for Dietary Restrictions and Allergies -->
      <div class="tabs">
        <button
          v-if="!message"
          @click="activeTab = 'dietary'"
          :class="{ active: activeTab === 'dietary' }"
        >
          Meal Type
        </button>
        <button
          v-if="!message"
          @click="activeTab = 'allergies'"
          :class="{ active: activeTab === 'allergies' }"
        >
          Allergies
        </button>
      </div>

      <!-- Dietary Restrictions Form -->
      <form
        v-if="activeTab === 'dietary'"
        @submit.prevent="updateDietaryRestrictions"
        class="dietary-form"
      >
        <h3 v-if="!message">Select Meal Type(s):</h3>
        <div v-if="!message" class="checkbox-group">
          <div v-for="(restriction, index) in dietaryOptions" :key="index" class="checkbox-item">
            <input
              type="checkbox"
              :id="restriction"
              :value="restriction"
              v-model="selectedRestrictions"
            />
            <label :for="restriction">{{ restriction }}</label>
          </div>
        </div>
        <button type="submit" :disabled="loading" v-if="!message">
          {{ loading ? 'Updating...' : 'Update Meal Type' }}
        </button>
      </form>

      <!-- Allergies Form -->
      <form v-if="activeTab === 'allergies'" @submit.prevent="updateAllergies" class="dietary-form">
        <h3 v-if="!message">Select Allergies:</h3>
        <div v-if="!message" class="checkbox-group">
          <div v-for="(allergy, index) in allergyOptions" :key="index" class="checkbox-item">
            <input type="checkbox" :id="allergy" :value="allergy" v-model="selectedAllergies" />
            <label :for="allergy">{{ allergy }}</label>
          </div>
        </div>
        <button type="submit" :disabled="loading" v-if="!message">
          {{ loading ? 'Updating...' : 'Update Allergies' }}
        </button>
      </form>

      <div v-if="message" :class="['message', messageType]">{{ message }}</div>
      <button v-if="message" @click="goBackToProfile">Go back to profile page</button>
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
    const loading = ref(false)
    const error = ref(null)
    const dietaryOptions = [
      'Balanced',
      'High-Fiber',
      'High-Protein',
      'Low-Carb',
      'Low-Fat',
      'Low-Sodium'
    ]
    const allergyOptions = [
      'Alcohol-free',
      'Celery-free',
      'Crustacean-free',
      'Dairy-free',
      'Egg-free',
      'Fish-free',
      'Gluten-free',
      'Kidney-friendly',
      'Kosher',
      'Low-potassium',
      'Lupine-free',
      'Mustard-free',
      'No-oil-added',
      'No-sugar',
      'Paleo',
      'Peanut-free',
      'Pescatarian',
      'Pork-free',
      'Red-meat-free',
      'Sesame-free',
      'Shellfish-free',
      'Soy-free',
      'Sugar-conscious',
      'Tree-Nut-free',
      'Vegan',
      'Vegetarian',
      'Wheat-free'
    ]
    const selectedRestrictions = ref([])
    const selectedAllergies = ref([])
    const message = ref('')
    const messageType = ref('')
    const activeTab = ref('dietary')

    const fetchDietaryRestrictions = async () => {
      try {
        const response = await fetch('http://157.245.198.241:5000/api/dietary-info', {
          headers: { 'X-Username': localStorage.getItem('loggedInUser') }
        })
        if (response.ok) {
          const restrictions = await response.json()
          dietaryRestrictions.value = restrictions.split(',')
          selectedRestrictions.value = dietaryRestrictions.value
          
        } else {
          throw new Error('Failed to fetch dietary restrictions')
        }
      } catch (err) {
        error.value = 'An error occurred while fetching dietary restrictions.'
      } finally {
        loading.value = false
        console.log(selectedRestrictions)
      }
    }

    const fetchAllergies = async () => {
      try {
        const response = await fetch('http://157.245.198.241:5000/api/allergy-info', {
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

    const updateDietaryRestrictions = async () => {
      loading.value = true
      try {
        const result = await fetch('http://157.245.198.241:5000/api/dietary-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Username': localStorage.getItem('loggedInUser')
          },
          body: JSON.stringify({ DietaryInfo: selectedRestrictions.value })
        })
        if (result.ok) {
          message.value = 'Meal Type updated successfully!'
          messageType.value = 'success'
        } else {
          throw new Error('Failed to update dietary restrictions')
        }
      } catch (err) {
        message.value = 'An error occurred while updating dietary restrictions.'
        messageType.value = 'error'
      } finally {
        loading.value = false
        console.log(selectedRestrictions)
      }
    }

    const updateAllergies = async () => {
      loading.value = true
      try {
        const result = await fetch('http://157.245.198.241:5000/api/allergy-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Username': localStorage.getItem('loggedInUser')
          },
          body: JSON.stringify({ AllergyInfo: selectedAllergies.value })
        })
        if (result.ok) {
          message.value = 'Allergies updated successfully!'
          messageType.value = 'success'
        } else {
          throw new Error('Failed to update allergies')
        }
      } catch (err) {
        message.value = 'An error occurred while updating allergies.'
        messageType.value = 'error'
      } finally {
        loading.value = false
        console.log(selectedAllergies)
      }
    }

    const goBackToProfile = () => {
      router.push('/profile')
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
      message,
      messageType,
      dietaryOptions,
      allergyOptions,
      selectedRestrictions,
      selectedAllergies,
      updateDietaryRestrictions,
      updateAllergies,
      goBackToProfile,
      activeTab
    }
  }
}
</script>

<style scoped>
#dietary-page {
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding: 20px; */
  min-height: 100vh;
}

#dietary-container {
  background-color: #e0ebe4;
  color: #795548;
  border-radius: 8px;
  text-align: center;
  width: 70%;
  padding: 20px;
}

.title {
  margin-top: -5px;
  color: #5d4037;
}

.dietary-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h3 {
  margin-bottom: 1rem;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  max-height: 200px; /* Limit height for scrolling */
  overflow-y: auto; /* Enable vertical scroll */
  margin-bottom: 1rem;
  padding-right: 10px; /* Add padding to avoid scrollbar overlap */
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

input[type='checkbox'] {
  margin-right: 0.5rem;
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

.message {
  margin-top: 15px;
  margin-bottom: 15px;
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

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.tabs button {
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  background-color: #5e9b77;
  color: #e6e6e6;
  border: none;
  border-radius: 4px;
}

.tabs button.active {
  background-color: #3d6a52;
  font-weight: bold;
}
</style>
