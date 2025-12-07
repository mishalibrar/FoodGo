import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { ArrowLeft, Heart, Utensils, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext';
import { useAlert } from '../context/AlertContext';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { showAlert, hideAlert } = useAlert();
  const {
    favoriteRestaurants,
    favoriteProducts,
    removeRestaurantFromFavorites,
    removeProductFromFavorites,
  } = useFavorites();
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'restaurants', 'products'

  const handleRestaurantPress = (restaurant) => {
    navigation.navigate('RestaurantDetailScreen', { restaurant });
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetailScreen', {
      adminId: product.adminId,
      restaurantId: product.restaurantId,
      categoryId: product.categoryId,
      itemId: product.id,
      itemData: {
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: product.description,
      },
    });
  };

  const formatPrice = (price) => {
    if (typeof price === 'string') {
      const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
      return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
    }
    return parseFloat(price).toFixed(2);
  };

  const handleRemoveRestaurant = (restaurant) => {
    showAlert(
      'Remove from Favorites',
      `Are you sure you want to remove "${restaurant.name}" from your favorites?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Remove',
          onPress: () => {
            removeRestaurantFromFavorites(restaurant.id);
            hideAlert();
          },
        },
      ],
      'warning'
    );
  };

  const handleRemoveProduct = (product) => {
    showAlert(
      'Remove from Favorites',
      `Are you sure you want to remove "${product.name}" from your favorites?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
        },
        {
          text: 'Remove',
          onPress: () => {
            removeProductFromFavorites(product.id);
            hideAlert();
          },
        },
      ],
      'warning'
    );
  };

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => handleRestaurantPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={
          item.imageUrl
            ? { uri: item.imageUrl }
            : require('../assets/images/burgerbistro.jpg')
        }
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleRemoveRestaurant(item);
            }}
            style={styles.removeButton}
            activeOpacity={0.7}
          >
            <X size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>
        {item.details && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.details}
          </Text>
        )}
        {item.rating && (
          <View style={styles.ratingContainer}>
            <Heart size={14} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.ratingText}>
              {typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={
          item.imageUrl
            ? { uri: item.imageUrl }
            : require('../assets/images/burgerbistro.jpg')
        }
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleRemoveProduct(item);
            }}
            style={styles.removeButton}
            activeOpacity={0.7}
          >
            <X size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>
        {item.description && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <Text style={styles.itemPrice}>Rs {formatPrice(item.price)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = (type) => (
    <View style={styles.emptyContainer}>
      <Heart size={48} color={Colors.textLight} />
      <Text style={styles.emptyTitle}>No {type} favorites yet</Text>
      <Text style={styles.emptyText}>
        Start adding {type === 'restaurants' ? 'restaurants' : 'products'} to your favorites
      </Text>
    </View>
  );

  const getFilteredData = () => {
    if (activeTab === 'restaurants') {
      return { restaurants: favoriteRestaurants, products: [] };
    } else if (activeTab === 'products') {
      return { restaurants: [], products: favoriteProducts };
    }
    return { restaurants: favoriteRestaurants, products: favoriteProducts };
  };

  const { restaurants, products } = getFilteredData();
  const hasFavorites = favoriteRestaurants.length > 0 || favoriteProducts.length > 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <View style={styles.backButton}>
            <ArrowLeft size={22} color={Colors.textPrimary} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tabs */}
      {hasFavorites && (
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.tabActive]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
              All ({favoriteRestaurants.length + favoriteProducts.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'restaurants' && styles.tabActive]}
            onPress={() => setActiveTab('restaurants')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'restaurants' && styles.tabTextActive]}>
              Restaurants ({favoriteRestaurants.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'products' && styles.tabActive]}
            onPress={() => setActiveTab('products')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'products' && styles.tabTextActive]}>
              Products ({favoriteProducts.length})
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!hasFavorites ? (
          renderEmptyState('items')
        ) : (
          <>
            {/* Restaurants Section */}
            {restaurants.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Utensils size={20} color={Colors.primary} />
                  <Text style={styles.sectionTitle}>
                    Restaurants ({restaurants.length})
                  </Text>
                </View>
                <FlatList
                  data={restaurants}
                  renderItem={renderRestaurantItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            {/* Products Section */}
            {products.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Heart size={20} color={Colors.primary}  />
                  <Text style={styles.sectionTitle}>
                    Products ({products.length})
                  </Text>
                </View>
                <FlatList
                  data={products}
                  renderItem={renderProductItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            {/* Empty state for filtered tabs */}
            {restaurants.length === 0 && products.length === 0 && activeTab !== 'all' && (
              renderEmptyState(activeTab === 'restaurants' ? 'restaurants' : 'products')
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.background,
    ...Shadows.small,
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
  },
  headerSpacer: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textWhite,
    fontFamily: Fonts.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.small,
  },
  itemImage: {
    width: 120,
    height: 120,
    backgroundColor: Colors.backgroundSecondary,
  },
  itemContent: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.xs,
  },
  itemName: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${Colors.error}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  itemDescription: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    lineHeight: 18,
    marginBottom: Spacing.xs,
  },
  itemPrice: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginTop: Spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  ratingText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  emptyTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
});

