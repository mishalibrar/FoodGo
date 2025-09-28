import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const Button = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonstyle}>
        <Text style={styles.buttontextstyle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttontextstyle: {
    fontFamily: 'Sen-Bold',
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    padding: 20,
  },
  buttonstyle: {
    borderRadius: 12,
    backgroundColor: '#FF7622',
    marginBottom: 10,
    padding: 5,
    width: '90%',
    margin: 15,
  },
});
