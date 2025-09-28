import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const CustomIcon = ({ imageSource, onPress }) => {
  return (
    <TouchableOpacity style={styles.iconButton} onPress={onPress}>
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
    padding: 10,
    borderWidth: 1,
    borderColor: '#ebebeb',
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor:'#ebebeb'
  },
  iconImage: {
    width: 24,
    height: 24,
  },
});
