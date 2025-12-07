import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from AsyncStorage on mount
  useEffect(() => {
    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    saveCart();
  }, [cartItems]);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cartItems');
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (itemData, quantity = 1, adminId, restaurantId, categoryId, itemId) => {
    const newItem = {
      id: `${adminId}_${restaurantId}_${categoryId}_${itemId}`,
      itemId: itemId,
      adminId: adminId,
      restaurantId: restaurantId,
      categoryId: categoryId,
      name: itemData.name,
      price: itemData.price,
      quantity: quantity,
      imageUrl: itemData.imageUrl,
      description: itemData.description,
      size: itemData.size || 'Regular',
    };

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex >= 0) {
        // Item already exists, update quantity
        const updated = [...prevItems];
        updated[existingItemIndex].quantity += quantity;
        return updated;
      } else {
        // New item, add to cart
        return [...prevItems, newItem];
      }
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const incrementQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => {
      // Parse price to number (handle string prices like "Rs 100" or "100")
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
        : parseFloat(item.price) || 0;
      return sum + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

