import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Splash from './src/screens/Splash';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroSlider from './src/screens/IntroSlider';
import LoginScreen from './src/screens/LoginScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import Verification from './src/screens/Verification';
import SignUp from './src/screens/SignUp';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminRestaurantDetail from './src/screens/AdminRestaurantDetail';

import PaymentSuccessfulScreen from './src/screens/PaymentSuccessfulScreen';
import AddCardScreen from './src/screens/AddCardScreen';
import PaymentCardScreen from './src/screens/PaymentCardScreen';
import PaymentNoCardScreen from './src/screens/PaymentNoCardScreen';
import EditCartScreen from './src/screens/EditCartScreen';
import CartScreen from './src/screens/CartScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import RestaurantDetailScreen from './src/screens/RestaurantDetailScreen';
import BurgerScreen from './src/screens/BurgerScreen';
import SearchScreen from './src/screens/SearchScreen';
import HomeScreen from './src/screens/HomeScreen';

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IntroSlider" component={IntroSlider} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
};

const AdminStack = () => {
  const Stack = createNativeStackNavigator();
  const currentUid = auth().currentUser?.uid; 

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        initialParams={{ adminUid: currentUid }}
      />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen
        name="AdminRestaurantDetail"
        component={AdminRestaurantDetail}
      />
    </Stack.Navigator>
  );
};

const UserStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="BurgerScreen" component={BurgerScreen} />
      <Stack.Screen
        name="RestaurantDetailScreen"
        component={RestaurantDetailScreen}
      />
      <Stack.Screen
        name="ProductDetailScreen"
        component={ProductDetailScreen}
      />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="EditCartScreen" component={EditCartScreen} />
      <Stack.Screen
        name="PaymentNoCardScreen"
        component={PaymentNoCardScreen}
      />
      <Stack.Screen name="PaymentCardScreen" component={PaymentCardScreen} />
      <Stack.Screen name="AddCardScreen" component={AddCardScreen} />
      <Stack.Screen
        name="PaymentSuccessfulScreen"
        component={PaymentSuccessfulScreen}
      />
    </Stack.Navigator>
  );
};

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
        console.log('No user logged in');
        setLoading(false);
        return;
      }

      try {
        const uid = currentUser.uid;
        console.log('Current UID:', uid);

        let detectedRole = null;

        const adminDoc = await firestore().collection('admins').doc(uid).get();
        if (adminDoc.exists && adminDoc.data()?.role === 'admin') {
          detectedRole = 'admin';
          console.log('Admin data:', adminDoc.data());
        }

        if (!detectedRole) {
          const userDoc = await firestore().collection('users').doc(uid).get();
          if (userDoc.exists && userDoc.data()?.role === 'user') {
            detectedRole = 'user';
            console.log('User data:', userDoc.data());
          }
        }

        setRole(detectedRole);
      } catch (error) {
        console.log('Error fetching role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#FF7622" />
      </View>
    );
  }

  return (

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
  );
};

export default App;

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E1E5EA',
  },
});