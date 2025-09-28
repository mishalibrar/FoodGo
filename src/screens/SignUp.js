import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Fill all fields!');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords must match!');
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

      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
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
          <CustomTextInput
            name="********"
            color="#676767"
            setState={setPassword}
            secureTextEntry={true}
          />
        </View>
        <Text style={styles.emailtextstyle}>Confirm Password</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="********"
            color="#676767"
            setState={setConfirmPassword}
            secureTextEntry={true}
          />
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
          <CustomButton title="SIGN UP" onPress={handleSignUp} />
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
});
