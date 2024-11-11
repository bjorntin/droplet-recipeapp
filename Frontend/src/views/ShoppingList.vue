<template>
  <div class="page-display">
    <h1>🛒 Shopping List</h1>
    <div class="main-card main-card-items row">
      <input class="col" style="min-width:200px" type="text" v-model="newItem" placeholder="Add new item" id="item" />
      <input class="col" style="min-width:200px" type="text" v-model="quantity" placeholder="Quantity" id="quantity"/>
      <button class="col" @click="addItem">Add</button>
    </div>
    <ul v-if="items.length">
      <li v-for="(item, index) in items" :key="index">
        <span :class="{ completed: item.completed }">{{ item.name }} | {{ item.quantity }}</span>
        <div>
          <button @click="toggleComplete(index)">{{ item.completed ? 'Undo' : 'Complete' }}</button>
          <button class="button-remove" @click="removeItem(item.id)">Remove</button>
        </div>
      </li>
    </ul>
    <p v-else>Your shopping list is empty.</p>
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
        const response = await fetch(`http://157.245.198.241:5000/api${url}`, options)
        return await response.json()
      } catch (error) {
        console.error('Error during fetch:', error)
        return { error: 'An error occurred (Shopping List).' }
      }
    },
    async addItem(event) {
      this.newItem.trim()
      this.newItem = this.newItem.charAt(0).toUpperCase() + this.newItem.slice(1)
      event.preventDefault()
      await this.makeRequest('/shopping-list', 'POST', {
        itemName: this.newItem,
        itemQuantity: this.quantity
      })
      this.newItem = ''
      this.quantity = ''
      this.getItems()
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
@import "../assets/style.css";

.main-card-items {
  align-items: start;
}

#item {
  flex: 2;
}

#quantity {
  flex: 1;
}

/* .add-item {
  display: flex;
  align-items: start;
  margin-bottom: 20px;
} */

/* #quantity {
  width: 10px;
} */

/* input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #795548;
  border-radius: 4px;
  margin-right: 5px;
} */

button {
  padding: 10px 15px;
  background-color: #5e9b77;
  color: #e6e6e6;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #4b8063;
}

.button-remove {
  background-color: #e57373;
}

.button-remove:hover {
  background-color: #ef9a9a;
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
  background-color: #e0ebe4;
  border-radius: 4px;
  margin-bottom: 10px;
}

.completed {
  text-decoration: line-through;
  color: #7f7f7f;
}

li button {
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 4px;
}
</style>
