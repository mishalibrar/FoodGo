import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomIcon from '../components/CustomIcon';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      const userCred = await auth().signInWithEmailAndPassword(email, password);
      const uid = userCred.user.uid;
      console.log(uid)

    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Invalid email format');
      } else {
        Alert.alert('Login failed', error.message);
      }
    }
  };

  return (
    <View style={styles.containerstyle}>
      <View style={{ flex: 0.3, justifyContent: 'center' }}>
        <Image
          source={require('../assets/images/bgsymbol.png')}
          style={styles.bgimgstyle}
        />
        <Text style={styles.logintitlestyle}>Log In</Text>
        <Text style={styles.textstyle}>
          Please sign in to your existing account
        </Text>
      </View>
      <View style={styles.whiteblockstyle}>
        <View style={{ margin: 5 }}>
          <Text style={styles.emailtextstyle}>EMAIL</Text>
          <View style={{ alignItems: 'center' }}>
            <CustomTextInput
              name="example@gmail.com"
              color="#676767"
              setState={setEmail}
              keyboardType={'email-address'}
            />
          </View>
          <Text style={styles.emailtextstyle}>PASSWORD</Text>
          <View style={{ alignItems: 'center' }}>
            <CustomTextInput
              name="********"
              color="#676767"
              setState={setPassword}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.forgotpasswordstyles}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotpassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <CustomButton title="LOG IN" onPress={handleSignIn} />

          <View
            style={{
              flexDirection: 'row',
              padding: 20,
              justifyContent: 'center',
            }}
          >
            <Text style={styles.Ortextstyle}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.forgotpassword}> SIGN UP </Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.Ortextstyle}>Or</Text>
            <View style={{ flexDirection: 'row', margin: 20, gap: 8 }}>
              <CustomIcon
                imageSource={require('../assets/images/googlelogo.png')}
                onPress={() => console.log('Google Login')}
              />
              <CustomIcon
                imageSource={require('../assets/images/fb.png')}
                onPress={() => console.log('Facebook Login')}
              />
              <CustomIcon
                imageSource={require('../assets/images/apple.png')}
                onPress={() => console.log('Apple Login')}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  containerstyle: {
    flex: 1,
    backgroundColor: '#121223',
    // backgroundColor:'#1E1E2E'
  },
  bgimgstyle: {
    width: 345,
    height: 340,
    position: 'absolute',
  },
  logintitlestyle: {
    fontFamily: 'Sen-Bold',
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
  },
  textstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 16,
    color: 'white',
    lineHeight: 26,
    textAlign: 'center',
  },
  whiteblockstyle: {
    flex: 0.7,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  emailtextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 13,
    color: '#32343E',
    letterSpacing: 1,
    paddingTop: 20,
    marginLeft: 18,
    marginBottom: 4,
  },
  remembermestyle: {
    color: '#7E8A97',
    fontFamily: 'Sen-Regular',
    fontSize: 13,
    textAlignVertical: 'center',
    marginLeft: 9,
  },
  forgotpassword: {
    fontFamily: 'Sen-Regular',
    fontSize: 14,
    color: '#FF7622',
    textAlign: 'right',
  },
  Ortextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 16,
    color: '#646982',
  },
  forgotpasswordstyles: {
    padding: 15,
    marginBottom: 10,
    justifyContent: 'flex-end',
  },
});
