import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react-native';
import { Colors, Fonts, FontSizes, BorderRadius, Spacing, Shadows } from '../styles/globalStyles';

const CustomAlertModal = ({
  visible,
  onClose,
  title,
  message,
  type = 'info', // 'success', 'error', 'warning', 'info'
  buttons = [{ text: 'OK', onPress: () => {} }],
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={50} color={Colors.success} />;
      case 'error':
        return <AlertCircle size={50} color={Colors.error} />;
      case 'warning':
        return <AlertTriangle size={50} color={Colors.warning} />;
      case 'info':
      default:
        return <Info size={50} color={Colors.info} />;
    }
  };

  const getIconBackgroundColor = () => {
    switch (type) {
      case 'success':
        return `${Colors.success}15`;
      case 'error':
        return `${Colors.error}15`;
      case 'warning':
        return `${Colors.warning}15`;
      case 'info':
      default:
        return `${Colors.info}15`;
    }
  };

  const handleButtonPress = (button) => {
    if (button.onPress) {
      button.onPress();
    }
    if (button.closeOnPress !== false) {
      onClose();
    }
  };

  // Ensure modal closes when visible becomes false
  useEffect(() => {
    if (!visible) {
      // Modal should be hidden
      return;
    }
  }, [visible]);

  // Cleanup on unmount - ensure modal is closed
  useEffect(() => {
    return () => {
      if (visible) {
        onClose();
      }
    };
  }, [visible, onClose]);

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      onModalHide={() => {
        // Ensure modal is properly closed
        if (visible) {
          onClose();
        }
      }}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modal}
      useNativeDriverForBackdrop={true}
      onSwipeComplete={onClose}
      swipeDirection="down"
      propagateSwipe={true}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <X size={20} color={Colors.textTertiary} />
        </TouchableOpacity>

        <View style={[styles.iconContainer, { backgroundColor: getIconBackgroundColor() }]}>
          {getIcon()}
        </View>

        {title && (
          <Text style={styles.title}>{title}</Text>
        )}
        
        {message && (
          <Text style={styles.message}>{message}</Text>
        )}

        <View style={styles.buttonContainer}>
          {buttons.map((button, index) => {
            const isPrimary = index === buttons.length - 1 && buttons.length === 1;
            const isLastButton = index === buttons.length - 1;
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  isPrimary ? styles.primaryButton : styles.secondaryButton,
                  !isLastButton && styles.buttonMargin,
                ]}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.buttonText,
                    isPrimary ? styles.primaryButtonText : styles.secondaryButtonText,
                  ]}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  container: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    padding: Spacing.xs,
    zIndex: 1,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxl,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
    paddingHorizontal: Spacing.sm,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonMargin: {
    marginRight: Spacing.sm,
  },
  buttonText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.md,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: Colors.textWhite,
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
  },
});

export default CustomAlertModal;

