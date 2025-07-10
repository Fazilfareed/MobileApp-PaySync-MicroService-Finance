import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CreateUserScreen = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    dateOfBirth: new Date(),
    residentialAddress: '',
    region: '', // ✅ Added region here
    idNumber: '',
    jobRole: '',
    worksAt: '',
    monthlyIncome: '',
    employmentDuration: '',
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [idCardCopy, setIdCardCopy] = useState(null);
  const [employmentLetterCopy, setEmploymentLetterCopy] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (event: any, selectedDate: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData({ ...formData, dateOfBirth: selectedDate });
    }
  };

  const selectImage = async (type: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission required", "Please enable photo access in settings");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const source = { uri: result.assets[0].uri };
      if (type === 'profile') setProfilePhoto(source);
      else if (type === 'idCard') setIdCardCopy(source);
      else if (type === 'employmentLetter') setEmploymentLetterCopy(source);
    }
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const submissionData = {
      ...formData,
      profilePhoto,
      idCardCopy,
      employmentLetterCopy,
    };

    console.log('Form submitted:', submissionData);
    Alert.alert('Success', 'User created successfully!');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg.png')}
      resizeMode="cover"
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        

        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Personal Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              value={formData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
              placeholder="Enter full name"
            />

            <View style={styles.row}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  placeholder="Enter email"
                />
              </View>
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>Upload Photo</Text>
                <TouchableOpacity style={styles.uploadButton} onPress={() => selectImage('profile')}>
                  {profilePhoto ? (
                    <Image source={profilePhoto} style={styles.uploadedImage} />
                  ) : (
                    <Text style={styles.uploadButtonText}>+ Upload</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>Contact Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.contactNumber}
                  onChangeText={(text) => handleInputChange('contactNumber', text)}
                  keyboardType="phone-pad"
                  placeholder="Enter phone number"
                />
              </View>
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>Date of Birth</Text>
                <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                  <MaterialIcons name="calendar-today" size={20} color="#555" />
                  <Text style={styles.datePickerText}>{formatDate(formData.dateOfBirth)}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={formData.dateOfBirth}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>
            </View>

            <Text style={styles.label}>Residential Address</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={formData.residentialAddress}
              onChangeText={(text) => handleInputChange('residentialAddress', text)}
              placeholder="Enter full address"
              multiline
              numberOfLines={3}
            />

            {/* ✅ Region input field */}
            <Text style={styles.label}>Region</Text>
            <TextInput
              style={styles.input}
              value={formData.region}
              onChangeText={(text) => handleInputChange('region', text)}
              placeholder="Enter your region"
            />
          </View>

          {/* Employment Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employment Information</Text>

            <View style={styles.row}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>ID Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.idNumber}
                  onChangeText={(text) => handleInputChange('idNumber', text)}
                  placeholder="Enter ID number"
                />
              </View>
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>Attach ID card copy</Text>
                <TouchableOpacity style={styles.uploadButton} onPress={() => selectImage('idCard')}>
                  {idCardCopy ? (
                    <Image source={idCardCopy} style={styles.uploadedImage} />
                  ) : (
                    <Text style={styles.uploadButtonText}>+ Upload</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.label}>Job Role</Text>
            <TextInput
              style={styles.input}
              value={formData.jobRole}
              onChangeText={(text) => handleInputChange('jobRole', text)}
              placeholder="Enter job title/role"
            />

            <Text style={styles.label}>Works At</Text>
            <TextInput
              style={styles.input}
              value={formData.worksAt}
              onChangeText={(text) => handleInputChange('worksAt', text)}
              placeholder="Enter company name"
            />

            <View style={styles.row}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>Monthly Income</Text>
                <TextInput
                  style={styles.input}
                  value={formData.monthlyIncome}
                  onChangeText={(text) => handleInputChange('monthlyIncome', text)}
                  keyboardType="numeric"
                  placeholder="Enter amount"
                />
              </View>
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>Employment Duration</Text>
                <TextInput
                  style={styles.input}
                  value={formData.employmentDuration}
                  onChangeText={(text) => handleInputChange('employmentDuration', text)}
                  placeholder="e.g. 2 years"
                />
              </View>
            </View>

            <Text style={styles.label}>Attach Employment Letter copy</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={() => selectImage('employmentLetter')}>
              {employmentLetterCopy ? (
                <Image source={employmentLetterCopy} style={styles.uploadedImage} />
              ) : (
                <Text style={styles.uploadButtonText}>+ Upload</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Create</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
  uploadButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  uploadButtonText: {
    color: '#666',
    fontSize: 16,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  datePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#000',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default CreateUserScreen;
