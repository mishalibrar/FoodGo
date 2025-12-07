import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Pin, Star, Pencil, Trash2 } from 'lucide-react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const AdminRestaurantCard = ({
  restaurant,
  onPress,
  onEdit,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.cardWrapper}
    >
      <View style={styles.card}>
        {/* Image Section */}
        {restaurant.imageUrl ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: restaurant.imageUrl }}
              style={styles.restaurantImage}
            />
            <View style={styles.imageOverlay}>
              <View style={styles.ratingBadge}>
                <Star size={12} color={Colors.textWhite} fill={Colors.textWhite} />
                <Text style={styles.ratingText}>{restaurant.rating || 'N/A'}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.placeholderImage}>
            <Pin size={48} color={Colors.textLight} strokeWidth={1.5} />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.headerSection}>
            <View style={styles.titleSection}>
              <Text style={styles.restaurantName} numberOfLines={1}>
                {restaurant.name || 'Unnamed Restaurant'}
              </Text>
              <Text style={styles.restaurantCategory} numberOfLines={1}>
                {restaurant.category || 'No category'}
              </Text>
            </View>
          </View>

          {/* Location */}
          {restaurant.location && (
            <View style={styles.locationSection}>
              <Pin size={14} color={Colors.textTertiary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {restaurant.location}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              activeOpacity={0.8}
            >
              <Pencil size={16} color={Colors.textWhite} strokeWidth={2} />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              activeOpacity={0.8}
            >
              <Trash2 size={16} color={Colors.textWhite} strokeWidth={2} />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AdminRestaurantCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
    backdropFilter: 'blur(10px)',
  },
  ratingText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    color: Colors.textTertiary,
  },
  contentSection: {
    padding: Spacing.lg,
  },
  headerSection: {
    marginBottom: Spacing.md,
  },
  titleSection: {
    flex: 1,
  },
  restaurantName: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: 0.2,
  },
  restaurantCategory: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    color: Colors.textTertiary,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  locationText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  actionSection: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.success,
    gap: Spacing.xs,
    ...Shadows.small,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.error,
    gap: Spacing.xs,
    ...Shadows.small,
  },
  actionButtonText: {
    color: Colors.textWhite,
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
  },
});

