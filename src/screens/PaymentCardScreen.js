import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomButton from '../components/Button';
import { useNavigation } from '@react-navigation/native';

const PaymentCardScreen = () => {
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
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const navigation = useNavigation();
  const [selectedMethod, setSelectedMethod] = useState('Mastercard');

  const paymentMethods = [
    { name: 'Cash', icon: require('../assets/images/cash.png') },
    { name: 'Visa', icon: require('../assets/images/visa.png') },
    { name: 'Mastercard', icon: require('../assets/images/mastercard.png') },
    { name: 'Paypal', icon: require('../assets/images/paypal.png') },
  ];

  return (
    <View style={styles.container}>
      {/* Header*/}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.feathericon}>
            <Entypo name="chevron-small-left" color="#181C2E" size={25} />
          </View>
        </TouchableOpacity>
        <Text style={styles.heading}>Payment</Text>
      </View>
      <View style={{ flex: 1 }}>
        {/* Payment Flatlist */}
        <View>
          <FlatList
            data={paymentMethods}
            horizontal
            renderItem={({ item }) => {
              const Checked = item.name === selectedMethod;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedMethod(item.name)}
                  style={{ alignItems: 'center' }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: Checked ? '#FF6A00' : '#ECF0F4',
                        alignItems: 'center',
                        backgroundColor: Checked ? 'white' : '#ECF0F4',
                        padding: 20,
                        marginTop: 18,
                        borderRadius: 9.62,
                        marginHorizontal: 10,
                      }}
                    >
                      <Image source={item.icon} style={styles.icon} />
                    </View>
                    {Checked && (
                      <View style={styles.crossIcon}>
                        <Entypo name="check" size={12} color="white" />
                      </View>
                    )}
                  </View>
                  <Text style={styles.optionText}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {/* Mastercard Info */}
        {selectedMethod === 'Mastercard' && (
          <>
            <View style={{ marginTop: 20 }}>
              <View style={styles.cardBox}>
                <Text
                  style={{
                    fontFamily: 'Sen-Bold',
                    fontSize: 16,
                    color: '#32343E',
                  }}
                >
                  Master Card
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <Image
                    source={require('../assets/images/mastercard1.png')}
                    style={{ width: 28, height: 17.85, borderRadius: 3 }}
                  />
                  <Text
                    style={{
                      paddingHorizontal: 5,
                      fontFamily: 'Sen-Regular',
                      fontSize: 16,
                      color: '#32343E',
                    }}
                  >
                    ***************** 436
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddCardScreen')}
              >
                <Text style={styles.addButtonText}>+ ADD NEW</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Footer */}
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.emailtextstyle}>TOTAL:</Text>
          <Text style={styles.total}>${total}</Text>
        </View>
      </View>
     <TouchableOpacity
           onPress={() => navigation.navigate('PaymentSuccessfulScreen')}
             style={{
               borderRadius: 15,
               alignItems: 'center',
               borderRadius: 12,
               padding: 5,
               width: '97%',
               backgroundColor: '#FF6A00',
             }}
           >
             <Text
               style={{
                 color: 'white',
                 fontFamily: 'Sen-Bold',
                 fontSize: 14,
                 textAlign: 'center',
                 padding: 20,
               }}
             >
               PAY & CONFIRM
             </Text>
           </TouchableOpacity>
    </View>
  );
};

export default PaymentCardScreen;

const styles = StyleSheet.create({
  crossIcon: {
    width: 15,
    height: 15,
    backgroundColor: '#FF6A00',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 15,
    right: 7,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedstyle: {
    borderColor: '#FF6A00',
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  heading: {
    marginLeft: 9,
    color: '#181C2E',
    fontFamily: 'Sen-Regular',
    fontSize: 17,
    lineHeight: 22,
  },
  emailtextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    color: '#A0A5BA',
    lineHeight: 24,
  },
  total: {
    fontFamily: 'Sen-Regular',
    fontSize: 30,
    color: '#181C2E',
    marginLeft: 9,
  },

  icon: { width: 30, height: 30, resizeMode: 'contain' },
  optionText: {
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'Sen-Regular',
    marginInline: 10,
    color: '#464E57',
  },

  cardBox: {
    backgroundColor: '#ECF0F4',
    borderRadius: 10,
    padding: 18,
    // alignItems: 'center',
    marginBottom: 15,
    // marginHorizontal: 10,
  },
  cardImage: {
    width: 150,
    height: 95,
    resizeMode: 'contain',
    marginBottom: 15,
    borderRadius: 15,
    elevation: 11,
  },
  noCardText: {
    fontSize: 16,
    fontFamily: 'Sen-Bold',
    color: '#32343E',
  },
  subText: {
    textAlign: 'center',
    fontFamily: 'Sen-Regular',
    fontSize: 15,
    letterSpacing: 0.5,
    lineHeight: 24,
    color: '#2D2D2D',
  },
  addButton: {
    borderWidth: 2,
    borderColor: '#F0F5FA',
    borderRadius: 15,
    alignItems: 'center',
    borderRadius: 12,
    padding: 5,
    width: '98%',
    // marginLeft: 15,
  },
  addButtonText: {
    color: '#FF6A00',
    fontFamily: 'Sen-Bold',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },

  feathericon: {
    backgroundColor: '#ECF0F4',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
