import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../styles/globalStyles';

const CustomIcon = ({ imageSource, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.iconButton} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={imageSource}
        style={styles.iconImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default CustomIcon;

const styles = StyleSheet.create({
  iconButton: {
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xs,
    backgroundColor: Colors.backgroundLight,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
});
