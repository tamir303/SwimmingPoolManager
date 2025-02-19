import React, { useEffect, useState } from "react";
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../../hooks/authContext";
import { useStudent } from "../../hooks/studentHooks/useStudent";
import styles from "./styles/StudentSettingScreen.styles"
import { Swimming } from "../../utils/swimming-enum.utils";

// Helper: Format a swimming type string (e.g., "BACK_STROKE" -> "Back stroke")
const formatSpecialty = (specialty: string): string => {
    const lower = specialty.toLowerCase().replace(/_/g, " ");
    return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const StudentSettingScreen: React.FC = () => {
  const { user } = useAuth();
  const { student, updateStudent, fetchStudent } = useStudent();
  const [name, setName] = useState("");
  const [preferences, setPreferences] = useState<Swimming[]>([]);
  const [tempSpecialties, SetTempSpecialties] = useState<Swimming[]>([])
  
  useEffect(() => {
    if (student) {
      setName(student.name);
      setPreferences(student.preferences);
    }
  }, [student]);

    useEffect(() => {
        const allSpecialties = Object.values(Swimming);
        SetTempSpecialties(
        allSpecialties.filter((s) => !tempSpecialties.includes(s))
        );
    }, [tempSpecialties]);

  const handleToggleSpecialty = (specialty: Swimming) => {
    if (tempSpecialties.includes(specialty)) {
        SetTempSpecialties((prev) => prev.filter((s) => s !== specialty));
    } else {
        SetTempSpecialties((prev) => [...prev, specialty]);
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
        <Text style={styles.label}>Swimming Preferences:</Text>
          <View style={styles.swimmingContainer}>
            {tempSpecialties.map((specialty) => (
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
      </View>
    </SafeAreaView>
  );
};

export default StudentSettingScreen;
