import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Edit, LogOut, SettingsIcon, User2 } from 'lucide-react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = auth().currentUser;

        if (!user) return;

        const userDoc = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();

        const userData = userDoc.data();

        if (userData?.name) {
          setUserName(userData.name);
          return;
        }

        const adminDoc = await firestore()
          .collection('admins')
          .doc(user.uid)
          .get();

        const adminData = adminDoc.data();

        if (adminData?.name) {
          setUserName(adminData.name);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User2 color="#fff" size={65} />
        </View>

        <Text style={styles.name}>{userName}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Edit size={22} color="#181C2E" />
          <Text style={styles.menuText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <SettingsIcon size={22} color="#181C2E" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
          <LogOut size={22} color="red" />
          <Text style={[styles.menuText, { color: 'red' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1E5EA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FC6E2A',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'white',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Sen-Bold',
  },
  email: {
    fontSize: 14,
    color: '#d1f0ee',
    fontFamily: 'Sen-Regular',
  },
  menu: {
    marginTop: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Sen-Regular',
    color: '#181C2E',
  },
});
