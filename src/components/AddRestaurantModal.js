import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Camera } from 'lucide-react-native';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomButton from './CustomButton';
import CustomTextInput from './CustomTextInput';
import { geocodeAddress } from '../utils/locationUtils';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const AddRestaurantModal = ({ isVisible, onClose, onSave, adminUid, initialLocation, currentLocation }) => {
  const [restaurantName, setRestaurantName] = useState('');
  const [details, setDetails] = useState('');
  const [rating, setRating] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  // Set initial location when modal opens or location changes
  useEffect(() => {
    if (isVisible && initialLocation) {
      setLocation(initialLocation);
    }
  }, [isVisible, initialLocation]);

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
      (!location && !initialLocation && !currentLocation) ||
      !category ||
      !imageUri
    ) {
      Alert.alert('Please fill all fields and select an image');
      return;
    }

    try {
      const imageUrl = await uploadImageToCloudinary();
      if (!imageUrl) return Alert.alert('Image upload failed');

      const restaurantData = {
        name: restaurantName,
        details,
        rating,
        category,
        location: location || initialLocation || 'Location not specified',
        imageUrl,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      // Use current location coordinates if available, otherwise geocode the address
      if (currentLocation && currentLocation.latitude && currentLocation.longitude) {
        // Use the fetched location coordinates
        restaurantData.latitude = currentLocation.latitude;
        restaurantData.longitude = currentLocation.longitude;
        if (currentLocation.city) {
          restaurantData.city = currentLocation.city;
        }
      } else {
        // Fallback: geocode the address string
        setGeocoding(true);
        const coordinates = await geocodeAddress(location || initialLocation);
        setGeocoding(false);

        if (coordinates) {
          restaurantData.latitude = coordinates.latitude;
          restaurantData.longitude = coordinates.longitude;
          if (coordinates.city) {
            restaurantData.city = coordinates.city;
          }
        }
      }

      await firestore()
        .collection('admins')
        .doc(adminUid)
        .collection('restaurants')
        .add(restaurantData);

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
    setImageUri(null);
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={handleClose}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.5}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Register Restaurant</Text>
          <TouchableOpacity onPress={handleClose} style={styles.iconCircle} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image Picker */}
          <View style={styles.sectionimagepicker}>
            <Text style={styles.label}>Restaurant Image</Text>
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
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.uploadedImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay}>
                    <View style={styles.editBadge}>
                      <Ionicons name="camera" size={16} color={Colors.textWhite} />
                      <Text style={styles.editText}>Change Image</Text>
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Camera size={32} color={Colors.textTertiary} strokeWidth={1.5} />
                  <Text style={styles.uploadText}>Tap to upload image</Text>
                  <Text style={styles.uploadHint}>16:9 aspect ratio recommended</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          <View style={styles.section}>
            <Text style={styles.label}>Restaurant Name</Text>
            <CustomTextInput
              name="e.g. Foodgo Cafe"
              value={restaurantName}
              setState={setRestaurantName}
              color={Colors.textPlaceholder}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Restaurant Details</Text>
            <CustomTextInput
              name="e.g. Family friendly cafe with coffee & snacks"
              setState={setDetails}
              color={Colors.textPlaceholder}
              value={details}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Rating</Text>
            <CustomTextInput
              name="e.g. 4.5"
              setState={setRating}
              color={Colors.textPlaceholder}
              value={rating}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Location</Text>
            <CustomTextInput
              name="e.g. Main Street, City"
              setState={setLocation}
              color={Colors.textPlaceholder}
              value={location}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Cuisine/Category</Text>
            <CustomTextInput
              name="e.g. Italian, Fast Food, Desserts"
              setState={setCategory}
              color={Colors.textPlaceholder}
              value={category}
            />
          </View>

          {/* Spacer for button */}
          <View style={styles.buttonSpacer} />
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <CustomButton
              title={
                uploading 
                  ? 'Uploading Image...' 
                  : geocoding 
                    ? 'Getting Location...' 
                    : 'Register Restaurant'
              }
              onPress={handleSave}
              disabled={uploading || geocoding}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddRestaurantModal;

const styles = StyleSheet.create({
  modal: { 
    margin: 0, 
    justifyContent: 'flex-end',
  },
  container: { 
    flex: 1, 
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    ...Shadows.small,
  },
  title: { 
    fontSize: FontSizes.xxxl, 
    fontFamily: Fonts.bold, 
    color: Colors.textPrimary,
    letterSpacing: 0.3,
  },
  iconCircle: {
    backgroundColor: Colors.backgroundSecondary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    width: '110%',
  },
  sectionimagepicker: {
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
  },  
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  uploadBox: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.border,
    position: 'relative',
  },
  uploadBoxFilled: {
    borderColor: 'transparent',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    color: Colors.textSecondary,
  },
  uploadHint: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
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
  },
  editText: {
    color: Colors.textWhite,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.semiBold,
  },
  footer: {
    backgroundColor: Colors.background,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.medium,
  },
  footerContent: {
    paddingHorizontal: Spacing.xl,
  },
  buttonSpacer: {
    height: Spacing.xxl,
  },
});
