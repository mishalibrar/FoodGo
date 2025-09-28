import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
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
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name='ProfileScreen' component={ProfileScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="BurgerScreen" component={BurgerScreen} />
      <Stack.Screen name="RestaurantDetailScreen" component={RestaurantDetailScreen} />
      <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="EditCartScreen" component={EditCartScreen} />
      <Stack.Screen name="PaymentNoCardScreen" component={PaymentNoCardScreen} />
      <Stack.Screen name="PaymentCardScreen" component={PaymentCardScreen} />
      <Stack.Screen name="AddCardScreen" component={AddCardScreen} />
      <Stack.Screen name="PaymentSuccessfulScreen" component={PaymentSuccessfulScreen} />
    </Stack.Navigator>
  );
}
