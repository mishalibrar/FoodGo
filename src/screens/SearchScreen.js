import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import React ,{useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import CustomTextInput from '../components/CustomTextInput';
import { ShoppingBag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import SuggestedRestaurantFlatlist from '../components/SuggestedRestaurantFlatlist';
import PopularFood from '../components/PopularFood';

const SearchScreen = () => {
  const navigation = useNavigation();
  const keywords = [
    {
      id: 1,
      title: 'Burger',
    },
    {
      id: 2,
      title: 'Sandwich',
    },
    {
      id: 3,
      title: 'Pizza',
    },
    {
      id: 4,
      title: ' Fried Rice',
    },
    {
      id: 5,
      title: 'Tacos',
    },
    {
      id: 6,
      title: 'Ice Cream',
    },
    {
      id: 7,
      title: 'Smoothie',
    },
  ];

  const Suggested = [
    {
      id: 1,
      title: 'Pansi Restaurant',
      ratings: 4.7,
      img: require('../assets/images/suggested1.jpg'),
    },
    {
      id: 2,
      title: 'American Spicy Burger Shop',
      ratings: 4.3,
      img: require('../assets/images/suggested2.jpeg'),
    },
    {
      id: 3,
      title: 'Cafenio Coffee Club',
      ratings: 4.1,
      img: require('../assets/images/suggested3.jpg'),
    },
  ];
  const Popular = [
    {
      id: 1,
      title: 'European Pizza',
      restaurant: 'Uttora Coffe House',
      img: require('../assets/images/pizza.png'),
    },
    {
      id: 2,
      title: 'Buffalo Pizza',
      restaurant: 'Cafenio Coffee Club',
      img: require('../assets/images/pizza.png'),
    },
    {
      id: 3,
      title: 'Cheese Pizza',
      restaurant: 'Uttora Coffe House',
      img: require('../assets/images/pizza.png'),
    },
    {
      id: 4,
      title: 'Mexican Pizza',
      restaurant: 'Cafenio Coffee Club',
      img: require('../assets/images/pizza.png'),
    },
  ];
  const [cartItems, setCartItems] = useState([
    { id: 1, quantity: 2 },
    { id: 2, quantity: 1 },
  ]);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.feathericon}>
              <Entypo name="chevron-small-left" color="#181C2E" size={25} />
            </View>
          </TouchableOpacity>
          <View style={{ marginLeft: 6, alignItems: 'center' }}>
            <Text style={styles.searchtext}>Search</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
          <View style={styles.lucideicon}>
            <ShoppingBag color="#ffffff" size={25} />
          </View>
          {cartCount > 0 && (
            <View style={styles.badgeiconstyle}>
              <Text
                style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}
              >
                {cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {/* Search Box */}
      <ScrollView>
        <View style={styles.textboxstyle}>
          <View style={{ justifyContent: 'center', marginLeft: 15 }}>
            <Feather name="search" size={15} color="#A0A5BA" />
          </View>
          <CustomTextInput name="Search dishes, restaurants" color="#676767" />
        </View>
        {/* Recent Keyword Title */}
        <View style={styles.headingstyle}>
          <Text style={styles.Categoriestextstyle}>Recent Keywords</Text>
        </View>
        {/* Recent Keywords Flatlist */}
        <View style={styles.Flatlistviewstyle}>
          <FlatList
            data={keywords}
            horizontal
            // scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity>
                <View style={styles.CategoriesFlatliststyle}>
                  <Text style={styles.FlatListtitlestyle}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id.toString()}
          />
        </View>
        {/* Suggested Restaurants */}
        <View style={styles.headingstyle}>
          <Text style={styles.Categoriestextstyle}>Suggested Restaurants</Text>
        </View>
        {/* Suggested Restaurant flatlist */}
        <SuggestedRestaurantFlatlist data={Suggested} />
        {/* Popular Fast Food Heading */}
        <View style={{ marginTop: 18, marginLeft: 18 }}>
          <Text style={styles.Categoriestextstyle}>Popular Fast Food</Text>
        </View>
        {/* Popular Fast Food Flatlist  */}
        <PopularFood data={Popular} />
      </ScrollView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  lucideicon: {
    backgroundColor: '#181C2E',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchtext: {
    fontFamily: 'Sen-Regular',
    fontSize: 17,
    color: '#181C2E',
    lineHeight: 22,
    margin: 10,
  },
  textboxstyle: {
    fontSize: 14,
    fontFamily: 'Sen-Regular',
    color: '#676767',
    backgroundColor: '#F0F5FA',
    width: '90%',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 16,
    // padding: 10,
  },
  Categoriestextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 20,
    color: '#32343E',
  },
  CategoriesFlatliststyle: {
    borderWidth: 1,
    borderColor: '#EDEDED',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingInline: 15,
    paddingVertical: 10,
    margin: 5,
    left: 10,
  },

  headingstyle: { marginTop: 8, marginLeft: 18, marginBottom: 7 },
  badgeiconstyle: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#FF7622',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
