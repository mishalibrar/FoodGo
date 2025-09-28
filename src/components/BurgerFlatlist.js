import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const BurgerFlatlist = ({ adminId, restaurantId, categoryId }) => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (items.length === 0) {
    return (
      <Text
        style={{
          fontFamily: 'Sen-Regular',
          fontSize: 16,
          color: '#888',
          margin: 10,
        }}
      >
        No items found in this category
      </Text>
    );
  }

  return (
    <ScrollView style={{ paddingHorizontal: 18 }}>
      <FlatList
        data={items}
        // numColumns={2}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() =>
              navigation.navigate('ProductDetailScreen', {
                restaurantId: restaurantId,
                adminId: adminId,
                categoryId: categoryId,
                itemId: item.id, 
                itemData: item,
              })
            }
          >
            <View key={item.id} style={styles.menuItem}>
              {item.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.menuItemImage}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                {/* <Text style={styles.menuItemDescription}>
                  {item.description}
                </Text> */}
                <Text style={styles.menuItemPrice}>Rs {item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

export default BurgerFlatlist;

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F0F5FA',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    elevation: 2,
    shadowRadius: 10,
  },
  menuItemImage: { width: 60, height: 60, borderRadius: 10, marginRight: 10 },
  menuItemName: { fontFamily: 'Sen-Bold', fontSize: 15 },
  menuItemDescription: {
    fontFamily: 'Sen-Regular',
    fontSize: 12,
    color: '#676767',
  },
  menuItemPrice: { fontFamily: 'Sen-Medium', fontSize: 13, color: '#F58D1D' },
});
