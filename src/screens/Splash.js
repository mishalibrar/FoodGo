import { StyleSheet, View, ImageBackground } from 'react-native';
import React from 'react';

const Splash = () => {
  return (
    <View
    style={{
      flex:1,
    }}
    >
      <ImageBackground
      source={require('../assets/images/splashpage.png')}
      resizeMode='cover'
      style={styles.backgroundimage}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  backgroundimage:{
        flex:1,
        width: '100%' ,
        height: '100%' ,
      }
})