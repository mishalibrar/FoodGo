import React, { useState, useEffect } from 'react';
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

const EditRestaurantModal = ({
  isVisible,
  onClose,
  onSave,
  adminUid,
  restaurant,
}) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [details, setDetails] = useState('');
  const [rating, setRating] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (restaurant) {
      setRestaurantName(restaurant.name || '');
      setDetails(restaurant.details || '');
      setRating(restaurant.rating?.toString() || '');
      setLocation(restaurant.location || '');
      setCategory(restaurant.category || '');
      setImageUri(restaurant.imageUrl || null);
    }
  }, [restaurant]);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const uploadImageToCloudinary = async () => {
    if (!imageUri || imageUri.startsWith('http')) return imageUri;
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

  const handleUpdate = async () => {
    if (!adminUid || !restaurant?.id)
      return Alert.alert('Error', 'Missing admin or restaurant ID');

    if (!restaurantName || !details || !rating || !location || !category) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary();
      if (!imageUrl) return Alert.alert('Image upload failed');

      await firestore()
        .collection('admins')
        .doc(adminUid)
        .collection('restaurants')
        .doc(restaurant.id)
        .update({
          name: restaurantName,
          details,
          rating,
          category,
          location,
          imageUrl,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      onSave();
    } catch (error) {
      console.error('Error updating restaurant: ', error);
      Alert.alert('Error', 'Could not update restaurant');
    }
  };

  const handleClose = () => {
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
          <Text style={styles.title}>Edit Restaurant</Text>
          <TouchableOpacity onPress={handleClose} style={styles.iconCircle}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Image Picker */}
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

        {/* Form Inputs */}
        <Text style={styles.label}>Restaurant Name:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            value={restaurantName}
            setState={setRestaurantName}
            name="e.g. Foodgo Cafe"
          />
        </View>
        <Text style={styles.label}>Restaurant Details:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            value={details}
            setState={setDetails}
            name="e.g. Family friendly cafe"
          />
        </View>
        <Text style={styles.label}>Rating:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            value={rating}
            setState={setRating}
            name="e.g. 4.5"
          />
        </View>
        <Text style={styles.label}>Location:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            value={location}
            setState={setLocation}
            name="e.g. Main Street, City"
          />
        </View>
        <Text style={styles.label}>Cuisine/Category:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            value={category}
            setState={setCategory}
            name="e.g. Italian, Fast Food"
          />
        </View>
        {/* Footer Button */}
        <View style={styles.footer}>
          <CustomButton
            title={uploading ? 'Updating...' : 'Update'}
            onPress={handleUpdate}
          />
        </View>
      </View>
    </Modal>
  );
};

export default EditRestaurantModal;

const styles = StyleSheet.create({
  modal: { margin: 0, justifyContent: 'flex-start' },
  container: { flex: 1, backgroundColor: '#fff' },
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
  footer: { position: 'absolute', bottom: 0, width: '100%' },
  uploadBox: {
    height: 100,
    backgroundColor: '#F0F5FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
});
