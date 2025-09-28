import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import BurgerFlatlist from '../components/BurgerFlatlist';
import RestaurantCard from '../components/RestaurantCard';
import Feather from 'react-native-vector-icons/Feather';
import SearchScreen from './SearchScreen';
import Modal from 'react-native-modal';
import FilterModal from '../components/FilterModal';

const BurgerScreen = () => {
  const navigation = useNavigation();
  const [modalvisible, setModalVisible] = useState(false);
  const Burger = [
    {
      id: 1,
      title: 'Burger Bistro',
      restaurant: 'Rose Garden',
      price: '$40',
      img: require('../assets/images/img3.png'),
    },
    {
      id: 2,
      title: "Smokin' Burger",
      restaurant: 'Cafenio Restaurant',
      price: '$60',
      img: require('../assets/images/img2.png'),
    },
    {
      id: 3,
      title: 'Buffalo Burgers',
      restaurant: 'Kaji Firm Kitchen',
      price: '$75',
      img: require('../assets/images/img4.png'),
    },
    {
      id: 4,
      title: 'Bullseye Burger',
      restaurant: 'Kabab Restaurant',
      price: '$94',
      img: require('../assets/images/img1.png'),
    },
  ];
  const Restaurants = [
    {
      id: 1,
      title: 'Rose Garden Restaurant',
      dishes: 'Burger - Chicken - Rice - Wings',
      ratings: 4.7,
      deliverytype: 'Free',
      time: '20 min',
      img: require('../assets/images/res.jpg'),
    },
    {
      id: 2,
      title: 'Five Star Diner',
      dishes: 'Pancakes - Bacon - Eggs - Hash Browns',
      ratings: 4.6,
      deliverytype: 'Free',
      time: '20 min',
      img: require('../assets/images/res2.jpg'),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View style={styles.containerview}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View style={styles.feathericon}>
              <Entypo name="chevron-small-left" color="#181C2E" size={25} />
            </View>
          </TouchableOpacity>
          <View style={styles.headingburger}>
            <Text style={styles.burgertext}>Burger</Text>
            <Entypo name="triangle-down" size={10} color="#F58D1D" />
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate(SearchScreen)}>
            <View style={styles.Feathericon}>
              <Feather name="search" size={20} color="#ffffff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.feathericon}>
              <Image
                source={require('../assets/images/filtericon2.png')}
                style={{ width: 18, height: 18 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {/* Popular Burger Heading */}
        <View style={styles.headingstyle}>
          <Text style={styles.Categoriestextstyle}>Popular Burgers</Text>
        </View>
        {/* Popular Burgers Flatlist */}
        <BurgerFlatlist data={Burger} />
        {/* Open Restaurant */}
        <View style={styles.headingstyle}>
          <Text style={styles.Categoriestextstyle}>Open Restaurants</Text>
        </View>
        {/* Open Restaurants Flatlist */}
        <RestaurantCard data={Restaurants} />
      </ScrollView>
      <FilterModal
        modalVisible={modalvisible}
        setModalVisible={setModalVisible}
      />
      <TouchableOpacity onPress={() => setModalVisible(true)}>

      </TouchableOpacity>
    </View>
  );
};

export default BurgerScreen;

const styles = StyleSheet.create({
  containerview: {
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
    elevation: 5,
    margin: 3,
  },
  Feathericon: {
    backgroundColor: '#181C2E',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
    elevation: 5,
  },
  burgertext: {
    fontFamily: 'Sen-Bold',
    fontSize: 12,
    color: '#181C2E',
    margin: 10,
  },
  headingburger: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECF0F4',
    borderRadius: 33,
    padding: 5,
    marginLeft: 15,
  },
  Categoriestextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 20,
    color: '#32343E',
  },
  headingstyle: { marginLeft: 18 },
});
