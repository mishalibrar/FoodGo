import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { Heart, Pin } from 'lucide-react-native';

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { adminId, restaurantId, categoryId, itemId, itemData } = route.params;
  console.log(adminId, restaurantId, categoryId, itemId);
  console.log(itemData);

  const [checked, setChecked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const pricePerItem = itemData?.price;
  const totalPrice = quantity * pricePerItem;

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.feathericon}>
            <Entypo name="chevron-small-left" color="#181C2E" size={25} />
          </View>
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => setChecked(!checked)}>
          <View style={styles.feathericon}>
            {checked ? (
              <MaterialIcons name="favorite" size={25} color="#FF8400" />
            ) : (
              <Heart size={25} color="#181C2E" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image
          source={
            itemData?.imageUrl
              ? { uri: itemData.imageUrl }
              : require('../assets/images/burgerbistro.jpg')
          }
          style={styles.imgstyle}
        />

        <Text style={styles.productname}>{itemData?.name}</Text>

        <Text style={styles.Categoriestextstyle}>Product Description:</Text>
        <Text style={styles.detailstextstyle}>{itemData?.description}</Text>
      </ScrollView>

      <View style={styles.cartContainer}>
        <View style={styles.priceQuantity}>
          <Text style={styles.priceText}>Rs {totalPrice}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              <Text style={styles.counterBtn}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterText}>{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
              <Text style={styles.counterBtn}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <CustomButton
          title="ADD TO CART"
          onPress={() =>
            navigation.navigate('CartScreen', { itemData, quantity })
          }
        />
      </View>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: 'row',
    zIndex: 1,
    position: 'absolute',
    width: '100%',
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
  imgstyle: {
    width: '100%',
    height: 360,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  iconview: {
    flexDirection: 'row',
    margin: 8,
  },
  delieverytextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    marginLeft: 6,
  },
  ratingsstyle: {
    fontFamily: 'Sen-Bold',
    fontSize: 16,
    marginLeft: 6,
  },
  ratingdelieverytime: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingHorizontal: 9,
    gap: 16,
  },
  productname: {
    fontFamily: 'Sen-Bold',
    fontSize: 24,
    marginLeft: 18,
    marginTop: 20,
    color: '#181C2E',
  },
  detailstextstyle: {
    fontFamily: 'Sen-Medium',
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 18,
    marginTop: 1,
    color: '#A0A5BA',
  },
  cartContainer: {
    padding: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#F2F7FB',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  priceQuantity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  quantityContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  counterBtn: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  counterText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 5,
  },
  Categoriestextstyle: {
    fontFamily: 'Sen-Medium',
    fontSize: 16,
    color: '#32343E',
    marginTop: 20,
    paddingHorizontal: 18,

    textDecorationLine: 'underline',
  },
});
