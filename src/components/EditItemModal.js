import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import { X, Camera } from 'lucide-react-native';
import CustomButton from './CustomButton';
import CustomTextInput from './CustomTextInput';
import firestore from '@react-native-firebase/firestore';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

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
    if (!itemName.trim() || !price.trim() || !description.trim() || !categoryId || !itemId) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    try {
      setUploading(true);
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
          name: itemName.trim(),
          price: price.trim(),
          description: description.trim(),
          imageUrl,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      setUploading(false);
      onClose();
    } catch (error) {
      console.error('Error updating item:', error);
      Alert.alert('Error', 'Failed to update item. Please try again.');
      setUploading(false);
    }
  };

  return (
    <Modal 
      isVisible={isVisible} 
      onBackdropPress={onClose} 
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Edit Item</Text>
            <Text style={styles.subtitle}>Update item details</Text>
          </View>
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <X size={20} color={Colors.textPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Image Upload */}
          <View style={styles.imageSection}>
            <Text style={styles.label}>Item Image</Text>
            <TouchableOpacity 
              style={[
                styles.uploadBox,
                imageUri && styles.uploadBoxFilled
              ]} 
              onPress={pickImage}
              activeOpacity={0.8}
            >
              {imageUri ? (
                <>
                  <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
                  <View style={styles.imageOverlay}>
                    <View style={styles.editBadge}>
                      <Camera size={16} color={Colors.textWhite} strokeWidth={2} />
                      <Text style={styles.editText}>Change Image</Text>
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.placeholderContent}>
                  <Camera size={48} color={Colors.textTertiary} strokeWidth={1.5} />
                  <Text style={styles.placeholderText}>Tap to upload image</Text>
                  <Text style={styles.placeholderHint}>Item image recommended</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Product Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product Name</Text>
            <CustomTextInput
              name="e.g. Chicken Chowmien"
              value={itemName}
              setState={setItemName}
              color={Colors.textTertiary}
            />
          </View>

          {/* Product Price */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product Price</Text>
            <CustomTextInput
              name="e.g. Rs 1,895"
              value={price}
              setState={setPrice}
              color={Colors.textTertiary}
            />
          </View>

          {/* Product Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product Description</Text>
            <CustomTextInput
              name="e.g. Chinese noodles with seasonal vegetables"
              value={description}
              setState={setDescription}
              color={Colors.textTertiary}
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <CustomButton
            title={uploading ? 'Updating...' : 'Update Item'}
            onPress={handleUpdate}
            disabled={uploading}
          />
        </View>
      </View>
    </Modal>
  );
};

export default EditItemModal;

const styles = StyleSheet.create({
  modal: { 
    margin: 0, 
    justifyContent: 'flex-end',
  },
  container: { 
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    flex: 0.9,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerContent: {
    flex: 1,
  },
  title: { 
    fontSize: FontSizes.xxl, 
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  imageSection: {
    marginBottom: Spacing.lg,
  },
  uploadBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    position: 'relative',
  },
  uploadBoxFilled: {
    borderColor: 'transparent',
    borderStyle: 'solid',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
    ...Shadows.small,
  },
  editText: {
    color: Colors.textWhite,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  placeholderHint: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
    width: '110%',
  },
  label: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
});
