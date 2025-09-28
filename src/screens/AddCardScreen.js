import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';

const AddCardScreen = () => {
  const navigation = useNavigation();
  const [cardholdername, setCardHolderName] = useState('');
  const [cardnumber, setCardNumber] = useState('');
  const [cvc, setCVC] = useState('');
  const [expiredate, setExpireDate] = useState('');

  return (
    <View style={styles.container}>
      {/* Header*/}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.feathericon}>
            <Entypo name="cross" color="#181C2E" size={20} />
          </View>
        </TouchableOpacity>
        <Text style={styles.heading}>Add Card</Text>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.emailtextstyle}>CARD HOLDER NAME</Text>
        <View style={{ alignItems: 'center' }}>
          <TextInput
            placeholder="Mishal Ibrar"
            placeholderTextColor={'#676767'}
            setState={setCardHolderName}
            style={{
              fontSize: 14,
              fontFamily: 'Sen-Regular',
              backgroundColor: '#F0F5FA',
              width: '97%',
              padding: 20,
              borderRadius: 10,
            }}
          />
        </View>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.emailtextstyle}>CARD NUMBER</Text>
        <View style={{ alignItems: 'center' }}>
          <TextInput
            placeholder="2134   _ _ _ _   _ _ _ _"
            placeholderTextColor={'#676767'}
            setState={setCardNumber}
            keyboardType={'numeric'}
            style={{
              fontSize: 14,
              fontFamily: 'Sen-Regular',
              backgroundColor: '#F0F5FA',
              width: '97%',
              padding: 20,
              borderRadius: 10,
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.emailtextstyle}>EXPIRE DATE</Text>
          <View style={{ alignItems: 'center' }}>
            <TextInput
              placeholder="mm/yyyy"
              placeholderTextColor={'#676767'}
              setState={setExpireDate}
              keyboardType={'numeric'}
              style={{
                fontSize: 14,
                fontFamily: 'Sen-Regular',
                backgroundColor: '#F0F5FA',
                width: 150,
                padding: 20,
                borderRadius: 10,
                marginLeft: 6,
              }}
            />
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.emailtextstyle}>CVC</Text>
          <View style={{ alignItems: 'center' }}>
            <TextInput
              placeholder="***"
              placeholderTextColor={'#676767'}
              setState={setCVC}
              keyboardType={'numeric'}
              style={{
                fontSize: 14,
                fontFamily: 'Sen-Regular',
                backgroundColor: '#F0F5FA',
                width: 150,
                padding: 20,
                borderRadius: 10,
              }}
            />
          </View>
        </View>
      </View>
      <View style={{flex:1,  justifyContent:'flex-end'}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('PaymentCardScreen')}
          style={{
            borderRadius: 15,
            alignItems: 'center',
            borderRadius: 12,
            padding: 5,
            width: '97%',
            backgroundColor: '#FF6A00',
            marginLeft: 6,
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
            ADD & MAKE PAYMENTS
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddCardScreen;

const styles = StyleSheet.create({
  heading: {
    marginLeft: 9,
    color: '#181C2E',
    fontFamily: 'Sen-Regular',
    fontSize: 17,
    lineHeight: 22,
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
  feathericon: {
    backgroundColor: '#ECF0F4',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailtextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 13,
    color: '#32343E',
    letterSpacing: 0.9,
    paddingTop: 20,
    marginLeft: 9,
    marginBottom: 6,
  },
});
