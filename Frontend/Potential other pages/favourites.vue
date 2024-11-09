<template>
  <div class="favourites">
    <h1>Favourite Recipes</h1>
    <div v-if="favourites.length" class="recipe-list">
      <div v-for="recipe in favourites" :key="recipe.id" class="recipe-card">
        <div v-if="recipe.isEdamamRecipe == 0">
          <h3>{{ recipe.recipe_name }}</h3>
          <p>Made By: {{ recipe.username }}</p>
          <p>Prep Time: {{ formatTime(recipe.prep_time) }}</p>
          <p>Serving Size: {{ recipe.serving_size }}</p>
          <p>Ingredients: {{ recipe.ingredient_list }}</p>
          <div>
            <p>Steps:</p>
            <ol v-html="formatSteps(recipe.prep_steps)"></ol>
          </div>
        </div>
        <div v-else>
          <h3>{{ recipe.recipe_name }}</h3>
          <p>Calories: {{ Math.round(recipe.calories) }}</p>
          <p>Cooking Time: {{ Math.round(recipe.cooking_time) }}</p>
          <p>Source: {{ recipe.source }}</p>
          <a :href="recipe.url" target="_blank" class="view-recipe-link">View Recipe</a>
        </div>
        <div class="recipe-actions">
          <button class="action-button remove-button" @click="removeFromFavourites(recipe.id)">
            Remove from Favourites
          </button>
        </div>
      </div>
    </div>
    <div v-else class="no-favourites">
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
        const response = await fetch(`http://localhost:5000/api${url}`, options)
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
        for (const fav of result) {
          if (fav.isEdamamRecipe == 0) {
            const recipeDetails = await this.displayUserRecipe(fav.RecipeID)
            this.favourites.push({
              isEdamamRecipe: 0,
              id: recipeDetails[0].UserMadeRecipeID,
              username: recipeDetails[0].Username,
              recipe_name: recipeDetails[0].RecipeName,
              prep_time: recipeDetails[0].PrepTime,
              serving_size: recipeDetails[0].ServingSize,
              prep_steps: recipeDetails[0].PrepSteps,
              ingredient_list: recipeDetails[0].IngredientList
            })
          } else {
            try {
              const response = await axios.get(`/api/recipe/${fav.RecipeID}`, {
                params: { isEdamamRecipe: true }
              })
              this.favourites.push({
                isEdamamRecipe: 1,
                id: response.data.id,
                source: response.data.source,
                recipe_name: response.data.title,
                calories: response.data.calories,
                cooking_time: response.data.totalTime,
                url: response.data.url
              })
            } catch (error) {
              console.error('Error searching recipes:', error)
            }
          }
        }
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
      await this.makeRequest(`/favourites/${recipeId}`, 'DELETE')
      this.getFavourites()
    }
  }
}
</script>

<style scoped>
.favourites {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(120deg, #f5f5f5, #fff0e0);
  border-radius: 12px;
}

h1 {
  color: #5d4037;
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.no-favourites {
  text-align: center;
  color: #7d7d7d;
}

.recipe-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.recipe-card {
  background-color: #ffe0b2;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.recipe-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.recipe-actions {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

.action-button {
  padding: 5px 10px;
  margin-top: 10px;
  background-color: #ff7043;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #f4511e;
}

.view-recipe-link {
  color: #5d4037;
  text-decoration: none;
  font-weight: bold;
}

.view-recipe-link:hover {
  text-decoration: underline;
}
</style>
