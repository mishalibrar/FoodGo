import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search } from 'lucide-react-native';
import CustomTextInput from '../components/CustomTextInput';
import { ShoppingBag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import SuggestedRestaurantFlatlist from '../components/SuggestedRestaurantFlatlist';
import PopularFood from '../components/PopularFood';
import { useCart } from '../context/CartContext';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const SearchScreen = () => {
  const navigation = useNavigation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [suggestedRestaurants, setSuggestedRestaurants] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  // Fetch restaurants and items
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all restaurants
        const restaurantsSnapshot = await firestore()
          .collectionGroup('restaurants')
          .get();

        if (!isMounted) return;

        const restaurantsData = restaurantsSnapshot.docs.map(doc => {
          const adminId = doc.ref.parent.parent.id;
          return {
            id: doc.id,
            adminId: adminId,
            ...doc.data(),
          };
        });

        // Get suggested restaurants (top 3 by rating or first 3)
        const suggested = restaurantsData
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3)
          .map(rest => ({
            id: rest.id,
            title: rest.name,
            ratings: rest.rating || 4.0,
            img: rest.imageUrl ? { uri: rest.imageUrl } : require('../assets/images/suggested1.jpg'),
            restaurant: rest,
          }));

        // Fetch all items from all restaurants
        const itemsPromises = restaurantsData.map(async (restaurant) => {
          try {
            const categoriesSnapshot = await firestore()
              .collection('admins')
              .doc(restaurant.adminId)
              .collection('restaurants')
              .doc(restaurant.id)
              .collection('categories')
              .get();

            const itemsPromises = categoriesSnapshot.docs.map(async (catDoc) => {
              const itemsSnapshot = await firestore()
                .collection('admins')
                .doc(restaurant.adminId)
                .collection('restaurants')
                .doc(restaurant.id)
                .collection('categories')
                .doc(catDoc.id)
                .collection('items')
                .get();

              return itemsSnapshot.docs.map(itemDoc => ({
                id: itemDoc.id,
                adminId: restaurant.adminId,
                restaurantId: restaurant.id,
                categoryId: catDoc.id,
                restaurantName: restaurant.name,
                ...itemDoc.data(),
              }));
            });

            const itemsArrays = await Promise.all(itemsPromises);
            return itemsArrays.flat();
          } catch (error) {
            console.error(`Error fetching items for restaurant ${restaurant.id}:`, error);
            return [];
          }
        });

        const allItemsArrays = await Promise.all(itemsPromises);
        const allItems = allItemsArrays.flat();

        // Get popular items (top 4 by price or first 4)
        const popular = allItems
          .slice(0, 4)
          .map(item => ({
            id: item.id,
            title: item.name,
            restaurant: item.restaurantName,
            img: item.imageUrl ? { uri: item.imageUrl } : require('../assets/images/pizza.png'),
            item: item,
          }));

        // Extract unique keywords from category names and item names
        const categoryNames = new Set();
        const itemNames = new Set();
        
        restaurantsData.forEach(rest => {
          // We'll fetch categories separately if needed
        });

        allItems.forEach(item => {
          if (item.name) {
            const words = item.name.split(' ').filter(w => w.length > 2);
            words.forEach(word => itemNames.add(word));
          }
        });

        const uniqueKeywords = Array.from(itemNames)
          .slice(0, 7)
          .map((keyword, index) => ({
            id: index + 1,
            title: keyword,
          }));

        if (isMounted) {
          setSuggestedRestaurants(suggested);
          setPopularItems(popular);
          setKeywords(uniqueKeywords);
          setAllRestaurants(restaurantsData);
          setAllItems(allItems);
        }
      } catch (error) {
        console.error('Error fetching search data:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter data based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRestaurants([]);
      setFilteredItems([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    
    // Filter all restaurants
    const filtered = allRestaurants
      .filter(rest => rest.name && rest.name.toLowerCase().includes(query))
      .map(rest => ({
        id: rest.id,
        title: rest.name,
        ratings: rest.rating || 4.0,
        img: rest.imageUrl ? { uri: rest.imageUrl } : require('../assets/images/suggested1.jpg'),
        restaurant: rest,
      }));
    setFilteredRestaurants(filtered);

    // Filter all items
    const filteredItemsList = allItems
      .filter(item => 
        (item.name && item.name.toLowerCase().includes(query)) ||
        (item.restaurantName && item.restaurantName.toLowerCase().includes(query))
      )
      .map(item => ({
        id: item.id,
        title: item.name,
        restaurant: item.restaurantName,
        img: item.imageUrl ? { uri: item.imageUrl } : require('../assets/images/pizza.png'),
        item: item,
      }));
    setFilteredItems(filteredItemsList);
  }, [searchQuery, allRestaurants, allItems]);

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <View style={styles.backButton}>
            <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Search</Text>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('CartScreen')}
          activeOpacity={0.7}
          style={styles.cartButton}
        >
          <View style={styles.cartIconContainer}>
            <ShoppingBag size={22} color={Colors.textWhite} strokeWidth={2} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={18} color={Colors.textTertiary} style={styles.searchIcon} />
          <CustomTextInput 
            name="Search dishes, restaurants" 
            color={Colors.textTertiary}
            value={searchQuery}
            setState={setSearchQuery}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <>
            {!searchQuery ? (
              <>
                {/* Recent Keywords */}
                {keywords.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Recent Keywords</Text>
                    </View>
                    <FlatList
                      data={keywords}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.keywordsList}
                      renderItem={({ item }) => (
                        <TouchableOpacity 
                          onPress={() => setSearchQuery(item.title)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.keywordChip}>
                            <Text style={styles.keywordText}>{item.title}</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item.id.toString()}
                    />
                  </>
                )}
                
                {/* Suggested Restaurants */}
                {suggestedRestaurants.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Suggested Restaurants</Text>
                    </View>
                    <SuggestedRestaurantFlatlist data={suggestedRestaurants} />
                  </>
                )}
                
                {/* Popular Fast Food */}
                {popularItems.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Popular Fast Food</Text>
                    </View>
                    <PopularFood data={popularItems} />
                  </>
                )}
              </>
            ) : (
              <>
                {/* Search Results */}
                {filteredRestaurants.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Restaurants</Text>
                    </View>
                    <SuggestedRestaurantFlatlist data={filteredRestaurants} />
                  </>
                )}
                {filteredItems.length > 0 && (
                  <>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Food Items</Text>
                    </View>
                    <PopularFood data={filteredItems} />
                  </>
                )}
                {filteredRestaurants.length === 0 && filteredItems.length === 0 && (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No results found</Text>
                    <Text style={styles.emptySubtext}>Try searching for something else</Text>
                  </View>
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  cartButton: {
    width: 40,
    height: 40,
  },
  cartIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#181C2E',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...Shadows.small,
  },
  badge: {
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
    transform: [{ translateX: 5 }, { translateY: -5 }],
    zIndex: 999999999,
    ...Shadows.small,
  },
  badgeText: {
    color: Colors.textWhite,
    fontSize: FontSizes.xs,
    fontFamily: Fonts.bold,
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm - 10,
    ...Shadows.small,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  keywordsList: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  keywordChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    ...Shadows.small,
  },
  keywordText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
  },
});
