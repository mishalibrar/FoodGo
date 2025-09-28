import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomTextInput from './CustomTextInput';
import CustomButton from './CustomButton';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dkris2jqn/image/upload';
const UPLOAD_PRESET = 'ml_default';

const AddCategoryModal = ({ isVisible, onClose, adminUid, restaurantId }) => {
  const [categoryName, setCategoryName] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Pick Image
  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Upload to Cloudinary
  const uploadImageToCloudinary = async () => {
    if (!imageUri) return null;

    setUploading(true);
    const data = new FormData();
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    data.append('upload_preset', UPLOAD_PRESET);

    try {
      let res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: data,
      });
      let json = await res.json();
      setUploading(false);
      return json.secure_url;
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      setUploading(false);
      return null;
    }
  };

  // Save Category
  const handleSave = async () => {
    if (!categoryName) {
      Alert.alert('Please enter a category name');
      return;
    }

    try {
      let imageUrl = await uploadImageToCloudinary();

      await firestore()
        .collection('admins')
        .doc(adminUid)
        .collection('restaurants')
        .doc(restaurantId)
        .collection('categories')
        .add({
          title: categoryName,
          image: imageUrl || null,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      setCategoryName('');
      setImageUri(null);
      onClose();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Category</Text>
          <TouchableOpacity onPress={onClose} style={styles.iconCircle}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Input */}
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="e.g. Burgers, Pizza, Drinks"
            value={categoryName}
            setState={setCategoryName}
            color="#676767"
          />
        </View>

        {/* Pick Image */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} />
          ) : (
            <Text style={{ color: '#676767' }}>Pick Category Image</Text>
          )}
        </TouchableOpacity>

        {/* Save */}
        <View style={styles.footer}>
          <CustomButton
            title={uploading ? 'Uploading...' : 'Save Category'}
            onPress={handleSave}
            disabled={uploading}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddCategoryModal;

const styles = StyleSheet.create({
  modal: { margin: 20, justifyContent: 'center' },
  container: { backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  title: { fontSize: 20, fontFamily: 'Sen-Bold' },
  iconCircle: {
    backgroundColor: '#ECF0F4',
    width: 35,
    height: 35,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { marginTop: 20 },
  imagePicker: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginHorizontal:18,
    height:200
  },
  preview: { width: 100, height: 100, },
});
