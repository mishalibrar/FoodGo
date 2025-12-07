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
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertCircle,
  Shield,
  CreditCard,
  Users,
} from 'lucide-react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const TermsOfServiceScreen = () => {
  const navigation = useNavigation();

  const TermsSection = ({ icon: Icon, title, content, items }) => (
    <View style={styles.termsSection}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIconContainer, { backgroundColor: `${Colors.primary}15` }]}>
          <Icon size={20} color={Colors.primary} strokeWidth={2} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {content && <Text style={styles.sectionContent}>{content}</Text>}
      {items && (
        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <CheckCircle size={16} color={Colors.primary} style={styles.checkIcon} />
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
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
        <Text style={styles.title}>Terms of Service</Text>
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
              <FileText size={32} color={Colors.primary} strokeWidth={2} />
            </View>
            <Text style={styles.introTitle}>Terms of Service</Text>
            <Text style={styles.introText}>
              Please read these terms carefully before using FoodGo. By using our
              service, you agree to be bound by these terms.
            </Text>
          </View>

          <TermsSection
            icon={Users}
            title="Acceptance of Terms"
            content="By accessing and using the FoodGo mobile application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service."
          />

          <TermsSection
            icon={Shield}
            title="User Responsibilities"
            items={[
              'You must be at least 18 years old to use this service',
              'You are responsible for maintaining the confidentiality of your account',
              'You agree to provide accurate and complete information',
              'You will not use the service for any illegal or unauthorized purpose',
              'You will not attempt to gain unauthorized access to the system',
            ]}
          />

          <TermsSection
            icon={CreditCard}
            title="Payment Terms"
            content="All payments are processed securely through our payment partners. By placing an order, you agree to pay the total amount including applicable taxes and delivery fees. Prices are subject to change without notice."
            items={[
              'Payment must be made at the time of order placement',
              'Refunds are processed according to our refund policy',
              'We reserve the right to refuse or cancel any order',
            ]}
          />

          <TermsSection
            icon={AlertCircle}
            title="Order Cancellation & Refunds"
            items={[
              'Orders can be cancelled within 5 minutes of placement',
              'Cancelled orders will be refunded to the original payment method',
              'Refunds may take 5-10 business days to process',
              'Restaurant-cancelled orders are automatically refunded',
            ]}
          />

          <TermsSection
            icon={FileText}
            title="Intellectual Property"
            content="All content, features, and functionality of the FoodGo app, including but not limited to text, graphics, logos, and software, are the property of FoodGo and are protected by copyright, trademark, and other intellectual property laws."
          />

          <TermsSection
            icon={Shield}
            title="Limitation of Liability"
            content="FoodGo shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our total liability shall not exceed the amount you paid for the service in the 12 months prior to the claim."
          />

          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Questions About Terms?</Text>
            <Text style={styles.contactText}>
              If you have any questions about these Terms of Service, please contact us at:
            </Text>
            <Text style={styles.contactEmail}>legal@foodgo.com</Text>
          </View>

          <View style={styles.agreementCard}>
            <Text style={styles.agreementTitle}>By using FoodGo, you agree to:</Text>
            <Text style={styles.agreementText}>
              • Comply with all applicable laws and regulations{'\n'}
              • Use the service only for lawful purposes{'\n'}
              • Respect the rights of other users{'\n'}
              • Not engage in any fraudulent or deceptive practices
            </Text>
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

export default TermsOfServiceScreen;

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
  termsSection: {
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
    marginBottom: Spacing.sm,
  },
  itemsList: {
    marginTop: Spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  checkIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  itemText: {
    flex: 1,
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
  agreementCard: {
    backgroundColor: `${Colors.primary}10`,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    ...Shadows.small,
  },
  agreementTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  agreementText: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  lastUpdated: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});

