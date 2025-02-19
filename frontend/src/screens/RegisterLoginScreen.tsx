import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { useAuth } from "../hooks/authContext";
import styles from "./RegisterLoginScreen.styles"

type statusType = "Register" | "Login"
type roleType = "Instructor" | "Student"

const RegisterLoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { login, register } = useAuth();
    const [status, setStatus] = useState<statusType>("Login");
    const [role, setRole] = useState<roleType>("Instructor");
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
                style={[styles.roleButton, role === "Student" && styles.activeRoleButton]} 
                onPress={() => setRole("Student")}
            >
                <Text style={styles.roleText}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.roleButton, role === "Instructor" && styles.activeRoleButton]} 
                onPress={() => setRole("Instructor")}
            >
                <Text style={styles.roleText}>Instructor</Text>
            </TouchableOpacity>
          </View>
          <InputField placeholder="Phone number" icon="📞" onChange={setPhone} />
          <InputField placeholder="Full name" icon="👤"  onChange={setName}/>
          <InputField placeholder="Password" icon="🔒" onChange={setPassword}/>
        </>
      ) : (
        <>
          <InputField placeholder="Phone number" icon="📞" onChange={setPhone}/>
          <InputField placeholder="Password" icon="🔒" onChange={setPassword}/>
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
                navigation.navigate(`${role}SettingScreen`)
                await register(name, phone, password, role)
              } else {
                await login(phone, password, role)
                navigation.navigate(`${role}MainScreen`)
              }
            } 
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