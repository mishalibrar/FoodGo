import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Info,
  Code,
  Heart,
  ExternalLink,
  Mail,
  Globe,
} from 'lucide-react-native';
import { Colors, Fonts, FontSizes, Spacing, BorderRadius, Shadows } from '../styles/globalStyles';

const AboutScreen = () => {
  const navigation = useNavigation();

  const InfoCard = ({ icon: Icon, title, value, onPress, link }) => (
    <TouchableOpacity
      style={styles.infoCard}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[styles.infoIconContainer, { backgroundColor: `${Colors.primary}15` }]}>
        <Icon size={22} color={Colors.primary} strokeWidth={2} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoTitle}>{title}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
      {link && (
        <ExternalLink size={18} color={Colors.textLight} />
      )}
    </TouchableOpacity>
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
        <Text style={styles.title}>About</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Info Card */}
        <View style={styles.appInfoCard}>
          <View style={styles.appIconContainer}>
            <Info size={40} color={Colors.primary} strokeWidth={2} />
          </View>
          <Text style={styles.appName}>FoodGo</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            A modern food delivery app built with React Native and Firebase.
            Order your favorite meals from local restaurants with ease.
          </Text>
        </View>

        {/* App Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.sectionCard}>
            <InfoCard
              icon={Code}
              title="Built With"
              value="React Native, Firebase"
            />
            <View style={styles.divider} />
            <InfoCard
              icon={Heart}
              title="Made With"
              value="❤️ by FoodGo Team"
            />
          </View>
        </View>

        {/* Contact & Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Links</Text>
          <View style={styles.sectionCard}>
            <InfoCard
              icon={Mail}
              title="Email"
              value="contact@foodgo.com"
              onPress={() => Linking.openURL('mailto:contact@foodgo.com')}
              link={true}
            />
            <View style={styles.divider} />
            <InfoCard
              icon={Globe}
              title="Website"
              value="www.foodgo.com"
              onPress={() => Linking.openURL('https://www.foodgo.com')}
              link={true}
            />
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.legalItem}
              onPress={() => navigation.navigate('PrivacyPolicyScreen')}
              activeOpacity={0.7}
            >
              <Text style={styles.legalText}>Privacy Policy</Text>
              <ExternalLink size={18} color={Colors.textLight} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.legalItem}
              onPress={() => navigation.navigate('TermsOfServiceScreen')}
              activeOpacity={0.7}
            >
              <Text style={styles.legalText}>Terms of Service</Text>
              <ExternalLink size={18} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Copyright */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} FoodGo. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;

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
  appInfoCard: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    margin: Spacing.xl,
    ...Shadows.small,
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSizes.title,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  appVersion: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    color: Colors.textTertiary,
    marginBottom: Spacing.md,
  },
  appDescription: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    minHeight: 64,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: FontSizes.md,
    fontFamily: Fonts.medium,
    color: Colors.textTertiary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 60,
    marginRight: Spacing.md,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    minHeight: 56,
  },
  legalText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.medium,
    color: Colors.textPrimary,
  },
  footer: {
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});

