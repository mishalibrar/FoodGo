import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useCallback, useRef } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Eye, EyeOff } from 'lucide-react-native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useAlert } from '../context/AlertContext';

const SignUp = () => {
  const navigation = useNavigation();
  const { showAlert, showError, showSuccess, hideAlert } = useAlert();
  const navigationTimeoutRef = useRef(null);
  const isNavigatingRef = useRef(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hide alerts when screen loses focus
  useFocusEffect(
    useCallback(() => {
      // Reset navigation flag when screen is focused
      isNavigatingRef.current = false;
      
      return () => {
        // Clear navigation timeout and hide alert when navigating away from this screen
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
          navigationTimeoutRef.current = null;
        }
        isNavigatingRef.current = false;
        hideAlert();
      };
    }, [hideAlert])
  );

  const handleSignUp = async () => {
    console.log('🔵 [SignUp] handleSignUp called');
    console.log('🔵 [SignUp] Name:', name);
    console.log('🔵 [SignUp] Email:', email);
    console.log('🔵 [SignUp] Role:', role);
    console.log('🔵 [SignUp] Password length:', password.length);
    
    if (!name || !email || !password || !confirmPassword) {
      console.log('❌ [SignUp] Validation failed: Missing fields');
      showAlert('Fill all fields!');
      return;
    }
    if (password.length < 8) {
      console.log('❌ [SignUp] Validation failed: Password too short');
      showAlert('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      console.log('❌ [SignUp] Validation failed: Passwords do not match');
      showAlert('Passwords must match!');
      return;
    }

    try {
      console.log('🟡 [SignUp] Creating user account with Firebase Auth...');
      const userCred = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const uid = userCred.user.uid;
      console.log('✅ [SignUp] User account created! UID:', uid);

      const data = {
        name,
        email,
        role,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      
      console.log('🔵 [SignUp] Saving user data to Firestore...');
      console.log('🔵 [SignUp] Collection:', role === 'admin' ? 'admins' : 'users');
      console.log('🔵 [SignUp] Data to save:', { ...data, createdAt: 'serverTimestamp' });
      
      if (role === 'admin') {
        await firestore().collection('admins').doc(uid).set(data);
        console.log('✅ [SignUp] Admin data saved to Firestore');
      } else {
        await firestore().collection('users').doc(uid).set(data);
        console.log('✅ [SignUp] User data saved to Firestore');
      }

      // Verify the data was saved
      const verifyDoc = role === 'admin' 
        ? await firestore().collection('admins').doc(uid).get()
        : await firestore().collection('users').doc(uid).get();
      
      if (verifyDoc.exists) {
        console.log('✅ [SignUp] Verified: Document exists in Firestore');
        console.log('✅ [SignUp] Verified data:', verifyDoc.data());
      } else {
        console.error('❌ [SignUp] ERROR: Document not found after saving!');
        throw new Error('Failed to save user data to Firestore');
      }

      // Wait a moment to ensure Firestore write is fully committed
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('🔵 [SignUp] Firestore write confirmed, proceeding...');

      // Sign out the user so they can log in with their selected role
      console.log('🔵 [SignUp] Signing out user...');
      await auth().signOut();
      console.log('✅ [SignUp] User signed out');

      // Wait a moment for auth state to update
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('🔵 [SignUp] Auth state updated, showing success message...');

      // Clear any existing navigation timeout
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }

      // Function to navigate to login screen
      const navigateToLogin = () => {
        // Prevent multiple navigation attempts
        if (isNavigatingRef.current) {
          console.log('🔵 [SignUp] Navigation already in progress, skipping...');
          return;
        }
        
        isNavigatingRef.current = true;
        console.log('🔵 [SignUp] Navigating to LoginScreen...');
        
        if (navigationTimeoutRef.current) {
          clearTimeout(navigationTimeoutRef.current);
          navigationTimeoutRef.current = null;
        }
        
        hideAlert();
        
        // Small delay to ensure alert closes smoothly before navigation
        setTimeout(() => {
          try {
            console.log('🔵 [SignUp] Executing navigation to LoginScreen');
            navigation.navigate('LoginScreen');
            console.log('✅ [SignUp] Navigation to LoginScreen completed');
          } catch (error) {
            console.error('❌ [SignUp] Navigation error:', error);
            isNavigatingRef.current = false;
          }
        }, 200);
      };

      // Show success message
      console.log('🔵 [SignUp] Showing success alert...');
      showSuccess(
        'Account Created!',
        `Your ${role} account has been created successfully. Please log in to continue.`,
        [
          {
            text: 'Go to Login',
            onPress: () => {
              console.log('🔵 [SignUp] User clicked "Go to Login" button');
              navigateToLogin();
            },
          },
        ]
      );

      // Auto-navigate to login screen after 4 seconds if user doesn't click button
      console.log('🔵 [SignUp] Setting auto-navigation timeout (4 seconds)...');
      navigationTimeoutRef.current = setTimeout(() => {
        console.log('🔵 [SignUp] Auto-navigation timeout triggered');
        navigateToLogin();
      }, 4000);
    } catch (error) {
      console.error('❌ [SignUp] Sign up error:', error);
      console.error('❌ [SignUp] Error code:', error.code);
      console.error('❌ [SignUp] Error message:', error.message);
      
      // Reset navigation flag on error
      isNavigatingRef.current = false;
      
      // Clear any pending navigation
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
        navigationTimeoutRef.current = null;
      }
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        showError('Email Already Exists', 'This email is already registered. Please use a different email or try logging in.');
      } else if (error.code === 'auth/weak-password') {
        showError('Weak Password', 'Password is too weak. Please use a stronger password.');
      } else if (error.code === 'auth/invalid-email') {
        showError('Invalid Email', 'Please enter a valid email address.');
      } else {
        showError('Sign Up Failed', error.message || 'An error occurred during sign up. Please try again.');
      }
    }
  };

  return (
    <View style={styles.containerstyle}>
      <Image
        source={require('../assets/images/bgsymbol.png')}
        style={styles.bgimgstyle}
      />
      <View style={{ flex: 0.3, justifyContent: 'center' }}>
        <Text style={styles.signuptitlestyle}>Sign Up</Text>
        <Text style={styles.textstyle}>Please sign up to get started</Text>
      </View>

      <View style={styles.whiteblockstyle}>
        <Text style={styles.emailtextstyle}>Name</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="Mishal Ibrar"
            color="#676767"
            setState={setName}
          />
        </View>
        <Text style={styles.emailtextstyle}>Email</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="example@gmail.com"
            color="#676767"
            setState={setEmail}
            keyboardType={'email-address'}
          />
        </View>
        <Text style={styles.emailtextstyle}>Password</Text>
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
        <Text style={styles.emailtextstyle}>Confirm Password</Text>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.passwordInputWrapper}>
            <CustomTextInput
              name="********"
              color="#676767"
              setState={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              style={styles.passwordInput}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              activeOpacity={0.7}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color="#676767" />
              ) : (
                <Eye size={20} color="#676767" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Role selection */}
        <Text style={styles.emailtextstyle}>Select Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'user' ? styles.activeRole : styles.inactiveRole,
            ]}
            onPress={() => setRole('user')}
          >
            <Text
              style={[
                styles.roleText,
                role === 'user' ? styles.activeText : styles.inactiveText,
              ]}
            >
              User
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              role === 'admin' ? styles.activeRole : styles.inactiveRole,
            ]}
            onPress={() => setRole('admin')}
          >
            <Text
              style={[
                styles.roleText,
                role === 'admin' ? styles.activeText : styles.inactiveText,
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 25 }}>
          <CustomButton title="SIGN UP" onPress={handleSignUp} 
          style={{ width: '90%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'}}/>
        </View>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  containerstyle: {
    flex: 1,
    backgroundColor: '#121223',
  },
  bgimgstyle: {
    width: 345,
    height: 340,
    position: 'absolute',
  },
  signuptitlestyle: {
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
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
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
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 20,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: '#121223',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  activeRole: {
    backgroundColor: '#121223',
  },
  inactiveRole: {
    backgroundColor: '#ffffff',
  },
  roleText: {
    fontFamily: 'Sen-Regular',
    fontSize: 14,
  },
  activeText: {
    color: '#ffffff',
  },
  inactiveText: {
    color: '#121223',
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
