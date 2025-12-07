import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { User2, ArrowLeft, Camera, User, Phone, MapPin } from 'lucide-react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows, CommonStyles } from '../styles/globalStyles';
import { useAlert } from '../context/AlertContext';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { showAlert, showError, showSuccess, showWarning } = useAlert();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth().currentUser;
      if (!user) return;

      // Try users collection first
      let doc = await firestore().collection('users').doc(user.uid).get();
      let data = doc.exists ? doc.data() : null;

      // If not found, try admins collection
      if (!data) {
        doc = await firestore().collection('admins').doc(user.uid).get();
        data = doc.exists ? doc.data() : null;
      }

      if (data) {
        setName(data.name || '');
        setPhone(data.phone || '');
        setAddress(data.address || '');
        setImageUri(data.imageUrl || null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      showError('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (!response.didCancel && !response.errorCode && response.assets?.[0]) {
          setImageUri(response.assets[0].uri);
        }
      },
    );
  };

  const uploadImageToCloudinary = async () => {
    // Note: You'll need to implement Cloudinary upload or use Firebase Storage
    // For now, returning the local URI - you should replace this with actual upload
    return imageUri;
  };

  const handleSave = async () => {
    if (!name.trim()) {
      showWarning('Validation', 'Please enter your name');
      return;
    }

    try {
      setSaving(true);
      const user = auth().currentUser;
      if (!user) {
        showError('Error', 'User not found');
        return;
      }

      let imageUrl = imageUri;

      // If image is a local URI, upload it (implement your upload logic here)
      if (imageUri && imageUri.startsWith('file://')) {
        setUploading(true);
        imageUrl = await uploadImageToCloudinary();
        setUploading(false);
      }

      // Determine which collection to update/create
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      const adminDoc = await firestore().collection('admins').doc(user.uid).get();
      
      const isUser = userDoc.exists;
      const isAdmin = adminDoc.exists;

      const updateData = {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      // Use set with merge to create if doesn't exist, or update if exists
      if (isUser) {
        await firestore().collection('users').doc(user.uid).set(updateData, { merge: true });
      } else if (isAdmin) {
        await firestore().collection('admins').doc(user.uid).set(updateData, { merge: true });
      } else {
        // If document doesn't exist in either collection, create it in users collection
        // You can change this logic based on your app's requirements
        await firestore().collection('users').doc(user.uid).set({
          ...updateData,
          email: user.email || '',
          createdAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }

      showSuccess('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={CommonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <View style={styles.backButtonContainer}>
            <ArrowLeft size={22} color={Colors.textWhite} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <View style={styles.avatarWrapper}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User2 color={Colors.primary} size={56} strokeWidth={1.5} />
              </View>
            )}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={pickImage}
              disabled={uploading}
              activeOpacity={0.8}
            >
              {uploading ? (
                <ActivityIndicator size="small" color={Colors.textWhite} />
              ) : (
                <Camera size={18} color={Colors.textWhite} strokeWidth={2.5} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.imageHintText}>
            Tap camera icon to change photo
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <View style={[styles.fieldIconContainer, { backgroundColor: `${Colors.primary}15` }]}>
                <User size={18} color={Colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.label}>Full Name</Text>
            </View>
            <CustomTextInput
              name="Enter your full name"
              setState={setName}
              value={name}
              style={[styles.input, { width: '100%' }]}
            />
          </View>

          {/* Phone Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <View style={[styles.fieldIconContainer, { backgroundColor: `${Colors.primary}15` }]}>
                <Phone size={18} color={Colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.label}>Phone Number</Text>
            </View>
            <CustomTextInput
              name="Enter your phone number"
              setState={setPhone}
              value={phone}
              keyboardType="phone-pad"
              style={[styles.input, { width: '100%' }]}
            />
          </View>

          {/* Address Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <View style={[styles.fieldIconContainer, { backgroundColor: `${Colors.primary}15` }]}>
                <MapPin size={18} color={Colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.label}>Address</Text>
            </View>
            <CustomTextInput
              name="Enter your address"
              setState={setAddress}
              value={address}
              numberOfLines={4}
              multiline={true}
              style={[styles.input, styles.textArea, { width: '100%' }]}
            />
          </View>
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={saving ? 'Saving Changes...' : 'Save Changes'}
            onPress={handleSave}
            disabled={saving || uploading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Header
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.medium,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontFamily: Fonts.bold,
    color: Colors.textWhite,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  // Image Section
  imageSection: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 5,
    borderColor: Colors.textWhite,
    backgroundColor: Colors.backgroundLight,
    ...Shadows.large,
  },
  avatarPlaceholder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: Colors.textWhite,
    ...Shadows.large,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.textWhite,
    ...Shadows.medium,
  },
  imageHintText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
  // Form Section
  formSection: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  fieldContainer: {
    marginBottom: Spacing.sm,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.small,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  fieldIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  label: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    color: Colors.textSecondary,
  },
  input: {
    marginBottom: 0,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },
  // Button Container
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
});

