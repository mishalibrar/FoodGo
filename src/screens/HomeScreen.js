import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  RefreshControl,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { ShoppingBag, User2Icon, MapPin } from 'lucide-react-native';
import Geolocation from '@react-native-community/geolocation';
import RestaurantCard from '../components/RestaurantCard';
import CategoryCard from '../components/CategoryCard';
import { useEffect, useState, useRef } from 'react';
import CustomModal from '../components/CustomModal';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Colors, Fonts, FontSizes, Spacing, Shadows, BorderRadius } from '../styles/globalStyles';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { filterRestaurantsByDistance } from '../utils/locationUtils';

const HomeScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]); // Store all restaurants before filtering
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const locationFetchRef = useRef({ active: false, success: false });

  const {
    location,
    setLocation,
    locationAddress,
    setLocationAddress,
    fetchingLocation,
    setFetchingLocation,
    locationError,
    setLocationError,
  } = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const navigation = useNavigation();

  useEffect(() => {
    setShowModal(true);
  }, []);

  // Request location permissions
  const requestLocationPermission = async () => {
    console.log('[Location] Requesting location permission...');
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'FoodGo needs access to your location to show nearby restaurants.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        console.log('[Location] Permission result:', granted);
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        console.log('[Location] Permission granted:', isGranted);
        return isGranted;
      } catch (err) {
        console.error('[Location] Permission request error:', err);
        return false;
      }
    }
    console.log('[Location] iOS - permissions handled automatically');
    return true; // iOS handles permissions automatically
  };

  // Reverse geocoding to get address and city from coordinates using OpenWeatherMap API
  const getAddressFromCoordinates = async (latitude, longitude) => {
    console.log('[Geocoding] Starting reverse geocoding for:', latitude, longitude);
    try {
      const apiKey = 'a9e69cf557ecfe6ddbf4e72af2e21b2a';
      const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
      console.log('[Geocoding] Fetching from OpenWeatherMap API...');

      const response = await fetch(url);
      console.log('[Geocoding] Response status:', response.status, response.statusText);

      // Check if response is OK
      if (!response.ok) {
        console.error('[Geocoding] HTTP error! status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Geocoding] Response data:', JSON.stringify(data, null, 2));

      if (data && data.length > 0) {
        const locationData = data[0];
        console.log('[Geocoding] Location data:', {
          name: locationData.name,
          state: locationData.state,
          country: locationData.country,
          local_names: locationData.local_names
        });

        // Extract city name - prefer English name from local_names, fallback to name
        let cityName = locationData.local_names?.en || locationData.name || '';

        console.log('[Geocoding] Extracted city name:', cityName);

        if (cityName) {
          // Update location with city information
          setLocation(prevLocation => {
            if (prevLocation && prevLocation.latitude === latitude && prevLocation.longitude === longitude) {
              return {
                ...prevLocation,
                city: cityName
              };
            }
            return prevLocation;
          });
          return cityName;
        }
      }

      // Fallback to coordinates if address not found
      console.warn('[Geocoding] No address found in response, falling back to coordinates');
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      console.error('[Geocoding] Error getting location:', error.message);
      console.error('[Geocoding] Error details:', error);
      // Silently fallback to coordinates
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  // Fetch current location with retry logic
  const fetchCurrentLocation = async (isRetry = false, useHighAccuracy = false) => {
    console.log('[Location] ===== Starting location fetch =====');
    console.log('[Location] isRetry:', isRetry, 'useHighAccuracy:', useHighAccuracy, 'retryCount:', retryCount);

    // Mark this fetch as active
    locationFetchRef.current = { active: true, success: false };

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.error('[Location] Permission denied - cannot fetch location');
      locationFetchRef.current = { active: false, success: false };
      if (isRetry) {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show your current location. Please enable it in settings.',
          [{ text: 'OK' }]
        );
      }
      setLocationError(true);
      setFetchingLocation(false);
      return;
    }

    console.log('[Location] Permission granted, starting location fetch...');
    setFetchingLocation(true);
    setLocationError(false);

    // Try with high accuracy first, then fallback to network-based location
    const options = {
      enableHighAccuracy: useHighAccuracy,
      timeout: useHighAccuracy ? 20000 : 30000, // Longer timeout for network-based
      maximumAge: useHighAccuracy ? 0 : 60000, // Accept older cached location for network-based
    };

    console.log('[Location] Geolocation options:', JSON.stringify(options));
    console.log('[Location] Calling Geolocation.getCurrentPosition...');

    Geolocation.getCurrentPosition(
      async (position) => {
        // Check if this fetch is still active (not superseded by a retry)
        if (!locationFetchRef.current.active) {
          console.log('[Location] Ignoring success - fetch was superseded');
          return;
        }

        console.log('[Location] ===== SUCCESS: Location received =====');
        console.log('[Location] Position:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });

        // Mark as successful
        locationFetchRef.current = { active: false, success: true };

        try {
          const { latitude, longitude } = position.coords;

          setLocation({ latitude, longitude, city: null });
          setRetryCount(0);

          // Show coordinates immediately while geocoding
          const coordinatesString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          console.log('[Location] Setting location address to coordinates:', coordinatesString);
          setLocationAddress(coordinatesString);
          setFetchingLocation(false);
          setLocationError(false);

          console.log('[Location] Starting reverse geocoding...');
          // Get address from coordinates (async, will update when done)
          getAddressFromCoordinates(latitude, longitude)
            .then((address) => {
              // Only update if this fetch is still the successful one
              if (locationFetchRef.current.success) {
                console.log('[Location] Geocoding successful, updating address to:', address);
                setLocationAddress(address);
                // City is already updated in getAddressFromCoordinates via setLocation
              } else {
                console.log('[Location] Ignoring geocoding result - fetch was superseded');
              }
            })
            .catch((error) => {
              console.error('[Location] Geocoding failed, coordinates already displayed:', error.message);
            });
        } catch (error) {
          console.error('[Location] Error processing location:', error);
          locationFetchRef.current = { active: false, success: false };
          setFetchingLocation(false);
          setLocationError(true);
        }
      },
      async (error) => {
        // Only process error if this fetch is still active
        if (!locationFetchRef.current.active) {
          console.log('[Location] Ignoring error - fetch was superseded');
          return;
        }

        console.error('[Location] ===== ERROR: Location fetch failed =====');
        console.error('[Location] Error code:', error.code);
        console.error('[Location] Error message:', error.message);

        setFetchingLocation(false);

        // Handle different error codes
        if (error.code === 1) {
          // Permission denied
          console.error('[Location] Error Code 1: PERMISSION_DENIED');
          locationFetchRef.current = { active: false, success: false };
          setLocationError(true);
          if (isRetry) {
            Alert.alert(
              'Permission Denied',
              'Location permission is required. Please enable it in your device settings.',
              [{ text: 'OK' }]
            );
          }
        } else if (error.code === 2) {
          // Position unavailable
          console.error('[Location] Error Code 2: POSITION_UNAVAILABLE');
          locationFetchRef.current = { active: false, success: false };
          setLocationError(true);
          if (isRetry) {
            Alert.alert(
              'Location Unavailable',
              'Unable to determine your location. Please check that GPS is enabled and try again.',
              [{ text: 'OK' }]
            );
          }
        } else if (error.code === 3) {
          // Timeout
          console.error('[Location] Error Code 3: TIMEOUT');
          console.log('[Location] Timeout - useHighAccuracy:', useHighAccuracy, 'retryCount:', retryCount);

          // If we tried with high accuracy and it timed out, retry with network-based location
          if (useHighAccuracy && retryCount < 2) {
            const newRetryCount = retryCount + 1;
            console.log('[Location] Retrying with network-based location, retry count:', newRetryCount);
            setRetryCount(newRetryCount);
            // Retry with network-based location (lower accuracy but faster)
            setTimeout(() => {
              console.log('[Location] Retrying location fetch...');
              fetchCurrentLocation(true, false);
            }, 1000);
            // Don't mark as inactive yet - the retry will handle it
          } else {
            console.error('[Location] Max retries reached or not using high accuracy');
            locationFetchRef.current = { active: false, success: false };
            setLocationError(true);
            if (isRetry) {
              Alert.alert(
                'Location Timeout',
                'Location request timed out. This may happen if you\'re indoors or GPS signal is weak. Please try again or check your location settings.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Retry',
                    onPress: () => {
                      console.log('[Location] User initiated retry');
                      setRetryCount(0);
                      fetchCurrentLocation(true, false);
                    }
                  }
                ]
              );
            }
          }
        } else {
          console.error('[Location] Unknown error code:', error.code);
          locationFetchRef.current = { active: false, success: false };
          setLocationError(true);
          if (isRetry) {
            Alert.alert(
              'Location Error',
              'Unable to get your location. Please check your location settings and try again.',
              [{ text: 'OK' }]
            );
          }
        }
      },
      options
    );
  };

  useEffect(() => {
    console.log('[Location] Component mounted, initializing location fetch...');
    // Initial location fetch - try with high accuracy first
    // Small delay to ensure component is mounted
    const timer = setTimeout(() => {
      console.log('[Location] Starting initial location fetch...');
      fetchCurrentLocation(false, true);
    }, 100);

    return () => {
      console.log('[Location] Component unmounting, clearing timer');
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const doc = await firestore().collection('users').doc(user.uid).get();
          if (doc.exists) {
            setUserName(doc.data().name);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch restaurants and categories in parallel
      const [restaurantsSnapshot, categoriesSnapshot] = await Promise.all([
        firestore().collectionGroup('restaurants').get(),
        firestore().collectionGroup('categories').get(),
      ]);

      const restaurantsData = restaurantsSnapshot.docs.map(doc => {
        const adminId = doc.ref.parent.parent.id;
        return {
          id: doc.id,
          adminId: adminId,
          ...doc.data(),
        };
      });

      // Categories are nested under restaurants: admins/{adminId}/restaurants/{restaurantId}/categories/{categoryId}
      // Extract adminId and restaurantId from the document path
      const categoriesData = categoriesSnapshot.docs.map(doc => {
        const pathParts = doc.ref.path.split('/');
        const adminIdIndex = pathParts.indexOf('admins');
        const restaurantIdIndex = pathParts.indexOf('restaurants');

        const adminId = adminIdIndex !== -1 && pathParts[adminIdIndex + 1]
          ? pathParts[adminIdIndex + 1]
          : null;
        const restaurantId = restaurantIdIndex !== -1 && pathParts[restaurantIdIndex + 1]
          ? pathParts[restaurantIdIndex + 1]
          : null;

        return {
          id: doc.id,
          adminId,
          restaurantId,
          ...doc.data(),
        };
      });

      setAllRestaurants(restaurantsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    await fetchData(true);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      await fetchData(false);
    };

    if (isMounted) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter restaurants by distance when location changes
  useEffect(() => {
    if (allRestaurants.length > 0 && location && location.latitude && location.longitude) {
      const nearbyRestaurants = filterRestaurantsByDistance(allRestaurants, location, 30); // 30km radius or same city
      setRestaurants(nearbyRestaurants);
    } else if (allRestaurants.length > 0) {
      // If no location available, show all restaurants (or empty if you prefer)
      // For now, we'll show all restaurants until location is available
      setRestaurants(allRestaurants);
    }
  }, [location, allRestaurants]);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <CustomModal visible={showModal} onClose={() => setShowModal(false)} />

      <View style={styles.headerContainer}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => {
              navigation.openDrawer();
            }}
            activeOpacity={0.7}
          >
            <View style={styles.feathericon}>
              <Feather name="bar-chart-2" color={Colors.textWhite} size={22} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.locationContainer}
            onPress={() => {
              setRetryCount(0);
              fetchCurrentLocation(true, true);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.locationContent}>
              <Text style={styles.delivertextstyle}>DELIVER TO</Text>
              <View style={styles.locationRow}>
                {fetchingLocation ? (
                  <ActivityIndicator size="small" color={Colors.textWhite} style={{ marginRight: Spacing.xs }} />
                ) : (
                  <MapPin
                    size={14}
                    color={locationError ? Colors.textWhite : Colors.textWhite}
                    style={{ marginRight: Spacing.xs }}
                  />
                )}
                <Text
                  style={[
                    styles.locationText,
                    locationError && styles.errorTextLight
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {fetchingLocation
                    ? 'Getting location...'
                    : locationError
                      ? 'Tap to get location'
                      : locationAddress || 'Location unavailable'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.cartContainer}>
          <View style={styles.lucideicon}>
            <ShoppingBag color="#ffffff" size={25} />
          </View>
          {cartCount > 0 && (
            <View style={styles.badgeiconstyle}>
              <Text
                style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}
              >
                {cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Hey {userName || 'User'}</Text>
      </View>

      <TouchableOpacity
        style={styles.searchBox}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('SearchScreen')}
      >
        <Feather name="search" size={20} color={Colors.textPlaceholder} style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>
          Search dishes, restaurants
        </Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* All Categories Section */}
        {categories.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Categories</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AllCategoriesScreen', { categories })}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <CategoryCard data={categories.slice(0, 8)} />
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Open Restaurants</Text>
          {restaurants.length > 0 && (
            <Text style={styles.restaurantCount}>{restaurants.length} available</Text>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading restaurants...</Text>
          </View>
        ) : restaurants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No restaurants available</Text>
            <Text style={styles.emptySubtext}>Check back later for new restaurants</Text>
          </View>
        ) : (
          <RestaurantCard data={restaurants} />
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  headerContainer: {
    paddingLeft: 20,
    paddingRight: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 10,
    zIndex: 999,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
    ...Shadows.medium,
  },
  topBar: {
    flexDirection: 'row',
    width: '70%',
  },
  feathericon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
  },
  locationContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    width: '70%',
  },
  locationContent: {
    flexDirection: 'column',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  delivertextstyle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xs,
    color: Colors.textWhite,
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  locationText: {
    color: Colors.textWhite,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    flex: 1,
  },
  cartContainer: {
    width: '30%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  lucideicon: {
    backgroundColor: '#181C2E',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeiconstyle: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: Colors.success,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    transform: [{ translateX: 5 }, { translateY: -5 }],
    zIndex: 999999999,
  },
  greetingContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'baseline',
  },
  greetingText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  greetingSubtext: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: Spacing.md,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textPlaceholder,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxl,
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.md,
    color: Colors.primary,
  },
  restaurantCount: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textTertiary,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textTertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.error,
  },
  errorTextLight: {
    color: Colors.textWhite,
    opacity: 0.8,
  },
});
