import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Splash from './src/screens/Splash';
import AuthStack from './src/navigations/AuthStack';
import AdminStack from './src/navigations/AdminStack';
import UserStack from './src/navigations/UserStack';
import { CommonStyles, Colors } from './src/styles/globalStyles';
import { CartProvider } from './src/context/CartContext';
import { LocationProvider } from './src/context/LocationContext';
import { AlertProvider } from './src/context/AlertContext';
import { FavoritesProvider } from './src/context/FavoritesContext';

const App = () => {
  const [splash, setSplash] = useState(true);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async currentUser => {
      if (!currentUser) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const uid = currentUser.uid;
        let detectedRole = null;

        const adminDoc = await firestore().collection('admins').doc(uid).get();
        if (adminDoc.exists && adminDoc.data()?.role === 'admin') {
          detectedRole = 'admin';
        }

        if (!detectedRole) {
          const userDoc = await firestore().collection('users').doc(uid).get();
          if (userDoc.exists && userDoc.data()?.role === 'user') {
            detectedRole = 'user';
          }
        }

        setRole(detectedRole);
      } catch (error) {
        console.error('Error fetching role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={CommonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <AlertProvider>
      <LocationProvider>
        <CartProvider>
          <FavoritesProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <NavigationContainer>
                {splash ? (
                  <Splash />
                ) : role === 'admin' ? (
                  <AdminStack />
                ) : role === 'user' ? (
                  <UserStack />
                ) : (
                  <AuthStack />
                )}
              </NavigationContainer>
            </GestureHandlerRootView>
          </FavoritesProvider>
        </CartProvider>
      </LocationProvider>
    </AlertProvider>
  );
};

export default App;