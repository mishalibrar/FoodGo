import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Star, Truck, Clock, ArrowLeft, MoreVertical, Heart, Utensils } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import BurgerFlatlist from '../components/BurgerFlatlist';
import firestore from '@react-native-firebase/firestore';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';
import { useFavorites } from '../context/FavoritesContext';
import { useAlert } from '../context/AlertContext';

const RestaurantDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurant } = route.params;
  const { isRestaurantFavorite, toggleRestaurantFavorite } = useFavorites();
  const { showAlert } = useAlert();

  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const isFavorite = isRestaurantFavorite(restaurant.id);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await firestore()
          .collection('admins')
          .doc(restaurant.adminId)
          .collection('restaurants')
          .doc(restaurant.id)
          .collection('categories')
          .get();

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(data);
        if (data.length > 0) {
          setChecked(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [restaurant]);

  useEffect(() => {
    if (!checked) return;

    const fetchItems = async () => {
      setLoading(true);
      try {
        const snapshot = await firestore()
          .collection('admins')
          .doc(restaurant.adminId)
          .collection('restaurants')
          .doc(restaurant.id)
          .collection('categories')
          .doc(checked)
          .collection('items')
          .get();

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [checked]);

  // Create array of images for carousel (using restaurant image as placeholder)
  const images = restaurant.imageUrl 
    ? [restaurant.imageUrl] 
    : [require('../assets/images/burgerbistro.jpg')];

  if (loading && categories.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading restaurant details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Image - Behind Content */}
      <View style={styles.imageContainer}>
        <Image
          source={typeof images[currentImageIndex] === 'string' 
            ? { uri: images[currentImageIndex] } 
            : images[currentImageIndex]}
          style={styles.restaurantImage}
          resizeMode="cover"
        />
        
        {/* Gradient Overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
          style={styles.gradientOverlay}
        />

        {/* Header Buttons */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <View style={styles.headerButton}>
              <ArrowLeft size={22} color={Colors.textWhite} strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => {
              const wasFavorite = isRestaurantFavorite(restaurant.id);
              toggleRestaurantFavorite(restaurant);
              
              if (!wasFavorite) {
                showAlert('Success', `${restaurant.name} added to favorites!`, [], 'success');
              } else {
                showAlert('Removed', `${restaurant.name} removed from favorites`, [], 'info');
              }
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.headerButton, isFavorite && styles.favoriteButtonActive]}>
              <Heart 
                size={22} 
                color={isFavorite ? Colors.textWhite : Colors.textWhite}
                fill={isFavorite ? Colors.textWhite : 'none'}
                strokeWidth={isFavorite ? 0 : 2.5}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Pagination Dots */}
        {images.length > 1 && (
          <View style={styles.paginationContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Restaurant Info Section */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            {restaurant.rating && (
              <View style={styles.infoBadge}>
                <Star size={18} color={Colors.primary} fill={Colors.primary} />
                <Text style={styles.infoBadgeText}>
                  {typeof restaurant.rating === 'number' ? restaurant.rating.toFixed(1) : restaurant.rating}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.restaurantName}>{restaurant.name}</Text>

          {restaurant.details && (
            <Text style={styles.descriptionText}>
              {restaurant.details}
            </Text>
          )}
        </View>

        {/* Categories Section */}
        {categories.length > 0 && (
          <View style={styles.categoriesSection}>
            <View style={styles.categoriesHeader}>
              <Utensils size={20} color={Colors.textPrimary} />
              <Text style={styles.categoriesTitle}>Categories</Text>
            </View>
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const isChecked = item.id === checked;
                return (
                  <TouchableOpacity 
                    onPress={() => setChecked(item.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.categoryButton,
                        isChecked && styles.categoryButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryText,
                          isChecked && styles.categoryTextActive,
                        ]}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
        )}

        {/* Items Section */}
        <View style={styles.itemsSection}>
          {checked ? (
            <>
              <View style={styles.itemsHeader}>
                <Text style={styles.itemsSectionTitle}>
                  {categories.find(cat => cat.id === checked)?.title || 'Menu Items'} ({items.length || 0})
                </Text>
              </View>
              {loading ? (
                <View style={styles.itemsLoadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.itemsLoadingText}>Loading menu items...</Text>
                </View>
              ) : (
                <BurgerFlatlist
                  categoryId={checked}
                  restaurantId={restaurant.id}
                  adminId={restaurant.adminId}
                  restaurantName={restaurant.name}
                />
              )}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Select a category to view items</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default RestaurantDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 280,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textTertiary,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.backgroundSecondary,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  headerContainer: {
    position: 'absolute',
    top: Spacing.xl + 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    zIndex: 10,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  
  },
  favoriteButtonActive: {
    backgroundColor:'rgba(255, 255, 255, 0.25)',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
    zIndex: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  paginationDotActive: {
    backgroundColor: Colors.textWhite,
    width: 28,
    height: 8,
  },
  infoCard: {
    backgroundColor: Colors.background,
    marginTop: -10,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl + Spacing.md,
    paddingBottom: Spacing.xl,
    zIndex: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: Spacing.md + Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.small,
  },
  infoBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  infoBadgeTextSecondary: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  restaurantName: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxxl + 2,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    letterSpacing: 0.3,
    lineHeight: 38,
    marginTop: Spacing.md,
  },
  descriptionText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    lineHeight: 24,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    letterSpacing: 0.1,
  },
  categoriesSection: {
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  categoriesTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  categoriesList: {
    paddingHorizontal: Spacing.xl,
  },
  categoryButton: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md + Spacing.xs,
    paddingHorizontal: Spacing.lg,
    marginRight: Spacing.md,
    minWidth: 90,
    alignItems: 'center',
    marginBottom: Spacing.sm,
    ...Shadows.small,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    transform: [{ scale: 1.05 }],
    ...Shadows.medium,
  },
  categoryText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  categoryTextActive: {
    color: Colors.textWhite,
    fontFamily: Fonts.bold,
  },
  itemsSection: {
    paddingTop: Spacing.lg,
    backgroundColor: Colors.background,
  },
  itemsHeader: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg + Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemsSectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxl + 2,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
    flex: 1,
  },
  itemsLoadingContainer: {
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsLoadingText: {
    marginTop: Spacing.md,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textTertiary,
  },
  emptyState: {
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
