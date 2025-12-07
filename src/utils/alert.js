// This file provides a drop-in replacement for Alert.alert
// Import this instead of Alert from 'react-native'
// Usage: import { Alert } from '../utils/alert';

import { useAlert } from '../context/AlertContext';

// Note: This won't work as a direct replacement because hooks can't be called outside components
// Instead, components should use useAlert() hook directly
// This file is kept for reference/documentation

// For components, use:
// import { useAlert } from '../context/AlertContext';
// const { showAlert, showError, showSuccess } = useAlert();
// Then call: showAlert('Title', 'Message', [{ text: 'OK', onPress: () => {} }]);

export { useAlert };

