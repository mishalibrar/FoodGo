import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { ArrowLeft, Search } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.md) / 2;

const AllCategoriesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { categories: initialCategories } = route.params || {};

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all categories if not provided
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        if (initialCategories && initialCategories.length > 0) {
          // Get unique categories by title
          const uniqueCategories = Array.from(
            new Map(initialCategories.map(cat => [cat.title, cat])).values()
          );
          setCategories(uniqueCategories);
        } else {
          const snapshot = await firestore()
            .collectionGroup('categories')
            .get();

          const categoriesData = snapshot.docs.map(doc => {
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

          // Get unique categories by title
          const uniqueCategories = Array.from(
            new Map(categoriesData.map(cat => [cat.title, cat])).values()
          );
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [initialCategories]);

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
          <Text style={styles.headerTitle}>All Categories</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('SearchScreen')}
          activeOpacity={0.7}
          style={styles.searchButton}
        >
          <Search size={20} color={Colors.textWhite} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {categories.length > 0 ? (
            <View style={styles.categoriesGrid}>
              <FlatList
                data={categories}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('BurgerScreen', { category: item })}
                    activeOpacity={0.8}
                    style={styles.categoryCard}
                  >
                    <View style={styles.categoryCardContent}>
                      {item.image ? (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.categoryCardImage}
                        />
                      ) : (
                        <View style={styles.categoryCardPlaceholder}>
                          <Text style={styles.categoryCardPlaceholderText}>
                            {(item.title || 'C')[0].toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.categoryCardTitle} numberOfLines={2}>
                        {item.title || 'Unnamed Category'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => `category-${item.id || index}`}
              />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No categories available</Text>
              <Text style={styles.emptySubtext}>Check back later for new categories</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default AllCategoriesScreen;

const styles = StyleSheet.create({
  mainContainer: {
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
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  categoriesGrid: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  gridContent: {
    paddingBottom: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: CARD_WIDTH,
    marginBottom: Spacing.lg,
  },
  categoryCardContent: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  categoryCardImage: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.backgroundSecondary,
    resizeMode: 'cover',
  },
  categoryCardPlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCardPlaceholderText: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    color: Colors.textTertiary,
  },
  categoryCardTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    padding: Spacing.md,
    textAlign: 'center',
    minHeight: 50,
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

