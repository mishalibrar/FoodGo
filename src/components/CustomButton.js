import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CustomButton = ({ title, onPress, ...rest }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.buttonstyle}
      {...rest}
    >
      <Text style={styles.buttontextstyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttontextstyle: {
    fontFamily: 'Sen-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingVertical: 20,
  },
  buttonstyle: {
    borderRadius: 12,
    backgroundColor: '#FF7622',
    width: '90%',
    marginVertical: 10,
    alignSelf: 'center',
  },
});
