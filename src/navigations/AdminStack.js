import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminRestaurantDetail from '../screens/AdminRestaurantDetail';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import AboutScreen from '../screens/AboutScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import CustomDrawer from '../components/CustomDrawer';
import { Colors } from '../styles/globalStyles';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Main Drawer Navigator for Admin
function AdminDrawerNavigator() {
  const currentUid = auth().currentUser?.uid;

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: {
          width: 300,
          backgroundColor: Colors.background,
        },
        drawerActiveTintColor: Colors.primary,
        drawerInactiveTintColor: Colors.textTertiary,
        drawerPosition: 'left',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}
    >
      <Drawer.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        initialParams={{ adminUid: currentUid }}
        options={{
          drawerLabel: 'Dashboard',
        }}
      />
    </Drawer.Navigator>
  );
}

// Main Stack Navigator
export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDrawerNavigator" component={AdminDrawerNavigator} />
      <Stack.Screen name="AdminRestaurantDetail" component={AdminRestaurantDetail} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
      <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}
