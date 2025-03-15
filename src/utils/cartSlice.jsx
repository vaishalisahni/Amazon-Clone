import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(localStorage.getItem('cart')) || {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const getNumericPrice = (price) => {
  return parseFloat(price.replace('₹', '').replace(',', ''));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.product_id === newItem.product_id);
      const itemPrice = getNumericPrice(newItem.discounted_price);

      if (existingItem) {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.quantity * itemPrice;
      } else {
        state.items.push({
          ...newItem,
          quantity: 1,
          totalPrice: itemPrice,
          itemPrice: itemPrice
        });
      }

      state.totalQuantity++;
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find(item => item.product_id === id);

      if (existingItem.quantity === 1) {
        state.items = state.items.filter(item => item.product_id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.quantity * existingItem.itemPrice;
      }

      state.totalQuantity--;
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.totalPrice,
        0
      );
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
