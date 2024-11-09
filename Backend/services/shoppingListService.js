const { query } = require('../db')

async function addToShoppingList(username, itemName, itemQuantity) {
  await query('INSERT INTO ShoppingList (Username, ItemName, ItemQuantity) VALUES (?, ?, ?)', [
    username,
    itemName,
    itemQuantity
  ])
}

async function getShoppingList(username) {
  return await query('SELECT * FROM ShoppingList WHERE Username = ?', [username])
}

async function deleteFromShoppingList(shoppingListID) {
  const result = await query('DELETE FROM ShoppingList WHERE ShoppingListID = ?', [shoppingListID])
  return result.affectedRows > 0
}

module.exports = {
  addToShoppingList,
  getShoppingList,
  deleteFromShoppingList
}
