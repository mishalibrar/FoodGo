import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Colors, Fonts, FontSizes, Spacing } from '../styles/globalStyles';

const SettingItem = ({
  icon: Icon,
  title,
  subtitle,
  onPress,
  rightComponent,
  iconColor = Colors.primary,
  showChevron = false,
  disabled = false,
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    activeOpacity={0.7}
    disabled={disabled || (!onPress && !rightComponent)}
  >
    <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
      <Icon size={20} color={iconColor} strokeWidth={2} />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {rightComponent || (showChevron && (
      <ChevronRight size={20} color={Colors.textLight} />
    ))}
  </TouchableOpacity>
);

export default SettingItem;

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    minHeight: 64,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    lineHeight: 18,
  },
});

