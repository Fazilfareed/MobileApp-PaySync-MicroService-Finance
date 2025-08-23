import React, { useState } from "react";
import { View, Text, Button, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const RegisterClient = () => {
  const [clientData, setClientData] = useState({
    personalInfo: {
      fullName: "Mohamed Nusaif",
      contactNumber: "0771234567",
      email: "mrmnusaif@gmial.com",
      dateOfBirth: "1998-05-12",
      address: "Colombo, Sri Lanka",
      district: "Colombo",
    },
    identityVerification: {
      idType: "NIC",
      idNumber: "982345678V",
    },
    employmentDetails: {
      employer: "ABC Pvt Ltd",
      jobRole: "Software Engineer",
      monthlyIncome: "120000",
      employmentDuration: "3 years",
    },
  });

  const [idCardImage, setIdCardImage] = useState(null);
  const [employmentLetterImage, setEmploymentLetterImage] = useState(null);

  // Pick ID Card Image
  const pickIdCard = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setIdCardImage(result.assets[0]);
    }
  };

  // Pick Employment Letter Image
  const pickEmploymentLetter = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      setEmploymentLetterImage(result.assets[0]);
    }
  };

  const registerClient = async () => {
    if (!idCardImage || !employmentLetterImage) {
      Alert.alert("Error", "Please select both images");
      return;
    }

    try {
      const formData = new FormData();

      // Add JSON data as a string
      formData.append("data", JSON.stringify(clientData));

      // Append ID Card Image
      formData.append("idCard", {
        uri: idCardImage.uri,
        name: "idCard.jpg",
        type: "image/jpeg",
      });

      // Append Employment Letter Image
      formData.append("employmentLetter", {
        uri: employmentLetterImage.uri,
        name: "employmentLetter.jpg",
        type: "image/jpeg",
      });

      // Send API Request via Axios
      const response = await axios.post(
        "http://10.152.237.129:5000/clientsAPI/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      console.log("✅ Success:", response.data);
      Alert.alert("Success", "Client registered successfully!");
    } catch (error) {
      if (error.response) {
        console.error("🚨 Server Error:", error.response.data);
        Alert.alert("Error", error.response.data.message || "Server error");
      } else if (error.request) {
        console.error("⚠️ No Response from Server:", error.request);
        Alert.alert("Error", "No response from server. Check your network.");
      } else {
        console.error("❌ Error:", error.message);
        Alert.alert("Error", "Something went wrong");
      }
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Register Client</Text>

      <Button title="Pick ID Card" onPress={pickIdCard} />
      {idCardImage && (
        <Image
          source={{ uri: idCardImage.uri }}
          style={{ width: 100, height: 100, marginVertical: 10 }}
        />
      )}

      <Button title="Pick Employment Letter" onPress={pickEmploymentLetter} />
      {employmentLetterImage && (
        <Image
          source={{ uri: employmentLetterImage.uri }}
          style={{ width: 100, height: 100, marginVertical: 10 }}
        />
      )}

      <Button title="Register Client" onPress={registerClient} />
    </View>
  );
};

export default RegisterClient;
