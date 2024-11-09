<template>
  <div class="community-recipes">
    <h1>Community Recipes</h1>

    <div class="filters">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search recipes (use commas to search multiple terms, e.g. 'chicken, fish')"
          @input="debouncedSearch"
        />
      </div>
      <div class="filter-options">
        <select v-model="ratingFilter" class="rating-filter">
          <option value="0">All Ratings</option>
          <option value="5">5 Stars Only</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="1">1+ Stars</option>
          <option value="no">No Ratings</option>
        </select>
      </div>
      <div class="sort-options">
        <div class="sort-label">Sort by rating:</div>
        <div class="radio-group">
          <label class="radio-label">
            <input type="radio" v-model="sortDirection" value="highest" />
            <span class="radio-text">Highest Rated First</span>
          </label>
          <label class="radio-label">
            <input type="radio" v-model="sortDirection" value="lowest" />
            <span class="radio-text">Lowest Rated First</span>
          </label>
          <label class="radio-label">
            <input type="radio" v-model="sortDirection" value="none" />
            <span class="radio-text">No Sort</span>
          </label>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading recipes...</div>

    <div v-else-if="filteredRecipes.length === 0" class="no-results">
      No recipes found matching your search.
    </div>

    <div v-else class="recipes-grid">
      <div v-for="recipe in filteredRecipes" :key="recipe.UserMadeRecipeID" class="recipe-card">
        <img
          v-if="isRecipeFavourite(recipe.UserMadeRecipeID)"
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
        <h3>
          <strong>{{ recipe.RecipeName }}</strong>
        </h3>
        <div class="recipe-info">
          <p><strong>By:</strong> {{ recipe.Username }}</p>
          <p><strong>Prep Time:</strong> {{ recipe.PrepTime }}</p>
          <p><strong>Serving Size:</strong> {{ recipe.ServingSize }}</p>
          <div class="rating" v-if="recipe.AverageRating > 0">
            <span> Rating: {{ Number(recipe.AverageRating).toFixed(1) }} </span>
            <span
              v-for="(star, index) in 5"
              :key="index"
              :class="getStarClass(recipe.AverageRating, index)"
              class="fa fa-star"
            ></span>
            <span>({{ recipe.RatingCount }} reviews)</span>
          </div>
          <div class="rating" v-else>
            <span>No ratings yet</span>
          </div>
        </div>

        <!-- Reviews Section -->
        <div class="reviews-section">
          <button
            class="toggle-reviews"
            @click="toggleReviews(recipe.UserMadeRecipeID)"
            v-if="recipe.reviews && recipe.reviews.length > 0"
          >
            {{ showReviewsFor === recipe.UserMadeRecipeID ? 'Hide Reviews' : 'Show Reviews' }}
          </button>

          <div
            v-if="showReviewsFor === recipe.UserMadeRecipeID && recipe.reviews"
            class="reviews-list"
          >
            <div v-for="review in recipe.reviews" :key="review.ReviewID" class="review-item">
              <div class="review-header">
                <span class="review-author">{{ review.Username }}</span>
                <span class="review-rating">{{ '⭐'.repeat(review.Rating) }}</span>
                <span class="review-date">{{ review.ReviewDate }}</span>
              </div>
              <p class="review-description">{{ review.Description }}</p>
            </div>
          </div>
        </div>

        <!-- Review Form -->
        <div class="review-section" v-if="showReviewForm === recipe.UserMadeRecipeID">
          <h3>Add Review</h3>
          <div class="rating-input">
            <select v-model="newReview.rating">
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <textarea
            v-model="newReview.description"
            placeholder="Write your review here..."
          ></textarea>
          <div class="review-buttons">
            <button @click="submitReview(recipe.UserMadeRecipeID)">Submit Review</button>
            <button @click="showReviewForm = null">Cancel</button>
          </div>
        </div>

        <div class="recipe-actions">
          <button
            v-if="isLoggedIn && recipe.Username !== currentUsername"
            @click="showReviewForm = recipe.UserMadeRecipeID"
            class="action-button"
          >
            Add Review
          </button>
          <button @click="viewRecipeDetails(recipe)" class="action-button">View Details</button>
        </div>
      </div>
    </div>

    <!-- Recipe Details Modal -->
    <div v-if="selectedRecipe" class="modal">
      <div class="modal-content">
        <span class="close" @click="selectedRecipe = null">&times;</span>
        <h2>{{ selectedRecipe.RecipeName }}</h2>
        <div class="recipe-details">
          <h3>Ingredients:</h3>
          <pre>{{ selectedRecipe.IngredientList }}</pre>

          <h3>Preparation Steps:</h3>
          <pre>{{ selectedRecipe.PrepSteps }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { inject } from 'vue'

export default {
  name: 'CommunityRecipes',
  setup() {
    const isLoggedIn = inject('loginState')
    const currentUsername = inject('currentUsername')
    return { isLoggedIn, currentUsername }
  },
  data() {
    return {
      username: '',
      recipes: [],
      favourites: [],
      searchResults: [],
      searchQuery: '',
      sortDirection: 'none',
      selectedRecipe: null,
      showReviewForm: null,
      showReviewsFor: null,
      loading: false,
      ratingFilter: '0',
      newReview: {
        rating: 5,
        description: ''
      },
      searchTimeout: null
    }
  },
  computed: {
    filteredRecipes() {
  let result = [...this.recipes]

  // Apply search filter if there's a search query
  if (this.searchQuery) {
    const searchTerms = this.searchQuery
      .toLowerCase()
      .split(',')
      .map((term) => term.trim())
      .filter((term) => term.length > 0)

    result = result.filter((recipe) => {
      // Add null checks for recipe properties
      const recipeName = recipe.RecipeName ? recipe.RecipeName.toLowerCase() : ''
      const ingredients = recipe.IngredientList ? recipe.IngredientList.toLowerCase() : ''

      // Check if ALL search terms are present in either recipe name or ingredients
      return searchTerms.every(
        (term) => recipeName.includes(term) || ingredients.includes(term)
      )
    })
  }

  // Apply rating filter
  if (this.ratingFilter !== '0') {
    if (this.ratingFilter === 'no') {
      // Filter for recipes with no ratings (RatingCount === 0 or AverageRating === 0)
      result = result.filter((recipe) => !recipe.RatingCount || !recipe.AverageRating)
    } else {
      const minRating = Number(this.ratingFilter)
      result = result.filter((recipe) => {
        if (!recipe.AverageRating) return false
        if (this.ratingFilter === '5') {
          // For 5 stars, we want ratings that round to 5.0
          return recipe.AverageRating >= 4.5
        } else {
          // For other ratings, we want greater than or equal to
          return recipe.AverageRating >= minRating
        }
      })
    }
  }

  // Apply sorting based on radio button selection
  if (this.sortDirection === 'highest') {
    result.sort((a, b) => {
      // Handle cases where AverageRating might be undefined
      const aRating = a.AverageRating || 0
      const bRating = b.AverageRating || 0
      // Sort by average rating (descending)
      const ratingDiff = bRating - aRating
      if (ratingDiff !== 0) return ratingDiff
      // If ratings are equal, sort by number of ratings (descending)
      return (b.RatingCount || 0) - (a.RatingCount || 0)
    })
  } else if (this.sortDirection === 'lowest') {
    result.sort((a, b) => {
      // Handle cases where AverageRating might be undefined
      const aRating = a.AverageRating || 0
      const bRating = b.AverageRating || 0
      // Sort by average rating (ascending)
      const ratingDiff = aRating - bRating
      if (ratingDiff !== 0) return ratingDiff
      // If ratings are equal, sort by number of ratings (ascending)
      return (a.RatingCount || 0) - (b.RatingCount || 0)
    })
  }

  return result
},
    isRecipeFavourite() {
      return (recipeId) => this.favourites.some((fav) => fav.id === recipeId)
    }
  },
  methods: {
    debouncedSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        // No need to fetch recipes, just let the computed property handle filtering
      }, 300)
    },
    async fetchRecipes() {
      this.loading = true
      try {
        const response = await axios.get('/api/all-personal-recipes')
        this.recipes = response.data

        // Fetch reviews for each recipe
        for (let recipe of this.recipes) {
          const reviewsResponse = await axios.get(`/api/recipe-reviews/${recipe.UserMadeRecipeID}`)
          recipe.reviews = reviewsResponse.data
        }
      } catch (error) {
        console.error('Error fetching recipes:', error)
      } finally {
        this.loading = false
      }
    },
    toggleReviews(recipeId) {
      this.showReviewsFor = this.showReviewsFor === recipeId ? null : recipeId
    },
    viewRecipeDetails(recipe) {
      this.selectedRecipe = recipe
    },
    async submitReview(recipeId) {
      if (!this.isLoggedIn) {
        alert('Please log in to submit a review')
        return
      }

      try {
        await axios.post(
          '/api/rate-recipe',
          {
            userMadeRecipeId: recipeId,
            rating: Number(this.newReview.rating),
            description: this.newReview.description
          },
          {
            headers: {
              'X-Username': this.currentUsername
            }
          }
        )

        // Reset form and refresh recipes
        this.newReview = { rating: 5, description: '' }
        this.showReviewForm = null
        await this.fetchRecipes()
      } catch (error) {
        alert(error.response?.data?.error || 'Error submitting review')
        console.error('Error submitting review:', error)
      }
    },
    getStarClass(rating, index) {
      // Full star
      if (index < Math.floor(rating)) return 'checked'
      // Half star (only for one star, as rating is out of 5)
      if (index < Math.ceil(rating)) return 'fa-star-half-alt checked'
      // Empty star
      return ''
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
    async getFavourites() {
      this.favourites = []
      try {
        const result = await this.makeRequest('/favourites', 'GET')
        for (const fav of result) {
          const recipeDetails = await this.displayUserRecipe(fav.RecipeID)
          this.favourites.push({
            id: recipeDetails[0].UserMadeRecipeID,
            recipe_name: recipeDetails[0].RecipeName
          })
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
        isEdamamRecipe: false
      })

      this.favourites = [
        ...this.favourites,
        {
          id: recipeId,
          recipe_name: this.recipes.find((r) => r.UserMadeRecipeID === recipeId).RecipeName
        }
      ]
    },
    async removeFromFavourites(recipeId) {
      await this.makeRequest(`/favourites/${recipeId}`, 'DELETE')
      this.favourites = this.favourites.filter((fav) => fav.id !== recipeId)
    }
  },
  created() {
    this.username = localStorage.getItem('loggedInUser')
    this.getFavourites()
    this.fetchRecipes()
  }
}
</script>

<style scoped>
h1 {
  color: #5d4037;
}

/* Previous styles remain unchanged */
.community-recipes {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.loading,
.no-results {
  text-align: center;
  padding: 20px;
  color: #666;
}

.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.search-bar {
  flex: 1;
  min-width: 250px;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 15px;
  }

  .search-bar {
    width: 100%;
    order: -1; /* Makes search bar appear first */
  }

  .filter-options,
  .sort-options {
    width: 100%;
  }

  .filter-options select.rating-filter {
    width: 100%;
  }
}
.search-bar input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  line-height: normal;
}

.filter-options select.rating-filter {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  line-height: normal;
  margin: 0;
}

.rating-filter {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.sort-options {
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.sort-options label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.recipe-card {
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 25px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recipe-info {
  margin: 10px 0;
}

.recipe-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.action-button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  background-color: #5e9b77;
  color: #e6e6e6;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #4b8063;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.close {
  float: right;
  cursor: pointer;
  font-size: 24px;
}

.review-section {
  margin-top: 15px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.rating-input {
  margin-bottom: 10px;
}

.rating-input select {
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

textarea {
  width: 100%;
  min-height: 100px;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.review-buttons {
  display: flex;
  gap: 10px;
}

.reviews-section {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.toggle-reviews {
  background: none;
  border: none;
  color: #4caf50;
  cursor: pointer;
  padding: 5px 0;
  font-weight: bold;
}

.reviews-list {
  margin-top: 10px;
}

.review-item {
  background: #f9f9f9;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.review-author {
  font-weight: bold;
}

.review-date {
  color: #666;
  font-size: 0.9em;
}

.review-description {
  margin: 5px 0 0;
  color: #333;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}

.rating {
  display: flex;
  gap: 5px;
  align-items: center;
}
.rating .fa-star.checked {
  color: gold;
}

.rating .fa-star-half-o.checked {
  color: gold;
}

.rating .fa-star {
  color: lightgray;
}
.sort-options {
  white-space: nowrap;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.sort-label {
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 0;
}

.radio-text {
  color: #444;
}

input[type='radio'] {
  margin: 0;
  cursor: pointer;
}

.fav-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
