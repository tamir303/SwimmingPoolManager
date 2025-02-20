import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface InputFieldProps {
    placeholder: string;
    icon: string;
    onChange: (text: string) => void;
    secureTextEntry?: boolean;  }

const InputField: React.FC<InputFieldProps> = ({ placeholder, icon, onChange, secureTextEntry }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.icon}>{icon}</Text>
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor="#999"
        onChangeText={onChange}
        secureTextEntry={secureTextEntry}
      />
    </View>
);

const styles = StyleSheet.create({
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 15,
      width: '100%',
    },
    icon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      height: 40,
      color: '#333',
    },
});

export default InputField;