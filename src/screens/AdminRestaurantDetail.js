import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { ArrowLeft, Pin, Star, Edit, Trash2, Plus } from 'lucide-react-native';
import AddCategoryModal from '../components/AddCategoryModal';
import AddItemModal from '../components/AddItemModal';
import EditItemModal from '../components/EditItemModal';
import EditCategoryModal from '../components/EditCategoryModal';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const { width } = Dimensions.get('window');

const AdminRestaurantDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { adminUid, restaurantId, restaurant } = route.params;

  const [restaurantData, setRestaurantData] = useState(restaurant || null);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [itemModalVisible, setItemModalVisible] = useState(false);
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editCategoryModalVisible, setEditCategoryModalVisible] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch restaurant info
  useEffect(() => {
    if (!restaurantData) {
      const unsubscribe = firestore()
        .collection('admins')
        .doc(adminUid)
        .collection('restaurants')
        .doc(restaurantId)
        .onSnapshot(doc => {
          if (doc.exists) setRestaurantData({ id: doc.id, ...doc.data() });
        });
      return () => unsubscribe();
    }
  }, [adminUid, restaurantId, restaurantData]);

  // Fetch categories
  useEffect(() => {
    if (!adminUid || !restaurantId) return;
    
    const unsubscribe = firestore()
      .collection('admins')
      .doc(adminUid)
      .collection('restaurants')
      .doc(restaurantId)
      .collection('categories')
      .onSnapshot(snapshot => {
        const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(cats);
        if (cats.length > 0 && !checked) {
          setChecked(cats[0].id);
        }
      });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminUid, restaurantId]);

  // Fetch menu items for selected category
  useEffect(() => {
    if (!checked) return;
    const unsubscribe = firestore()
      .collection('admins')
      .doc(adminUid)
      .collection('restaurants')
      .doc(restaurantId)
      .collection('categories')
      .doc(checked)
      .collection('items')
      .onSnapshot(snapshot => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(items);
      });
    return () => unsubscribe();
  }, [adminUid, restaurantId, checked]);

  // Delete category
  const handleDeleteCategory = categoryId => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore()
                .collection('admins')
                .doc(adminUid)
                .collection('restaurants')
                .doc(restaurantId)
                .collection('categories')
                .doc(categoryId)
                .delete();

              if (checked === categoryId) setChecked(null);
            } catch (error) {
              console.error('Error deleting category:', error);
              Alert.alert('Error', 'Failed to delete category');
            }
          },
        },
      ],
    );
  };

  // Delete item
  const handleDeleteItem = itemId => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore()
                .collection('admins')
                .doc(adminUid)
                .collection('restaurants')
                .doc(restaurantId)
                .collection('categories')
                .doc(checked)
                .collection('items')
                .doc(itemId)
                .delete();
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item');
            }
          },
        },
      ],
    );
  };

  const images =
    Array.isArray(restaurantData?.images) && restaurantData?.images.length > 0
      ? restaurantData.images
      : restaurantData?.imageUrl
      ? [restaurantData.imageUrl]
      : [];

  return (
    <View style={styles.mainContainer}>
      {/* Header with Primary Background */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <View style={styles.backButton}>
            <ArrowLeft size={22} color={Colors.textWhite} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurant Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Slider */}
        {images.length > 0 ? (
          <View style={styles.imageContainer}>
            <FlatList
              data={images}
              pagingEnabled
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.restaurantImage} />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        ) : (
          <View style={styles.noImageContainer}>
            <Pin size={48} color={Colors.textLight} strokeWidth={1.5} />
            <Text style={styles.noImageText}>No Images Available</Text>
          </View>
        )}

        {/* Restaurant Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.restaurantName}>
            {restaurantData?.name || 'Unnamed Restaurant'}
          </Text>
          
          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Star size={16} color={Colors.primary} fill={Colors.primary} />
              <Text style={styles.ratingText}>
                {restaurantData?.rating ?? 'N/A'}
              </Text>
            </View>
            <View style={styles.locationContainer}>
              <Pin size={16} color={Colors.textTertiary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {restaurantData?.location ?? 'N/A'}
              </Text>
            </View>
          </View>

          <Text style={styles.detailsText}>
            {restaurantData?.details || 'No description available.'}
          </Text>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Categories</Text>
            <View style={styles.categoryActions}>
              {checked && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCategory(
                        categories.find(c => c.id === checked),
                      );
                      setEditCategoryModalVisible(true);
                    }}
                    style={styles.actionIconButton}
                    activeOpacity={0.7}
                  >
                    <Edit size={18} color={Colors.primary} strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(checked)}
                    style={styles.actionIconButton}
                    activeOpacity={0.7}
                  >
                    <Trash2 size={18} color={Colors.error} strokeWidth={2} />
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity
                onPress={() => setCategoryModalVisible(true)}
                style={styles.addCategoryButton}
                activeOpacity={0.8}
              >
                <Plus size={16} color={Colors.textWhite} strokeWidth={2.5} />
                <Text style={styles.addCategoryText}>Add Category</Text>
              </TouchableOpacity>
            </View>
          </View>

          {categories.length > 0 ? (
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
              renderItem={({ item }) => {
                const isChecked = item.id === checked;
                return (
                  <TouchableOpacity 
                    onPress={() => setChecked(item.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.categoryCard,
                        isChecked && styles.categoryCardChecked,
                      ]}
                    >
                      {item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.categoryImg}
                        />
                      ) : (
                        <View style={styles.categoryImgPlaceholder}>
                          <Text style={styles.categoryImgText}>
                            {(item.title || 'C')[0].toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <Text
                        style={[
                          styles.categoryText,
                          isChecked && styles.categoryTextChecked,
                        ]}
                        numberOfLines={1}
                      >
                        {item.title || 'Untitled'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.id.toString()}
            />
          ) : (
            <View style={styles.emptyCategoriesContainer}>
              <Text style={styles.emptyCategoriesText}>No Categories Yet</Text>
              <Text style={styles.emptyCategoriesHint}>
                Tap "Add Category" to create your first category
              </Text>
            </View>
          )}
        </View>

        {selectedCategory && (
          <EditCategoryModal
            isVisible={editCategoryModalVisible}
            onClose={() => setEditCategoryModalVisible(false)}
            adminUid={adminUid}
            restaurantId={restaurantId}
            categoryId={selectedCategory.id}
            existingCategory={selectedCategory}
          />
        )}

        {/* Add Category Modal */}
        <AddCategoryModal
          isVisible={categoryModalVisible}
          onClose={() => setCategoryModalVisible(false)}
          adminUid={adminUid}
          restaurantId={restaurantId}
        />

        {/* Menu Items Section */}
        {checked && (
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <View style={styles.menuTitleContainer}>
                <Text style={styles.menuTitle}>
                  {categories.find(cat => cat.id === checked)?.title || 'Menu'}
                </Text>
                <View style={styles.itemCountBadge}>
                  <Text style={styles.itemCountText}>{menuItems.length}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setItemModalVisible(true)}
                disabled={!checked}
                style={[
                  styles.addItemButton,
                  !checked && styles.addItemButtonDisabled
                ]}
                activeOpacity={0.8}
              >
                <Plus size={16} color={Colors.textWhite} strokeWidth={2.5} />
                <Text style={styles.addItemText}>Add Item</Text>
              </TouchableOpacity>
            </View>

            {menuItems.length > 0 ? (
              <View style={styles.menuItemsList}>
                {menuItems.map(item => (
                  <View key={item.id} style={styles.menuItemCard}>
                    {item.imageUrl ? (
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.menuItemImage}
                      />
                    ) : (
                      <View style={styles.menuItemImagePlaceholder}>
                        <Text style={styles.menuItemImageText}>
                          {(item.name || 'I')[0].toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={styles.menuItemInfo}>
                      <Text style={styles.menuItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text 
                        style={styles.menuItemDescription}
                        numberOfLines={2}
                      >
                        {item.description || 'No description'}
                      </Text>
                      <Text style={styles.menuItemPrice}>
                        Rs {item.price || '0'}
                      </Text>
                    </View>
                    <View style={styles.menuItemActions}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedItem(item);
                          setEditItemModalVisible(true);
                        }}
                        style={styles.editItemButton}
                        activeOpacity={0.7}
                      >
                        <Edit size={16} color={Colors.textWhite} strokeWidth={2} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => handleDeleteItem(item.id)}
                        style={styles.deleteItemButton}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={16} color={Colors.textWhite} strokeWidth={2} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyItemsContainer}>
                <Text style={styles.emptyItemsText}>No Items Yet</Text>
                <Text style={styles.emptyItemsHint}>
                  Tap "Add Item" to add items to this category
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Item Modal */}
      <AddItemModal
        isVisible={itemModalVisible}
        onClose={() => setItemModalVisible(false)}
        adminUid={adminUid}
        restaurantId={restaurantId}
        categoryId={checked}
      />

      {/* Edit Item Modal */}
      {selectedItem && (
        <EditItemModal
          isVisible={editItemModalVisible}
          onClose={() => setEditItemModalVisible(false)}
          adminUid={adminUid}
          restaurantId={restaurantId}
          categoryId={checked}
          itemId={selectedItem.id}
          existingItem={selectedItem}
        />
      )}
    </View>
  );
};

export default AdminRestaurantDetail;

const styles = StyleSheet.create({
  mainContainer: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.primary
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 280,
  },
  restaurantImage: {
    width: width,
    height: 280,
    resizeMode: 'cover',
  },
  noImageContainer: {
    height: 280,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    color: Colors.textTertiary,
  },
  infoSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  restaurantName: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    letterSpacing: 0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.lg,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}15`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  ratingText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bold,
    color: Colors.primary,
    marginLeft: Spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    marginLeft: Spacing.xs,
    flex: 1,
  },
  detailsText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    lineHeight: 22,
    marginTop: Spacing.sm,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  categoryTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
    ...Shadows.small,
  },
  addCategoryText: {
    color: Colors.textWhite,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
  },
  categoriesList: {
    paddingBottom: Spacing.sm,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.md,
    ...Shadows.small,
  },
  categoryCardChecked: {
    backgroundColor: Colors.primary,
  },
  categoryImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Spacing.sm,
    resizeMode: 'cover',
  },
  categoryImgPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  categoryImgText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bold,
    color: Colors.textTertiary,
  },
  categoryText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
    color: Colors.textSecondary,
  },
  categoryTextChecked: {
    color: Colors.textWhite,
  },
  emptyCategoriesContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyCategoriesText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  emptyCategoriesHint: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
  },
  menuContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  menuTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  menuTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  itemCountBadge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.round,
    minWidth: 24,
    height: 24,
    paddingHorizontal: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCountText: {
    color: Colors.textWhite,
    fontSize: FontSizes.xs,
    fontFamily: Fonts.bold,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
    ...Shadows.small,
  },
  addItemButtonDisabled: {
    backgroundColor: Colors.textLight,
    opacity: 0.5,
  },
  addItemText: {
    color: Colors.textWhite,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
  },
  menuItemsList: {
    gap: Spacing.md,
  },
  menuItemCard: {
    flexDirection: 'row',
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
    resizeMode: 'cover',
  },
  menuItemImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuItemImageText: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.textTertiary,
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: 'space-between',
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
  menuItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  editItemButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  deleteItemButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  emptyItemsContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyItemsText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  emptyItemsHint: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textLight,
    textAlign: 'center',
  },
});
