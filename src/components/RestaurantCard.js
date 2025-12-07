import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Pin, Star } from 'lucide-react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius } from '../styles/globalStyles';

const RestaurantCard = ({ data }) => {
  const navigation = useNavigation();

  return (
    <FlatList
      data={data}
      numColumns={1}
      scrollEnabled={false}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('RestaurantDetailScreen', {
              restaurant: item,
            })
          }
          style={styles.cardWrapper}
        >
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Image 
                source={item.imageUrl ? { uri: item.imageUrl } : require('../assets/images/burgerbistro.jpg')} 
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              {item.category && (
                <Text style={styles.category} numberOfLines={1}>{item.category}</Text>
              )}

              <View style={styles.infoRow}>
                {item.rating && (
                  <View style={styles.infoItem}>
                    <Star size={16} color={Colors.primary} fill={Colors.primary} />
                    <Text style={styles.infoText}>
                      {typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}
                    </Text>
                  </View>
                )}
                {item.location && (
                  <View style={styles.infoItem}>
                    <Pin size={16} color={Colors.primary} />
                    <Text style={styles.infoText} numberOfLines={1}>{item.location}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default RestaurantCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  container: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundLoading,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingTop: Spacing.md,
  },
  name: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxl,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  category: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
    color: Colors.textLight,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
