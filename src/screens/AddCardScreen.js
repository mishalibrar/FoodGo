import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
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
          <CustomTextInput
            name="Mishal Ibrar"
            color="#676767"
            setState={setCardHolderName}
            style={styles.inputFull}
          />
        </View>
      </View>
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.emailtextstyle}>CARD NUMBER</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="2134   _ _ _ _   _ _ _ _"
            color="#676767"
            setState={setCardNumber}
            keyboardType="numeric"
            style={styles.inputFull}
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
            <CustomTextInput
              name="mm/yyyy"
              color="#676767"
              setState={setExpireDate}
              keyboardType="numeric"
              style={[styles.inputHalf, styles.inputLeft]}
            />
          </View>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.emailtextstyle}>CVC</Text>
          <View style={{ alignItems: 'center' }}>
            <CustomTextInput
              name="***"
              color="#676767"
              setState={setCVC}
              keyboardType="numeric"
              style={styles.inputHalf}
            />
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="ADD & MAKE PAYMENTS"
          onPress={() => navigation.navigate('PaymentCardScreen')}
          style={styles.addButton}
        />
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
  inputFull: {
    width: '97%',
  },
  inputHalf: {
    width: 150,
  },
  inputLeft: {
    marginLeft: 6,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  addButton: {
    marginVertical: 0,
  },
});
