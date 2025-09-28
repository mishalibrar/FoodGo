import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const saveInfo = () => {
    if (!email.endsWith('@gmail.com')) {
      Alert.alert('Email not valid must ends with @gmail.com');
    } else {
      navigation.replace('Verification');
    }
  };

  return (
    <View style={styles.containerstyle}>
      <Image
        source={require('../assets/images/bgsymbol.png')}
        style={styles.bgimgstyle}
      />
      <View style={{ flex: 0.3, justifyContent: 'center' }}>
        <Text style={styles.logintitlestyle}>Forgot Password</Text>
        <Text style={styles.textstyle}>
          Please sign in to your existing account
        </Text>
      </View>
      <View style={styles.whiteblockstyle}>
        <View style={{margin:5}}>
        <Text style={styles.emailtextstyle}>EMAIL</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="example@gmail.com"
            color="#676767"
            setState={setEmail}
            keyboardType={'email-address'}
          />
        </View>
        <View>
          <CustomButton title="SEND CODE" onPress={saveInfo} />
        </View>
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  containerstyle: {
    flex: 1,
    backgroundColor: '#121223',
    // backgroundColor:'#1E1E2E'
  },
  bgimgstyle: {
    width: 345,
    height: 340,
    position: 'absolute',
  },
  logintitlestyle: {
    fontFamily: 'Sen-Bold',
    color: 'white',
    fontSize: 30,
    textAlign: 'center',

    // top: 70,
  },
  textstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 16,
    color: 'white',
    lineHeight: 26,
    textAlign: 'center',
    // top: 70,
  },
  whiteblockstyle: {
    flex: 0.7,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  emailtextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 13,
    color: '#32343E',
    letterSpacing: 1,
    paddingTop: 20,
    marginLeft: 18,
    marginBottom: 4,
  },
});
