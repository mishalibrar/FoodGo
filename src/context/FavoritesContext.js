import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favoriteRestaurants, setFavoriteRestaurants] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage whenever they change
  useEffect(() => {
    saveFavorites();
  }, [favoriteRestaurants, favoriteProducts]);

  const loadFavorites = async () => {
    try {
      const restaurantsData = await AsyncStorage.getItem('favoriteRestaurants');
      const productsData = await AsyncStorage.getItem('favoriteProducts');
      
      if (restaurantsData) {
        setFavoriteRestaurants(JSON.parse(restaurantsData));
      }
      if (productsData) {
        setFavoriteProducts(JSON.parse(productsData));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async () => {
    try {
      await AsyncStorage.setItem('favoriteRestaurants', JSON.stringify(favoriteRestaurants));
      await AsyncStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // Restaurant favorites
  const addRestaurantToFavorites = (restaurant) => {
    setFavoriteRestaurants(prev => {
      const exists = prev.find(r => r.id === restaurant.id);
      if (exists) return prev;
      return [...prev, restaurant];
    });
  };

  const removeRestaurantFromFavorites = (restaurantId) => {
    setFavoriteRestaurants(prev => prev.filter(r => r.id !== restaurantId));
  };

  const isRestaurantFavorite = (restaurantId) => {
    return favoriteRestaurants.some(r => r.id === restaurantId);
  };

  const toggleRestaurantFavorite = (restaurant) => {
    if (isRestaurantFavorite(restaurant.id)) {
      removeRestaurantFromFavorites(restaurant.id);
    } else {
      addRestaurantToFavorites(restaurant);
    }
  };

  // Product favorites
  const addProductToFavorites = (product) => {
    setFavoriteProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeProductFromFavorites = (productId) => {
    setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
  };

  const isProductFavorite = (productId) => {
    return favoriteProducts.some(p => p.id === productId);
  };

  const toggleProductFavorite = (product) => {
    if (isProductFavorite(product.id)) {
      removeProductFromFavorites(product.id);
    } else {
      addProductToFavorites(product);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteRestaurants,
        favoriteProducts,
        addRestaurantToFavorites,
        removeRestaurantFromFavorites,
        isRestaurantFavorite,
        toggleRestaurantFavorite,
        addProductToFavorites,
        removeProductFromFavorites,
        isProductFavorite,
        toggleProductFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

