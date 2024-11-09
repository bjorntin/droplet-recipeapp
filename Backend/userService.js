// Import all service modules
const authService = require('./services/authService')
const recipeService = require('./services/recipeService')
const favouriteService = require('./services/favouriteService')
const shoppingListService = require('./services/shoppingListService')
const ratingService = require('./services/ratingService')
const profileService = require('./services/profileService')

// Re-export all services with the same interface as before
module.exports = {
  // Auth services
  createUser: authService.createUser,
  loginUser: authService.loginUser,
  checkUsernameExists: authService.checkUsernameExists,

  // Recipe services
  createPersonalRecipe: recipeService.createPersonalRecipe,
  getPersonalRecipes: recipeService.getPersonalRecipes,
  getAllPersonalRecipes: recipeService.getAllPersonalRecipes,
  getPersonalRecipeById: recipeService.getPersonalRecipeById,
  updatePersonalRecipe: recipeService.updatePersonalRecipe,
  deletePersonalRecipe: recipeService.deletePersonalRecipe,

  // Favorite services
  addFavouriteRecipe: favouriteService.addFavouriteRecipe,
  getFavouriteRecipes: favouriteService.getFavouriteRecipes,
  deleteFromFavourites: favouriteService.deleteFromFavourites,

  // Shopping list services
  addToShoppingList: shoppingListService.addToShoppingList,
  getShoppingList: shoppingListService.getShoppingList,
  deleteFromShoppingList: shoppingListService.deleteFromShoppingList,

  // Rating and points services
  rateRecipe: ratingService.rateRecipe,
  getUserPoints: ratingService.getUserPoints,
  redeemPoints: ratingService.redeemPoints,
  getTopRatedRecipes: ratingService.getTopRatedRecipes,

  // Profile services
  getDietaryInfo: profileService.getDietaryInfo,
  updateDietaryInfo: profileService.updateDietaryInfo,
  getAllergyInfo: profileService.getAllergyInfo,
  updateAllergyInfo: profileService.updateAllergyInfo
}
