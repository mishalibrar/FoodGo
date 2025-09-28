import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';


const Verification = () => {
  const navigation = useNavigation();

  const saveInfo = () => {
    navigation.replace('HomeScreen');
  };

  return (
    <View style={styles.containerstyle}>
      <Image
        source={require('../assets/images/bgsymbol.png')}
        style={styles.bgimgstyle}
      />
      <View style={{ flex: 0.3, justifyContent: 'center' }}>
        <Text style={styles.logintitlestyle}>Verification</Text>
        <Text style={styles.textstyle}>We have sent a code to your email</Text>
        <Text style={styles.examplestyle}>example@gmail.com</Text>
      </View>
      <View style={styles.whiteblockstyle}>
        <View style={{ paddingTop: 20 , justifyContent:'center'}}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 19 }}>
            <Text style={styles.emailtextstyle}>CODE</Text>
            <View style={{  flexDirection:'row', }}>
            <TouchableOpacity>
              <Text style={{ fontFamily: 'Sen-Bold', fontSize: 12 }}>
                Resend
              </Text>
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Sen-Regular', fontSize: 12 }}>
              in.50 sec
            </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent:'center' }}>
            <TextInput
              placeholder="1"
              placeholderTextColor={'#A0A5BA'}
              maxLength={1}
              keyboardType="Numeric"
              style={styles.textinputstyle}
            />
            <TextInput
              placeholder="2"
              placeholderTextColor={'#A0A5BA'}
              maxLength={1}
              keyboardType="Numeric"
              style={styles.textinputstyle}
            />
            <TextInput
              placeholder="3"
              placeholderTextColor={'#A0A5BA'}
              maxLength={1}
              keyboardType="Numeric"
              style={styles.textinputstyle}
            />
            <TextInput
              placeholder="4"
              placeholderTextColor={'#A0A5BA'}
              maxLength={1}
              keyboardType="Numeric"
              style={styles.textinputstyle}
            />
          </View>
        </View>
        <View>
          <CustomButton title="VERIFY" onPress={saveInfo} />
        </View>
      </View>
    </View>
  );
};

export default Verification;

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
    // top: 120,
    // borderRadius: 24,
    // alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  textinputstyle: {
    borderRadius: 10,
    backgroundColor: '#F0F5FA',
    width: 62,
    height: 62,
    color: '#32343E',
    fontFamily: 'Sen-Bold',
    fontSize: 16,
    margin: 10,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  emailtextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 13,
    color: '#32343E',
    letterSpacing: 1,
    marginBottom: 4,
    marginLeft: 14,
    
  },
  examplestyle: {
    fontFamily: 'Sen-Bold',
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
    marginTop: 3,
  },
});
