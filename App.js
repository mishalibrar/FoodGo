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
    console.log('🔵 [App] Setting up auth state listener...');
    
    const unsubscribe = auth().onAuthStateChanged(async currentUser => {
      console.log('🟢 [App] Auth state changed!');
      console.log('🟢 [App] Current user:', currentUser ? currentUser.uid : 'null');
      
      if (!currentUser) {
        console.log('🔵 [App] No user logged in, setting role to null');
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const uid = currentUser.uid;
        console.log('🔵 [App] User logged in, UID:', uid);
        console.log('🔵 [App] Checking user role in Firestore...');
        
        let detectedRole = null;

        console.log('🔵 [App] Checking admins collection...');
        const adminDoc = await firestore().collection('admins').doc(uid).get();
        console.log('🔵 [App] Admin doc exists:', adminDoc.exists);
        if (adminDoc.exists) {
          const adminData = adminDoc.data();
          console.log('🔵 [App] Admin doc data:', adminData);
          console.log('🔵 [App] Admin role:', adminData?.role);
          if (adminData?.role === 'admin') {
            detectedRole = 'admin';
            console.log('✅ [App] Role detected: ADMIN');
          }
        }

        if (!detectedRole) {
          console.log('🔵 [App] Not an admin, checking users collection...');
          const userDoc = await firestore().collection('users').doc(uid).get();
          console.log('🔵 [App] User doc exists:', userDoc.exists);
          if (userDoc.exists) {
            const userData = userDoc.data();
            console.log('🔵 [App] User doc data:', userData);
            console.log('🔵 [App] User role:', userData?.role);
            if (userData?.role === 'user') {
              detectedRole = 'user';
              console.log('✅ [App] Role detected: USER');
            }
          }
        }

        if (!detectedRole) {
          console.warn('⚠️ [App] No role found for user! User might not be in Firestore.');
          console.warn('⚠️ [App] UID:', uid);
        }

        console.log('🔵 [App] Final detected role:', detectedRole);
        setRole(detectedRole);
      } catch (error) {
        console.error('❌ [App] Error fetching role:', error);
        console.error('❌ [App] Error details:', error.message);
        setRole(null);
      } finally {
        console.log('🔵 [App] Setting loading to false');
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  console.log('🔵 [App] Render - Loading:', loading, 'Splash:', splash, 'Role:', role);

  if (loading) {
    console.log('🟡 [App] Showing loading indicator');
    return (
      <View style={CommonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  console.log('🔵 [App] Rendering navigation stack');
  console.log('🔵 [App] Splash:', splash);
  console.log('🔵 [App] Role:', role);
  console.log('🔵 [App] Selected stack:', 
    splash ? 'Splash' : 
    role === 'admin' ? 'AdminStack' : 
    role === 'user' ? 'UserStack' : 
    'AuthStack'
  );

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