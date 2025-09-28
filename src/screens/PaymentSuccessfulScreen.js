import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PaymentSuccessfulScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../assets/images/tick.png')}
            style={styles.imgstyle}
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            marginHorizontal: 30,
          }}
        >
          <Text style={styles.titlestyle}>Congratulations!</Text>
          <Text style={styles.textstyle}>
            You successfully maked a paymet, enjoy our services!
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'green',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
             onPress={() => navigation.goBack()}
            style={{
              borderRadius: 15,
              alignItems: 'center',
              borderRadius: 12,
              padding: 5,
              width: '97%',
              backgroundColor: '#FF6A00',
              justifyContent: 'center',
              position: 'absolute',
              top: 50,
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
              TRACK ORDER
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentSuccessfulScreen;

const styles = StyleSheet.create({
  titlestyle: {
    fontFamily: 'Sen-ExtraBold',
    fontSize: 24,
    color: '#32343E',
    marginBottom: 4,
  },
  textstyle: {
    textAlign: 'center',
    fontFamily: 'Sen-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#646982',
  },
  imgstyle: {
    width: 340,
    height: 392,
    // justifyContent:'center',
    // alignItems:'center'
  },
  parentviewstyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
