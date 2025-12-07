import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react-native';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';
import { useAlert } from '../context/AlertContext';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const { showAlert, showError, showSuccess, showWarning } = useAlert();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      showWarning('Validation', 'Please enter your current password');
      return;
    }

    if (!newPassword.trim()) {
      showWarning('Validation', 'Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      showWarning('Validation', 'New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      showWarning('Validation', 'New password and confirm password do not match');
      return;
    }

    if (currentPassword === newPassword) {
      showWarning('Validation', 'New password must be different from current password');
      return;
    }

    try {
      setChangingPassword(true);
      const user = auth().currentUser;
      if (!user || !user.email) {
        showError('Error', 'User not found');
        return;
      }

      // Reauthenticate user with current password
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await user.reauthenticateWithCredential(credential);

      // Update password
      await user.updatePassword(newPassword);

      showSuccess('Success', 'Password changed successfully', [
        {
          text: 'OK',
          onPress: () => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('Error changing password:', error);
      let errorMessage = 'Failed to change password';
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = 'Current password is incorrect';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'New password is too weak. Please use a stronger password';
      } else if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'For security reasons, please log out and log in again before changing your password';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection';
      }
      
      showError('Error', errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  const PasswordField = ({ label, value, setValue, showPassword, setShowPassword, placeholder }) => (
    <View style={styles.passwordFieldContainer}>
      <Text style={styles.passwordLabel}>{label}</Text>
      <View style={styles.passwordInputWrapper}>
        <CustomTextInput
          name={placeholder}
          setState={setValue}
          value={value}
          secureTextEntry={!showPassword}
          style={[styles.passwordInput, { flex: 1 }]}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.7}
        >
          {showPassword ? (
            <EyeOff size={20} color={Colors.textTertiary} />
          ) : (
            <Eye size={20} color={Colors.textTertiary} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={styles.title}>Change Password</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconContainer}>
            <Lock size={28} color={Colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.infoTitle}>Update Your Password</Text>
          <Text style={styles.infoText}>
            Enter your current password and choose a new secure password for your account.
          </Text>
        </View>

        {/* Password Form */}
        <View style={styles.formSection}>
          <PasswordField
            label="Current Password"
            value={currentPassword}
            setValue={setCurrentPassword}
            showPassword={showCurrentPassword}
            setShowPassword={setShowCurrentPassword}
            placeholder="Enter your current password"
          />

          <PasswordField
            label="New Password"
            value={newPassword}
            setValue={setNewPassword}
            showPassword={showNewPassword}
            setShowPassword={setShowNewPassword}
            placeholder="Enter new password (min 6 characters)"
          />

          <PasswordField
            label="Confirm New Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
            placeholder="Confirm your new password"
          />

          {/* Password Requirements */}
          <View style={styles.requirementsCard}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <View style={styles.requirementItem}>
              <View style={[styles.requirementDot, newPassword.length >= 6 && styles.requirementDotValid]} />
              <Text style={[styles.requirementText, newPassword.length >= 6 && styles.requirementTextValid]}>
                At least 6 characters
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <View style={[styles.requirementDot, newPassword === confirmPassword && newPassword.length > 0 && styles.requirementDotValid]} />
              <Text style={[styles.requirementText, newPassword === confirmPassword && newPassword.length > 0 && styles.requirementTextValid]}>
                Passwords match
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <View style={[styles.requirementDot, currentPassword !== newPassword && newPassword.length > 0 && styles.requirementDotValid]} />
              <Text style={[styles.requirementText, currentPassword !== newPassword && newPassword.length > 0 && styles.requirementTextValid]}>
                Different from current password
              </Text>
            </View>
          </View>
        </View>

        {/* Change Password Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={changingPassword ? 'Changing Password...' : 'Change Password'}
            onPress={handleChangePassword}
            disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePasswordScreen;

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
  // Info Card
  infoCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    margin: Spacing.xl,
    alignItems: 'center',
    ...Shadows.small,
  },
  infoIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  infoTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  infoText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Form Section
  formSection: {
    paddingHorizontal: Spacing.xl,
  },
  passwordFieldContainer: {
    marginBottom: Spacing.lg,
  },
  passwordLabel: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.md,
    paddingRight: Spacing.sm,
    ...Shadows.small,
  },
  passwordInput: {
    marginBottom: 0,
    paddingRight: Spacing.xs,
  },
  eyeIcon: {
    padding: Spacing.sm,
  },
  // Requirements Card
  requirementsCard: {
    backgroundColor: `${Colors.primary}08`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  requirementsTitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  requirementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textTertiary,
    marginRight: Spacing.sm,
  },
  requirementDotValid: {
    backgroundColor: Colors.success,
  },
  requirementText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
  },
  requirementTextValid: {
    color: Colors.success,
    fontFamily: Fonts.semiBold,
  },
  // Button Container
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
});

