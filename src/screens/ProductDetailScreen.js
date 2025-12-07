import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Minus, Plus, Star } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '../components/CustomButton';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAlert } from '../context/AlertContext';
import SuccessModal from '../components/SuccessModal';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const { width } = Dimensions.get('window');

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addToCart } = useCart();
  const { isProductFavorite, toggleProductFavorite } = useFavorites();
  const { showAlert } = useAlert();

  const { adminId, restaurantId, categoryId, itemId, itemData } = route.params || {};

  const [quantity, setQuantity] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isFavorite = itemData ? isProductFavorite(itemId) : false;

  // Fix price parsing - handle string or number
  const pricePerItem = itemData?.price
    ? (typeof itemData.price === 'string'
      ? parseFloat(itemData.price.replace(/[^0-9.]/g, ''))
      : parseFloat(itemData.price))
    : 0;

  const totalPrice = quantity * pricePerItem;

  const handleAddToCart = () => {
    if (!itemData) {
      return;
    }

    addToCart(itemData, quantity, adminId, restaurantId, categoryId, itemId);
    setShowSuccessModal(true);
  };

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
    navigation.goBack();
  };

  const handleViewCart = () => {
    setShowSuccessModal(false);
    navigation.navigate('CartScreen');
  };

  if (!itemData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Item added to cart successfully!"
        onContinueShopping={handleContinueShopping}
        onViewCart={handleViewCart}
      />

      {/* Product Image - Fixed at top */}
      <View style={styles.imageContainer}>
        <Image
          source={
            itemData?.imageUrl
              ? { uri: itemData.imageUrl }
              : require('../assets/images/burgerbistro.jpg')
          }
          style={styles.productImage}
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
              if (itemData) {
                const product = {
                  id: itemId,
                  name: itemData.name,
                  price: itemData.price,
                  imageUrl: itemData.imageUrl,
                  description: itemData.description,
                  adminId,
                  restaurantId,
                  categoryId,
                };
                const wasFavorite = isProductFavorite(itemId);
                toggleProductFavorite(product);

                if (!wasFavorite) {
                  showAlert('Success', `${itemData.name} added to favorites!`, [], 'success');
                } else {
                  showAlert('Removed', `${itemData.name} removed from favorites`, [], 'info');
                }
              }
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.headerButton, isFavorite && styles.favoriteButtonActive]}>
              <Heart
                size={22}
                color={Colors.textWhite}
                fill={isFavorite ? Colors.textWhite : 'none'}
                strokeWidth={isFavorite ? 0 : 2.5}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Info Section - Overlapping with rounded top corners */}
        <View style={styles.infoCard}>
          <Text style={styles.productName} numberOfLines={2}>
            {itemData?.name || 'Unnamed Product'}
          </Text>

          {itemData?.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionLabel}>Description</Text>
              <Text style={styles.descriptionText}>{itemData.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Cart Section */}
      <View style={styles.cartContainer}>
        <View style={styles.priceQuantityRow}>
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Total Price</Text>
            <Text style={styles.priceText}>Rs {totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
              activeOpacity={0.7}
              disabled={quantity <= 1}
            >
              <Minus
                size={18}
                color={quantity <= 1 ? Colors.textLight : Colors.textWhite}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              style={styles.quantityButton}
              activeOpacity={0.7}
            >
              <Plus
                size={18}
                color={Colors.textWhite}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          </View>
        </View>
        <CustomButton
          title="Add to Cart"
          onPress={handleAddToCart}
        />
      </View>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
    color: Colors.textTertiary,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.backgroundSecondary,
  },
  productImage: {
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
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingBottom: 200,
  },
  infoCard: {
    backgroundColor: Colors.background,
    marginTop: 350,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl + Spacing.md,
    paddingBottom: Spacing.xl,
    ...Shadows.medium,
  },
  infoHeader: {
    marginBottom: Spacing.lg,
  },
  namePriceRow: {
    marginBottom: Spacing.md,
  },
  productName: {
    fontSize: FontSizes.xxxl + 4 ,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
    lineHeight: 38,
    marginBottom: Spacing.xs,
  },
  priceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.full,
    ...Shadows.small,
  },
  priceBadgeText: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
    letterSpacing: 0.2,
  },
  descriptionSection: {
    marginTop: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    letterSpacing: 0.2,
  },
  descriptionText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  cartContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.backgroundLight,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg + Spacing.sm,
    paddingBottom: Spacing.xl + Spacing.sm,
    ...Shadows.large,
  },
  priceQuantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg + Spacing.sm,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
    letterSpacing: 0.2,
  },
  priceText: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  quantityContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.lg,
    ...Shadows.medium,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
    minWidth: 35,
    textAlign: 'center',
  },
});
