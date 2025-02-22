import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Button } from "react-native-paper";
import TimePicker from "../../components/TimePicker";
import { Swimming } from "../../utils/swimming-enum.utils";
import { DaysOfWeek } from "../../utils/days-week-enum.utils";
import { useInstructors } from "../../hooks/instructorHooks/useInstructors";
import { useInstructorForm } from "../../hooks/instructorHooks/useInstructorForm";
import { sortDays } from "../../utils/sortHelpers";
import { isInstructorValid } from "../../utils/validation";
import StartAndEndTime, { Availability } from "../../dto/instructor/start-and-end-time.dto";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles/InstructorScreen.styles";
import { useAuth } from "../../hooks/authContext";
import Instructor from "../../dto/instructor/instructor.dto";
import InstructorService from "../../services/instructor.service";
import Footer from "../../components/Footer";
import useAlert from "../../hooks/useAlert";
import Icon from "react-native-vector-icons/FontAwesome";

const formatSpecialty = (specialty: string): string => {
  const lower = specialty.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const formatDate = (date: Date): Date => {
  const fdate = new Date(date);
  fdate.setSeconds(0);
  fdate.setMilliseconds(0);
  return fdate;
};

const InstructorScreen: React.FC = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const navigation = useNavigation();
  const { updateInstructor } = useInstructors();

  const [userInstructor, setUserInstructor] = useState<Instructor | null>(null);
  const { name, setName, specialties, setSpecialties, availabilities, setAvailabilities, availableDays, setAvailableDays } = useInstructorForm();
  const [tempSpecialties, setTempSpecialties] = useState<Swimming[]>([]);
  const [tempAvailabilities, setTempAvailabilities] = useState<Availability[]>(new Array(7).fill(-1));
  const [tempAvailableDays, setTempAvailableDays] = useState<DaysOfWeek[]>(Object.values(DaysOfWeek));
  const [tempSelectedDay, setTempSelectedDay] = useState<DaysOfWeek | null>(null);
  const [tempAvailableSpecialties, setTempAvailableSpecialties] = useState<Swimming[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        try {
          console.log(`Fetching instructor data for user ID: ${user.id}`);
          const instructorData = await InstructorService.getInstructorById(user.id);
          setUserInstructor(instructorData);
          console.log("Instructor data fetched successfully:", instructorData);
        } catch (error) {
          console.error("Error fetching instructor data:", error);
          showAlert("Failed to load your profile. Please try again.");
        }
      } else {
        console.log("No user or user ID available to fetch instructor data.");
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (userInstructor) {
      console.log("Setting initial form values from userInstructor:", userInstructor);
      setName(userInstructor.name);
      setSpecialties(userInstructor.specialties);
      setAvailabilities(userInstructor.availabilities);
      const newAvailableDays = Object.values(DaysOfWeek).filter((day, idx) => userInstructor.availabilities[idx] === -1);
      setAvailableDays(newAvailableDays);
      setTempSpecialties(userInstructor.specialties);
      setTempAvailabilities(userInstructor.availabilities.length === 7 ? userInstructor.availabilities : new Array(7).fill(-1));
      setTempAvailableDays(newAvailableDays);
      setTempSelectedDay(null);
      setTempAvailableSpecialties(Object.values(Swimming).filter((s) => !userInstructor.specialties.includes(s)));
    } else {
      console.log("No userInstructor, resetting tempAvailabilities and tempAvailableDays.");
      setTempAvailabilities(new Array(7).fill(-1));
      setTempAvailableDays(Object.values(DaysOfWeek));
    }
  }, [userInstructor, setName, setSpecialties, setAvailabilities, setAvailableDays]);

  useEffect(() => {
    console.log("Updating tempAvailableSpecialties based on tempSpecialties:", tempSpecialties);
    setTempAvailableSpecialties(Object.values(Swimming).filter((s) => !tempSpecialties.includes(s)));
  }, [tempSpecialties]);

  useEffect(() => {
    const cancelledDays = Object.values(DaysOfWeek).filter((day, idx) => tempAvailabilities[idx] === -1);
    if (cancelledDays.length !== tempAvailableDays.length) {
      console.log("Updating tempAvailableDays based on tempAvailabilities:", cancelledDays);
      setTempAvailableDays(cancelledDays);
    }
  }, [tempAvailabilities]);

  const checkIfValid = (): boolean => {
    const { valid, message } = isInstructorValid(name, tempSpecialties, tempAvailableDays);
    if (!valid && message) {
      console.log("Validation failed:", message);
      showAlert(message);
    }
    return valid;
  };

  const handleSaveChanges = async () => {
    const data = { name, specialties: tempSpecialties, availabilities: tempAvailabilities };
    console.log("Attempting to save changes:", data);
    if (!checkIfValid()) return;
    try {
      if (userInstructor && userInstructor.id) {
        await updateInstructor({ id: userInstructor.id, data });
        console.log("Instructor profile updated successfully:", data);
        setSpecialties(tempSpecialties);
        setAvailableDays(tempAvailableDays);
        setAvailabilities(tempAvailabilities);
        showAlert("Profile updated successfully!");
        setTempSelectedDay(null);
      } else {
        console.log("No userInstructor or ID available to update.");
        showAlert("Cannot save changes: Instructor ID missing.");
      }
    } catch (err) {
      console.error("Error saving data:", err);
      showAlert("Failed to save profile! Please try again.");
    }
  };

  const handleCancel = () => {
    console.log("Cancel button pressed, navigating back.");
    navigation.goBack();
  };

  const handleToggleDay = (day: DaysOfWeek) => {
    const dayIndex = Object.values(DaysOfWeek).indexOf(day);
    const currentValue = tempAvailabilities[dayIndex];
    if (currentValue === -1) {
      const newAvail = [...tempAvailabilities];
      newAvail[dayIndex] = { startTime: new Date(), endTime: new Date() };
      setTempAvailabilities(newAvail);
      setTempAvailableDays((prev) => prev.filter((d) => d !== day));
      setTempSelectedDay(day);
      console.log(`Enabled day ${day}, new tempAvailabilities:`, newAvail);
    } else {
      const newAvail = [...tempAvailabilities];
      newAvail[dayIndex] = -1;
      setTempAvailabilities(newAvail);
      setTempAvailableDays((prev) => sortDays([...prev, day]));
      if (tempSelectedDay === day) setTempSelectedDay(null);
      console.log(`Disabled day ${day}, new tempAvailabilities:`, newAvail);
    }
  };

  const handleUpdateDayRange = (day: DaysOfWeek, start?: Date, end?: Date) => {
    const dayIndex = Object.values(DaysOfWeek).indexOf(day);
    if (tempAvailabilities[dayIndex] === -1) return;
    const newAvail = [...tempAvailabilities];
    const currentRange = newAvail[dayIndex] as StartAndEndTime;
    newAvail[dayIndex] = {
      startTime: start || currentRange.startTime,
      endTime: end || currentRange.endTime,
    };
    setTempAvailabilities(newAvail);
    console.log(`Updated time range for ${day}:`, newAvail[dayIndex]);
  };

  const handleToggleSpecialty = (specialty: Swimming) => {
    if (tempSpecialties.includes(specialty)) {
      setTempSpecialties((prev) => prev.filter((s) => s !== specialty));
      console.log(`Removed specialty ${specialty}, new tempSpecialties:`, tempSpecialties);
    } else {
      setTempSpecialties((prev) => [...prev, specialty]);
      console.log(`Added specialty ${specialty}, new tempSpecialties:`, tempSpecialties);
    }
  };

  const activeDays = Object.values(DaysOfWeek).filter((day, idx) => tempAvailabilities[idx] !== -1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile Settings</Text>
      </View>
      <View style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Current Settings */}
          <Text style={styles.sectionTitle}>
            <Icon name="info-circle" size={18} color="#34495E" /> Current Settings
          </Text>
          {userInstructor ? (
            <View style={styles.currentSettingsContainer}>
              <Text style={styles.currentSettingsText}>
                <Icon name="user" size={16} color="#6C63FF" /> Name: {name}
              </Text>
              {availabilities.every((availability) => availability === -1) ? (
                <Text style={styles.emptyText}>No Availabilities Set Yet!</Text>
              ) : (
                availabilities.map((availability, idx) => {
                  if (availability === -1) return null;
                  const day = Object.values(DaysOfWeek)[idx];
                  return (
                    <Text style={styles.currentSettingsText} key={day}>
                      <Icon name="calendar" size={16} color="#6C63FF" /> {day}:{" "}
                      {new Date(formatDate(availability.startTime)).toLocaleTimeString()} -{" "}
                      {new Date(formatDate(availability.endTime)).toLocaleTimeString()}
                    </Text>
                  );
                })
              )}
              {specialties.length > 0 ? (
                <Text style={styles.currentSettingsText}>
                  Specialties: {specialties.map(formatSpecialty).join(", ")}
                </Text>
              ) : (
                <Text style={styles.emptyText}>No Specialties Set Yet!</Text>
              )}
            </View>
          ) : (
            <Text style={styles.emptyText}>Loading current settings...</Text>
          )}

          {/* Set User Name */}
          <Text style={styles.sectionTitle}>Edit Profile</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              console.log("Name updated to:", text);
            }}
          />

          {/* Availability Section */}
          <Text style={styles.sectionTitle}>
            <Icon name="clock-o" size={18} color="#34495E" /> Set Your Availability
          </Text>
          <View style={styles.daysGrid}>
            {Object.values(DaysOfWeek).map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayBox,
                  tempAvailabilities[Object.values(DaysOfWeek).indexOf(day)] !== -1 && styles.dayBoxActive,
                ]}
                onPress={() => handleToggleDay(day)}
              >
                <Text style={styles.dayLabel}>{formatSpecialty(day)}</Text>
                <Switch
                  value={tempAvailabilities[Object.values(DaysOfWeek).indexOf(day)] !== -1}
                  onValueChange={() => handleToggleDay(day)}
                  trackColor={{ false: "#DDD", true: "#6C63FF" }}
                  thumbColor="#FFF"
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Active Days Time Pickers */}
          {activeDays.map((day) => {
            const dayIndex = Object.values(DaysOfWeek).indexOf(day);
            return (
              <View key={day} style={styles.timePickerSection}>
                <TouchableOpacity style={styles.removeIcon} onPress={() => handleToggleDay(day)}>
                  <Icon name="times" size={16} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.timePickerTitle}>{formatSpecialty(day)}</Text>
                <View style={styles.timePickerRow}>
                  <View style={styles.timePickerItem}>
                    <Text style={styles.timePickersLabel}>From</Text>
                    <TimePicker
                      label="From"
                      value={typeof tempAvailabilities[dayIndex] === "object" && tempAvailabilities[dayIndex]?.startTime || new Date()}
                      onTimeSelected={(time) => handleUpdateDayRange(day, time, undefined)}
                    />
                  </View>
                  <View style={styles.timePickerItem}>
                    <Text style={styles.timePickersLabel}>Until</Text>
                    <TimePicker
                      label="Until"
                      value={typeof tempAvailabilities[dayIndex] === "object" && tempAvailabilities[dayIndex]?.endTime || new Date()}
                      onTimeSelected={(time) => handleUpdateDayRange(day, undefined, time)}
                    />
                  </View>
                </View>
              </View>
            );
          })}

          {/* Swimming Types Section */}
          <Text style={styles.sectionTitle}>Select Swimming Types</Text>
          <View style={styles.swimWrap}>
            {tempAvailableSpecialties.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                style={styles.swimChip}
                onPress={() => handleToggleSpecialty(specialty)}
              >
                <Text style={styles.swimChipText}>{formatSpecialty(specialty)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sectionTitle}>Chosen Swimming Types</Text>
          <View style={styles.swimColumn}>
            {tempSpecialties.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                style={styles.swimRowItem}
                onPress={() => handleToggleSpecialty(specialty)}
              >
                <Text style={styles.swimRowItemText}>
                  <Icon name="check" size={16} color="#4CAF50" /> {formatSpecialty(specialty)}
                </Text>
              </TouchableOpacity>
            ))}
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
      </View>
      <View style={styles.footerContainer}>
        <Footer navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default InstructorScreen;