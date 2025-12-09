import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import auth from '@react-native-firebase/auth';
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
  const timeoutRef = useRef(null);

  const showAlert = useCallback((title, message, buttons, type = 'info') => {
    // Clear any existing timeout and hide previous alert
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
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
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setAlert(prev => ({ ...prev, visible: false }));
  }, []);

  // Reset alert state completely
  const resetAlert = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setAlert({
      visible: false,
      title: null,
      message: null,
      type: 'info',
      buttons: [{ text: 'OK', onPress: () => {} }],
    });
  }, []);

  // Listen to auth state changes to reset alerts (e.g., on logout)
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      // Reset alert when auth state changes (login/logout)
      resetAlert();
    });

    return unsubscribe;
  }, [resetAlert]);

  // Auto-hide alert after 5 seconds if no buttons are pressed
  // Skip auto-hide if alert has custom buttons (user should interact with them)
  useEffect(() => {
    if (alert.visible) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Only auto-hide if there's a single default "OK" button
      // If there are custom buttons, don't auto-hide (let user interact)
      const hasCustomButtons = alert.buttons && alert.buttons.length > 0 && 
        (alert.buttons.length > 1 || 
         (alert.buttons[0] && alert.buttons[0].text !== 'OK' && alert.buttons[0].onPress));
      
      if (!hasCustomButtons) {
        // Set new timeout to auto-hide after 5 seconds for simple alerts
        timeoutRef.current = setTimeout(() => {
          hideAlert();
        }, 5000);
      } else {
        console.log('🔵 [AlertContext] Alert has custom buttons, skipping auto-hide');
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }
  }, [alert.visible, alert.buttons, hideAlert]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
        resetAlert,
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

