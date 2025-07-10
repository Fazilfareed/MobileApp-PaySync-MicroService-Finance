import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://192.168.1.100:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Login Successful', `Welcome ${data.user.name}`);
        router.replace('/User_Dashboard');
      } else {
        Alert.alert(
          'User not found',
          'Do you want to create a new account?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: () => createNewUser() },
          ]
        );
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewUser = async () => {
    const name = 'New User'; // You can later prompt the user for this

    try {
      const response = await fetch('http://192.168.1.100:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Account Created', `Welcome ${data.user.name}`);
        router.replace('/User_Dashboard');
      } else {
        Alert.alert('Registration Failed', data.message || 'Could not create user');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/bg.png')}
        resizeMode="cover"
        style={styles.background}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.whiteBox}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>PaySync</Text>
              </View>

              <Text style={styles.welcomeText}>Welcome Back</Text>
              <Text style={styles.signInText}>Sign in to your account</Text>

              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                />
              </View>

              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={() => router.push('/ForgotPasswordScreen')}
              >
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>LOGIN</Text>
                )}
              </TouchableOpacity>

              <View style={styles.createAccountContainer}>
                <Text style={styles.createAccountText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/create_user')}>
                  <Text style={styles.createAccountLink}>create account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%' },
  keyboardAvoidingView: { flex: 1, width: '100%' },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  whiteBox: {
    width: width - 40,
    maxWidth: 400,
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    marginVertical: 20,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00008B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#000', marginBottom: 6, textAlign: 'center' },
  signInText: { fontSize: 16, color: '#666', marginBottom: 24, textAlign: 'center' },
  inputLabel: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '500' },
  inputContainer: { marginBottom: 16, width: '100%' },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingRight: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    width: '100%',
  },
  passwordInput: { flex: 1, height: 48, fontSize: 16, paddingHorizontal: 16 },
  eyeIcon: { padding: 8 },
  forgotPasswordButton: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotPasswordText: { fontSize: 14, color: '#666', fontWeight: '500' },
  loginButton: {
    backgroundColor: '#00008B',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' },
  createAccountContainer: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
  createAccountText: { fontSize: 14, color: '#666' },
  createAccountLink: { fontSize: 14, color: '#00008B', fontWeight: 'bold' },
});
