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
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation, useRoute } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import BurgerFlatlist from '../components/BurgerFlatlist';
import firestore from '@react-native-firebase/firestore';
import { Pin } from 'lucide-react-native';

const RestaurantDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { restaurant } = route.params;

  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState('');

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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF7622" />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <View style={styles.feathericon}>
            <Entypo name="chevron-small-left" color="#181C2E" size={23} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Restaurant Image */}
      <Image
        source={{ uri: restaurant.imageUrl }}
        style={styles.FlatListimgstyle}
        resizeMode="cover"
      />

      {/* Restaurant Info */}
      <Text style={styles.restaurantname}>{restaurant.name}</Text>
      <View style={styles.ratingdelieverytime}>
        <View style={styles.iconview}>
          <Feather name="star" size={18} color="#FF7622" />
          <Text style={styles.ratingsstyle}>{restaurant.rating || 'N/A'}</Text>
          <View style={{ flexDirection: 'row', marginLeft: 16 }}>
            <Pin size={18} color="#FF7622" />
            <Text style={styles.ratingsstyle}>{restaurant.location}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.detailstextstyle}>
        {restaurant.details || 'No description available.'}
      </Text>

      <Text style={styles.Categoriestextstyle}>Categories:</Text>

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          const isChecked = item.id === checked;
          return (
            <TouchableOpacity onPress={() => setChecked(item.id)}>
              <View
                style={[
                  styles.categoryBtn,
                  { backgroundColor: isChecked ? '#F58D1D' : 'white' },
                ]}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.FlatListimagestyle}
                  resizeMode="cover"
                />
                <Text
                  style={[
                    styles.categoryText,
                    { color: isChecked ? '#fff' : '#181C2E' },
                  ]}
                >
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 18 }}
      />

      {/* Items inside selected category */}
      <View>
        {checked ? (
          <>
            <Text style={styles.Categoriestextstyle}>
              {categories.find(cat => cat.id === checked)?.title} (
              {items.length})
            </Text>
            <BurgerFlatlist
              categoryId={checked}
              restaurantId={restaurant.id}
              adminId={restaurant.adminId}
            />
          </>
        ) : (
          <Text style={styles.emptyText}>Select a category to view items</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default RestaurantDetailScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    flexDirection: 'row',
    zIndex: 1,
    position: 'absolute',
  },
  feathericon: {
    backgroundColor: '#ECF0F4',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 7,
  },
  FlatListimgstyle: {
    width: '100%',
    height: 260,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  iconview: {
    flexDirection: 'row',
    margin: 10,
  },
  ratingsstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    marginLeft: 5,
  },
  ratingdelieverytime: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  restaurantname: {
    fontFamily: 'Sen-Bold',
    fontSize: 24,
    marginLeft: 15,
    marginTop: 20,
    color: '#181C2E',
  },
  detailstextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 16,
    lineHeight: 22,
    marginHorizontal: 15,
    color: '#A0A5BA',
    marginVertical: 0,
  },
  Categoriestextstyle: {
    fontFamily: 'Sen-Bold',
    fontSize: 18,
    color: '#32343E',
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  categoryBtn: {
    borderWidth: 1,
    borderColor: '#EDEDED',
    alignItems: 'center',
    borderRadius: 40,
    paddingVertical: 2,
    marginHorizontal: 5,
    flexDirection: 'row',
    paddingHorizontal: 2,
    width: '100%',
  },
  categoryText: {
    fontFamily: 'Sen-Regular',
    fontSize: 16,
  },
  emptyText: {
    fontFamily: 'Sen-Regular',
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 15,
  },
  FlatListimagestyle: {
    width: 40,
    height: 40,
    borderRadius: 23,
    backgroundColor: '#ECF0F4',
    margin: 6,
  },
});
