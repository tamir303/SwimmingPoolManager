import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from "./Button"

type FooterType = "Student" | "Instructor"

interface FooterProps {
  navigation: any;
  type: FooterType
}

const Footer: React.FC<FooterProps> = ({ navigation, type }) => {
  return (
    <View style={styles.footer}>
      <Button title="Home" onPress={() => navigation.navigate(`${type}HomeScreen`)} />
      <Button title="Lessons" onPress={() => navigation.navigate(`${type}LessonScreen`)} />
      <Button title="Settings" onPress={() => navigation.navigate(`${type}SettingsScreen`)} />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f8f8f8',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default Footer;
