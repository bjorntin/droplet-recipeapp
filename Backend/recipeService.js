const axios = require('axios')
const dotenv = require('dotenv')
const { query } = require('./db')

dotenv.config()

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY
const EDAMAM_API_URL = 'https://api.edamam.com/api/recipes/v2'

async function searchEdamamRecipes(searchQuery, healthLabels = [], dietLabels = []) {
  try {
    // Convert labels to arrays if they're strings
    const healthLabelsArray = Array.isArray(healthLabels) 
      ? healthLabels 
      : healthLabels.split(',').map(label => label.trim());

    const dietLabelsArray = Array.isArray(dietLabels)
      ? dietLabels
      : dietLabels.split(',').map(label => label.trim());

    // Create params object
    const params = new URLSearchParams({
      type: 'public',
      q: searchQuery,
      app_id: EDAMAM_APP_ID,
      app_key: EDAMAM_APP_KEY
    });

    // Add each health label individually
    healthLabelsArray.forEach(label => {
      params.append('health', label);
    });

    // Add each diet label individually
    dietLabelsArray.forEach(label => {
      params.append('diet', label);
    });

    const response = await axios.get(EDAMAM_API_URL, { params })

    return response.data.hits.map((hit) => ({
      id: hit.recipe.uri.split('_')[1],
      title: hit.recipe.label,
      image: hit.recipe.image,
      source: hit.recipe.source,
      url: hit.recipe.url,
      ingredientLines: hit.recipe.ingredientLines,
      calories: hit.recipe.calories,
      totalTime: hit.recipe.totalTime,
      healthLabels: hit.recipe.healthLabels,
      dietLabels: hit.recipe.dietLabels,
      nutrients: {
        protein: hit.recipe.totalNutrients.PROCNT,
        fat: hit.recipe.totalNutrients.FAT,
        carbs: hit.recipe.totalNutrients.CHOCDF,
        fiber: hit.recipe.totalNutrients.FIBTG
      },
      isEdamamRecipe: true
    }))
  } catch (error) {
    console.error('Error searching Edamam recipes:', error.response?.data || error.message)
    throw new Error('Failed to search Edamam recipes')
  }
}

async function searchUserMadeRecipes(searchQuery) {
  try {
    const results = await query(
      `SELECT * FROM UserMadeRecipe 
       WHERE RecipeName LIKE ? OR IngredientList LIKE ?`,
      [`%${searchQuery}%`, `%${searchQuery}%`]
    )
    return results.map((recipe) => ({
      ...recipe,
      isEdamamRecipe: false
    }))
  } catch (error) {
    console.error('Error searching user-made recipes:', error)
    throw new Error('Failed to search user-made recipes')
  }
}

async function searchAllRecipes(searchQuery, healthLabels = [], dietLabels = []) {
  const [edamamRecipes, userMadeRecipes] = await Promise.all([
    searchEdamamRecipes(searchQuery, healthLabels, dietLabels),
    searchUserMadeRecipes(searchQuery)
  ])
  return [...edamamRecipes, ...userMadeRecipes]
}

async function getRecipesByIngredients(ingredients, healthLabels = [], dietLabels = []) {
  try {
    const searchQuery = ingredients.join(',')
    return await searchAllRecipes(searchQuery, healthLabels, dietLabels)
  } catch (error) {
    console.error('Error getting recipes by ingredients:', error)
    throw new Error('Failed to get recipes by ingredients')
  }
}

async function getUserMadeRecipe(recipeId) {
  try {
    const [recipe] = await query('SELECT * FROM UserMadeRecipe WHERE UserMadeRecipeID = ?', [
      recipeId
    ])
    return recipe ? { ...recipe, isEdamamRecipe: false } : null
  } catch (error) {
    console.error('Error getting user-made recipe:', error)
    throw new Error('Failed to get user-made recipe')
  }
}

async function getEdamamRecipe(recipeId) {
  try {
    const response = await axios.get(`${EDAMAM_API_URL}/${recipeId}`, {
      params: {
        type: 'public',
        app_id: EDAMAM_APP_ID,
        app_key: EDAMAM_APP_KEY
      }
    })
    const recipe = response.data.recipe
    return {
      id: recipeId,
      title: recipe.label,
      image: recipe.image,
      source: recipe.source,
      url: recipe.url,
      ingredientLines: recipe.ingredientLines,
      calories: recipe.calories,
      totalTime: recipe.totalTime,
      healthLabels: recipe.healthLabels,
      dietLabels: recipe.dietLabels,
      nutrients: {
        protein: recipe.totalNutrients.PROCNT,
        fat: recipe.totalNutrients.FAT,
        carbs: recipe.totalNutrients.CHOCDF,
        fiber: recipe.totalNutrients.FIBTG
      },
      isEdamamRecipe: true
    }
  } catch (error) {
    console.error('Error getting Edamam recipe:', error)
    throw new Error('Failed to get Edamam recipe')
  }
}

async function getRecipe(recipeId, isEdamamRecipe) {
  return isEdamamRecipe ? getEdamamRecipe(recipeId) : getUserMadeRecipe(recipeId)
}

function getValidDietLabels() {
  return [
    'balanced',
    'high-fiber',
    'high-protein',
    'low-carb',
    'low-fat',
    'low-sodium'
  ]
}

function getValidHealthLabels() {
  return [
    'alcohol-free',
    'celery-free',
    'crustacean-free',
    'dairy-free',
    'egg-free',
    'fish-free',
    'gluten-free',
    'kidney-friendly',
    'kosher',
    'low-potassium',
    'lupine-free',
    'mustard-free',
    'no-oil-added',
    'no-sugar',
    'paleo',
    'peanut-free',
    'pescatarian',
    'pork-free',
    'red-meat-free',
    'sesame-free',
    'shellfish-free',
    'soy-free',
    'sugar-conscious',
    'tree-nut-free',
    'vegan',
    'vegetarian',
    'wheat-free'
  ]
}

module.exports = {
  searchAllRecipes,
  getRecipesByIngredients,
  getRecipe,
  getValidHealthLabels,
  getValidDietLabels
}
