import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  Lock,
  Shield,
  Moon,
  Globe,
  HelpCircle,
  Info,
  ArrowLeft,
} from 'lucide-react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';
import SettingItem from '../components/SettingItem';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);


  const handleChangePassword = () => {
    navigation.navigate('ChangePasswordScreen');
  };

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
        <Text style={styles.title}>Settings</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.sectionCard}>
            <SettingItem
              icon={Moon}
              title="Dark Mode"
              subtitle="Switch to dark theme"
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.textWhite}
                  ios_backgroundColor={Colors.border}
                />
              }
            />

            <View style={styles.divider} />

            <SettingItem
              icon={Globe}
              title="Location Services"
              subtitle="Allow location access"
              rightComponent={
                <Switch
                  value={locationServices}
                  onValueChange={setLocationServices}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.textWhite}
                  ios_backgroundColor={Colors.border}
                />
              }
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.sectionCard}>
            <SettingItem
              icon={Lock}
              title="Change Password"
              subtitle="Update your password"
              onPress={handleChangePassword}
              showChevron={true}
            />

            <View style={styles.divider} />

            <SettingItem
              icon={Shield}
              title="Privacy Policy"
              subtitle="Read our privacy policy"
              onPress={() => navigation.navigate('PrivacyPolicyScreen')}
              showChevron={true}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <View style={styles.sectionCard}>
            <SettingItem
              icon={HelpCircle}
              title="Help & Support"
              subtitle="Get help with the app"
              onPress={() => navigation.navigate('HelpSupportScreen')}
              showChevron={true}
            />

            <View style={styles.divider} />

            <SettingItem
              icon={Info}
              title="About"
              subtitle="App version and information"
              onPress={() => navigation.navigate('AboutScreen')}
              showChevron={true}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

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
  // Sections
  section: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bold,
    color: Colors.textTertiary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xs,
    ...Shadows.small,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 60,
    marginRight: Spacing.md,
  },
});

