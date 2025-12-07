import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSizes, BorderRadius, Spacing } from '../styles/globalStyles';

const CustomTextInput = ({
  name,
  color = Colors.textTertiary,
  keyboardType,
  setState,
  onPress,
  style,
  secureTextEntry,
  numberOfLines,
  value,
  ...rest
}) => {
  return (
    <TextInput
      placeholder={name}
      placeholderTextColor={color}
      keyboardType={keyboardType}
      onChangeText={setState}
      onPress={onPress}
      style={[styles.input, style]}
      secureTextEntry={secureTextEntry}
      numberOfLines={numberOfLines}
      value={value}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textPrimary,
    backgroundColor: Colors.backgroundLight,
    width: '90%',
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
});

export default CustomTextInput;
