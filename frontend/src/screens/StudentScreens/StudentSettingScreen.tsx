import React, { useEffect, useState } from "react";
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../../hooks/authContext";
import { useStudent } from "../../hooks/studentHooks/useStudent";
import styles from "./styles/StudentSettingScreen.styles"
import { Swimming } from "../../utils/swimming-enum.utils";
import Footer from "../../components/Footer";
import { useNavigation } from "@react-navigation/native";

// Helper: Format a swimming type string (e.g., "BACK_STROKE" -> "Back stroke")
const formatSpecialty = (specialty: string): string => {
    const lower = specialty.toLowerCase().replace(/_/g, " ");
    return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const StudentSettingScreen: React.FC = () => {
  const { user } = useAuth();
  const { student, updateStudent, fetchStudent } = useStudent();
  const navigation = useNavigation();
  
  const [name, setName] = useState("");
  const [preferences, setPreferences] = useState<Swimming[]>([]);
  const [availableSpecialties, setAvailableSpecialties] = useState<Swimming[]>([]);
  
  // Initialize state from student data when available
  useEffect(() => {
    if (student) {
      setName(student.name);
      setPreferences(student.preferences);
      const allSpecialties = Object.values(Swimming);
      setAvailableSpecialties(allSpecialties.filter(s => !student.preferences.includes(s)));
    }
  }, [student]);

  // Toggle specialty: move specialty from available to selected or vice-versa.
  const handleToggleSpecialty = (specialty: Swimming) => {
    if (preferences.includes(specialty)) {
      // Remove from selected and add back to available
      setPreferences(prev => prev.filter(s => s !== specialty));
      setAvailableSpecialties(prev => [...prev, specialty]);
    } else {
      // Add to selected and remove from available
      setPreferences(prev => [...prev, specialty]);
      setAvailableSpecialties(prev => prev.filter(s => s !== specialty));
    }
  };

  const handleSave = async () => {
    if (user && user.id) {
      await updateStudent(user.id, { name, preferences: preferences });
      await fetchStudent(user.id);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Student Settings</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
        <Text style={styles.label}>Available Swimming Types:</Text>
          <View style={styles.swimmingContainer}>
            {availableSpecialties.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                style={styles.swimmingRow}
                onPress={() => handleToggleSpecialty(specialty)}
              >
                <Text style={styles.swimmingText}>{formatSpecialty(specialty)}</Text>
                <Text style={styles.checkMark}>✓</Text>
              </TouchableOpacity>
            ))}
          </View>
        <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
          Save Changes
        </Button>
        <Footer navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default StudentSettingScreen;
