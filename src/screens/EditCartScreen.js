import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useAlert } from '../context/AlertContext';
import { Spacing } from '../styles/globalStyles';

const EditCartScreen = () => {
  const { cartItems, incrementQuantity, decrementQuantity, removeFromCart, getCartTotal } = useCart();
  const { locationAddress, fetchingLocation, locationError } = useLocation();
  const { showAlert, hideAlert } = useAlert();
  const navigation = useNavigation();

  const total = getCartTotal();
  const formattedTotal = total.toFixed(2);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Helper function to format price
  const formatPrice = (price) => {
    if (typeof price === 'string') {
      const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
      return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
    }
    return parseFloat(price).toFixed(2);
  };

  return (
    <View style={styles.containerstyle}>
      <View style={{ padding: 20, paddingBottom: cartItems.length > 0 ? 310 : 20 }}>
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
        {cartItems.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtext}>Add items from the menu to get started</Text>
          </View>
        ) : (
          <FlatList
            data={cartItems}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Image 
                  source={
                    item.imageUrl 
                      ? { uri: item.imageUrl }
                      : require('../assets/images/burgerbistro.jpg')
                  } 
                  style={styles.image} 
                />
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text 
                      style={styles.itemName}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        showAlert(
                          'Remove Item',
                          `Are you sure you want to remove "${item.name}" from your cart?`,
                          [
                            {
                              text: 'Cancel',
                              onPress: () => {},
                            },
                            {
                              text: 'Remove',
                              onPress: () => {
                                removeFromCart(item.id);
                                hideAlert();
                                showAlert('Removed', `${item.name} removed from cart`, [], 'success');
                              },
                            },
                          ],
                          'warning'
                        );
                      }}
                      style={styles.crossIcon}
                    >
                      <Entypo name="cross" size={20} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.price}>Rs {formatPrice(item.price)}</Text>

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
                        onPress={() => decrementQuantity(item.id)}
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
                        onPress={() => incrementQuantity(item.id)}
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
        )}
      </View>
      {/* Bottom Ticker */}
      <View style={styles.whiteblockstyle}>
        <View style={{ margin: 10 }}>
          <View style={styles.address}>
            <Text style={styles.emailtextstyle}>DELIVERY ADDRESS</Text>
            {cartItems.length > 0 && (
              <Text style={styles.itemCountText}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
            )}
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.addressInputContainer}>
              <Text style={styles.addressText}>
                {locationError 
                  ? 'Tap to get location' 
                  : fetchingLocation 
                    ? 'Getting location...' 
                    : locationAddress || 'Location unavailable'}
              </Text>
            </View>
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
            <Text style={styles.total}>RS {formattedTotal}</Text>
          </View>
         
        </View>
        <View style={styles.buttonContainer}>
        <CustomButton 
          title={'CONTINUE'} 
          onPress={() => {
            if (cartItems.length > 0) {
              navigation.navigate('PaymentCardScreen');
            }
          }}
          disabled={cartItems.length === 0}
        />
        </View>
      </View>
    </View>
  );
};

export default EditCartScreen;

const styles = StyleSheet.create({
  containerstyle: {
    flex: 1,
    backgroundColor: '#121223',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  crossIcon: {
    width: 25,
    height: 25,
    backgroundColor: '#E04444',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    flexShrink: 0,
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
  itemName: { 
    fontSize: 18, 
    fontFamily: 'Sen-Regular', 
    color: 'white',
    flex: 1,
    marginRight: 8,
  },
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  itemCountText: {
    fontFamily: 'Sen-Regular',
    fontSize: 12,
    color: '#646668ff',
    lineHeight: 24,
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
  total: { fontFamily: 'Sen-Regular', fontSize: 30, color: '#181C2E' },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyCartText: {
    fontSize: 20,
    fontFamily: 'Sen-Bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  emptyCartSubtext: {
    fontSize: 14,
    fontFamily: 'Sen-Regular',
    color: '#A0A5BA',
  },
  addressInputContainer: {
    width: '90%',
    backgroundColor: '#F0F5FA',
    borderRadius: 10,
    padding: 15,
    minHeight: 50,
    justifyContent: 'center',
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Sen-Regular',
    color: '#32343E',
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
});
