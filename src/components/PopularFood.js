import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.md) / 2;

const PopularFood = ({ data }) => {
  const navigation = useNavigation();

  const handlePress = (item) => {
    if (item.item) {
      const itemData = item.item;
      // Navigate to product detail screen with proper data structure
      navigation.navigate('ProductDetailScreen', {
        adminId: itemData.adminId,
        restaurantId: itemData.restaurantId,
        categoryId: itemData.categoryId,
        itemId: itemData.id,
        itemData: itemData,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => handlePress(item)}
            activeOpacity={0.8}
            style={styles.cardWrapper}
          >
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image
                  source={item.img}
                  resizeMode="cover"
                  style={styles.image}
                  defaultSource={require('../assets/images/pizza.png')}
                />
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.restaurantText} numberOfLines={1}>
                  {item.restaurant}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `popular-food-${item.id || index}`}
      />
    </View>
  );
};

export default PopularFood;

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
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Spacing.md,
  },
  image: {
    width: CARD_WIDTH - Spacing.md * 2,
    height: 100,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundSecondary,
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  productName: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  restaurantText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
