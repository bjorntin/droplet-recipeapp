// Import necessary functions from vue-router
import { createRouter, createWebHistory } from 'vue-router'

// Import components for routes that are always needed
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import RecipeSearch from '../views/RecipeSearch.vue'
import DietaryRestrictions from '../views/DietaryRestrictions.vue'

// Create a new router instance
const router = createRouter({
  // Use web history mode for cleaner URLs
  history: createWebHistory(import.meta.env.BASE_URL),
  // Define the routes for the application
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signup',
      name: 'signup',
      // Lazy-load the Signup component
      component: () => import('../views/Signup.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/recipe-search',
      name: 'recipeSearch',
      component: RecipeSearch,
      meta: { requiresAuth: true }
    },
    {
      path: '/favourites',
      name: 'favourites',
      // Lazy-load the Favourites component
      component: () => import('../views/Favourites.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/personal-recipes',
      name: 'personalRecipes',
      // Lazy-load the PersonalRecipes component
      component: () => import('../views/PersonalRecipes.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/shopping-list',
      name: 'shoppingList',
      // Lazy-load the ShoppingList component
      component: () => import('../views/ShoppingList.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/create-recipe',
      name: 'createRecipe',
      // Lazy-load the CreateRecipe component
      component: () => import('../views/CreateRecipe.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/dietary-restrictions',
      name: 'dietaryRestrictions',
      // Lazy-load the CreateRecipe component
      component: () => import('../views/DietaryRestrictions.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/community-recipes',
      name: 'communityRecipes',
      // Lazy-load the CommunityRecipes component
      component: () => import('../views/CommunityRecipes.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/vouchers',
      name: 'Vouchers',
      // Lazy-load the CommunityRecipes component
      component: () => import('../views/Vouchers.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// GLobal navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('loggedInUser')

  // If the route requires authentication and user is not authenticated, redirect to login
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

// Export the router instance to be used in main.js
export default router
