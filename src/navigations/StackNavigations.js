import { useEffect, useState } from 'react';
import Splash from '../screens/Splash';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroSlider from '../screens/IntroSlider';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import ForgotPassword from '../screens/ForgotPassword';
import SignUp from '../screens/SignUp';
import Verification from '../screens/Verification';
import SearchScreen from '../screens/SearchScreen';
import BurgerScreen from '../screens/BurgerScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import EditCartScreen from '../screens/EditCartScreen';
import PaymentNoCardScreen from '../screens/PaymentNoCardScreen';
import PaymentCardScreen from '../screens/PaymentCardScreen';
import AddCardScreen from '../screens/AddCardScreen';
import PaymentSuccessfulScreen from '../screens/PaymentSuccessfulScreen';

const StackNavigations = () => {
  const Stack = createNativeStackNavigator();
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 2000);
  }, []);

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {splash ? (
          <Stack.Screen name="Splash" component={Splash} />
        ) : (
          <>
            <Stack.Screen name="IntroSlider" component={IntroSlider} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Verification" component={Verification} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen name="BurgerScreen" component={BurgerScreen} />
            <Stack.Screen name='RestaurantDetailScreen' component={RestaurantDetailScreen} />
            <Stack.Screen name='ProductDetailScreen' component={ProductDetailScreen} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="EditCartScreen" component={EditCartScreen} />
            <Stack.Screen
              name="PaymentNoCardScreen"
              component={PaymentNoCardScreen}
            />
            <Stack.Screen
              name="PaymentCardScreen"
              component={PaymentCardScreen}
            />
            <Stack.Screen name="AddCardScreen" component={AddCardScreen} />
            <Stack.Screen
              name="PaymentSuccessfulScreen"
              component={PaymentSuccessfulScreen}
            />
          </>
        )}
      </Stack.Navigator>
  );
};

export default StackNavigations;
