<template>
  <div class="shopping-list">
    <h1>Shopping List</h1>
    <div class="add-item">
      <input v-model="newItem" placeholder="Add new item" />
      <input
        id="quantity"
        v-model="quantity"
        type="number"
        placeholder="Quantity"
        min="1"
        step="1"
      />
      <button @click="addItem">Add</button>
    </div>
    <ul v-if="items.length">
      <li v-for="(item, index) in items" :key="index">
        <span :class="{ completed: item.completed }">{{ item.name }} | {{ item.quantity }}</span>
        <div class="item-actions">
          <button @click="toggleComplete(index)" :class="{ complete: item.completed }">
            {{ item.completed ? 'Undo' : 'Complete' }}
          </button>
          <button @click="removeItem(item.id)" class="remove">Remove</button>
        </div>
      </li>
    </ul>
    <p v-else class="empty-list">
      <img src="../assets/icon.png" alt="Empty List Icon" />
      Your shopping list is empty.
    </p>
  </div>
</template>

<script>
export default {
  name: 'ShoppingList',
  data() {
    return {
      username: '',
      items: [],
      newItem: '',
      quantity: ''
    }
  },
  mounted() {
    this.username = localStorage.getItem('loggedInUser')
    this.getItems()
  },
  methods: {
    async makeRequest(url, method, body = null) {
      const headers = {
        'Content-Type': 'application/json',
        'X-Username': this.username
      }
      const options = { method, headers }
      if (body) options.body = JSON.stringify(body)
      try {
        const response = await fetch(`http://localhost:5000/api${url}`, options)
        return await response.json()
      } catch (error) {
        console.error('Error during fetch:', error)
        return { error: 'An error occurred (Shopping List).' }
      }
    },
    async addItem(event) {
      event.preventDefault()
      this.newItem = this.newItem.trim()
      this.newItem = this.newItem.charAt(0).toUpperCase() + this.newItem.slice(1)
      if (this.newItem && this.quantity) {
        await this.makeRequest('/shopping-list', 'POST', {
          itemName: this.newItem,
          itemQuantity: this.quantity
        })
        this.newItem = ''
        this.quantity = ''
        this.getItems()
      }
    },
    async getItems() {
      try {
        const result = await this.makeRequest('/shopping-list', 'GET')
        this.items = result.map((item) => ({
          id: item.ShoppingListID,
          name: item.ItemName,
          quantity: item.ItemQuantity,
          completed: false
        }))
      } catch (error) {
        console.error('Error fetching items:', error)
      }
    },
    toggleComplete(index) {
      this.items[index].completed = !this.items[index].completed
    },
    async removeItem(shoppingListID) {
      await this.makeRequest(`/shopping-list/${shoppingListID}`, 'DELETE')
      this.getItems()
    }
  }
}
</script>

<style scoped>
.shopping-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  color: #5d4037;
  font-family: Arial, sans-serif;
}

h1 {
  color: #5d4037;
  text-align: center;
  margin-bottom: 20px;
}

.add-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #795548;
  border-radius: 4px;
}

#quantity {
  max-width: 80px;
}

button {
  padding: 10px 15px;
  background-color: #ffa726;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #ff9800;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #ffe0b2;
  border-radius: 4px;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}

li:hover {
  background-color: #ffd699;
}

.completed {
  text-decoration: line-through;
  color: #7f7f7f;
}

.item-actions {
  display: flex;
  gap: 5px;
}

.item-actions .complete {
  background-color: #4caf50;
}

.item-actions .remove {
  background-color: #f44336;
}

.empty-list {
  text-align: center;
  color: #7f7f7f;
  font-style: italic;
}

.empty-list img {
  max-width: 100px;
  margin-bottom: 10px;
}
</style>
