import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  const PolicySection = ({ icon: Icon, title, content }) => (
    <View style={styles.policySection}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconContainer, { backgroundColor: `${Colors.primary}15` }]}>
          <Icon size={20} color={Colors.primary} strokeWidth={2} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionContent}>{content}</Text>
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
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.introCard}>
            <View style={styles.introIconContainer}>
              <Shield size={32} color={Colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.introTitle}>Your Privacy Matters</Text>
            <Text style={styles.introText}>
              At FoodGo, we are committed to protecting your privacy and ensuring
              the security of your personal information.
            </Text>
          </View>

          <PolicySection
            icon={FileText}
            title="Information We Collect"
            content="We collect information that you provide directly to us, including your name, email address, phone number, delivery address, and payment information. We also collect information about your device, including IP address, device type, and operating system."
          />

          <PolicySection
            icon={Lock}
            title="How We Use Your Information"
            content="We use the information we collect to process your orders, communicate with you about your orders, provide customer support, improve our services, send you promotional communications (with your consent), and comply with legal obligations."
          />

          <PolicySection
            icon={Eye}
            title="Information Sharing"
            content="We do not sell your personal information. We may share your information with service providers who assist us in operating our app, processing payments, and delivering orders. We may also share information if required by law or to protect our rights."
          />

          <PolicySection
            icon={Shield}
            title="Data Security"
            content="We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
          />

          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Questions About Privacy?</Text>
            <Text style={styles.contactText}>
              If you have any questions about this Privacy Policy, please contact us at:
            </Text>
            <Text style={styles.contactEmail}>privacy@foodgo.com</Text>
          </View>

          <Text style={styles.lastUpdated}>
            Last updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  content: {
    padding: Spacing.xl,
  },
  introCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.small,
  },
  introIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  introTitle: {
    fontSize: FontSizes.xxl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  introText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  policySection: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
  },
  sectionContent: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  contactCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.small,
  },
  contactTitle: {
    fontSize: FontSizes.xl,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  contactText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 22,
  },
  contactEmail: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  lastUpdated: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});

