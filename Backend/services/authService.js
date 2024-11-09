const bcrypt = require('bcrypt')
const { query } = require('../db')

const saltRounds = 10

async function createUser(username, password) {
  if (username.length > 50) {
    throw new Error('Username must be 50 characters or less')
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  await query(
    'INSERT INTO Users (Username, Password, Points) VALUES (?, ?, 0)',
    [username, hashedPassword]
  )
  return { username }
}

async function loginUser(username, password) {
  const [user] = await query('SELECT * FROM Users WHERE Username = ?', [username])
  if (!user || !(await bcrypt.compare(password, user.Password))) {
    throw new Error('Invalid username or password')
  }
  return {
    username: user.Username,
    dietaryRestrictions: user.DietaryRestrictions,
    points: user.Points
  }
}

async function checkUsernameExists(username) {
  const [user] = await query('SELECT Username FROM Users WHERE Username = ?', [username])
  return !!user
}

module.exports = {
  createUser,
  loginUser,
  checkUsernameExists
}
