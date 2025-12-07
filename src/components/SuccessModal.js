import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { CheckCircle } from 'lucide-react-native';
import { Colors, Fonts, FontSizes, Spacing } from '../styles/globalStyles';
import CustomButton from './CustomButton';

const SuccessModal = ({ visible, onClose, message = 'Item added to cart successfully!', onContinueShopping, onViewCart }) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <CheckCircle size={60} color={Colors.success} />
        </View>
        
        <Text style={styles.title}>Success!</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.buttonContainer}>
          {onContinueShopping && (
            <CustomButton
              title="Continue Shopping"
              onPress={onContinueShopping}
              variant="outline"
              style={styles.outlineButton}
            />
          )}
          
          {onViewCart && (
            <CustomButton
              title="View Cart"
              onPress={onViewCart}
              style={styles.primaryButton}
            />
          )}
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
    borderRadius: 20,
    padding: Spacing.xl,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
   
  },
  iconContainer: {
    marginBottom: Spacing.lg,
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
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  outlineButton: {
    marginVertical: 0,
  },
  primaryButton: {
    marginVertical: 0,
  },
});

export default SuccessModal;

