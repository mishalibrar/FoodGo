import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Plus } from 'lucide-react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';
import { useCart } from '../context/CartContext';
import CustomAlertModal from './CustomAlertModal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.md) / 2;

const BurgerFlatlist = ({ adminId, restaurantId, categoryId, restaurantName }) => {
  const navigation = useNavigation();
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [addedItemName, setAddedItemName] = useState('');

  useEffect(() => {
    if (!adminId || !restaurantId || !categoryId) return;

    setLoading(true);

    const fetchItems = async () => {
      try {
        const snapshot = await firestore()
          .collection('admins')
          .doc(adminId)
          .collection('restaurants')
          .doc(restaurantId)
          .collection('categories')
          .doc(categoryId)
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
  }, [adminId, restaurantId, categoryId]);

  if (loading) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF7622" />
      </View>
    );
  }

  const handleAddToCart = (item) => {
    addToCart(item, 1, adminId, restaurantId, categoryId, item.id);
    setAddedItemName(item.name || 'Product');
    setShowAlert(true);
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No items found in this category
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        numColumns={2}
        scrollEnabled={false}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('ProductDetailScreen', {
                restaurantId: restaurantId,
                adminId: adminId,
                categoryId: categoryId,
                itemId: item.id, 
                itemData: item,
              })
            }
            style={styles.cardWrapper}
          >
            <View style={styles.card}>
              {/* Image */}
              <View style={ styles.imageContainer}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>
                      {(item.name || 'I')[0].toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Content */}
              <View style={styles.cardContent}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.restaurantName} numberOfLines={1}>
                  {restaurantName || 'Restaurant'}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.itemPrice}> {item.price}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    activeOpacity={0.8}
                  >
                    <Plus size={18} color={Colors.textWhite} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <CustomAlertModal
        visible={showAlert}
        onClose={() => setShowAlert(false)}
        type="success"
        title="Added to Cart"
        message={`${addedItemName} has been added to your cart successfully!`}
        buttons={[
          {
            text: 'OK',
            onPress: () => setShowAlert(false),
          },
        ]}
      />
    </View>
  );
};

export default BurgerFlatlist;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
  },
  listContent: {
    paddingBottom: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    backgroundColor: Colors.backgroundSecondary,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    color: Colors.textTertiary,
  },
  cardContent: {
    padding: Spacing.md,
  },
  itemName: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  restaurantName: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
