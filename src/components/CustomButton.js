import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSizes, BorderRadius, Spacing, Shadows } from '../styles/globalStyles';

const CustomButton = ({ title, onPress, variant = 'primary', style, ...rest }) => {
  const baseButtonStyle = variant === 'outline' 
    ? styles.outlineButton
    : styles.primaryButton;
  
  const buttonStyle = style 
    ? [baseButtonStyle, style]
    : baseButtonStyle;
  
  const textStyle = variant === 'outline'
    ? styles.outlineButtonText
    : styles.primaryButtonText;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={buttonStyle}
      {...rest}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 50,
    marginVertical: Spacing.md,
    ...Shadows.medium,
  },
  primaryButtonText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.textWhite,
    textAlign: 'center',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: 50,
    marginVertical: Spacing.md,
  },
  outlineButtonText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.primary,
    textAlign: 'center',
  },
});

export default CustomButton;
