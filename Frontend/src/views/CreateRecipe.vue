<template>
  <div class="create-recipe">
    <h1>Create New Recipe</h1>
    <!-- Form for creating a new recipe -->
    <form @submit.prevent="createRecipe">
      <div>
        <label for="recipeName">Recipe Name:</label>
        <input v-model="recipe.recipeName" id="recipeName" required />
      </div>
      <div class="prep-time">
        <label>Preparation Time: Hours/Minutes</label>
        <div class="time-inputs">
          <input
            v-model.number="prepTimeHours"
            type="number"
            min="0"
            placeholder="Hours"
            required
          />
          <input
            v-model.number="prepTimeMinutes"
            type="number"
            min="0"
            max="59"
            placeholder="Minutes"
            required
          />
        </div>
      </div>
      <div>
        <label for="servingSize">Serving Size:</label>
        <input v-model.number="recipe.servingSize" id="servingSize" type="number" required />
      </div>
      <div>
        <label for="prepSteps">Preparation Steps:</label>
        <textarea v-model="recipe.prepSteps" id="prepSteps" required></textarea>
      </div>
      <div>
        <label for="ingredientList">Ingredients (comma-separated):</label>
        <textarea v-model="recipe.ingredientList" id="ingredientList" required></textarea>
      </div>
      <button type="submit">Create Recipe</button>
    </form>
    <!-- Message to show success or error -->
    <p v-if="message" :class="{ success: isSuccess, error: !isSuccess }">{{ message }}</p>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    // Initial state for the recipe form
    const initialRecipeState = {
      recipeName: '',
      prepTime: '',
      servingSize: null,
      prepSteps: '',
      ingredientList: ''
    }

    // Reactive variables
    const recipe = ref({ ...initialRecipeState })
    const prepTimeHours = ref(0)
    const prepTimeMinutes = ref(0)
    const message = ref('')
    const isSuccess = ref(false)

    // Function to create a unique identifier
    const createUniqueId = () => {
      return Date.now().toString(36) + Math.random().toString(36).substr(2)
    }

    // Function to create a new recipe
    const createRecipe = async () => {
      const recipeId = createUniqueId()
      console.log(`Starting recipe creation. Recipe ID: ${recipeId}`)

      // Check if user is logged in
      const username = localStorage.getItem('loggedInUser')
      if (!username) {
        console.error(`Recipe creation failed. Recipe ID: ${recipeId}. Error: User not logged in`)
        message.value = 'Please log in to create a recipe.'
        isSuccess.value = false
        return
      }

      // Format prep time as "HH:MM"
      recipe.value.prepTime = `${prepTimeHours.value.toString().padStart(2, '0')}:${prepTimeMinutes.value.toString().padStart(2, '0')}`

      console.log(
        `Sending recipe creation request. Recipe ID: ${recipeId}. Recipe data:`,
        JSON.stringify(recipe.value, null, 2)
      )

      try {
        // Send POST request to create recipe
        const response = await fetch('http://157.245.198.241:5000/api/personal-recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Username': username
          },
          body: JSON.stringify(recipe.value)
        })

        if (response.ok) {
          // Recipe created successfully
          const createdRecipe = await response.json()
          console.log(
            `Recipe created successfully. Recipe ID: ${recipeId}. Created recipe:`,
            JSON.stringify(createdRecipe, null, 2)
          )
          message.value = 'Recipe created successfully!'
          isSuccess.value = true
          // Reset form
          recipe.value = { ...initialRecipeState }
          prepTimeHours.value = 0
          prepTimeMinutes.value = 0
        } else {
          // Handle error from server
          const error = await response.json()
          console.error(`Recipe creation failed. Recipe ID: ${recipeId}. Server error:`, error)
          message.value = `Failed to create recipe: ${error.error || 'Unknown error'}`
          isSuccess.value = false
        }
      } catch (error) {
        // Handle network or other errors
        console.error(
          `Recipe creation failed. Recipe ID: ${recipeId}. Network or other error:`,
          error
        )
        message.value = 'An error occurred. Please try again.'
        isSuccess.value = false
      }
    }

    // Return variables and functions to be used in the template
    return {
      recipe,
      prepTimeHours,
      prepTimeMinutes,
      message,
      isSuccess,
      createRecipe
    }
  }
}
</script>

<style scoped>
h1 {
  color: #5d4037;
}

/* Styles remain unchanged */
.create-recipe {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 10px;
}

input,
textarea {
  width: 100%;
  padding: 5px;
  margin-top: 5px;
}

.prep-time {
  margin-top: 10px;
}

.time-inputs {
  display: flex;
  gap: 10px;
}

.time-inputs input {
  width: 50%;
}

button {
  margin-top: 20px;
  padding: 10px;
  background-color: #5e9b77;
  color: #e6e6e6;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #4b8063;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
