import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../hooks/authContext';
import Icon from 'react-native-vector-icons/FontAwesome';

interface FooterProps {
  navigation: any;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
  const { isInstructor, logout } = useAuth();

  return (
    <SafeAreaView style={styles.footerContainer}>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => navigation.navigate(isInstructor ? `InstructorMainScreen` : `StudentMainScreen`)}
        >
          <Icon name="home" size={24} color="#333" />
          <Text style={[styles.footerButtonText, { marginTop: 5 }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => navigation.navigate(isInstructor ? "InstructorCalendarScreen" : "StudentCalendarScreen")}
        >
          <Icon name="calendar" size={24} color="#333" />
          <Text style={styles.footerButtonText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => navigation.navigate(isInstructor ? "InstructorSettingScreen" : "StudentSettingScreen")}
        >
          <Icon name="cog" size={24} color="#333" />
          <Text style={styles.footerButtonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => {
            logout()
            navigation.navigate("LoginRegisterScreen")
          }}
        >
          <Icon name="sign-out" size={24} color="#333" />
          <Text style={styles.footerButtonText}>Logout</Text>
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
    backgroundColor: '#f8f8f8',
  },
  footerButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Footer;
