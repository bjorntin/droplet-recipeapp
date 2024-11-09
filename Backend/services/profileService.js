const { query } = require('../db')

async function getDietaryInfo(username) {
  const [user] = await query('SELECT DietaryRestrictions FROM Users WHERE Username = ?', [username])
  return user ? user.DietaryRestrictions : ''
}

async function updateDietaryInfo(username, dietaryInfo) {
  const newDietaryInfo = dietaryInfo.join(',')
  await query('UPDATE Users SET DietaryRestrictions = ? WHERE Username = ?', [
    newDietaryInfo,
    username
  ])
  return true
}

async function getAllergyInfo(username) {
  const [user] = await query('SELECT Allergies FROM Users WHERE Username = ?', [username])
  return user
}

async function updateAllergyInfo(username, allergyInfo) {
  const newAllergyInfo = allergyInfo.join(',')
  await query('UPDATE Users SET Allergies = ? WHERE Username = ?', [
    newAllergyInfo,
    username
  ])
  return true
}

module.exports = {
  getDietaryInfo,
  updateDietaryInfo,
  getAllergyInfo,
  updateAllergyInfo
}