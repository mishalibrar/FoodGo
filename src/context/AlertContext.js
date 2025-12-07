import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomAlertModal from '../components/CustomAlertModal';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    visible: false,
    title: null,
    message: null,
    type: 'info',
    buttons: [{ text: 'OK', onPress: () => {} }],
  });

  const showAlert = useCallback((title, message, buttons, type = 'info') => {
    // Handle Alert.alert format: Alert.alert(title, message, buttons)
    // Or single param: Alert.alert(message)
    let alertTitle = null;
    let alertMessage = null;
    let alertButtons = [{ text: 'OK', onPress: () => {} }];
    let alertType = type;

    // Single parameter - treat as message
    if (title && !message && !buttons) {
      alertMessage = title;
    }
    // Two parameters - title and message
    else if (title && message && !Array.isArray(message)) {
      alertTitle = title;
      alertMessage = message;
      // Check if third param is buttons array
      if (Array.isArray(buttons)) {
        alertButtons = buttons;
      }
    }
    // Three parameters - title, message, buttons
    else if (title && message && Array.isArray(buttons)) {
      alertTitle = title;
      alertMessage = message;
      alertButtons = buttons;
    }

    // Convert Alert.alert button format to our format
    if (Array.isArray(alertButtons) && alertButtons.length > 0) {
      alertButtons = alertButtons.map(btn => {
        const buttonText = typeof btn === 'string' ? btn : (btn.text || 'OK');
        const buttonOnPress = typeof btn === 'object' && btn.onPress ? btn.onPress : (() => {});
        return {
          text: buttonText,
          onPress: buttonOnPress,
          closeOnPress: typeof btn === 'object' && btn.onPress ? false : true,
        };
      });
    }

    // Auto-detect type based on title if not specified
    if (type === 'info' && alertTitle) {
      const titleLower = alertTitle.toLowerCase();
      if (titleLower.includes('error') || titleLower.includes('failed')) {
        alertType = 'error';
      } else if (titleLower.includes('success')) {
        alertType = 'success';
      } else if (titleLower.includes('warning')) {
        alertType = 'warning';
      }
    }

    setAlert({
      visible: true,
      title: alertTitle,
      message: alertMessage,
      type: alertType,
      buttons: alertButtons,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, visible: false }));
  }, []);

  // Helper methods for different alert types
  const showSuccess = useCallback((title, message, buttons) => {
    showAlert(title, message, buttons, 'success');
  }, [showAlert]);

  const showError = useCallback((title, message, buttons) => {
    showAlert(title, message, buttons, 'error');
  }, [showAlert]);

  const showWarning = useCallback((title, message, buttons) => {
    showAlert(title, message, buttons, 'warning');
  }, [showAlert]);

  const showInfo = useCallback((title, message, buttons) => {
    showAlert(title, message, buttons, 'info');
  }, [showAlert]);

  return (
    <AlertContext.Provider
      value={{
        showAlert,
        hideAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      <CustomAlertModal
        visible={alert.visible}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        buttons={alert.buttons}
      />
    </AlertContext.Provider>
  );
};

