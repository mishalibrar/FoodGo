import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import RestaurantCard from '../components/RestaurantCard';
import FilterModal from '../components/FilterModal';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const BurgerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params || {};

  const [categoryItems, setCategoryItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    const fetchCategoryData = async () => {
      try {
        setLoading(true);

        // Fetch all categories and filter by title client-side
        const categoriesSnapshot = await firestore()
          .collectionGroup('categories')
          .get();

        const allCategories = categoriesSnapshot.docs.map(doc => {
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

        // Filter categories by title
        const categoriesData = allCategories.filter(cat => cat.title === category.title);

        // Fetch items from all matching categories
        const itemsPromises = categoriesData.map(async (cat) => {
          try {
            const itemsSnapshot = await firestore()
              .collection('admins')
              .doc(cat.adminId)
              .collection('restaurants')
              .doc(cat.restaurantId)
              .collection('categories')
              .doc(cat.id)
              .collection('items')
              .get();

            return itemsSnapshot.docs.map(itemDoc => ({
              id: itemDoc.id,
              adminId: cat.adminId,
              restaurantId: cat.restaurantId,
              categoryId: cat.id,
              ...itemDoc.data(),
            }));
          } catch (error) {
            console.error(`Error fetching items for category ${cat.id}:`, error);
            return [];
          }
        });

        const itemsArrays = await Promise.all(itemsPromises);
        const allItems = itemsArrays.flat();
        setCategoryItems(allItems);

        // Fetch unique restaurants
        const restaurantIds = new Set();
        const restaurantsMap = new Map();
        
        categoriesData.forEach(cat => {
          const key = `${cat.adminId}_${cat.restaurantId}`;
          if (!restaurantIds.has(key)) {
            restaurantIds.add(key);
            restaurantsMap.set(key, {
              adminId: cat.adminId,
              restaurantId: cat.restaurantId,
            });
          }
        });

        const restaurantPromises = Array.from(restaurantsMap.values()).map(async ({ adminId, restaurantId }) => {
          try {
            const restaurantDoc = await firestore()
              .collection('admins')
              .doc(adminId)
              .collection('restaurants')
              .doc(restaurantId)
              .get();

            if (restaurantDoc.exists) {
              return {
                id: restaurantId,
                adminId,
                ...restaurantDoc.data(),
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching restaurant ${restaurantId}:`, error);
            return null;
          }
        });

        const restaurantsData = (await Promise.all(restaurantPromises)).filter(Boolean);
        setRestaurants(restaurantsData);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [category]);

  if (!category) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Category not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <View style={styles.backButton}>
            <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{category.title || 'Category'}</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SearchScreen')}
            activeOpacity={0.7}
            style={styles.searchButton}
          >
            <Search size={20} color={Colors.textWhite} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
            style={styles.filterButton}
          >
            <Filter size={20} color={Colors.textPrimary} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading category items...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Category Items */}
          {categoryItems.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  {category.title || 'Category'} Items
                </Text>
                <Text style={styles.itemCount}>{categoryItems.length} items</Text>
              </View>
              <View style={styles.itemsContainer}>
                {categoryItems.map((item, index) => (
                  <TouchableOpacity
                    key={`${item.id}-${index}`}
                    activeOpacity={0.88}
                    onPress={() =>
                      navigation.navigate('ProductDetailScreen', {
                        restaurantId: item.restaurantId,
                        adminId: item.adminId,
                        categoryId: item.categoryId,
                        itemId: item.id,
                        itemData: item,
                      })
                    }
                  >
                    <View style={styles.menuItem}>
                      {item.imageUrl && (
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={styles.menuItemImage}
                        />
                      )}
                      <View style={styles.menuItemContent}>
                        <Text style={styles.menuItemName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        {item.description && (
                          <Text style={styles.menuItemDescription} numberOfLines={2}>
                            {item.description}
                          </Text>
                        )}
                        <Text style={styles.menuItemPrice}>
                          {item.price || '0'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Restaurants with this category */}
          {restaurants.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Open Restaurants</Text>
              </View>
              <RestaurantCard data={restaurants} />
            </>
          )}

          {categoryItems.length === 0 && restaurants.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items found in this category</Text>
            </View>
          )}
        </ScrollView>
      )}

      <FilterModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

export default BurgerScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
    color: Colors.textTertiary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  itemCount: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
  },
  itemsContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
    backgroundColor: Colors.backgroundSecondary,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  menuItemDescription: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  menuItemPrice: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
    color: Colors.textTertiary,
  },
});
