import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { Swimming } from "../../utils/swimming-enum.utils";
import { useStudent } from "../../hooks/studentHooks/useStudent";
import { useAuth } from "../../hooks/authContext";
import styles from "./styles/StudentSettingScreen.styles";
import Footer from "../../components/Footer";
import { useNavigation } from "@react-navigation/native";
import Student from "../../dto/student/student.dto";
import useAlert from "../../hooks/useAlert";

const formatSpecialty = (specialty: string): string => {
  const lower = specialty.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const StudentSettingsScreen: React.FC = () => {
  const { updateStudent, fetchStudent } = useStudent();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const navigation = useNavigation();

  const [name, setName] = useState<string>("");
  const [tempPreferences, setTempPreferences] = useState<Swimming[]>([]);
  const [availablePreferences, setAvailablePreferences] = useState<Swimming[]>([]);
  const [userStudent, setUserStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        try {
          const student: Student = await fetchStudent(user.id);
          setUserStudent(student);
        } catch (error) {
          // showAlert(`Failed to load your profile. ${error?.response.data.error || "Internal Error!"}`);
        }
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (userStudent) {
      setName(userStudent.name);
      setTempPreferences(userStudent.preferences);
      setAvailablePreferences(
        Object.values(Swimming).filter((s) => !userStudent.preferences.includes(s))
      );
    }
  }, [userStudent]);

  useEffect(() => {
    setAvailablePreferences(Object.values(Swimming).filter((s) => !tempPreferences.includes(s)));
  }, [tempPreferences]);

  const handleTogglePreference = (specialty: Swimming) => {
    if (tempPreferences.includes(specialty)) {
      setTempPreferences((prev) => prev.filter((s) => s !== specialty));
    } else {
      setTempPreferences((prev) => [...prev, specialty]);
    }
  };

  const handleSaveChanges = async () => {
    if (user && user.id) {
      try {
        const updatedData = {
          name,
          preferences: tempPreferences,
        };
        await updateStudent(user.id, updatedData);
        setUserStudent({ ...userStudent!, name, preferences: tempPreferences });
        showAlert("Profile updated successfully!");
      } catch (err) {
        showAlert(`Failed to update profile. ${err?.response.data.error || "Internal Error!"}`);
      }
    } else {
      showAlert(`Cannot save changes: User not authenticated.`);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile Settings</Text>
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}>
        {/* Current Settings */}
        <Text style={styles.sectionTitle}>
          <Icon name="info-circle" size={18} color="#34495E" /> Current Settings
        </Text>
        {userStudent ? (
          <View style={styles.currentSettingsContainer}>
            <Text style={styles.currentSettingsText}>
              <Icon name="user" size={16} color="#6C63FF" /> Name: {userStudent.name}
            </Text>
            {userStudent.preferences.length > 0 ? (
              <Text style={styles.currentSettingsText}>
                <Icon name="star" size={12} color="#6C63FF" />
                Preferences: {userStudent.preferences.map(formatSpecialty).join(", ")}
              </Text>
            ) : (
              <Text style={styles.emptyText}>No Preferences Set Yet!</Text>
            )}
          </View>
        ) : (
          <Text style={styles.emptyText}>Loading current settings...</Text>
        )}

        {/* Edit Profile */}
        <Text style={styles.sectionTitle}>Edit Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={(text) => {
            setName(text);
          }}
        />

        {/* Swimming Preferences Selection */}
        <Text style={styles.sectionTitle}>Select Swimming Preferences</Text>
        <View style={styles.swimWrap}>
          {availablePreferences.map((specialty) => (
            <TouchableOpacity
              key={specialty}
              style={styles.swimChip}
              onPress={() => handleTogglePreference(specialty)}
            >
              <Text style={styles.swimChipText}>{formatSpecialty(specialty)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chosen Preferences */}
        <Text style={styles.sectionTitle}>Chosen Preferences</Text>
        <View style={styles.swimColumn}>
          {tempPreferences.length > 0 ? (
            tempPreferences.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                style={styles.swimRowItem}
                onPress={() => handleTogglePreference(specialty)}
              >
                <Text style={styles.swimRowItemText}>
                  <Icon name="check" size={16} color="#4CAF50" /> {formatSpecialty(specialty)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No preferences selected yet.</Text>
          )}
        </View>

        {/* Save / Cancel Buttons */}
        <View style={styles.buttonRow}>
          <Button mode="contained" style={styles.saveButton} onPress={handleSaveChanges}>
            Save
          </Button>
          <Button mode="outlined" style={styles.cancelButton} onPress={handleCancel}>
            Cancel
          </Button>
        </View>
      </ScrollView>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

export default StudentSettingsScreen;