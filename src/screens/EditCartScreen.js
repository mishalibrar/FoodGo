import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../components/CustomTextInput';
import Feather from 'react-native-vector-icons/Feather';
import CustomButton from '../components/Button';

const EditCartScreen = () => {
  const [address, setAddress] = useState('');
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Pizza Calzone',
      price: 64,
      quantity: 1,
      image: require('../assets/images/pizzacalzoneeuropean.jpg'),
      size: '14"',
    },
    {
      id: 2,
      name: 'Veggie Delight',
      price: 45,
      quantity: 2,
      image: require('../assets/images/veggiedelight.jpg'),
      size: '14"',
    },
  ]);

  const increment = index => {
    const updated = [...cartItems];
    updated[index].quantity += 1;
    setCartItems(updated);
  };

  const decrement = index => {
    const updated = [...cartItems];
    if (updated[index].quantity > 1) {
      updated[index].quantity -= 1;
      setCartItems(updated);
    }
  };
  const removeItem = index => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const navigation = useNavigation();

  return (
    <View style={styles.containerstyle}>
      <View style={{ padding: 20 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View style={styles.feathericon}>
                <Entypo name="chevron-small-left" color="#ffffff" size={25} />
              </View>
            </TouchableOpacity>

            <Text style={[styles.cartTitle, { marginLeft: 12 }]}>Cart</Text>
          </View>
          <TouchableOpacity onPress={()=> navigation.goBack()}>
            <Text style={styles.DoneText}>DONE</Text>
          </TouchableOpacity>
        </View>
        {/* Product Flatlist */}
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.itemContainer}>
              <Image source={item.image} style={styles.image} />
              <View style={{ flex: 1 }}>
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={styles.itemName}>{item.name}</Text>
                 <TouchableOpacity
                      onPress={() => removeItem(index)}
                      style={styles.crossIcon}
                    >
                      <Entypo name="cross" size={20} color="#ffffff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.price}>${item.price}</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text style={styles.sizetext}>{item.size}</Text>
                  <View style={styles.qtyBox}>
                    <TouchableOpacity
                      onPress={() => decrement(index)}
                      style={styles.qtyBtn}
                    >
                      <Entypo
                        name="circle-with-minus"
                        size={22}
                        color="#646668ff"
                      />
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() => increment(index)}
                      style={styles.qtyBtn}
                    >
                      <Entypo
                        name="circle-with-plus"
                        size={22}
                        color="#646668ff"
                      />
                    </TouchableOpacity>
                   
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
      {/* Bottom Ticker */}
      <View style={styles.whiteblockstyle}>
        <View style={{ margin: 10 }}>
          <View style={styles.address}>
            <Text style={styles.emailtextstyle}>DELIVERY ADDRESS</Text>
            <Text style={styles.editText}>EDIT</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <CustomTextInput
              name="2118 Thomridge Cir, Syracuse"
              color="#32343E"
              setState={setAddress}
            />
          </View>
        </View>
        <View
          style={[
            styles.header,
            { marginLeft: 18, marginRight: 18, paddingTop: 18 },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.emailtextstyle}>TOTAL:</Text>
            <Text style={styles.total}>${total}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text style={styles.editText}>Breakdown</Text>
              <Feather name="chevron-right" size={15} color="#A0A5BA" />
            </TouchableOpacity>
          </View>
        </View>
        <CustomButton title={'PLACE ORDER'} onPress={() => navigation.navigate('PaymentNoCardScreen')} />
      </View>
    </View>
  );
};

export default EditCartScreen;

const styles = StyleSheet.create({
  containerstyle: {
    flex: 1,
    backgroundColor: '#121223',
    justifyContent: 'space-between',
    // padding: 20,
  },
  crossIcon: {
    width:25,
    height:25,
    backgroundColor: '#E04444',
    borderRadius:20,
    alignItems:'center',
    justifyContent:'center'
    // marginLeft: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  feathericon: {
    backgroundColor: '#646668ff',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartTitle: {
    color: '#ffffff',
    fontFamily: 'Sen-Regular',
    fontSize: 17,
    lineHeight: 22,
  },
  DoneText: {
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    lineHeight: 24,
    color: '#059C6A',
  },

  editText: {
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    lineHeight: 24,
    color: '#FF7622',
  },
  itemContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 19,
  },
  image: { width: 120, height: 100, borderRadius: 15, marginRight: 15 },
  itemName: { fontSize: 18, fontFamily: 'Sen-Regular', color: 'white' },
  price: {
    fontSize: 20,
    marginTop: 5,
    color: 'white',
    fontFamily: 'Sen-Bold',
  },
  qtyBox: { flexDirection: 'row', alignItems: 'center', marginTop: 9 },
  qtyBtn: {
    marginHorizontal: 10,
  },
  qtyText: { fontSize: 16, fontFamily: 'Sen-Bold', color: 'white' },
  sizetext: {
    fontFamily: 'Sen-Regular',
    fontSize: 18,
    color: '#646668ff',
    marginTop: 9,
  },
  whiteblockstyle: {
    height: 280,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // position:'absolute'
  },
  emailtextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    color: '#A0A5BA',
    lineHeight: 24,
  },
  address: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 18,
    marginRight: 18,
    paddingTop: 15,
  },
emailtextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    color: '#A0A5BA',
    lineHeight: 24,
  },
  total: { fontFamily: 'Sen-Regular', fontSize: 30, color: '#181C2E' },

});
