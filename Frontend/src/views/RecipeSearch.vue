<template>
  <div class="recipe-search">
    <h1>Recipe Search</h1>
    <div class="search-form">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Enter ingredients or recipe name"
        @keyup.enter="searchRecipes"
      />
      <div class="filter-options">
        <label class="filter-checkbox">
          <input type="checkbox" v-model="applyHealthFilters" />
          Apply My Dietary & Allergy Filters
        </label>
      </div>
      <button @click="searchRecipes" :disabled="isLoading">
        {{ isLoading ? 'Searching...' : 'Search' }}
      </button>
    </div>
    <div v-if="searchResults.length">
      <div id="search-results">
        <h2>Search Results</h2>
        <button v-if="isEDAMAM" @click="displayUserRecipes">User Recipes</button>
        <button v-else @click="searchRecipes" :disabled="isLoading">EDAMAM Recipes</button>
      </div>
      <ul class="results" v-if="isEDAMAM && !isLoading">
        <li v-for="recipe in searchResults" :key="recipe.id">
          <img
            v-if="favourites.some((fav) => fav.recipe_name === recipe.title)"
            src="../assets/favourite_checked.png"
            alt="fav-icon"
            class="fav-icon"
            @click="removeFromFavourites(recipe.id)"
          />
          <img
            v-else
            src="../assets/favourite_unchecked.png"
            alt="fav-icon"
            class="fav-icon"
            @click="addToFavourites(recipe.id)"
          />
          <div class="recipe-info">
            <h4>
              <strong>{{ recipe.title }}</strong>
            </h4>
            <p>Calories: {{ Math.round(recipe.calories) }}</p>
            <p>Cooking Time: {{ Math.round(recipe.calories) }}</p>
            <p>Source: {{ recipe.source }}</p>
            <a :href="recipe.url" target="_blank">View Recipe</a>
          </div>
          <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
        </li>
      </ul>
      <ul class="results" v-else>
        <li v-for="recipe in searchResults" :key="recipe.UserMadeRecipeID">
          <img
            v-if="favourites.some((fav) => fav.recipe_name === recipe.RecipeName)"
            src="../assets/favourite_checked.png"
            alt="fav-icon"
            class="fav-icon"
            @click="removeFromFavourites(recipe.UserMadeRecipeID)"
          />
          <img
            v-else
            src="../assets/favourite_unchecked.png"
            alt="fav-icon"
            class="fav-icon"
            @click="addToFavourites(recipe.UserMadeRecipeID)"
          />
          <div class="recipe-info">
            <h4>
              <strong>{{ recipe.RecipeName }}</strong>
            </h4>
            <p>Made By: {{ recipe.Username }}</p>
            <p>Prep Time: {{ formatTime(recipe.PrepTime) }}</p>
            <p>Serving Size: {{ recipe.ServingSize }}</p>
            <p>Ingredients: {{ recipe.IngredientList }}</p>
            <div style="margin-bottom: 20px">
              <p>Steps:</p>
              <ol v-html="formatSteps(recipe.PrepSteps)"></ol>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'RecipeSearch',
  data() {
    return {
      username: '',
      searchQuery: '',
      searchResults: [],
      isLoading: false,
      isEDAMAM: true,
      favourites: [],
      applyHealthFilters: false,
      dietaryRestrictions: [],
      allergies: [],
      validHealthLabels: []
    }
  },
  mounted() {
    this.username = localStorage.getItem('loggedInUser')
    this.getFavourites()
    this.getUserHealthInfo()
    this.getValidHealthLabels()
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
    async getValidHealthLabels() {
      try {
        const response = await axios.get('/api/valid-health-labels')
        this.validHealthLabels = response.data
      } catch (error) {
        console.error('Error fetching valid health labels:', error)
      }
    },
    async getUserHealthInfo() {
      try {
        const [dietaryResponse, allergyResponse] = await Promise.all([
          this.makeRequest('/dietary-info', 'GET'),
          this.makeRequest('/allergy-info', 'GET')
        ])

        this.dietaryRestrictions = dietaryResponse ? dietaryResponse.split(',').filter(Boolean) : []
        this.allergies = allergyResponse?.Allergies
          ? allergyResponse.Allergies.split(',').filter(Boolean)
          : []

        console.log('Dietary Restrictions:', this.dietaryRestrictions)
        console.log('Allergies:', this.allergies)
      } catch (error) {
        console.error('Error fetching health info:', error)
      }
    },

    async searchRecipes() {
  this.isEDAMAM = true
  this.isLoading = true
  try {
    // Start with base query parameter
    const params = new URLSearchParams({
      query: this.searchQuery
    })

    // Add filters if checkbox is checked
    if (this.applyHealthFilters) {
      // Add allergies as health parameters
      if (this.allergies.length > 0) {
        this.allergies.forEach((allergy) => {
          params.append('health', allergy.toLowerCase())
        })
      }

      // Add dietary restrictions as diet parameters
      if (this.dietaryRestrictions.length > 0) {
        this.dietaryRestrictions.forEach((diet) => {
          params.append('diet', diet.toLowerCase())
        })
      }
    }

    const response = await axios.get(`http://157.245.198.241:5000/api/search-recipes?${params.toString()}`)
    this.searchResults = response.data
  } catch (error) {
    console.error('Error searching recipes:', error)
  } finally {
    this.isLoading = false
  }
},
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
        return { error: 'An error occurred (search recipes).' }
      }
    },
    async displayUserRecipes() {
      this.isEDAMAM = false
      try {
        const result = await this.makeRequest('/all-personal-recipes', 'GET')
        console.log(result)
        this.searchResults = result
      } catch (error) {
        console.error('Error fetching items:', error)
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
              id: recipeDetails[0].UserMadeRecipeID,
              recipe_name: recipeDetails[0].RecipeName
            })
          } else {
            try {
              const response = await axios.get(`/api/recipe/${fav.RecipeID}`, {
                params: { isEdamamRecipe: true }
              })
              this.favourites.push({
                id: response.data.id,
                recipe_name: response.data.title
              })
            } catch (error) {
              console.error('Error searching recipes:', error)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching favourites:', error)
      }
      console.log(this.favourites)
    },
    async displayUserRecipe(recipeId) {
      try {
        const result = await this.makeRequest(`/personal-recipes/${recipeId}`, 'GET')
        return result
      } catch (error) {
        console.error('Error fetching recipe:', error)
      }
    },
    async addToFavourites(recipeId) {
      await this.makeRequest('/favourites', 'POST', {
        recipeId: recipeId,
        isEdamamRecipe: this.isEDAMAM
      })

      const recipeToAdd = this.isEDAMAM
        ? this.searchResults.find((recipe) => recipe.id === recipeId)
        : this.searchResults.find((recipe) => recipe.UserMadeRecipeID === recipeId)

      if (recipeToAdd) {
        this.favourites.push({
          id: recipeToAdd.id || recipeToAdd.UserMadeRecipeID,
          recipe_name: recipeToAdd.title || recipeToAdd.RecipeName
        })
      }
    },
    async removeFromFavourites(recipeId) {
      await this.makeRequest(`/favourites/${recipeId}`, 'DELETE')
      this.favourites = this.favourites.filter((fav) => fav.id !== recipeId)
    }
  }
}
</script>

<style scoped>
.recipe-search {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1,
h2 {
  color: #5d4037;
}

.search-form {
  margin-bottom: 20px;
}

input {
  padding: 10px;
  width: 70%;
  border: 1px solid #795548;
  border-radius: 4px;
  margin-right: 5px;
}

.filter-options {
  margin: 10px 0;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5d4037;
  cursor: pointer;
}

.filter-checkbox input[type='checkbox'] {
  width: auto;
  cursor: pointer;
}

button {
  padding: 10px 20px;
  background-color: #5e9b77;
  color: #e6e6e6;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #4b8063;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  padding: 10px;
  background-color: #e0ebe4;
  border-radius: 4px;
  display: flex;
  align-items: flex-start;
}

.recipe-info {
  flex: 1;
  /* margin-bottom: 20px; */
  margin: 10px;
}

.recipe-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-left: auto;
  border-radius: 4px;
}

#search-results {
  display: flex;
  align-items: center;
}

#search-results button {
  margin-left: 20px;
}

#fav-button {
  margin-left: 20px;
  padding: 10px;
  font-size: 0.8em;
}

.fav-icon {
  width: 24px;
  height: 24px;
  object-fit: cover;
  margin-left: auto;
  border-radius: 4px;
  margin-top: 16px;
  margin-right: 10px;
  cursor: pointer;
}
</style>
