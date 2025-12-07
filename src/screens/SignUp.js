import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react-native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useAlert } from '../context/AlertContext';

const SignUp = () => {
  const { showAlert, showError, showSuccess } = useAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      showAlert('Fill all fields!');
      return;
    }
    if (password.length < 8) {
      showAlert('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      showAlert('Passwords must match!');
      return;
    }

    try {
      const userCred = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const uid = userCred.user.uid;

      const data = {
        name,
        email,
        role,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      
      if (role === 'admin') {
        await firestore().collection('admins').doc(uid).set(data);
      } else {
        await firestore().collection('users').doc(uid).set(data);
      }

      showSuccess('Success', 'Account created successfully!');
    } catch (error) {
      showError('Sign Up Failed', error.message);
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
