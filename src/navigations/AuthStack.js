import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IntroSlider from '../screens/IntroSlider';
import LoginScreen from '../screens/LoginScreen';
import ForgotPassword from '../screens/ForgotPassword';
import Verification from '../screens/Verification';
import SignUp from '../screens/SignUp';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="IntroSlider" component={IntroSlider} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="Verification" component={Verification} />
    <Stack.Screen name="SignUp" component={SignUp} />
  </Stack.Navigator>
);

export default AuthStack;
