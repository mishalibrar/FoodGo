import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { User2, Edit, Settings, LogOut, Phone, MapPin, ChevronRight, Heart } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';
import { useAlert } from '../context/AlertContext';
import { useFavorites } from '../context/FavoritesContext';

const CustomDrawer = props => {
  const { showAlert, showError } = useAlert();
  const { favoriteRestaurants, favoriteProducts } = useFavorites();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();

    // Refresh data when drawer is focused
    const unsubscribe = props.navigation.addListener('focus', () => {
      fetchUserData();
    });

    return unsubscribe;
  }, [props.navigation]);

  const fetchUserData = async () => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      // Try to fetch from users collection first
      let doc = await firestore().collection('users').doc(user.uid).get();
      let data = doc.exists ? doc.data() : null;

      // If not found, try admins collection
      if (!data) {
        doc = await firestore().collection('admins').doc(user.uid).get();
        data = doc.exists ? doc.data() : null;
      }

      if (data) {
        setUserData({
          name: data.name || 'User',
          email: user.email || '',
          phone: data.phone || '',
          address: data.address || '',
          imageUrl: data.imageUrl || null,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    showAlert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await auth().signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              showError('Error', 'Failed to logout');
            }
          },
        },
      ],
    );
  };

  const handleEditProfile = () => {
    props.navigation.closeDrawer();
    props.navigation.navigate('EditProfileScreen');
  };

  const handleFavorites = () => {
    props.navigation.closeDrawer();
    props.navigation.navigate('FavoritesScreen');
  };

  const handleSettings = () => {
    props.navigation.closeDrawer();
    props.navigation.navigate('SettingsScreen');
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header with Gradient */}
        <LinearGradient
          colors={[Colors.primaryLight, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHeader}
        >
          <View style={styles.profileContent}>
            {userData?.imageUrl ? (
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: userData.imageUrl }}
                  style={styles.avatar}
                />
                <View style={styles.avatarBadge} />
              </View>
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User2 color={Colors.primary} size={42} strokeWidth={2} />
              </View>
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {userData?.name || 'User'}
              </Text>
              {userData?.email && (
                <Text style={styles.userEmail} numberOfLines={1}>
                  {userData.email}
                </Text>
              )}
            </View>
          </View>
        </LinearGradient>

        {/* Profile Info Cards */}
        {(userData?.phone || userData?.address) && (
          <View style={styles.infoSection}>
            {userData?.phone && (
              <View style={styles.infoCard}>
                <View style={[styles.infoIconContainer, { backgroundColor: `${Colors.primary}15` }]}>
                  <Phone size={18} color={Colors.primary} />
                </View>
                <Text style={styles.infoText} numberOfLines={1}>
                  {userData.phone}
                </Text>
              </View>
            )}
            {userData?.address && (
              <View style={styles.infoCard}>
                <View style={[styles.infoIconContainer, { backgroundColor: `${Colors.primary}15` }]}>
                  <MapPin size={18} color={Colors.primary} />
                </View>
                <Text style={styles.infoText} numberOfLines={2}>
                  {userData.address}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: `${Colors.primary}15` }]}>
              <Edit size={20} color={Colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Edit Profile</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleFavorites}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: `${Colors.primary}15` }]}>
              <Heart 
                size={20} 
                color={Colors.primary} 
                fill={Colors.primary}
                strokeWidth={2} 
              />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Favorites</Text>
              {(favoriteRestaurants.length > 0 || favoriteProducts.length > 0) && (
                <Text style={styles.menuBadge}>
                  {favoriteRestaurants.length + favoriteProducts.length}
                </Text>
              )}
            </View>
            <ChevronRight size={20} color={Colors.textLight} style={styles.chevron} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleSettings}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, { backgroundColor: `${Colors.primary}15` }]}>
              <Settings size={20} color={Colors.primary} strokeWidth={2} />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuText}>Settings</Text>
            </View>
            <ChevronRight size={20} color={Colors.textLight} style={styles.chevron} />
          </TouchableOpacity>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.logoutIconContainer, { backgroundColor: `${Colors.error}15` }]}>
              <LogOut size={20} color={Colors.error} strokeWidth={2} />
            </View>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>FoodGo v1.0.0</Text>
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  drawerContent: {
    paddingBottom: Spacing.xxxl,
  },
  // Profile Header
  profileHeader: {
    marginTop: -10,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
    ...Shadows.medium,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: Colors.textWhite,
    backgroundColor: Colors.textWhite,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.success,
    borderWidth: 3,
    borderColor: Colors.textWhite,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.textWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 4,
    borderColor: Colors.textWhite,
    ...Shadows.small,
  },
  userInfo: {
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textWhite,
    opacity: 0.95,
    textAlign: 'center',
  },
  // Info Section
  infoSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  infoIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  infoText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
    flex: 1,
  },
  // Menu Section
  menuSection: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bold,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.background,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
  },
  menuTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  menuBadge: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    textAlign: 'center',
  },
  chevron: {
    marginLeft: Spacing.sm,
  },
  // Logout Section
  logoutSection: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
  },
  logoutIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  logoutText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
    color: Colors.error,
    flex: 1,
  },
  // Footer
  footer: {
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
  },
});

