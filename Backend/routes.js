const express = require('express')
const recipeService = require('./recipeService')
const userService = require('./userService')  // This path is correct as userService.js re-exports all services

const router = express.Router()

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  const username = req.header('X-Username')
  if (!username) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  req.username = username
  next()
}

// User routes
router.post('/signup', async (req, res) => {
  try {
    const { username, password, dietaryRestrictions } = req.body
    const user = await userService.createUser(username, password, dietaryRestrictions)
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await userService.loginUser(username, password)
    res.json(user)
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

// New route to check username availability
router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params
    const exists = await userService.checkUsernameExists(username)
    res.json({ exists })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Recipe routes
router.get('/search-recipes', async (req, res) => {
  try {
    const { query, health, diet } = req.query
    const recipes = await recipeService.searchAllRecipes(
      query,
      health ? (Array.isArray(health) ? health : [health]) : [],
      diet ? (Array.isArray(diet) ? diet : [diet]) : []
    )
    res.json(recipes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/recipes-by-ingredients', async (req, res) => {
  try {
    const { ingredients, healthLabels } = req.query
    const recipes = await recipeService.getRecipesByIngredients(
      ingredients.split(','),
      healthLabels ? healthLabels.split(',') : []
    )
    res.json(recipes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/recipe/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params
    const { isEdamamRecipe } = req.query
    const recipe = await recipeService.getRecipe(recipeId, isEdamamRecipe === 'true')
    if (recipe) {
      res.json(recipe)
    } else {
      res.status(404).json({ error: 'Recipe not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Favourite recipes routes
router.post('/favourites', authenticateUser, async (req, res) => {
  try {
    const { recipeId, isEdamamRecipe } = req.body
    await userService.addFavouriteRecipe(req.username, recipeId, isEdamamRecipe)
    res.status(201).json({ message: 'Recipe added to favourites' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/favourites', authenticateUser, async (req, res) => {
  try {
    const favourites = await userService.getFavouriteRecipes(req.username)
    console.log('from database: ' + favourites)
    res.json(favourites)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/favourites/:recipeId', authenticateUser, async (req, res) => {
  try {
    const { recipeId } = req.params
    const deleted = await userService.deleteFromFavourites(recipeId)
    if (deleted) {
      res.json({ message: 'Successfully removed from favourites' })
    } else {
      res.status(404).json({ error: 'Remove unsuccessful or unauthorized' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Personal recipes routes
router.post('/personal-recipes', authenticateUser, async (req, res) => {
  try {
    const recipe = req.body
    const newRecipe = await userService.createPersonalRecipe(req.username, recipe)
    res.status(201).json(newRecipe)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/personal-recipes', authenticateUser, async (req, res) => {
  try {
    const recipes = await userService.getPersonalRecipes(req.username)
    res.json(recipes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Changed to not require authentication since these are public recipes
router.get('/all-personal-recipes', async (req, res) => {
  try {
    const recipes = await userService.getAllPersonalRecipes()
    res.json(recipes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/personal-recipes/:recipeId', authenticateUser, async (req, res) => {
  try {
    const { recipeId } = req.params
    const recipe = await userService.getPersonalRecipeById(recipeId)
    res.json(recipe)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/personal-recipes/:recipeId', authenticateUser, async (req, res) => {
  try {
    const { recipeId } = req.params
    const recipe = req.body
    const updatedRecipe = await userService.updatePersonalRecipe(req.username, recipeId, recipe)
    if (updatedRecipe) {
      res.json(updatedRecipe)
    } else {
      res.status(404).json({ error: 'Recipe not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/personal-recipes/:recipeId', authenticateUser, async (req, res) => {
  try {
    const { recipeId } = req.params
    const deleted = await userService.deletePersonalRecipe(req.username, recipeId)
    if (deleted) {
      res.json({ message: 'Recipe deleted successfully' })
    } else {
      res.status(404).json({ error: 'Recipe not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Allergy information routes
router.get('/allergy-info', authenticateUser, async (req, res) => {
  try {
    const allergyInfo = await userService.getAllergyInfo(req.username)
    res.json(allergyInfo)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/allergy-info', authenticateUser, async (req, res) => {
  try {
    const { AllergyInfo } = req.body
    await userService.updateAllergyInfo(req.username, AllergyInfo)
    res.json({ message: 'Allergy information updated successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Dietary information route
router.get('/dietary-info', authenticateUser, async (req, res) => {
  try {
    const dietaryInfo = await userService.getDietaryInfo(req.username)
    res.json(dietaryInfo)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/dietary-info', authenticateUser, async (req, res) => {
  try {
    const { DietaryInfo } = req.body
    console.log('in route ', DietaryInfo)

    await userService.updateDietaryInfo(req.username, DietaryInfo)
    res.json({ message: 'Dietary information updated successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Shopping list routes
router.post('/shopping-list', authenticateUser, async (req, res) => {
  try {
    const { itemName, itemQuantity } = req.body
    await userService.addToShoppingList(req.username, itemName, itemQuantity)
    res.status(201).json({ message: 'Item added to shopping list' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/shopping-list', authenticateUser, async (req, res) => {
  try {
    const shoppingList = await userService.getShoppingList(req.username)
    res.json(shoppingList)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/shopping-list/:shoppingListID', authenticateUser, async (req, res) => {
  try {
    const { shoppingListID } = req.params
    console.log(`Deleting shopping list item with ID: ${shoppingListID}`)
    const deleted = await userService.deleteFromShoppingList(shoppingListID)
    if (deleted) {
      res.json({ message: 'Item deleted successfully' })
    } else {
      res.status(404).json({ error: 'Item not found or unauthorized' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Recipe rating route
router.post('/rate-recipe', authenticateUser, async (req, res) => {
  try {
    const { userMadeRecipeId, rating, description } = req.body
    await userService.rateRecipe(req.username, userMadeRecipeId, rating, description)
    res.json({ message: 'Recipe rated successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get reviews for a specific recipe
router.get('/recipe-reviews/:recipeId', async (req, res) => {
  try {
    const { recipeId } = req.params
    const reviews = await userService.getRecipeReviews(recipeId)
    res.json(reviews)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// User points routes
router.get('/user-points', authenticateUser, async (req, res) => {
  try {
    const points = await userService.getUserPoints(req.username)
    res.json({ points })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/redeem-points', authenticateUser, async (req, res) => {
  try {
    const { pointsToRedeem } = req.body
    const result = await userService.redeemPoints(req.username, pointsToRedeem)
    if (result.success) {
      res.json({ message: 'Points redeemed successfully', remainingPoints: result.remainingPoints })
    } else {
      res.status(400).json({ error: result.message })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Top rated recipes route - removed authentication requirement
router.get('/top-rated-recipes', async (req, res) => {
  try {
    const { limit } = req.query
    const topRatedRecipes = await userService.getTopRatedRecipes(limit ? parseInt(limit) : 10)
    res.json(topRatedRecipes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Valid health labels route
router.get('/valid-health-labels', (req, res) => {
  const validHealthLabels = recipeService.getValidHealthLabels()
  res.json(validHealthLabels)
})

module.exports = router
