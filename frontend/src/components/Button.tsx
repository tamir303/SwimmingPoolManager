import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native"

interface ButtonProps {
    title: string;
    description?: string;
    onPress: () => void;
    children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    title,
    description,
    onPress,
    children
}) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
        {children}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
      backgroundColor: '#6a5acd',
      paddingVertical: 12,
      paddingHorizontal: 50,
      borderRadius: 8,
      marginBottom: 10,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    description: {
        color: '#fff',
        fontWeight: 'light',
        fontSize: 10,
    },
  });

export default Button;