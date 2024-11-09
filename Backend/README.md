# RecipeApp

RecipeApp is a web application that allows users to search for recipes, create and manage their own recipes, and interact with a community of food enthusiasts. It combines user-generated content with recipes from the EDAMAM API.

## Features

- User authentication (signup, login)
- Search recipes from both user-generated content and EDAMAM API
- Create, read, update, and delete personal recipes
- Save favorite recipes
- Rate and review recipes
- Manage shopping lists
- Earn and redeem points
- Dietary restrictions and preferences

## Backend Setup

### Prerequisites

- Node.js (v14 or later)
- MySQL (v8 or later)
- EDAMAM API credentials

### MySQL Setup

1. Install MySQL if you haven't already.
2. Start the MySQL service:
   - On Windows: Open Services and start MySQL
   - On macOS: `brew services start mysql`
   - On Linux: `sudo systemctl start mysql`
3. Log in to MySQL as root:
   ```
   mysql -u root -p
   ```
   If you haven't set a root password, you might need to use `sudo mysql` on Linux.
4. Create a new user and grant permissions:
   ```sql
   CREATE USER 'recipeapp_user'@'localhost' IDENTIFIED BY 'your_password';
   CREATE DATABASE IF NOT EXISTS recipeapp;
   GRANT ALL PRIVILEGES ON recipeapp.* TO 'recipeapp_user'@'localhost';
   FLUSH PRIVILEGES;
   ```
   Replace 'your_password' with a secure password.

### Environment Configuration

1. Navigate to the `Backend` directory.
2. Create a `.env` file with the following content:

```
PORT=5000
DB_HOST=localhost
DB_USER=recipeapp_user
DB_PASSWORD=your_password
DB_NAME=recipeapp
EDAMAM_APP_ID=your_edamam_app_id
EDAMAM_APP_KEY=your_edamam_api_key
```

Replace 'your_password' with the password you set for the MySQL user, and add your EDAMAM API credentials.

### Installation

1. In the `Backend` directory, install the required dependencies:
   ```
   npm install
   ```

### Starting the Backend Server

To start the backend server, run:

```
npm start
```

The server will start on the port specified in your `.env` file (default is 5000).

## Frontend Setup

1. Open the `index.html` file in a web browser.
2. Use the forms to interact with the backend and test various functionalities.

## Troubleshooting

If you encounter the error "Error: Access denied for user ''@'localhost' (using password: NO)":

1. Ensure MySQL is running on your machine.
2. Double-check your `.env` file to ensure DB_USER and DB_PASSWORD are correctly set.
3. Verify that you've created the MySQL user and granted permissions as described in the MySQL Setup section.
4. If you're using a different MySQL user, ensure it has the necessary permissions:
   ```sql
   GRANT ALL PRIVILEGES ON recipeapp.* TO 'your_username'@'localhost';
   FLUSH PRIVILEGES;
   ```
5. If you're still having issues, try these steps:
   - Delete the `Backend/.env` file and recreate it with the correct credentials.
   - Restart your MySQL service.
   - Restart your terminal or command prompt to ensure it picks up the latest environment variables.

If you're getting a "MODULE_NOT_FOUND" error:
1. Ensure you're in the `Backend` directory when running `npm install` and `npm start`.
2. Try deleting the `node_modules` folder and running `npm install` again.

## API Documentation

For detailed API documentation, please refer to the `API_DOCUMENTATION.md` file (to be created).

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
