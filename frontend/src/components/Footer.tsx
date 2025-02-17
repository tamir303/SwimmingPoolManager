import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';

interface FooterProps {
  navigation: any;
}

const Footer: React.FC<FooterProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.footerContainer}>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => navigation.navigate("MainScreen")}
        >
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => navigation.navigate("CalendarScreen")}
        >
          <Text style={styles.footerButtonText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => navigation.navigate("InstructorScreen")}
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
