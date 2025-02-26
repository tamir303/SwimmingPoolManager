import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Button, RadioButton } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { Swimming } from "../../utils/swimming-enum.utils";
import { useStudent } from "../../hooks/studentHooks/useStudent";
import { useAuth } from "../../hooks/authContext";
import styles from "./styles/StudentSettingScreen.styles";
import Footer from "../../components/Footer";
import { useNavigation } from "@react-navigation/native";
import Student from "../../dto/student/student.dto";
import useAlert from "../../hooks/useAlert";
import { LessonType } from "../../utils/lesson-enum.utils";
import TypePreference from "../../dto/student/typePreference.dto";
import { Picker } from "@react-native-picker/picker"

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
  const [userStudent, setUserStudent] = useState<Student | null>(null);

  const [tempSwimmings, setTempSwimmings] = useState<Swimming[]>([]);
  const [availableSwimmings, setAvailableSwimmings] = useState<Swimming[]>([]);

  const [typePreference, setTypePreference] = useState<TypePreference>(
    new TypePreference(LessonType.PUBLIC, null, null) // Default value
  );

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
      setTempSwimmings(userStudent.preferences);
      setTypePreference(
        new TypePreference(
        userStudent.typePreference.preference,
        userStudent.typePreference?.priority1 || null,
        userStudent.typePreference?.priority2 || null,
      ))
      setAvailableSwimmings(
        Object.values(Swimming).filter((s) => !userStudent.preferences.includes(s))
      );
    }
  }, [userStudent]);

  useEffect(() => {
    setAvailableSwimmings(Object.values(Swimming).filter((s) => !tempSwimmings.includes(s)));
  }, [tempSwimmings]);

  const handleTogglePreference = (specialty: Swimming) => {
    if (tempSwimmings.includes(specialty)) {
      setTempSwimmings((prev) => prev.filter((s) => s !== specialty));
    } else {
      setTempSwimmings((prev) => [...prev, specialty]);
    }
  };

  const handleSaveChanges = async () => {
    if (user && user.id) {
      try {
        const updatedData = {
          name,
          preferences: tempSwimmings,
          typePreference: new TypePreference(
            typePreference.preference,
            typePreference.priority1,
            typePreference.priority2,
          ),
        };
        await updateStudent(user.id, updatedData);
        setUserStudent({ ...userStudent!, name, preferences: tempSwimmings, typePreference: typePreference });
        showAlert("Profile updated successfully!");
      } catch (err) {
        showAlert(`Failed to update profile. ${err?.response.data.error || "Internal Error!"}`);
      }
    } else {
      showAlert(`Cannot save changes: User not authenticated.`);
    }
  };

  const handlePreferenceChange = (preference: LessonType | null, priority1: LessonType | null, priority2: LessonType | null) => {
    const newPreference = preference || typePreference.preference;
    let newPriority1: LessonType | null = priority1;
    let newPriority2: LessonType | null = priority2;

    // Reset priorities to null if preference is PUBLIC or PRIVATE
    if (newPreference === LessonType.PUBLIC || newPreference === LessonType.PRIVATE) {
      newPriority1 = null;
      newPriority2 = null;
    } else if (newPreference === LessonType.MIXED) {
      // Set defaults or update based on Picker if MIXED
      newPriority1 = priority1 !== null ? priority1 : typePreference.priority1 || LessonType.PUBLIC;
      newPriority2 = priority2 !== null ? priority2 : typePreference.priority2 || LessonType.PRIVATE;
    }

    const updatedPreference = new TypePreference(newPreference, newPriority1, newPriority2);
    setTypePreference(updatedPreference);
    console.log("Updated TypePreference:", {
      preference: updatedPreference.preference,
      priority1: updatedPreference.priority1,
      priority2: updatedPreference.priority2,
    });
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
              <Icon name="user" size={16} color="#6C63FF" />  Name: {userStudent.name}
            </Text>

          {userStudent.typePreference?.preference !== LessonType.MIXED ? 
              (
                <Text style={styles.currentSettingsText}>
                  <Icon name="list-alt" size={12} color="#6C63FF" /> Lesson Type: {formatSpecialty(userStudent.typePreference?.preference || typePreference.preference)}
                </Text>
              ) : (
                <Text style={styles.currentSettingsText}>
                  <Icon name="list-alt" size={12} color="#6C63FF" /> Lesson Type: {formatSpecialty(LessonType.MIXED)} (Priority: {formatSpecialty(userStudent.typePreference?.priority1 || LessonType.PUBLIC)}
                )
                </Text>
              )
            }

            {userStudent.preferences.length > 0 ? (
              <Text style={styles.currentSettingsText}>
                <Icon name="star" size={12} color="#6C63FF" /> Swimmings: {userStudent.preferences.map(formatSpecialty).join(", ")}
              </Text>
            ) : (
              <Text style={styles.emptyText}>No Swimmings Set Yet!</Text>
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
        <Text style={styles.sectionTitle}>Select Swimming Styles</Text>
        <View style={styles.swimWrap}>
          {availableSwimmings.map((specialty) => (
            <TouchableOpacity
              key={specialty}
              style={styles.swimChip}
              onPress={() => handleTogglePreference(specialty)}
            >
              <Text style={styles.swimChipText}>{formatSpecialty(specialty)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chosen Swimming Styles */}
        <Text style={styles.sectionTitle}>Chosen Swimming Styles</Text>
        <View style={styles.swimColumn}>
          {tempSwimmings.length > 0 ? (
            tempSwimmings.map((specialty) => (
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
            <Text style={styles.emptyText}>No Swimming style selected yet.</Text>
          )}
        </View>

        {/* Lesson Type Selection with RadioButton.Group */}
        <Text style={styles.sectionTitle}>Select Lesson Type</Text>
        <View style={styles.lessonTypeContainer}>
          <RadioButton.Group
            onValueChange={(newValue) => handlePreferenceChange(newValue as LessonType, null, null)}
            value={typePreference.preference}
          >
            <View style={styles.radioButton}>
              <RadioButton value={LessonType.PUBLIC} color="#6C63FF" />
              <Text style={styles.radioText}>Public</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value={LessonType.PRIVATE} color="#6C63FF" />
              <Text style={styles.radioText}>Private</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value={LessonType.MIXED} color="#6C63FF" />
              <Text style={styles.radioText}>Mixed</Text>
            </View>
          </RadioButton.Group>

          {/* Priority Selection with Picker for Mixed */}
          {typePreference?.preference === LessonType.MIXED && (
            <View style={styles.priorityContainer}>
              <Text style={styles.subSectionTitle}>Priority</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={typePreference.priority1 || LessonType.PUBLIC}
                  onValueChange={(itemValue) => {
                    const newPriority = itemValue as LessonType
                    const secondPriority = newPriority === LessonType.PUBLIC ? LessonType.PRIVATE : LessonType.PUBLIC
                    handlePreferenceChange(null, newPriority, secondPriority)
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Public" value={LessonType.PUBLIC} />
                  <Picker.Item label="Private" value={LessonType.PRIVATE} />
                </Picker>
              </View>
            </View>
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