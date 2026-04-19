import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('wishlist')) || { items: [] };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const item = action.payload;
      const exists = state.items.find((i) => i.product_id === item.product_id);
      if (exists) {
        state.items = state.items.filter((i) => i.product_id !== item.product_id);
      } else {
        state.items.push(item);
      }
      localStorage.setItem('wishlist', JSON.stringify(state));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;