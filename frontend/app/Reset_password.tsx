import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CreateNewPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const scrollViewRef = useRef();
  const confirmPasswordRef = useRef();

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // Simulate API call to reset password
    console.log('Password reset successful');
    setShowSuccessModal(true);
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    router.push('/LoginScreen');
  };

  const focusConfirmPassword = () => {
    confirmPasswordRef.current?.focus();
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg.png')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.whiteFrame}>
              {/* Logo */}
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>PaySync</Text>
              </View>

              <Text style={styles.title}>Create New Password</Text>
              <Text style={styles.subtitle}>
                Please set a new password for your account
              </Text>

              {/* New Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>New Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    placeholder="Enter new password"
                    placeholderTextColor="#999"
                    returnKeyType="next"
                    onSubmitEditing={focusConfirmPassword}
                    blurOnSubmit={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    ref={confirmPasswordRef}
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    placeholder="Confirm new password"
                    placeholderTextColor="#999"
                    returnKeyType="done"
                    onSubmitEditing={handleResetPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color="#555"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={newPassword.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'} 
                    size={16} 
                    color={newPassword.length >= 8 ? '#4CAF50' : '#666'} 
                  />
                  <Text style={styles.requirementText}>At least 8 characters</Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons 
                    name={newPassword === confirmPassword && confirmPassword.length > 0 ? 'checkmark-circle' : 'ellipse-outline'} 
                    size={16} 
                    color={newPassword === confirmPassword && confirmPassword.length > 0 ? '#4CAF50' : '#666'} 
                  />
                  <Text style={styles.requirementText}>Passwords match</Text>
                </View>
              </View>

              {/* Reset Password Button */}
              <TouchableOpacity
                style={[
                  styles.resetButton, 
                  (newPassword.length < 8 || newPassword !== confirmPassword) && styles.disabledButton
                ]}
                onPress={handleResetPassword}
                disabled={newPassword.length < 8 || newPassword !== confirmPassword}
              >
                <Text style={styles.resetButtonText}>Reset Password</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Ionicons name="checkmark-circle" size={60} color="#4CAF50" style={styles.successIcon} />
              <Text style={styles.modalTitle}>Password Changed!</Text>
              <Text style={styles.modalText}>Your password has been updated successfully.</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSuccessConfirm}
              >
                <Text style={styles.modalButtonText}>Continue to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  whiteFrame: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00008B',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  requirementsContainer: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  requirementText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
  },
  resetButton: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateNewPassword;