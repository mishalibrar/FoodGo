import React from 'react';
import { StyleSheet, View, ImageBackground } from 'react-native';

const Splash = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/splashpage.png')}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});