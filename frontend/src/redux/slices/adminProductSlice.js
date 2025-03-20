import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers: {
          Authorization: USER_TOKEN,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// Async thunk to create a new product
export const createProduct = createAsyncThunk(
  "adminProducts/createProducts",
  async (productData) => {
    const response = await axios.post(
      `${API_URL}/api/admin/products`,
      productData,
      {
        headers: {
          Authorization: USER_TOKEN
        }
      }
    );
    return response.data; // If the request was successful, return the products data
  }
);

// Async thunk to update
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(
      `${API_URL}/api/admin/products/${id}`,
      productData,
      {
        headers: {
          Authorization: USER_TOKEN
        }
      }
    );
    return response.data; // If the request was successful, return the products data
  }
);

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id) => {
    await axios.delete(`${API_URL}/api/products/${id}`, {
      headers: { Authorization: USER_TOKEN }
    });
    return id; // Return the ID of the deleted product
  }
);

const adminProductSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Fetched products payload:", action.payload); // Log the payload
        state.products = action.payload; // Store the fetched products
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Store the error message
      })
      // Create a new product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload); // Add the new product to the list
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      });
  }
});

export default adminProductSlice.reducer;
