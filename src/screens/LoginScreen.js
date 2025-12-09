import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomIcon from '../components/CustomIcon';
import { useAlert } from '../context/AlertContext';
import { useCallback } from 'react';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { showAlert, showError, hideAlert } = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Hide alerts when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Hide alert when navigating away from this screen
        hideAlert();
      };
    }, [hideAlert])
  );

  const handleSignIn = async () => {
    console.log('🔵 [LoginScreen] handleSignIn called');
    console.log('🔵 [LoginScreen] Email:', email);
    console.log('🔵 [LoginScreen] Password length:', password.length);
    
    if (!email || !password) {
      console.log('❌ [LoginScreen] Validation failed: Missing email or password');
      showAlert('Please fill all fields');
      return;
    }

    try {
      console.log('🟡 [LoginScreen] Attempting to sign in with Firebase Auth...');
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      console.log('✅ [LoginScreen] Firebase Auth sign-in successful!');
      console.log('✅ [LoginScreen] User UID:', userCredential.user.uid);
      console.log('✅ [LoginScreen] User Email:', userCredential.user.email);
      console.log('🟡 [LoginScreen] Waiting for auth state change to trigger navigation...');
      
      // Check current auth state
      const currentUser = auth().currentUser;
      console.log('🔵 [LoginScreen] Current auth user:', currentUser ? currentUser.uid : 'null');

    } catch (error) {
      console.error('❌ [LoginScreen] Sign-in error:', error);
      console.error('❌ [LoginScreen] Error code:', error.code);
      console.error('❌ [LoginScreen] Error message:', error.message);
      
      if (error.code === 'auth/user-not-found') {
        showError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        showError('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        showError('Invalid email format');
      } else {
        showError('Login failed', error.message);
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
            <View style={styles.passwordInputWrapper}>
              <CustomTextInput
                name="********"
                color="#676767"
                setState={setPassword}
                secureTextEntry={!showPassword}
                value={password}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#676767" />
                ) : (
                  <Eye size={20} color="#676767" />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.forgotpasswordstyles}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotpassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <CustomButton 
          title="LOG IN" 
          onPress={handleSignIn} 
          style={{ width: '90%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'}} />

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
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    marginBottom: 0,
  },
  eyeIcon: {
    padding: 10,
  },
});
