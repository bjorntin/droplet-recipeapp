const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 30000,
  ssl: {
    rejectUnauthorized: false  // Modified this line to fix SSL certificate issue
  }
});

async function connectToDatabase() {
  try {
    console.log('Attempting to connect to database...');
    // Test the pool connection
    await pool.getConnection();
    console.log('Successfully connected to MySQL database');
  } catch (error) {
    console.error('Detailed connection error:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
}

async function createTables() {
  try {
    console.log('Creating tables...');
    const connection = await pool.getConnection();
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Users (
        Username VARCHAR(50) PRIMARY KEY,
        Password VARCHAR(255) NOT NULL,
        DietaryRestrictions TEXT DEFAULT NULL,
        Allergies TEXT,
        Points INT DEFAULT 0
      )
    `);

    // Check if Allergies column exists, if not add it
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'Users' 
      AND COLUMN_NAME = 'Allergies'
      AND TABLE_SCHEMA = ?
    `, [process.env.DB_NAME]);

    if (columns.length === 0) {
      await connection.execute(`
        ALTER TABLE Users
        ADD COLUMN Allergies TEXT
      `);
    }

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UserSavedRecipe (
        UserSavedRecipeID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(50),
        RecipeID VARCHAR(255),
        isEdamamRecipe BOOLEAN,
        FOREIGN KEY (Username) REFERENCES Users(Username)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS UserMadeRecipe (
        UserMadeRecipeID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(50),
        RecipeName VARCHAR(255) NOT NULL,
        PrepTime TIME,
        ServingSize INT,
        PrepSteps TEXT,
        IngredientList TEXT,
        FOREIGN KEY (Username) REFERENCES Users(Username)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Reviews (
        ReviewID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(50),
        UserMadeRecipeID INT,
        Rating INT,
        Description TEXT,
        FOREIGN KEY (Username) REFERENCES Users(Username),
        FOREIGN KEY (UserMadeRecipeID) REFERENCES UserMadeRecipe(UserMadeRecipeID)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Vouchers (
        VoucherCode INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(50),
        FOREIGN KEY (Username) REFERENCES Users(Username)
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ShoppingList (
        ShoppingListID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(50),
        ItemName VARCHAR(255),
        ItemQuantity INT,
        FOREIGN KEY (Username) REFERENCES Users(Username)
      )
    `);

    connection.release();
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    console.log('Database connection test successful');
  } catch (error) {
    console.error('Database connection test failed:', error);
    throw error;
  }
}

async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

module.exports = {
  connectToDatabase,
  createTables,
  testConnection,
  query
};
