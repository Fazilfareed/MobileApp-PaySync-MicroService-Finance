import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ClientForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    dateOfBirth: '',
    address: '',
    district: '',
    idType: 'NIC',
    idNumber: '',
    employer: '',
    jobRole: '',
    monthlyIncome: '',
    employmentDuration: '',
  });

  const [idCard, setIdCard] = useState(null);
  const [employmentLetter, setEmploymentLetter] = useState(null);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const pickImage = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      setter({
        uri: selected.uri,
        name: selected.uri.split('/').pop(),
        type: 'image/jpeg',
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.district) {
      Alert.alert('Validation Error', 'District is required');
      return;
    }

    const formData = new FormData();

    // Compose JSON data object
    const clientData = {
      personalInfo: {
        fullName: form.fullName,
        contactNumber: form.contactNumber,
        email: form.email,
        dateOfBirth: form.dateOfBirth,
        address: form.address,
        district: form.district,
      },
      identityVerification: {
        idType: form.idType,
        idNumber: form.idNumber,
      },
      employmentDetails: {
        employer: form.employer,
        jobRole: form.jobRole,
        monthlyIncome: Number(form.monthlyIncome),
        employmentDuration: form.employmentDuration,
      },
    };

    // Append JSON string
    formData.append('clientData', JSON.stringify(clientData));

    // Append files if selected
    if (idCard) {
      formData.append('idCard', {
        uri: idCard.uri,
        name: idCard.name || 'idCard.jpg',
        type: idCard.type || 'image/jpeg',
      });
    }

    if (employmentLetter) {
      formData.append('employmentLetter', {
        uri: employmentLetter.uri,
        name: employmentLetter.name || 'employmentLetter.jpg',
        type: employmentLetter.type || 'image/jpeg',
      });
    }

    try {
      const response = await fetch('http://localhost:5000/clientsAPI/register', {
     method: 'POST',
     body: formData, // just set the body
       // ❌ Do NOT set 'Content-Type' manually
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Client registered successfully!');
        // Optionally clear form here
      } else {
        Alert.alert('Error', result.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={form.fullName}
        onChangeText={(val) => handleChange('fullName', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={form.contactNumber}
        keyboardType="phone-pad"
        onChangeText={(val) => handleChange('contactNumber', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        keyboardType="email-address"
        onChangeText={(val) => handleChange('email', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={form.dateOfBirth}
        onChangeText={(val) => handleChange('dateOfBirth', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={form.address}
        onChangeText={(val) => handleChange('address', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="District"
        value={form.district}
        onChangeText={(val) => handleChange('district', val)}
      />

      <TextInput
        style={styles.input}
        placeholder="ID Number"
        value={form.idNumber}
        onChangeText={(val) => handleChange('idNumber', val)}
      />

      <TextInput
        style={styles.input}
        placeholder="Employer"
        value={form.employer}
        onChangeText={(val) => handleChange('employer', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Job Role"
        value={form.jobRole}
        onChangeText={(val) => handleChange('jobRole', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Monthly Income"
        keyboardType="numeric"
        value={form.monthlyIncome}
        onChangeText={(val) => handleChange('monthlyIncome', val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Employment Duration"
        value={form.employmentDuration}
        onChangeText={(val) => handleChange('employmentDuration', val)}
      />

      <Text style={styles.label}>Upload ID Card</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => pickImage(setIdCard)}
      >
        <Text style={styles.uploadButtonText}>
          {idCard ? 'Change ID Card' : '+ Upload ID Card'}
        </Text>
      </TouchableOpacity>
      {idCard && <Image source={{ uri: idCard.uri }} style={styles.preview} />}

      <Text style={styles.label}>Upload Employment Letter</Text>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={() => pickImage(setEmploymentLetter)}
      >
        <Text style={styles.uploadButtonText}>
          {employmentLetter ? 'Change Letter' : '+ Upload Letter'}
        </Text>
      </TouchableOpacity>
      {employmentLetter && (
        <Image source={{ uri: employmentLetter.uri }} style={styles.preview} />
      )}

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    padding: 10,
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  preview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
  },
});

export default ClientForm;
