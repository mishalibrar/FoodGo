import { StyleSheet } from 'react-native';

// Color Palette
export const Colors = {
  // Primary Colors
  primary: '#FF7622',
  primaryDark: '#FC6E2A',
  primaryLight: '#F58D1D',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundDark: '#121223',
  backgroundLight: '#F0F5FA',
  backgroundSecondary: '#ECF0F4',
  backgroundLoading: '#E1E5EA',
  
  // Text Colors
  textPrimary: '#181C2E',
  textSecondary: '#32343E',
  textTertiary: '#676767',
  textLight: '#A0A5BA',
  textWhite: '#FFFFFF',
  textPlaceholder: '#646982',
  
  // Status Colors
  success: '#4CAF50',
  error: '#E53935',
  warning: '#FFC107',
  info: '#2196F3',
  
  // Border & Divider
  border: '#EDEDED',
  divider: '#E0E0E0',
  
  // Shadow
  shadow: '#000000',
};

// Typography
export const Fonts = {
  // Sen Font Family
  regular: 'Sen-Regular',
  medium: 'Sen-Medium',
  semiBold: 'Sen-SemiBold',
  bold: 'Sen-Bold',
  extraBold: 'Sen-ExtraBold',
  
  // Roboto Font Family (if needed)
  robotoRegular: 'Roboto-Regular',
  robotoMedium: 'Roboto-Medium',
  robotoBold: 'Roboto-Bold',
  robotoExtraBold: 'Roboto-ExtraBold',
};

// Font Sizes
export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 22,
  title: 30,
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 15,
  xxl: 20,
  round: 25,
  circle: 30,
  full: 9999,
};

// Shadow Styles
export const Shadows = {
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 7,
  },
};

// Common Styles
export const CommonStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  containerDark: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  containerLight: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  
  // Text Styles
  textRegular: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  textMedium: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  textBold: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  textTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.title,
    color: Colors.textPrimary,
  },
  textSubtitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xl,
    color: Colors.textSecondary,
  },
  textSecondary: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textTertiary,
  },
  textPlaceholder: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textPlaceholder,
  },
  
  
  // Card Styles
  card: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
  },
  
  // Icon Circle
  iconCircle: {
    backgroundColor: Colors.backgroundSecondary,
    width: 45,
    height: 45,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.large,
  },
  iconCircleDark: {
    backgroundColor: Colors.textPrimary,
    width: 45,
    height: 45,
    borderRadius: BorderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLoading,
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textTertiary,
    marginTop: Spacing.md,
    fontSize: FontSizes.lg,
    fontFamily: Fonts.bold,
  },
  
  // Row Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Spacing Utilities
  paddingHorizontal: {
    paddingHorizontal: Spacing.xl,
  },
  paddingVertical: {
    paddingVertical: Spacing.xl,
  },
  marginTop: {
    marginTop: Spacing.lg,
  },
  marginBottom: {
    marginBottom: Spacing.lg,
  },
});

// Export default styles object
export default {
  Colors,
  Fonts,
  FontSizes,
  Spacing,
  BorderRadius,
  Shadows,
  CommonStyles,
};

