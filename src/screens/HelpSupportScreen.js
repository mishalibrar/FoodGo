import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  HelpCircle,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  ChevronRight,
} from 'lucide-react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';
import SettingItem from '../components/SettingItem';
import { useAlert } from '../context/AlertContext';

const HelpSupportScreen = () => {
  const navigation = useNavigation();
  const { showAlert } = useAlert();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleEmail = () => {
    Linking.openURL('mailto:support@foodgo.com?subject=Support Request');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+1234567890');
  };

  const faqs = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'Browse restaurants, select items, add them to your cart, and proceed to checkout. You can pay using your saved payment method or add a new one.',
    },
    {
      id: 2,
      question: 'How long does delivery take?',
      answer: 'Delivery time varies by restaurant and location. Typically, orders are delivered within 30-45 minutes. You can track your order in real-time.',
    },
    {
      id: 3,
      question: 'Can I cancel my order?',
      answer: 'You can cancel your order within 5 minutes of placing it. After that, please contact support for assistance.',
    },
    {
      id: 4,
      question: 'What payment methods are accepted?',
      answer: 'We accept credit cards, debit cards, and digital wallets. You can save your payment methods for faster checkout.',
    },
    {
      id: 5,
      question: 'How do I track my order?',
      answer: 'Once your order is confirmed, you can track it in real-time from the Orders section in your profile.',
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
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
        <Text style={styles.title}>Help & Support</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <View style={styles.sectionCard}>
            <SettingItem
              icon={Mail}
              title="Email Support"
              subtitle="support@foodgo.com"
              onPress={handleEmail}
              showChevron={true}
            />
            <View style={styles.divider} />
            <SettingItem
              icon={Phone}
              title="Call Us"
              subtitle="+1 (234) 567-8900"
              onPress={handlePhone}
              showChevron={true}
            />
            <View style={styles.divider} />
            <SettingItem
              icon={MessageCircle}
              title="Live Chat"
              subtitle="Available 24/7"
              onPress={() => showAlert('Live Chat', 'Live chat feature coming soon!')}
              showChevron={true}
            />
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.sectionCard}>
            {faqs.map((faq, index) => (
              <View key={faq.id}>
                <TouchableOpacity
                  style={styles.faqItem}
                  onPress={() => toggleFaq(faq.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.faqContent}>
                    <View style={styles.faqIconContainer}>
                      <HelpCircle size={18} color={Colors.primary} strokeWidth={2} />
                    </View>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                  </View>
                  <ChevronRight
                    size={20}
                    color={Colors.textLight}
                    style={[
                      styles.faqChevron,
                      expandedFaq === faq.id && styles.faqChevronExpanded,
                    ]}
                  />
                </TouchableOpacity>
                {expandedFaq === faq.id && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
                {index < faqs.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Links</Text>
          <View style={styles.sectionCard}>
            <SettingItem
              icon={FileText}
              title="Terms of Service"
              subtitle="Read our terms and conditions"
              onPress={() => navigation.navigate('TermsOfServiceScreen')}
              showChevron={true}
            />
            <View style={styles.divider} />
            <SettingItem
              icon={HelpCircle}
              title="Privacy Policy"
              subtitle="Learn how we protect your data"
              onPress={() => navigation.navigate('PrivacyPolicyScreen')}
              showChevron={true}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HelpSupportScreen;

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
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    minHeight: 64,
  },
  faqContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  faqQuestion: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    flex: 1,
  },
  faqChevron: {
    transform: [{ rotate: '0deg' }],
  },
  faqChevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  faqAnswerContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
    paddingLeft: 60,
  },
  faqAnswer: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});

