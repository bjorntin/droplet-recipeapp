const { query } = require('../db')

function formatPrepTime(prepTime) {
  if (!prepTime || typeof prepTime !== 'string') {
    return '00:00'
  }
  const [hours, minutes] = prepTime.split(':').map(Number)
  if (isNaN(hours) || isNaN(minutes)) {
    return '00:00'
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

async function createPersonalRecipe(username, recipe) {
  const { recipeName, prepTime, servingSize, prepSteps, ingredientList } = recipe
  const formattedPrepTime = formatPrepTime(prepTime)
  const result = await query(
    'INSERT INTO UserMadeRecipe (Username, RecipeName, PrepTime, ServingSize, PrepSteps, IngredientList) VALUES (?, ?, ?, ?, ?, ?)',
    [username, recipeName, formattedPrepTime, servingSize, prepSteps, ingredientList]
  )
  return { id: result.insertId, ...recipe, prepTime: formattedPrepTime }
}

async function searchRecipes(searchTerms = '', sortByRating = false) {
  // Clean and split search terms
  const terms = searchTerms
    .split(',')
    .map((term) => term.trim())
    .filter((term) => term.length > 0)

  let sql = `
    SELECT r.*, 
           COALESCE(AVG(rv.Rating), 0) as AverageRating,
           COUNT(rv.Rating) as RatingCount
    FROM UserMadeRecipe r
    LEFT JOIN Reviews rv ON r.UserMadeRecipeID = rv.UserMadeRecipeID
  `

  // Add search conditions if terms exist
  if (terms.length > 0) {
    const searchConditions = terms
      .map(() => '(LOWER(r.RecipeName) LIKE LOWER(?) OR LOWER(r.IngredientList) LIKE LOWER(?))')
      .join(' OR ') // Changed from AND to OR

    sql += ` WHERE ${searchConditions}`
  }

  sql += ' GROUP BY r.UserMadeRecipeID'

  // Add sorting
  if (sortByRating) {
    sql += ' ORDER BY AverageRating DESC, RatingCount DESC'
  } else {
    sql += ' ORDER BY r.UserMadeRecipeID DESC'
  }

  // Create parameters array for search terms
  const params = []
  terms.forEach((term) => {
    params.push(`%${term}%`, `%${term}%`) // One for RecipeName, one for IngredientList
  })

  return await query(sql, params)
}

async function getPersonalRecipes(username) {
  return await query(
    `SELECT r.*, 
            COALESCE(AVG(rv.Rating), 0) as AverageRating,
            COUNT(rv.Rating) as RatingCount
     FROM UserMadeRecipe r
     LEFT JOIN Reviews rv ON r.UserMadeRecipeID = rv.UserMadeRecipeID
     WHERE r.Username = ?
     GROUP BY r.UserMadeRecipeID`,
    [username]
  )
}

async function getAllPersonalRecipes() {
  return await query(
    `SELECT r.*, 
            COALESCE(AVG(rv.Rating), 0) as AverageRating,
            COUNT(rv.Rating) as RatingCount
     FROM UserMadeRecipe r
     LEFT JOIN Reviews rv ON r.UserMadeRecipeID = rv.UserMadeRecipeID
     GROUP BY r.UserMadeRecipeID
     ORDER BY r.UserMadeRecipeID DESC`
  )
}

async function getPersonalRecipeById(userMadeRecipeId) {
  // Fetch personal recipe by a user
  return await query('SELECT * FROM UserMadeRecipe WHERE UserMadeRecipeID = ?', [userMadeRecipeId])
}

async function updatePersonalRecipe(username, recipeId, recipe) {
  const [existingRecipe] = await query(
    'SELECT * FROM UserMadeRecipe WHERE UserMadeRecipeID = ? AND Username = ?',
    [recipeId, username]
  )

  if (!existingRecipe) {
    throw new Error('Recipe not found or does not belong to the user')
  }

  const updateFields = {}
  if (recipe.RecipeName !== existingRecipe.RecipeName) updateFields.RecipeName = recipe.RecipeName
  if (recipe.PrepTime !== existingRecipe.PrepTime)
    updateFields.PrepTime = formatPrepTime(recipe.PrepTime)
  if (recipe.ServingSize !== existingRecipe.ServingSize)
    updateFields.ServingSize = recipe.ServingSize
  if (recipe.PrepSteps !== existingRecipe.PrepSteps) updateFields.PrepSteps = recipe.PrepSteps
  if (recipe.IngredientList !== existingRecipe.IngredientList)
    updateFields.IngredientList = recipe.IngredientList

  if (Object.keys(updateFields).length === 0) {
    return existingRecipe
  }

  const setClause = Object.keys(updateFields)
    .map((key) => `${key} = ?`)
    .join(', ')
  const params = [...Object.values(updateFields), recipeId, username]

  const updateQuery = `UPDATE UserMadeRecipe SET ${setClause} WHERE UserMadeRecipeID = ? AND Username = ?`
  await query(updateQuery, params)

  const [updatedRecipe] = await query(
    `SELECT r.*, 
            COALESCE(AVG(rv.Rating), 0) as AverageRating,
            COUNT(rv.Rating) as RatingCount
     FROM UserMadeRecipe r
     LEFT JOIN Reviews rv ON r.UserMadeRecipeID = rv.UserMadeRecipeID
     WHERE r.UserMadeRecipeID = ?
     GROUP BY r.UserMadeRecipeID`,
    [recipeId]
  )

  return updatedRecipe
}

async function deletePersonalRecipe(username, recipeId) {
  const result = await query(
    'DELETE FROM UserMadeRecipe WHERE UserMadeRecipeID = ? AND Username = ?',
    [recipeId, username]
  )
  return result.affectedRows > 0
}

module.exports = {
  createPersonalRecipe,
  getPersonalRecipes,
  getAllPersonalRecipes,
  getPersonalRecipeById,
  updatePersonalRecipe,
  deletePersonalRecipe,
  searchRecipes
}
