import { StyleSheet, TextInput } from 'react-native';
import React from 'react';

const CustomTextInput = props => {
  return (
    <TextInput
      placeholder={props.name}
      placeholderTextColor={props.color}
      keyboardType={props.keyboardType}
      onChangeText={props.setState}
      onPress={props.onPress}
      style={[styles.textinputstyle, props.style]}
      secureTextEntry={props.secureTextEntry}
      numberOfLines={props.numberOfLines}
      value={props.value}
    />
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  textinputstyle: {
    fontSize: 14,
    fontFamily: 'Sen-Regular',
    color: '#676767',
    backgroundColor: '#F0F5FA',
    width: '90%',
    padding: 20,
    borderRadius: 10,
  },
});
