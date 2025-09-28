import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomButton from './CustomButton';
import CustomTextInput from './CustomTextInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

const EditItemModal = ({
  isVisible,
  onClose,
  adminUid,
  restaurantId,
  categoryId,
  itemId, // 🔹 ID of the item to update
  existingItem, // 🔹 Object containing { name, price, description, imageUrl }
}) => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null); // local new image
  const [uploading, setUploading] = useState(false);

  // Prefill values when modal opens
  useEffect(() => {
    if (existingItem) {
      setItemName(existingItem.name || '');
      setPrice(existingItem.price || '');
      setDescription(existingItem.description || '');
      setImageUri(existingItem.imageUrl || null);
    }
  }, [existingItem]);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (!response.didCancel && !response.errorCode) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const uploadImageToCloudinary = async () => {
    if (!imageUri || imageUri === existingItem.imageUrl)
      return existingItem.imageUrl;
    setUploading(true);

    const data = new FormData();
    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'item.jpg',
    });
    data.append('upload_preset', 'ml_default'); // replace with your Cloudinary preset

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dkris2jqn/image/upload',
        { method: 'POST', body: data },
      );
      const result = await res.json();
      setUploading(false);
      return result.secure_url;
    } catch (err) {
      console.error('Upload error:', err);
      setUploading(false);
      return existingItem.imageUrl;
    }
  };

  const handleUpdate = async () => {
    if (!itemName || !price || !description || !categoryId || !itemId) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary();

      await firestore()
        .collection('admins')
        .doc(adminUid)
        .collection('restaurants')
        .doc(restaurantId)
        .collection('categories')
        .doc(categoryId)
        .collection('items')
        .doc(itemId)
        .update({
          name: itemName,
          price,
          description,
          imageUrl,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert(
        'Update failed',
        'Something went wrong while updating the item.',
      );
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Product</Text>
          <TouchableOpacity onPress={onClose} style={styles.iconCircle}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

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

        <Text style={styles.emailtextstyle}>Product Name:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="Product Name"
            setState={setItemName}
            color="#676767"
            value={itemName}
          />
        </View>

        <Text style={styles.emailtextstyle}>Product Price:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="Rs 1,895"
            setState={setPrice}
            color="#676767"
            value={price}
          />
        </View>

        <Text style={styles.emailtextstyle}>Product Detail:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="Product Description"
            setState={setDescription}
            color="#676767"
            value={description}
          />
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          <CustomButton
            title={'Update Item'}
            onPress={handleUpdate}
            loading={uploading}
          />
        </View>
      </View>
    </Modal>
  );
};

export default EditItemModal;

const styles = StyleSheet.create({
  modal: { margin: 0, justifyContent: 'flex-start' },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#181C2E' },
  uploadBox: {
    height: 170,
    backgroundColor: '#F0F5FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  emailtextstyle: {
    fontFamily: 'Sen-Regular',
    fontSize: 13,
    color: '#32343E',
    letterSpacing: 1,
    paddingTop: 20,
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
});
