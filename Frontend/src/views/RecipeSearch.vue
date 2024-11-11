<template>
  <div class="page-display">
    <h1>🍲 Recipe Search</h1>

    <div class="main-card">
      <div class="main-card-items row">
        <div class="col-12 col-md-8" style="margin-bottom:20px">
        <input style="min-width:100px; width: 100%"
          type="text"
          v-model="searchQuery"
          placeholder="Enter ingredients or recipe name"
          @keyup.enter="searchRecipes"
        />
        </div>
        <!-- <div class="filter-options">
          <label class="filter-checkbox">
            <input type="checkbox" v-model="applyHealthFilters" />
            Apply My Dietary Restrictions
          </label>
        </div> -->
        <label class="col-7 col-md-2 filter-checkbox">
          <div class="inline"><input type="checkbox" v-model="applyHealthFilters" />
          Apply My Dietary Restrictions</div>
        </label>
        <button class="col-5 col-md-2" @click="searchRecipes" :disabled="isLoading">
          {{ isLoading ? 'Searching...' : 'Search' }}
        </button>
      </div>
    </div>

    <div v-if="searchResults.length" class="results-section">
      <h2>Search Results</h2>
      <button v-if="isEDAMAM" @click="displayUserRecipes" class="toggle-button">User Recipes</button>
      <button v-else @click="searchRecipes" :disabled="isLoading" class="toggle-button">EDAMAM Recipes</button>
      <ul class="results row" style="margin-bottom:20px" v-if="isEDAMAM && !isLoading">
        <div v-for="recipe in searchResults" :key="recipe.id" class="col-12 col-md-6"  style="margin-bottom:20px">
        <li class="recipe-item">
          
          <!-- Favourite icon and recipe info -->
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
            @click="addToFavourites(recipe)"
          />
          <div class="recipe-info">
            <h4><strong>{{ recipe.title }}</strong></h4>
            <p>Calories: {{ Math.round(recipe.calories) }}</p>
            <p>Cooking Time: {{ Math.round(recipe.totalTime) }} mins</p>
            <p>Source: {{ recipe.source }}</p>
            <a :href="recipe.url" target="_blank" class="recipe-link">View Recipe</a>
          </div>
          <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
          
        </li>
      </div>
      </ul>
      <!-- User-made recipes -->
      <ul class="results row" v-else>
        <div v-for="recipe in searchResults" :key="recipe.UserMadeRecipeID" class="col-12 col-md-6"  style="margin-bottom:20px">
        <li class="recipe-item">
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
            @click="addToFavourites(recipe)"
          />
          <div class="recipe-info">
            <h4><strong>{{ recipe.RecipeName }}</strong></h4>
            <p>Made By: {{ recipe.Username }}</p>
            <p>Prep Time: {{ formatTime(recipe.PrepTime) }}</p>
            <p>Serving Size: {{ recipe.ServingSize }}</p>
            <p>Ingredients: {{ recipe.IngredientList }}</p>
            <p>Steps:</p>
            <ol v-html="formatSteps(recipe.PrepSteps)"></ol>
          </div>
        </li>
        </div>
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
        console.log('Search results:', this.searchResults)
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
        console.log('User recipes:', result)
        this.searchResults = result
      } catch (error) {
        console.error('Error fetching items:', error)
      }
    },
    async getFavourites() {
      this.favourites = []
      try {
        const result = await this.makeRequest('/favourites', 'GET')
        console.log('Raw favorites from API:', result)
        for (const fav of result) {
          if (fav.isEdamamRecipe == 0) {
            const recipeDetails = await this.displayUserRecipe(fav.RecipeID)
            console.log('User recipe details:', recipeDetails)
            this.favourites.push({
              id: recipeDetails[0].UserMadeRecipeID,
              recipe_name: recipeDetails[0].RecipeName
            })
          } else {
            try {
              const response = await axios.get(`http://157.245.198.241:5000/api/recipe/${fav.RecipeID}`, {
                params: { isEdamamRecipe: true }
              })
              console.log('EDAMAM recipe response:', response.data)
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
      console.log('Final favourites array:', this.favourites)
    },
    async displayUserRecipe(recipeId) {
      try {
        const result = await this.makeRequest(`/personal-recipes/${recipeId}`, 'GET')
        return result
      } catch (error) {
        console.error('Error fetching recipe:', error)
      }
    },
    async addToFavourites(recipe) {
      console.log('Adding to favorites. Recipe:', recipe)
      console.log('Is EDAMAM recipe:', this.isEDAMAM)

      const recipeId = this.isEDAMAM ? recipe.id : recipe.UserMadeRecipeID
      
      await this.makeRequest('/favourites', 'POST', {
        recipeId: recipeId,
        isEdamamRecipe: this.isEDAMAM
      })

      if (this.isEDAMAM) {
        this.favourites.push({
          id: recipe.id,
          recipe_name: recipe.title,
          source: recipe.source,
          calories: recipe.calories,
          cooking_time: recipe.totalTime,
          url: recipe.url,
          isEdamamRecipe: 1
        })
      } else {
        this.favourites.push({
          id: recipe.UserMadeRecipeID,
          recipe_name: recipe.RecipeName,
          isEdamamRecipe: 0
        })
      }
      console.log('Updated favorites array:', this.favourites)
    },
    async removeFromFavourites(recipeId) {
      await this.makeRequest(`/favourites/${recipeId}`, 'DELETE')
      this.favourites = this.favourites.filter((fav) => fav.id !== recipeId)
    }
  }
}
</script>

<style scoped>
@import "../assets/style.css";

input[type="text"] {
  width: 60%;
}

input[type='checkbox'] + label {
  display: inline-block;
}

.inline {
  width: unset;
  margin: 0 0.5em 0 0;
  vertical-align: middle;
  color: #5d4037;
}



/* .filter-options {
  margin: 10px 0;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  color: #3d6a52;
  cursor: pointer;
} */

/* .search-button {
  padding: 10px 20px;
  background-color: #5e9b77;
  color: #e6e6e6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #4b8063;
} */

.results-section h2 {
  color: #4b8063;
  margin-top: 20px;
}

.toggle-button {
  margin: 10px 0;
  padding: 8px 12px;
  background-color: #5e9b77;
  color: #e6e6e6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

ul.results {
  list-style-type: none;
  padding: 0;
}

.recipe-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  background-color: #e0ebe4;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.recipe-info {
  flex: 1;
  margin-right: 10px;
}

.recipe-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-left: 10px;
}

.recipe-link {
  color: #4b8063;
  text-decoration: underline;
}

.fav-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-right: 15px;
}

.fav-icon:hover {
  opacity: 0.8;
}

.main-card-items{
  gap: 0px !important;
}
</style>