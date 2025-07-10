import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';

const OTPVerification = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);
  const scrollViewRef = useRef();

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, resendDisabled]);

  const handleVerifyOTP = () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 4) {
      Alert.alert('Error', 'Please enter a 4-digit OTP code');
      return;
    }
    console.log('Verifying OTP:', fullOtp, 'for email:', email);
    router.push('/Reset_password');
  };

  const handleResendOTP = () => {
    setResendDisabled(true);
    setCountdown(30);
    Alert.alert('OTP Resent', 'New 4-digit code has been sent to your email');
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    // Scroll to ensure input is visible
    scrollViewRef.current?.scrollTo({ y: 100, animated: true });
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
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
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.whiteFrame}>
              {/* Logo */}
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>PaySync</Text>
              </View>

              <Text style={styles.title}>OTP Verification</Text>
              <Text style={styles.subtitle}>Enter the 4-digit code sent to</Text>
              <Text style={styles.emailText}>{email}</Text>
              
              {/* 4-Digit OTP Input */}
              <View style={styles.otpContainer}>
                {[0, 1, 2, 3].map((index) => (
                  <TextInput
                    key={index}
                    style={styles.otpBox}
                    value={otp[index]}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              {/* Resend OTP */}
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={resendDisabled}
                style={styles.resendButton}
              >
                <Text style={[styles.resendText, resendDisabled && styles.disabledText]}>
                  {resendDisabled ? `Resend code in ${countdown}s` : 'Resend code'}
                </Text>
              </TouchableOpacity>

              {/* Verify Button */}
              <TouchableOpacity
                style={[styles.verifyButton, otp.join('').length !== 4 && styles.disabledButton]}
                onPress={handleVerifyOTP}
                disabled={otp.join('').length !== 4}
              >
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
    paddingBottom: 50, // Extra space at bottom
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
    marginBottom: 20, // Ensure space when keyboard appears
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
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  resendButton: {
    alignSelf: 'center',
    marginBottom: 25,
  },
  resendText: {
    fontSize: 14,
    color: '#00008B',
  },
  disabledText: {
    color: '#999',
  },
  verifyButton: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OTPVerification;