import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

import { launchImageLibrary } from 'react-native-image-picker';
import CustomButton from './CustomButton';
import CustomTextInput from './CustomTextInput';

const AddRestaurantModal = ({ isVisible, onClose, onSave, adminUid }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [details, setDetails] = useState('');
  const [rating, setRating] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const uploadImageToCloudinary = async () => {
    if (!imageUri) return null;
    setUploading(true);

    const data = new FormData();
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'restaurant.jpg',
    });
    data.append('upload_preset', 'ml_default');

    try {
      let res = await fetch(
        'https://api.cloudinary.com/v1_1/dkris2jqn/image/upload',
        {
          method: 'POST',
          body: data,
        },
      );
      let result = await res.json();
      setUploading(false);
      return result.secure_url;
    } catch (err) {
      setUploading(false);
      console.error('Upload error:', err);
      return null;
    }
  };

  const handleSave = async () => {
    if (!adminUid) return Alert.alert('Error', 'Missing admin ID');

    if (
      !restaurantName ||
      !details ||
      !rating ||
      !location ||
      !category ||
      !imageUri
    ) {
      Alert.alert('Please fill all fields and select an image');
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary();
      if (!imageUrl) return Alert.alert('Image upload failed');

      await firestore()
        .collection('admins')
        .doc(adminUid)
        .collection('restaurants')
        .add({
          name: restaurantName,
          details,
          rating,
          category,
          location,
          imageUrl,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      setRestaurantName('');
      setDetails('');
      setRating('');
      setCategory('');
      setLocation('');
      setImageUri(null);

      onSave();
    } catch (error) {
      console.error('Error adding restaurant: ', error);
    }
  };

  const handleClose = () => {
    setRestaurantName('');
    setDetails('');
    setRating('');
    setCategory('');
    setLocation('');
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Register Restaurant</Text>
          <TouchableOpacity onPress={handleClose} style={styles.iconCircle}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Restaurant Image:</Text>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: '100%', borderRadius: 12 }}
              />
            ) : (
              <Text style={{ color: '#888' }}>+ Upload Image</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Restaurant Name:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="e.g. Foodgo Cafe"
            value={restaurantName}
            setState={setRestaurantName}
            color="#676767"
          />
        </View>
        <Text style={styles.label}>Restaurant Details:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="e.g. Family friendly cafe with coffee & snacks"
            setState={setDetails}
            color="#676767"
            value={details}
          />
        </View>
        <Text style={styles.label}>Rating:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="e.g. 4.5"
            setState={setRating}
            color="#676767"
            value={rating}
          />
        </View>
        <Text style={styles.label}>Location:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="e.g. Main Street, City"
            setState={setLocation}
            color="#676767"
            value={location}
          />
        </View>
        <Text style={styles.label}>Cuisine/Category:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="e.g. Italian, Fast Food, Desserts"
            setState={setCategory}
            color="#676767"
            value={category}
          />
        </View>

        <View style={styles.footer}>
          <CustomButton
            title={uploading ? 'Uploading...' : 'Save'}
            onPress={handleSave}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddRestaurantModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  title: { fontSize: 22, fontFamily: 'Sen-Bold', color: '#181C2E' },
  label: {
    fontFamily: 'Sen-Regular',
    fontSize: 13,
    color: '#32343E',
    letterSpacing: 1,
    paddingTop: 10,
    marginLeft: 18,
    marginBottom: 4,
    textAlign: 'left',
  },
  iconCircle: {
    backgroundColor: '#ECF0F4',
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    elevation: 7,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
  },
  uploadBox: {
    height: 100,
    backgroundColor: '#F0F5FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 15,
    width: '90%',
  },
});
