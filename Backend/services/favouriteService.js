const { query } = require('../db')

async function addFavouriteRecipe(username, recipeId, isEdamamRecipe) {
  await query('INSERT INTO UserSavedRecipe (Username, RecipeID, isEdamamRecipe) VALUES (?, ?, ?)', [
    username,
    recipeId,
    isEdamamRecipe
  ])
}

async function getFavouriteRecipes(username) {
  return await query('SELECT * FROM UserSavedRecipe WHERE Username = ?', [username])
}

async function deleteFromFavourites(recipeId) {
  // Remove item from user's favourites
  const result = await query('DELETE FROM UserSavedRecipe WHERE RecipeID = ?', [recipeId])
  return result.affectedRows > 0
}

module.exports = {
  addFavouriteRecipe,
  getFavouriteRecipes,
  deleteFromFavourites
}
