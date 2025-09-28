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
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AddCategoryModal from '../components/AddCategoryModal';
import AddItemModal from '../components/AddItemModal';
import EditItemModal from '../components/EditItemModal';
import EditCategoryModal from '../components/EditCategoryModal';
import { Pin, Star } from 'lucide-react-native';

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
    const unsubscribe = firestore()
      .collection('admins')
      .doc(adminUid)
      .collection('restaurants')
      .doc(restaurantId)
      .collection('categories')
      .onSnapshot(snapshot => {
        const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(cats);
        if (cats.length > 0 && !checked) setChecked(cats[0].id);
      });
    return () => unsubscribe();
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

  // Delete item
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
      {/* Header */}
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.feathericon}>
            <Entypo name="chevron-small-left" color="#181C2E" size={25} />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>
      <ScrollView>
        {/* Image Slider */}
        {images.length > 0 ? (
          <FlatList
            data={images}
            pagingEnabled
            horizontal
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.FlatListimgstyle} />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Text>No Images</Text>
          </View>
        )}

        <Text style={styles.restaurantname}>
          {restaurantData?.name || 'Unnamed Restaurant'}
        </Text>
        <View style={styles.iconview}>
          <Star size={18} color="#FF7622" />
          <Text style={styles.ratingsstyle}>
            {restaurantData?.rating ?? 'N/A'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 16,
            }}
          >
            <Pin size={18} color="#FF7622" />
            <Text style={styles.ratingsstyle}>
              {restaurantData?.location ?? 'N/A'}
            </Text>
          </View>
        </View>
        <Text style={styles.detailstextstyle}>
          {restaurantData?.details || 'No description available.'}
        </Text>

        <View style={styles.categoriesContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryTitle}>Categories</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {checked && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedCategory(
                        categories.find(c => c.id === checked),
                      );
                      setEditCategoryModalVisible(true);
                    }}
                    style={{ marginRight: 15 }}
                  >
                    <Feather name="edit-2" size={20} color="#F58D1D" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteCategory(checked)}
                  >
                    <Feather name="trash-2" size={20} color="red" />
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                onPress={() => setCategoryModalVisible(true)}
                style={{ marginLeft: 15 }}
              >
                <Text style={styles.addCategoryText}>+ Add Category</Text>
              </TouchableOpacity>
            </View>
          </View>

          {categories.length > 0 ? (
            <FlatList
              data={categories}
              horizontal
              renderItem={({ item }) => {
                const isChecked = item.id === checked;
                return (
                  <TouchableOpacity onPress={() => setChecked(item.id)}>
                    <View
                      style={[
                        styles.categoryCard,
                        isChecked && styles.categoryCardChecked,
                      ]}
                    >
                      {item.image && (
                        <Image
                          source={{ uri: item.image }}
                          style={styles.categoryImg}
                        />
                      )}
                      <Text
                        style={[
                          styles.categoryText,
                          isChecked && styles.categoryTextChecked,
                        ]}
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
            <Text style={styles.noCategoriesText}>No Categories</Text>
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

        {/* Menu Items */}
        <ScrollView style={styles.menuContainer}>
          {checked && (
            <View style={styles.addItemContainer}>
              <Text style={styles.Categoriestextstyle}>
                {categories.find(cat => cat.id === checked)?.title} (
                {menuItems.length})
              </Text>
              <TouchableOpacity
                onPress={() => setItemModalVisible(true)}
                disabled={!checked}
              >
                <Text
                  style={[styles.addItemText, !checked && { color: '#ccc' }]}
                >
                  + Add Item
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {menuItems.length > 0 ? (
            menuItems.map(item => (
              <View key={item.id} style={styles.menuItem}>
                {item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.menuItemImage}
                  />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemDescription}>
                    {item.description}
                  </Text>
                  <Text style={styles.menuItemPrice}>Rs {item.price}</Text>
                </View>
                <View style={styles.menuItemButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedItem(item);
                      setEditItemModalVisible(true);
                    }}
                    style={{ marginRight: 10 }}
                  >
                    <Feather name="edit-2" size={20} color="#F58D1D" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                    <Feather name="trash-2" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noItemsText}>No items in this category</Text>
          )}
        </ScrollView>
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
  mainContainer: { flex: 1, backgroundColor: 'white' },
  container: {
    padding: 20,
    flexDirection: 'row',
    zIndex: 1,
    position: 'absolute',
  },
  feathericon: {
    backgroundColor: '#ECF0F4',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    elevation: 7,
  },
  FlatListimgstyle: {
    width: 360,
    height: 260,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  noImageContainer: {
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconview: { flexDirection: 'row', marginLeft: 18, marginTop: 10 },
  ratingsstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    marginLeft: 6,
    textAlignVertical: 'center',
    color: '#181C2E',
  },
  restaurantname: {
    fontFamily: 'Sen-Bold',
    fontSize: 22,
    marginLeft: 18,
    marginTop: 9,
    color: '#181C2E',
    marginTop: 20,
  },
  detailstextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 13,
    lineHeight: 24,
    paddingHorizontal: 18,
    marginTop: 9,
    color: '#A0A5BA',
  },
  categoriesContainer: { paddingHorizontal: 18 },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTitle: { fontFamily: 'Sen-Bold', fontSize: 16, color: '#181C2E' },
  addCategoryText: { color: '#F58D1D', fontSize: 13 },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#EDEDED',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 5,
  },
  categoryButtonChecked: { backgroundColor: '#F58D1D' },
  categoryButtonText: {
    fontFamily: 'Sen-Regular',
    fontSize: 16,
    color: '#181C2E',
  },
  categoryButtonTextChecked: { color: '#ffffff' },
  noCategoriesText: { paddingHorizontal: 18, color: '#999' },
  menuContainer: { paddingHorizontal: 18, marginTop: 9 },
  addItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addItemText: { color: '#F58D1D', fontSize: 13 },
  Categoriestextstyle: {
    color: '#32343E',
    fontFamily: 'Sen-Bold',
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuItemImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  menuItemName: { fontFamily: 'Sen-Bold', fontSize: 15 },
  menuItemDescription: {
    fontFamily: 'Sen-Regular',
    fontSize: 12,
    color: '#676767',
  },
  menuItemPrice: { fontFamily: 'Sen-Medium', fontSize: 13, color: '#F58D1D' },
  menuItemButtons: { flexDirection: 'row', marginLeft: 10 },
  noItemsText: { color: '#999', marginTop: 10 },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    elevation: 5,
    marginBottom: 10,
  },
  categoryCardChecked: {
    backgroundColor: '#F58D1D',
  },
  categoryImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECF0F4',
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Sen-Bold',
    color: '#32343E',
  },
  categoryTextChecked: {
    color: '#fff',
  },
});
