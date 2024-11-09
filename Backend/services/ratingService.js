const { query } = require('../db')

async function rateRecipe(username, userMadeRecipeId, rating, description = '') {
  // Check if user is trying to rate their own recipe
  const [recipe] = await query(
    'SELECT Username FROM UserMadeRecipe WHERE UserMadeRecipeID = ?',
    [userMadeRecipeId]
  )

  if (!recipe) {
    throw new Error('Recipe not found')
  }

  if (recipe.Username === username) {
    throw new Error('You cannot rate your own recipe')
  }

  // Check if user has already rated this recipe
  const [existingRating] = await query(
    'SELECT ReviewID FROM Reviews WHERE Username = ? AND UserMadeRecipeID = ?',
    [username, userMadeRecipeId]
  )

  if (existingRating) {
    throw new Error('You have already rated this recipe')
  }

  // Add the review
  await query(
    'INSERT INTO Reviews (Username, UserMadeRecipeID, Rating, Description) VALUES (?, ?, ?, ?)',
    [username, userMadeRecipeId, rating, description]
  )

  // Award points to recipe creator based on rating
  // 5 stars = 100 points
  // 4 stars = 50 points
  if (rating >= 4) {
    const pointsToAdd = rating === 5 ? 100 : 50
    await query(
      'UPDATE Users SET Points = COALESCE(Points, 0) + ? WHERE Username = ?',
      [pointsToAdd, recipe.Username]
    )
  }
}

async function getUserPoints(username) {
  const [user] = await query('SELECT Points FROM Users WHERE Username = ?', [username])
  return user ? user.Points || 0 : 0
}

async function redeemPoints(username, pointsToRedeem) {
  const [user] = await query('SELECT Points FROM Users WHERE Username = ?', [username]);
  
  // Check if user exists and has enough points
  if (user && user.Points >= pointsToRedeem) {
    // Insert a new voucher for the user
    await query('INSERT INTO Vouchers (Username) VALUES (?)', [username]);
    
    // Update the user's points
    await query('UPDATE Users SET Points = Points - ? WHERE Username = ?', [
      pointsToRedeem,
      username
    ]);
    
    return { success: true, remainingPoints: user.Points - pointsToRedeem };
  }
  
  return { success: false, message: 'Insufficient points' };
}


async function getTopRatedRecipes(limit = 10) {
  // Convert limit to number and set a default
  const numLimit = Number(limit) || 10
  
  return await query(
    `
    SELECT r.UserMadeRecipeID, r.Username, r.RecipeName, r.PrepTime, r.ServingSize, r.PrepSteps, r.IngredientList, 
           COALESCE(AVG(rv.Rating), 0) as AverageRating, 
           COUNT(rv.Rating) as RatingCount
    FROM UserMadeRecipe r
    LEFT JOIN Reviews rv ON r.UserMadeRecipeID = rv.UserMadeRecipeID
    GROUP BY r.UserMadeRecipeID
    ORDER BY AverageRating DESC, RatingCount DESC
    LIMIT ${numLimit}
  `
  )
}

async function getRecipeReviews(recipeId) {
  return await query(
    `
    SELECT r.ReviewID, r.Username, r.Rating, r.Description, 
           DATE_FORMAT(COALESCE(r.CreatedAt, NOW()), '%Y-%m-%d %H:%i') as ReviewDate
    FROM Reviews r
    WHERE r.UserMadeRecipeID = ?
    ORDER BY r.CreatedAt DESC
    `,
    [recipeId]
  )
}

module.exports = {
  rateRecipe,
  getUserPoints,
  redeemPoints,
  getTopRatedRecipes,
  getRecipeReviews
}
