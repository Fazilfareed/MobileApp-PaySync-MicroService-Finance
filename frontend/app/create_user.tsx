import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
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
import axios from 'axios';

// ✅ Define TypeScript Interfaces
interface PersonalInfo {
  fullName: string;
  contactNumber: string;
  email: string;
  dateOfBirth: Date;
  address: string;
  district: string;
}

interface IdentityVerification {
  idNumber: string;
}

interface EmploymentDetails {
  employer: string;
  jobRole: string;
  monthlyIncome: string;
  employmentDuration: string;
}

interface FormData {
  personalInfo: PersonalInfo;
  identityVerification: IdentityVerification;
  employmentDetails: EmploymentDetails;
}

interface ImageFile {
  uri: string;
}

const CreateUserScreen: React.FC = () => {
  // ✅ State with Type Safety
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      fullName: '',
      contactNumber: '',
      email: '',
      dateOfBirth: new Date(),
      address: '',
      district: '',
    },
    identityVerification: {
      idNumber: '',
    },
    employmentDetails: {
      employer: '',
      jobRole: '',
      monthlyIncome: '',
      employmentDuration: '',
    },
  });

  const [idCardCopy, setIdCardCopy] = useState<ImageFile | null>(null);
  const [employmentLetterCopy, setEmploymentLetterCopy] = useState<ImageFile | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const API_URL = 'http://10.152.237.129:5000/clientsAPI/register';

  // ✅ Strongly Typed Handle Input Change
  const handleInputChange = (
    section: keyof FormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // ✅ Date Picker Handler
  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          dateOfBirth: selectedDate,
        },
      }));
    }
  };

  // ✅ Image Picker
  const selectImage = async (type: 'idCard' | 'employmentLetter') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please enable photo access in settings');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (type === 'idCard') {
        setIdCardCopy({ uri });
      } else {
        setEmploymentLetterCopy({ uri });
      }
    }
  };

  // ✅ Submit Handler
  const handleSubmit = async () => {
    const { fullName, email, district } = formData.personalInfo;

    if (!fullName || !email || !district) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!idCardCopy || !employmentLetterCopy) {
      Alert.alert('Error', 'Please upload both ID card and employment letter');
      return;
    }

    try {
      const data = new FormData();
      data.append(
        'data',
        JSON.stringify({
          ...formData,
          personalInfo: {
            ...formData.personalInfo,
            dateOfBirth: formData.personalInfo.dateOfBirth.toISOString(),
          },
        })
      );

      // ✅ Append Images Correctly
      data.append('idCard', {
        uri: idCardCopy.uri,
        name: 'idCard.jpg',
        type: 'image/jpeg',
      } as any);

      data.append('employmentLetter', {
        uri: employmentLetterCopy.uri,
        name: 'employmentLetter.jpg',
        type: 'image/jpeg',
      } as any);
            //test
       

            const response = await axios.post(API_URL, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Success', 'Client registered successfully!');
      console.log('✅ Server Response:', response.data);

      // ✅ Reset Form
      setFormData({
        personalInfo: {
          fullName: '',
          contactNumber: '',
          email: '',
          dateOfBirth: new Date(),
          address: '',
          district: '',
        },
        identityVerification: {
          idNumber: '',
        },
        employmentDetails: {
          employer: '',
          jobRole: '',
          monthlyIncome: '',
          employmentDuration: '',
        },
      });
      setIdCardCopy(null);
      setEmploymentLetterCopy(null);
    } catch (error: any) {
      if (error.response) {
        console.error('🚨 Server Error:', error.response.data);
        Alert.alert('Error', error.response.data.message || 'Server error occurred');
      } else if (error.request) {
        console.error('📡 No response received:', error.request);
        Alert.alert(
          'Network Error',
          'No response from server. Check your internet or backend server.'
        );
      } else {
        console.error('❌ Request Error:', error.message);
        Alert.alert('Error', 'Request failed: ' + error.message);
      }
    }
  };

  // ✅ Format Date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ImageBackground source={require('../assets/images/bg.png')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Personal Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.fullName}
              onChangeText={(text) => handleInputChange('personalInfo', 'fullName', text)}
              placeholder="Enter full name"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.email}
              onChangeText={(text) => handleInputChange('personalInfo', 'email', text)}
              placeholder="Enter email"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.contactNumber}
              onChangeText={(text) => handleInputChange('personalInfo', 'contactNumber', text)}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <MaterialIcons name="calendar-today" size={20} color="#555" />
              <Text style={styles.datePickerText}>
                {formatDate(formData.personalInfo.dateOfBirth)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.personalInfo.dateOfBirth}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.address}
              onChangeText={(text) => handleInputChange('personalInfo', 'address', text)}
              placeholder="Enter address"
            />

            <Text style={styles.label}>District</Text>
            <TextInput
              style={styles.input}
              value={formData.personalInfo.district}
              onChangeText={(text) => handleInputChange('personalInfo', 'district', text)}
              placeholder="Enter district"
            />
          </View>

          {/* Employment Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employment Information</Text>

            <Text style={styles.label}>ID Number</Text>
            <TextInput
              style={styles.input}
              value={formData.identityVerification.idNumber}
              onChangeText={(text) =>
                handleInputChange('identityVerification', 'idNumber', text)
              }
              placeholder="Enter ID number"
            />

            <Text style={styles.label}>Upload ID Card Copy</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => selectImage('idCard')}
            >
              {idCardCopy ? (
                <Image source={idCardCopy} style={styles.uploadedImage} />
              ) : (
                <Text style={styles.uploadButtonText}>+ Upload</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>Employer</Text>
            <TextInput
              style={styles.input}
              value={formData.employmentDetails.employer}
              onChangeText={(text) =>
                handleInputChange('employmentDetails', 'employer', text)
              }
              placeholder="Enter employer"
            />

            <Text style={styles.label}>Job Role</Text>
            <TextInput
              style={styles.input}
              value={formData.employmentDetails.jobRole}
              onChangeText={(text) =>
                handleInputChange('employmentDetails', 'jobRole', text)
              }
              placeholder="Enter job role"
            />

            <Text style={styles.label}>Monthly Income</Text>
            <TextInput
              style={styles.input}
              value={formData.employmentDetails.monthlyIncome}
              onChangeText={(text) =>
                handleInputChange('employmentDetails', 'monthlyIncome', text)
              }
              placeholder="Enter monthly income"
              keyboardType="numeric"
            />

            <Text style={styles.label}>Employment Duration</Text>
            <TextInput
              style={styles.input}
              value={formData.employmentDetails.employmentDuration}
              onChangeText={(text) =>
                handleInputChange('employmentDetails', 'employmentDuration', text)
              }
              placeholder="Enter duration"
            />

            <Text style={styles.label}>Upload Employment Letter</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => selectImage('employmentLetter')}
            >
              {employmentLetterCopy ? (
                <Image source={employmentLetterCopy} style={styles.uploadedImage} />
              ) : (
                <Text style={styles.uploadButtonText}>+ Upload</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
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
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  uploadButton: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginTop: 10,
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
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  datePickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#000',
    height: 45,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateUserScreen;
