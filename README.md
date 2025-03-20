# ShopEase: Your All-in-One E-commerce Solution

## Table of Contents
- [ShopEase: Your All-in-One E-commerce Solution](#shopease-your-all-in-one-e-commerce-solution)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
    - [For Users:](#for-users)
    - [For Admins:](#for-admins)
  - [Project Structure](#project-structure)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [API Endpoints](#api-endpoints)
  - [Design Decisions](#design-decisions)
  - [Payment System](#payment-system)
  - [License](#license)
  - [Contact](#contact)

---

## Introduction

ShopEase is a modern e-commerce platform designed to simplify online shopping for users while providing robust tools for administrators to manage products, orders, and inventory efficiently. It offers features like guest checkout, cart merging, product filtering, and an intuitive admin dashboard.

---

## Features

### For Users:
- **Guest Checkout**: Browse and add items to your cart without signing up.
- **Persistent Cart**: Guest carts are automatically merged with user accounts upon login.
- **Advanced Filtering**: Find products by category, price range, tags, and more.
- **Product Details**: View detailed information about each product, including images, descriptions, and reviews.
- **Responsive Design**: Fully responsive UI for a great experience on all devices.

### For Admins:
- **Product Management**: Add, edit, and delete products easily.
- **Order Tracking**: Monitor and manage customer orders in real-time.
- **Analytics Dashboard**: Gain insights into sales performance, popular products, and customer behavior.
- **Role-Based Access Control**: Ensure only authorized personnel can access sensitive admin features.

---

## Project Structure

The project is divided into two main parts:
- **Backend**: Handles API endpoints, database interactions, and authentication.
- **Frontend**: Provides the user interface and interacts with the backend APIs.

---

## Technologies Used

- **Backend**:
  - Node.js: JavaScript runtime for building scalable server-side applications.
  - Express.js: Fast and minimalist web framework for Node.js.
  - MongoDB: NoSQL database for flexible and high-performance data storage.
  - Mongoose: ODM library for MongoDB, simplifying schema design and data validation.
  - JWT: Secure token-based authentication for users and admins.

- **Frontend**:
  - React.js: Library for building interactive user interfaces.
  - Redux: State management library for handling global application state.
  - Axios: Promise-based HTTP client for API requests.
  - CSS Modules/TailwindCSS: Modular and maintainable styling.

- **Other Tools**:
  - dotenv: Manage environment variables securely.
  - bcryptjs: Hash passwords securely for user authentication.
  - cors: Enable Cross-Origin Resource Sharing for API communication.
  - nodemon: Automatically restart the server during development.

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/boughanmiyoussef/ShopEase.git
   cd ShopEase
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Variables**:
Create a `.env` file in the backend directory with the following content:
   ```env
   PORT=9000
   MONGO_URI=mongodb://localhost:27017/shopease
   JWT_SECRET=your_jwt_secret_key_here
   ```
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Run the Backend**:
   ```bash
   cd backend
   npm start
   ```

6. **Run the Frontend**:
   ```bash
   cd frontend
   npm start
   ```

---

## API Endpoints

| Endpoint              | Method | Description                         |
|---------------------|-------|-------------------------------------|
| `/api/products`      | GET   | Retrieve all products             |
| `/api/products/:id`   | GET   | Retrieve a single product by ID    |
| `/api/cart`          | POST  | Add a product to the cart         |
| `/api/cart/merge`    | POST  | Merge guest cart with authenticated user |
| `/api/users/login`    | POST  | User login                         |
| `/api/users/register` | POST  | User registration                  |
| `/api/admin/products` | POST  | Add a new product (admin only)     |
| `/api/admin/products/:id` | PUT   | Update a product (admin only)     |

---

## Design Decisions

- **RESTful APIs**: Chosen for simplicity and compatibility with various frontends.
- **MongoDB & Mongoose**: Selected for flexibility in schema design and ease of use with Node.js.
- **JWT Authentication**: Implemented for secure and stateless authentication.
- **Error Handling**: Centralized error handling ensures consistent responses.

---

## Payment System

ShopEase integrates a **cash on delivery (COD)** payment system to ensure user-friendly and accessible transactions. During checkout, users can select the COD option to place their orders without requiring immediate online payment. This method enhances trust and encourages more users to complete their purchases.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Contact

For any inquiries or support, please reach out to:
- **Email**: yussefboughanmy@gmail.com
- **GitHub**: [boughanmiyoussef](https://github.com/boughanmiyoussef)
- **LinkedIn**: [Youssef Boughanmi](https://www.linkedin.com/in/youssef-boughanmi)

