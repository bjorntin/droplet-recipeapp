<template>
  <div class="favourites">
    <h1>Favourite Recipes</h1>
    <div v-if="favourites.length" class="recipe-list">
      <div v-for="recipe in favourites" :key="recipe.id" class="recipe-card">
        <div v-if="recipe.isEdamamRecipe == 0">
          <h4>
            <strong>{{ recipe.recipe_name }}</strong>
          </h4>
          <p>Made By: {{ recipe.username }}</p>
          <p>Prep Time: {{ formatTime(recipe.prep_time) }}</p>
          <p>Serving Size: {{ recipe.serving_size }}</p>
          <p>Ingredients: {{ recipe.ingredient_list }}</p>
          <div>
            <p>Steps:</p>
            <!-- Use v-html to render the formatted steps -->
            <ol v-html="formatSteps(recipe.prep_steps)"></ol>
          </div>
        </div>
        <div v-else>
          <h4>
            <strong>{{ recipe.recipe_name }}</strong>
          </h4>
          <p>Calories: {{ Math.round(recipe.calories) }}</p>
          <p>Cooking Time: {{ Math.round(recipe.cooking_time) }}</p>
          <p>Source: {{ recipe.source }}</p>
          <a :href="recipe.url" target="_blank">View Recipe</a>
        </div>
        <div class="recipe-actions">
          <button @click="removeFromFavourites(recipe.id)">Remove from Favourites</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>You haven't added any favourites yet.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Favourites',
  data() {
    return {
      username: '',
      favourites: []
    }
  },
  mounted() {
    this.username = localStorage.getItem('loggedInUser')
    this.getFavourites()
  },
  setup() {
    const formatTime = (timeString) => {
      if (!timeString || typeof timeString !== 'string') return 'N/A'
      const [hours, minutes] = timeString.split(':').map(Number)
      if (hours > 0) {
        return `${hours}h ${minutes}m`
      } else {
        return `${minutes}m`
      }
    }

    const formatSteps = (steps) => {
      if (!steps) return ''
      return steps
        .split('\n')
        .map((step) => `<li>${step}</li>`)
        .join('')
    }

    return {
      formatTime,
      formatSteps
    }
  },
  methods: {
    async makeRequest(url, method, body = null) {
      const headers = {
        'Content-Type': 'application/json',
        'X-Username': this.username
      }
      const options = { method, headers }
      if (body) options.body = JSON.stringify(body)
      try {
        const response = await fetch(`http://157.245.198.241:5000/api${url}`, options)
        return await response.json()
      } catch (error) {
        console.error('Error during fetch:', error)
        return { error: 'An error occurred (Shopping List).' }
      }
    },
    async getFavourites() {
      this.favourites = []
      try {
        const result = await this.makeRequest('/favourites', 'GET')
        console.log('Raw favorites from API:', result) // Added log

        // Map each favorite to a promise to process recipes concurrently
        const favouritePromises = result.map(async (fav) => {
          console.log('Processing favorite:', fav) // Added log
          
          if (fav.isEdamamRecipe == 0) {
            const recipeDetails = await this.displayUserRecipe(fav.RecipeID)
            console.log('User recipe details:', recipeDetails) // Added log
            return {
              isEdamamRecipe: 0,
              id: recipeDetails[0].UserMadeRecipeID,
              username: recipeDetails[0].Username,
              recipe_name: recipeDetails[0].RecipeName,
              prep_time: recipeDetails[0].PrepTime,
              serving_size: recipeDetails[0].ServingSize,
              prep_steps: recipeDetails[0].PrepSteps,
              ingredient_list: recipeDetails[0].IngredientList
            }
          } else {
            try {
              const response = await axios.get(`/api/recipe/${fav.RecipeID}`, {
                params: { isEdamamRecipe: true }
              })
              console.log('EDAMAM recipe response:', response.data) // Added log
              
              const edamamRecipe = {
                isEdamamRecipe: 1,
                id: response.data.id,
                source: response.data.source,
                recipe_name: response.data.title,
                calories: response.data.calories,
                cooking_time: response.data.totalTime,
                url: response.data.url
              }
              console.log('Formatted EDAMAM recipe:', edamamRecipe) // Added log
              return edamamRecipe
            } catch (error) {
              console.error('Error fetching EDAMAM recipe:', error)
              console.log('Failed recipe ID:', fav.RecipeID) // Added log
            }
          }
        })

        // Wait for all recipes to be fetched before updating the favourites array
        const processedFavorites = await Promise.all(favouritePromises)
        console.log('Processed favorites before filtering:', processedFavorites) // Added log
        
        // Filter out any undefined entries (from failed requests)
        this.favourites = processedFavorites.filter(Boolean)
        console.log('Final favorites array:', this.favourites) // Added log
      } catch (error) {
        console.error('Error fetching favourites:', error)
      }
    },
    async displayUserRecipe(recipeId) {
      try {
        const result = await this.makeRequest(`/personal-recipes/${recipeId}`, 'GET')
        return result
      } catch (error) {
        console.error('Error fetching recipe:', error)
      }
    },
    async removeFromFavourites(recipeId) {
      console.log('Removing recipe with ID:', recipeId) // Added log
      // Remove the recipe from the `favourites` array directly in the UI
      this.favourites = this.favourites.filter((recipe) => recipe.id !== recipeId)
      console.log('Updated favorites after removal:', this.favourites) // Added log

      // Send the delete request to the API
      await this.makeRequest(`/favourites/${recipeId}`, 'DELETE')
    }
  }
}
</script>

<style scoped>
.favourites {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #5d4037;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  padding: 10px;
  background-color: #ffe0b2;
  border-radius: 4px;
}

button {
  padding: 5px 10px;
  margin-top: 10px;
  background-color: #5e9b77;
  color: #e6e6e6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3d6a52;
}

.recipe-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.recipe-card {
  background-color: #e0ebe4;
  border-radius: 8px;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.recipe-actions {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
}
</style>
