import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Pin, MapPin } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import Feather from 'react-native-vector-icons/Feather';
import AddRestaurantModal from '../components/AddRestaurantModal';
import EditRestaurantModal from '../components/EditRestaurantModal';
import AdminRestaurantCard from '../components/AdminRestaurantCard';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const adminUid = route.params?.adminUid;
  const [restaurants, setRestaurants] = useState([]);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  
  // Location state
  const [location, setLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState('Getting location...');
  const [fetchingLocation, setFetchingLocation] = useState(true);
  const [locationError, setLocationError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const locationFetchRef = useRef({ active: false, success: false });

  // Request location permissions
  const requestLocationPermission = async () => {
    console.log('[AdminDashboard] Requesting location permission...');
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'FoodGo needs access to your location to register your restaurant.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        console.log('[AdminDashboard] Permission result:', granted);
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        console.log('[AdminDashboard] Permission granted:', isGranted);
        return isGranted;
      } catch (err) {
        console.error('[AdminDashboard] Permission request error:', err);
        return false;
      }
    }
    console.log('[AdminDashboard] iOS - permissions handled automatically');
    return true; // iOS handles permissions automatically
  };

  // Reverse geocoding to get address from coordinates
  const getAddressFromCoordinates = async (latitude, longitude) => {
    console.log('[AdminDashboard] Starting reverse geocoding for:', latitude, longitude);
    try {
      const apiKey = 'a9e69cf557ecfe6ddbf4e72af2e21b2a';
      const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;
      console.log('[AdminDashboard] Fetching from OpenWeatherMap API...');
      
      const response = await fetch(url);
      console.log('[AdminDashboard] Geocoding response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[AdminDashboard] Geocoding response data:', JSON.stringify(data, null, 2));
      
      if (data && data.length > 0) {
        const locationData = data[0];
        let cityName = locationData.local_names?.en || locationData.name || '';
        console.log('[AdminDashboard] Extracted city name:', cityName);
        
        if (cityName) {
          setLocation(prev => ({
            ...prev,
            latitude,
            longitude,
            city: cityName
          }));
          console.log('[AdminDashboard] Location updated with city:', cityName);
          return cityName;
        }
      }
      
      console.warn('[AdminDashboard] No city found, using coordinates');
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch (error) {
      console.error('[AdminDashboard] Error getting location:', error.message);
      console.error('[AdminDashboard] Error details:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  // Fetch current location with retry logic (matching HomeScreen implementation)
  const fetchCurrentLocation = async (isRetry = false, useHighAccuracy = false) => {
    console.log('[AdminDashboard] ===== Starting location fetch =====');
    console.log('[AdminDashboard] isRetry:', isRetry, 'useHighAccuracy:', useHighAccuracy, 'retryCount:', retryCount);
    
    // Mark this fetch as active
    locationFetchRef.current = { active: true, success: false };
    
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.error('[AdminDashboard] Permission denied - cannot fetch location');
      locationFetchRef.current = { active: false, success: false };
      if (isRetry) {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to register your restaurant location. Please enable it in settings.',
          [{ text: 'OK' }]
        );
      }
      setLocationError(true);
      setFetchingLocation(false);
      return;
    }

    console.log('[AdminDashboard] Permission granted, starting location fetch...');
    setFetchingLocation(true);
    setLocationError(false);
    
    // Try with high accuracy first, then fallback to network-based location
    const options = {
      enableHighAccuracy: useHighAccuracy,
      timeout: useHighAccuracy ? 20000 : 30000, // Longer timeout for network-based
      maximumAge: useHighAccuracy ? 0 : 60000, // Accept older cached location for network-based
    };
    
    console.log('[AdminDashboard] Geolocation options:', JSON.stringify(options));
    console.log('[AdminDashboard] Calling Geolocation.getCurrentPosition...');

    Geolocation.getCurrentPosition(
      async (position) => {
        // Check if this fetch is still active (not superseded by a retry)
        if (!locationFetchRef.current.active) {
          console.log('[AdminDashboard] Ignoring success - fetch was superseded');
          return;
        }
        
        console.log('[AdminDashboard] ===== SUCCESS: Location received =====');
        console.log('[AdminDashboard] Position:', {
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
          console.log('[AdminDashboard] Setting location address to coordinates:', coordinatesString);
          setLocationAddress(coordinatesString);
          setFetchingLocation(false);
          setLocationError(false);
          
          console.log('[AdminDashboard] Starting reverse geocoding...');
          // Get address from coordinates (async, will update when done)
          getAddressFromCoordinates(latitude, longitude)
            .then((address) => {
              // Only update if this fetch is still the successful one
              if (locationFetchRef.current.success) {
                console.log('[AdminDashboard] Geocoding successful, updating address to:', address);
                setLocationAddress(address);
              } else {
                console.log('[AdminDashboard] Ignoring geocoding result - fetch was superseded');
              }
            })
            .catch((error) => {
              console.error('[AdminDashboard] Geocoding failed, coordinates already displayed:', error.message);
            });
        } catch (error) {
          console.error('[AdminDashboard] Error processing location:', error);
          locationFetchRef.current = { active: false, success: false };
          setFetchingLocation(false);
          setLocationError(true);
        }
      },
      async (error) => {
        // Only process error if this fetch is still active
        if (!locationFetchRef.current.active) {
          console.log('[AdminDashboard] Ignoring error - fetch was superseded');
          return;
        }
        
        console.error('[AdminDashboard] ===== ERROR: Location fetch failed =====');
        console.error('[AdminDashboard] Error code:', error.code);
        console.error('[AdminDashboard] Error message:', error.message);
        
        setFetchingLocation(false);
        
        // Handle different error codes
        if (error.code === 1) {
          // Permission denied
          console.error('[AdminDashboard] Error Code 1: PERMISSION_DENIED');
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
          console.error('[AdminDashboard] Error Code 2: POSITION_UNAVAILABLE');
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
          console.error('[AdminDashboard] Error Code 3: TIMEOUT');
          console.log('[AdminDashboard] Timeout - useHighAccuracy:', useHighAccuracy, 'retryCount:', retryCount);
          
          // If we tried with high accuracy and it timed out, retry with network-based location
          if (useHighAccuracy && retryCount < 2) {
            const newRetryCount = retryCount + 1;
            console.log('[AdminDashboard] Retrying with network-based location, retry count:', newRetryCount);
            setRetryCount(newRetryCount);
            // Retry with network-based location (lower accuracy but faster)
            setTimeout(() => {
              console.log('[AdminDashboard] Retrying location fetch...');
              fetchCurrentLocation(true, false);
            }, 1000);
            // Don't mark as inactive yet - the retry will handle it
          } else {
            console.error('[AdminDashboard] Max retries reached or not using high accuracy');
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
                      console.log('[AdminDashboard] User initiated retry');
                      setRetryCount(0);
                      fetchCurrentLocation(true, false);
                    }
                  }
                ]
              );
            }
          }
        } else {
          console.error('[AdminDashboard] Unknown error code:', error.code);
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

  // Fetch location on mount
  useEffect(() => {
    console.log('[AdminDashboard] Component mounted, initializing location fetch...');
    const timer = setTimeout(() => {
      console.log('[AdminDashboard] Starting initial location fetch...');
      fetchCurrentLocation(false, true);
    }, 100);
    
    return () => {
      console.log('[AdminDashboard] Component unmounting, clearing timer');
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!adminUid) {
      console.log('[AdminDashboard] No adminUid provided');
      return;
    }

    console.log('[AdminDashboard] Setting up restaurant listener for admin:', adminUid);
    const unsubscribe = firestore()
      .collection('admins')
      .doc(adminUid)
      .collection('restaurants')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('[AdminDashboard] Restaurants updated, count:', data.length);
        console.log('[AdminDashboard] Restaurants data:', data);
        setRestaurants(data);
      }, error => {
        console.error('[AdminDashboard] Error listening to restaurants:', error);
      });
    return () => {
      console.log('[AdminDashboard] Unsubscribing from restaurant listener');
      unsubscribe();
    };
  }, [route.params?.adminUid]);

  const handleAddRestaurant = () => {
    console.log('[AdminDashboard] Add restaurant button pressed');
    console.log('[AdminDashboard] Current restaurants count:', restaurants.length);
    console.log('[AdminDashboard] Current location:', location);
    
    if (restaurants.length >= 1) {
      console.log('[AdminDashboard] Limit reached - cannot add more restaurants');
      Alert.alert(
        'Limit Reached',
        'You can only register one restaurant. Please edit or delete your existing restaurant.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (!location || !location.latitude || !location.longitude) {
      console.warn('[AdminDashboard] Location not available, cannot add restaurant');
      Alert.alert(
        'Location Required',
        'Please wait for your location to be fetched, or tap the location button to retry.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Retry Location',
            onPress: () => {
              console.log('[AdminDashboard] User initiated location retry');
              fetchCurrentLocation(true, true);
            }
          }
        ]
      );
      return;
    }
    
    console.log('[AdminDashboard] Opening add restaurant modal');
    console.log('[AdminDashboard] Passing location to modal:', {
      address: locationAddress,
      coordinates: location
    });
    setAddModalVisible(true);
  };

  const deleteRestaurant = restaurantId => {
    console.log('[AdminDashboard] Delete restaurant requested for ID:', restaurantId);
    Alert.alert(
      'Delete Restaurant',
      'Are you sure you want to delete this restaurant?',
      [
        { 
          text: 'Cancel', 
          style: 'cancel',
          onPress: () => {
            console.log('[AdminDashboard] Delete cancelled');
          }
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            console.log('[AdminDashboard] Deleting restaurant:', restaurantId);
            try {
              await firestore()
                .collection('admins')
                .doc(adminUid)
                .collection('restaurants')
                .doc(restaurantId)
                .delete();
              console.log('[AdminDashboard] Restaurant deleted successfully');
            } catch (error) {
              console.error('[AdminDashboard] Error deleting restaurant:', error);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
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
              <Text style={styles.delivertextstyle}>RESTAURANT LOCATION</Text>
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

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Admin Dashboard</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.subtitle}>My Restaurant</Text>
          {restaurants.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{restaurants.length}</Text>
            </View>
          )}
        </View>

        <FlatList
          data={restaurants}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AdminRestaurantCard
              restaurant={item}
              onPress={() =>
                navigation.navigate('AdminRestaurantDetail', {
                  adminUid: adminUid,
                  restaurantId: item.id,
                })
              }
              onEdit={() => {
                setEditingRestaurant(item);
                setEditModalVisible(true);
              }}
              onDelete={() => deleteRestaurant(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Pin size={48} color={Colors.textLight} strokeWidth={1.5} />
              </View>
              <Text style={styles.emptyTitle}>No Restaurant Yet</Text>
              <Text style={styles.emptySubtext}>Tap the + button below to register your restaurant</Text>
            </View>
          }
        />
      </View>

      {restaurants.length === 0 && (
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={handleAddRestaurant}
        >
          <Text style={styles.floatingBtnText}>+</Text>
        </TouchableOpacity>
      )}

      <AddRestaurantModal
        isVisible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={() => setAddModalVisible(false)}
        adminUid={adminUid}
        initialLocation={locationAddress}
        currentLocation={location}
      />

      <EditRestaurantModal
        isVisible={isEditModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setEditingRestaurant(null);
        }}
        onSave={() => {
          setEditModalVisible(false);
          setEditingRestaurant(null);
        }}
        adminUid={adminUid}
        restaurant={editingRestaurant}
      />
    </View>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  headerContainer: {
    paddingLeft: Spacing.xl,
    paddingRight: Spacing.xl + 5,
    flexDirection: 'column',
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    zIndex: 999,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
    ...Shadows.medium,
  },
  topBar: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-start',
  },
  feathericon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 45,
    height: 45,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
  },
  locationContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    flex: 1,
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
    letterSpacing: 0.8,
    opacity: 0.9,
  },
  locationText: {
    color: Colors.textWhite,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    flex: 1,
  },
  titleContainer: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
    alignItems: 'center',
  },
  title: { 
    fontSize: FontSizes.xxxl, 
    fontFamily: Fonts.bold, 
    color: Colors.textWhite,
    letterSpacing: 0.3,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  subtitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
    minWidth: 24,
    height: 24,
    paddingHorizontal: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.textWhite,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorText: {
    color: Colors.error,
  },
  errorTextLight: {
    color: Colors.textWhite,
    opacity: 0.8,
  },
  floatingBtn: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    backgroundColor: Colors.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.large,
  },
  floatingBtnText: {
    color: Colors.textWhite,
    fontSize: 32,
    fontFamily: Fonts.bold,
    lineHeight: 36,
  },
});
