import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../hooks/authContext';

interface FooterProps {
  navigation: any;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
  const { isInstructor } = useAuth();

  return (
    <SafeAreaView style={styles.footerContainer}>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => navigation.navigate(true ? `InstructorMainScreen` : `StudentMainScreen`)}
        >
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => navigation.navigate(true ? "InstructorCalendarScreen" : "StudentCalendarScreen")}
        >
          <Text style={styles.footerButtonText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => navigation.navigate(true ? "InstructorSettingScreen" : "StudentSettingScreen")}
        >
          <Text style={styles.footerButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footer: {
    flexDirection: 'row',
    height: 60,
  },
  footerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // No borderRadius for pointy corners
    backgroundColor: '#f8f8f8',
  },
  footerButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Footer;
