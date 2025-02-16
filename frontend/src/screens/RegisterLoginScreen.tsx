import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useAuth } from "../hooks/authContext";
import styles from "./RegisterLoginScreen.styles"

type statusType = "Register" | "Login"
type roleType = "instructor" | "student"

const RegisterLoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { login, register } = useAuth();
    const [modalVisible, setModalVisible] = useState(true);
    const [status, setStatus] = useState<statusType>("Register");
    const [role, setRole] = useState<roleType>("student");
    const [name, setName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const changeStatus = () => {
      setStatus((prevStatus) => (prevStatus === "Register" ? "Login" : "Register"));
    };

    const getFormByStatus = () => {
      return status === "Register" ? (
        <>
          <View style={styles.roleContainer}>
            <TouchableOpacity 
                style={[styles.roleButton, role === "student" && styles.activeRoleButton]} 
                onPress={() => setRole("student")}
            >
                <Text style={styles.roleText}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.roleButton, role === "instructor" && styles.activeRoleButton]} 
                onPress={() => setRole("instructor")}
            >
                <Text style={styles.roleText}>Instructor</Text>
            </TouchableOpacity>
          </View>
          <InputField placeholder="Enter your phone number" icon="📞" onChange={setPhone} />
          <InputField placeholder="Enter your full name" icon="👤"  onChange={setName}/>
          <InputField placeholder="Create a password" icon="🔒" onChange={setPassword}/>
        </>
      ) : (
        <>
          <InputField placeholder="Enter your phone number" icon="📞" onChange={setPhone}/>
          <InputField placeholder="Enter your password" icon="🔒" onChange={setPassword}/>
        </>
      )
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{status === "Register" ? "Create Account" : "Login"}</Text>
        <Text style={styles.subtitle}>Join us to enhance your swimming learning experience!</Text>
          { getFormByStatus() }
      
          <Button title={status === "Register" ? "Sign Up" : "Login"} onPress={async () =>  {
              if (status === "Register") {
                await register(name, phone, password, role)
              } else {
                await login(phone, password, role)
              }


              navigation.navigate("MainScreen")} 
            }
          />
    
          <Text style={styles.footerText}>
            {status === "Register" ? "Already registered?" : "Not registered yet?"}
          <Text style={styles.loginText} onPress={changeStatus}>
            {status === "Register" ? " Log In" : " Register"}
          </Text>
        </Text>
    </View>
    );
};
  
export default RegisterLoginScreen;