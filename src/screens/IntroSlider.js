import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useNavigation } from '@react-navigation/native';

const IntroSlider = () => {
  const navigation = useNavigation();

  const renderSkipButton = () => (
    <View style={styles.skipWrapper}>
      <Text style={styles.skipText}>Skip</Text>
    </View>
  );

  const renderNextButton = () => (
    <View style={styles.nextButtonWrapper}>
      <Text style={styles.buttontextstyle}>Next</Text>
    </View>
  );
  const renderDoneButton = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={styles.buttonstyle}>
        <Text style={styles.buttontextstyle}>Get Started</Text>
      </View>
    </View>
  );

  const Slides = [
    {
      key: 1,
      title: 'All your favorites',
      text: 'Get all your loved foods in one once place, \n you just place the orer we do the rest',
      image: require('../assets/images/introslide1.png'),
      backgroundcolor: 'white',
    },
    {
      key: 2,
      title: 'All your favorites',
      text: 'Get all your loved foods in one once place, \n you just place the orer we do the rest',
      image: require('../assets/images/introslide2.png'),
      backgroundcolor: 'white',
    },
    {
      key: 3,
      title: 'Order from choosen chef',
      text: 'Get all your loved foods in one once place, \n you just place the orer we do the rest',
      image: require('../assets/images/introslider3.png'),
      backgroundcolor: 'white',
    },
    {
      key: 4,
      title: 'Free delivery offers',
      text: 'Get all your loved foods in one once place, \n you just place the orer we do the rest',
      image: require('../assets/images/introslider4.png'),
      backgroundcolor: 'white',
    },
  ];

  const handleDone = () => {
    navigation.replace('LoginScreen');
  };

  return (
    <AppIntroSlider
      data={Slides}
      renderItem={({ item }) => (
        <View style={styles.parentviewstyle}>
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.imgstyle} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.titlestyle}>{item.title}</Text>
            <Text style={styles.textstyle}>{item.text}</Text>
          </View>
        </View>
      )}
      onDone={handleDone}
      bottomButton={true}
      showSkipButton={true}
      onSkip={handleDone}
      dotStyle={{
        backgroundColor: '#FFE1CE',
      }}
      activeDotStyle={{
        backgroundColor: '#FF7622',
      }}
      renderNextButton={renderNextButton}
      renderSkipButton={renderSkipButton}
      renderDoneButton={renderDoneButton}
    />
  );
};

export default IntroSlider;

const styles = StyleSheet.create({
  parentviewstyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingTop: 40,
  },
  imageContainer: {
    flex: 0.55,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.35,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  imgstyle: {
    width: 240,
    height: 292,
    resizeMode: 'contain',
  },
  titlestyle: {
    fontFamily: 'Sen-ExtraBold',
    fontSize: 24,
    color: '#32343E',
    marginBottom: 8,
  },
  textstyle: {
    textAlign: 'center',
    fontFamily: 'Sen-Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#646982',
  },
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
    marginBottom: 54,
    width: '90%',
    margin: 10,
  },
  nextButtonWrapper: {
   borderRadius: 12,
    backgroundColor: '#FF7622',
    width: '90%',
    alignSelf:'center',
    margin: 10,
  },
  skipWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  skipText: {
    color: '#646982',
    fontFamily: 'Sen-Regular',
    fontSize: 16,
  },
});
