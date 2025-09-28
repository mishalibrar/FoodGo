import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomButton from './CustomButton';
import CustomTextInput from './CustomTextInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';

const AddItemModal = ({
  isVisible,
  onClose,
  adminUid,
  restaurantId,
  categoryId,
}) => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
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
      name: 'item.jpg',
    });
    data.append('upload_preset', 'ml_default'); // replace with your Cloudinary preset

    try {
      let res = await fetch(
        'https://api.cloudinary.com/v1_1/dkris2jqn/image/upload', // replace with your cloud name
        {
          method: 'POST',
          body: data,
        },
      );
      let result = await res.json();
      setUploading(false);
      return result.secure_url;
    } catch (err) {
      console.error('Upload error:', err);
      setUploading(false);
      return null;
    }
  };

  const handleSave = async () => {
    if (!itemName || !price || !description || !categoryId) {
      Alert.alert('Please fill all fields');
      return;
    }

    try {
      let imageUrl = null;
      if (imageUri) {
        imageUrl = await uploadImageToCloudinary();
        if (!imageUrl) {
          Alert.alert('Image upload failed');
          return;
        }
      }

      await firestore()
        .collection('admins')
        .doc(adminUid)
        .collection('restaurants')
        .doc(restaurantId)
        .collection('categories')
        .doc(categoryId)
        .collection('items')
        .add({
          name: itemName,
          price,
          description,
          imageUrl,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      setItemName('');
      setPrice('');
      setDescription('');
      setImageUri(null);
      onClose();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Add New Product</Text>
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
            name="Chicken Chowmien"
            setState={setItemName}
            color="#676767"
          />
        </View>
        <Text style={styles.emailtextstyle}>Product Price:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="Rs 1,895"
            setState={setPrice}
            color="#676767"
          />
        </View>
        <Text style={styles.emailtextstyle}>Product Detail:</Text>
        <View style={{ alignItems: 'center' }}>
          <CustomTextInput
            name="Chinese noodles seasonal vegetables"
            setState={setDescription}
            color="#676767"
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
          <CustomButton title={'Save'} onPress={handleSave} />
        </View>
      </View>
    </Modal>
  );
};

export default AddItemModal;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 20,
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
    // marginBottom: 15,
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '90%',
  },
  radio: {
    flex: 1,
    padding: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
  },
  radioSelected: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  ingredients: {
    marginBottom: 10,
  },
  ingredient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 8,
  },
  ingredientSelected: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
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
  imagePreview: { width: '100%', height: '100%', borderRadius: 12 },
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
