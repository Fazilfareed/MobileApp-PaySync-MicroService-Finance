import React, { useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { height, width } = Dimensions.get('window');

const SwipeLoginScreen = () => {
  const router = useRouter();
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy < -100) { // Swipe up threshold
        router.push('/LoginScreen'); // Navigate to login screen
      } else {
        // Reset position with spring animation
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          friction: 5, // Controls bounciness
          tension: 40, // Controls speed
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <ImageBackground
      source={require('../assets/images/bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* PaySync Logo in Dark Blue Circle */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>PaySync</Text>
        </View>

        {/* Swipe Up Elements */}
        <Animated.View
          style={[styles.swipeContainer, { 
            transform: [{ translateY: pan.y }],
            bottom: height * 0.1, // Fixed position at bottom
          }]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.swipeText}>SWIPE UP TO LOGIN</Text>
          <View style={styles.arrowsContainer}>
            <Ionicons name="chevron-up" size={28} color="#fff" />
            <Ionicons name="chevron-up" size={28} color="#fff" style={styles.secondArrow} />
          </View>
        </Animated.View>
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
  logoContainer: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: width * 0.125,
    backgroundColor: '#00008B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: height * 0.65,
    alignSelf: 'center',
  },
  logoText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#fff',
  },
  swipeContainer: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
  },
  swipeText: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  arrowsContainer: {
    alignItems: 'center',
  },
  secondArrow: {
    marginTop: -15,
  },
});

export default SwipeLoginScreen;