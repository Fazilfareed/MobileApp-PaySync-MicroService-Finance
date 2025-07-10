import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const UserDashboard = () => {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <Image
            source={require('../assets/images/user-avatar.jpeg')}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.userName}>Jaya Kumar</Text>
          </View>
        </View>
      </View>

      {/* Loan Amount Card */}
      <LinearGradient colors={['#3b5998', '#192f6a']} style={styles.loanCard}>
        <Text style={styles.cardTitleWhite}>Current Loan Amount</Text>
        <Text style={styles.loanAmountWhite}>Rs 150000.00</Text>
      </LinearGradient>

      {/* Buttons Row */}
      <View style={styles.rowButtons}>
        {/* Apply for Loan */}
        <TouchableOpacity style={styles.applyCard} onPress={() => router.push('/applyLoan')}>
          <Ionicons name="cash-outline" size={50} color="#fff" />
          <Text style={styles.applyText}>Apply for a loan</Text>
        </TouchableOpacity>

        {/* EMI Card */}
        <View style={styles.emiCard}>
          <View style={styles.emiTop}>
            <Text style={styles.loanLabel}>Loan EMI</Text>
            <Text style={styles.dueTag}>Due</Text>
          </View>
          <Text style={styles.emiAmount}>Rs 15000.00</Text>
          <Text style={styles.dueDate}>15-May-2025</Text>
          <TouchableOpacity onPress={() => router.push('/payLoan')}>
            <Text style={styles.payNow}>Pay Now ➔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Activity Section */}
      <View style={styles.activityWrapper}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {[
          { type: 'EMI', status: 'Due', amount: 'Rs 15000.00', date: '15-May-2025' },
          { type: 'EMI', status: 'Due', amount: 'Rs 15000.00', date: '15-Apr-2025' },
          { type: 'Loan', status: 'Approved', amount: 'Rs 150000.00', date: '15-Mar-2025' },
        ].map((item, index) => (
          <View key={index} style={styles.activityCard}>
            <View style={styles.activityRow}>
              <Text style={styles.activityLabel}>{item.type}</Text>
              <Text
                style={
                  item.status === 'Approved'
                    ? styles.activityStatusApproved
                    : styles.activityStatusDue
                }
              >
                {item.status}
              </Text>
            </View>
            <View style={styles.activityRow}>
              <Text style={styles.activityAmount}>{item.amount}</Text>
              <Text style={styles.activityDate}>{item.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 25,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  loanCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardTitleWhite: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  loanAmountWhite: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  applyCard: {
    backgroundColor: '#28a745',
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  emiCard: {
    backgroundColor: '#dc3545',
    flex: 1,
    padding: 16,
    borderRadius: 10,
  },
  emiTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanLabel: {
    color: '#fff',
    fontSize: 14,
  },
  dueTag: {
    backgroundColor: '#fff',
    color: '#dc3545',
    fontWeight: 'bold',
    paddingHorizontal: 6,
    borderRadius: 4,
    fontSize: 12,
  },
  emiAmount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 6,
  },
  dueDate: {
    color: '#fff',
    fontSize: 12,
  },
  payNow: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 6,
  },
  activityWrapper: {
    backgroundColor: '#e9ecef',
    padding: 16,
    borderRadius: 16,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#666',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  activityLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityDate: {
    fontSize: 13,
    color: '#555',
  },
  activityStatusDue: {
    fontSize: 13,
    color: '#dc3545',
    fontWeight: 'bold',
  },
  activityStatusApproved: {
    fontSize: 13,
    color: '#28a745',
    fontWeight: 'bold',
  },
});

export default UserDashboard;
