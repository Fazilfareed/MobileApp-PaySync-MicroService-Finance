import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RawUserData = () => {
  const [rawJson, setRawJson] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setRawJson(storedUser); // Leave it as a raw string
        } else {
          console.warn('⚠️ No user found in AsyncStorage.');
        }
      } catch (error) {
        console.error('❌ Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {rawJson ? (
        <Text style={styles.rawText}>
          Raw Data: {rawJson}
        </Text>
      ) : (
        <Text style={styles.loadingText}>🔄 Loading Raw User Data...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  rawText: {
    fontSize: 14,
    fontFamily: 'Courier New',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    color: '#333',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 100,
  },
});

export default RawUserData;
