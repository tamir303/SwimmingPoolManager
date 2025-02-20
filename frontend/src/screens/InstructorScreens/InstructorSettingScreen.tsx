import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
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

// Helper: Format a swimming type string (e.g., "BACK_STROKE" -> "Back stroke")
const formatSpecialty = (specialty: string): string => {
  const lower = specialty.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const InstructorScreen: React.FC = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert()
  const navigation = useNavigation();
  const { updateInstructor } = useInstructors();

  // Global (saved) instructor data.
  const [userInstructor, setUserInstructor] = useState<Instructor | null>(null);

  // Global state from useInstructorForm (saved values)
  const {
    name,
    setName,
    specialties,
    setSpecialties,
    availabilities,
    setAvailabilities,
    availableDays,
    setAvailableDays,
  } = useInstructorForm();

  // Temporary state for unsaved changes.
  const [tempSpecialties, setTempSpecialties] = useState<Swimming[]>([]);
  const [tempAvailabilities, setTempAvailabilities] = useState<Availability[]>(new Array(7).fill(-1));
  const [tempAvailableDays, setTempAvailableDays] = useState<DaysOfWeek[]>(Object.values(DaysOfWeek));
  const [tempSelectedDay, setTempSelectedDay] = useState<DaysOfWeek | null>(null);
  const [tempAvailableSpecialties, setTempAvailableSpecialties] = useState<Swimming[]>([]);

  // Fetch instructor data on mount.
  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        console.log(`Fetching user ${user.id}`)
        const instructorData = await InstructorService.getInstructorById(user.id);
        setUserInstructor(instructorData);
      }
    };
    fetchData();
  }, [user]);

  // When instructor data is fetched, initialize both global and temporary state.
  useEffect(() => {
    if (userInstructor) {
      setName(userInstructor.name);
      setSpecialties(userInstructor.specialties);
      setAvailabilities(userInstructor.availabilities);
      const newAvailableDays = Object.values(DaysOfWeek).filter((day, idx) => {
        return userInstructor.availabilities[idx] === -1;
      });
      setAvailableDays(newAvailableDays);

      // Initialize temporary state with saved values.
      setTempSpecialties(userInstructor.specialties);
      if (userInstructor.availabilities && userInstructor.availabilities.length === 7) {
        setTempAvailabilities(userInstructor.availabilities);
      } else {
        setTempAvailabilities(new Array(7).fill(-1));
      }
      setTempAvailableDays(newAvailableDays);
      setTempSelectedDay(null);

      // Initialize temporary available swimming types.
      const allSpecialties = Object.values(Swimming);
      setTempAvailableSpecialties(
        allSpecialties.filter((s) => !userInstructor.specialties.includes(s))
      );
    } else {
      // If no instructor data, initialize defaults.
      setTempAvailabilities(new Array(7).fill(-1));
      setTempAvailableDays(Object.values(DaysOfWeek));
    }
  }, [userInstructor, setName, setSpecialties, setAvailabilities, setAvailableDays]);

  // Recalculate available swimming types whenever tempSpecialties changes.
  useEffect(() => {
    const allSpecialties = Object.values(Swimming);
    setTempAvailableSpecialties(
      allSpecialties.filter((s) => !tempSpecialties.includes(s))
    );
  }, [tempSpecialties]);

  useEffect(() => {
    // Compute all days that are cancelled (i.e. availability equals -1)
    const cancelledDays = Object.values(DaysOfWeek).filter((day, idx) => {
      return tempAvailabilities[idx] === -1;
    });
    // Only update if there's a change to avoid unnecessary re-renders.
    if (cancelledDays.length !== tempAvailableDays.length) {
      setTempAvailableDays(cancelledDays);
    }
  }, [tempAvailabilities]);
  

  const checkIfValid = (): boolean => {
    const { valid, message } = isInstructorValid(name, tempSpecialties, tempAvailableDays);
    if (message) showAlert(message)
    return valid;
  };

  const handleSaveChanges = async () => {
    const data = {
      name: name,
      specialties: tempSpecialties,
      availabilities: tempAvailabilities
    }
    console.log(data)

    if (!checkIfValid()) {
      console.log("Data invalid. Please check required fields.");
      return;
    }
    try {
      if (userInstructor && userInstructor.id) {
        await updateInstructor({
          id: userInstructor.id,
          data: { name: name, specialties: tempSpecialties, availabilities: tempAvailabilities },
        });
      }

      // Commit temporary changes to global state.
      setSpecialties(tempSpecialties);
      setAvailableDays(tempAvailableDays);
      setAvailabilities(tempAvailabilities)
      console.log("Saved instructor data!");
      
      setTempSelectedDay(null);
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  // Updated handleToggleDay: Allows multiple days to be active.
  const handleToggleDay = (day: DaysOfWeek) => {
    const dayIndex = Object.values(DaysOfWeek).indexOf(day);
    const currentValue = tempAvailabilities[dayIndex];

    // Simply toggle the day without affecting others.
    if (currentValue === -1) {
      // Toggle on: set default time range.
      const newAvail = [...tempAvailabilities];
      newAvail[dayIndex] = { startTime: new Date(), endTime: new Date() };
      setTempAvailabilities(newAvail);
      setTempAvailableDays((prev) => prev.filter((d) => d !== day));
      // Set this day as active (for showing time pickers).
      setTempSelectedDay(day);
    } else {
      // Toggle off.
      const newAvail = [...tempAvailabilities];
      newAvail[dayIndex] = -1;
      setTempAvailabilities(newAvail);
      setTempAvailableDays((prev) => sortDays([...prev, day]));
      // If this day was active, remove it.
      if (tempSelectedDay === day) {
        setTempSelectedDay(null);
      }
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
  };

  const handleToggleSpecialty = (specialty: Swimming) => {
    if (tempSpecialties.includes(specialty)) {
      setTempSpecialties((prev) => prev.filter((s) => s !== specialty));
    } else {
      setTempSpecialties((prev) => [...prev, specialty]);
    }
  };

  // Compute active days (all days where tempAvailabilities is not -1).
  const activeDays = Object.values(DaysOfWeek).filter((day, idx) => {
    return tempAvailabilities[idx] !== -1;
  });  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile Settings</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Current Settings (Global Data) */}
          <Text style={styles.sectionTitle}>Current Settings</Text>
          {userInstructor ? (
            <View style={styles.currentSettingsContainer}>
              <Text style={styles.currentSettingsText}>
                Name: {name}
              </Text>
              {
                availabilities.every((availability) => availability === -1) ? (
                  <Text style={styles.currentSettingsText}>No Availabilities Set Yet!</Text>
                ) : (
                  availabilities.map((availability, idx) => {
                    if (availability === -1) return null;
                    const day = Object.values(DaysOfWeek)[idx];
                    return (
                      <Text style={styles.currentSettingsText} key={day}>
                        {day}: {new Date(availability.startTime).toLocaleTimeString()} -{" "}
                        {new Date(availability.endTime).toLocaleTimeString()}
                      </Text>
                    );
                  })
                )
              }
              {specialties.length > 0 ? (
                <Text style={styles.currentSettingsText}>
                    Specialties:{" "}
                  {specialties.map(formatSpecialty).join(", ")}
                </Text>
              ) : (
                <Text style={styles.currentSettingsText}>
                  No Specialities Set Yet!
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.currentSettingsText}>Loading current settings...</Text>
          )}

          {/* Availability Section (Temporary State) */}
          <Text style={styles.sectionTitle}>Set Your Availability</Text>
          <View style={styles.daysGrid}>
            {availableDays.map((day) => (
              <View key={day} style={styles.dayBox}>
                <Text style={styles.dayLabel}>{formatSpecialty(day)}</Text>
                <Switch
                  value={
                    tempAvailabilities[Object.values(DaysOfWeek).indexOf(day)] !== -1
                  }
                  onValueChange={() => handleToggleDay(day)}
                />
              </View>
            ))}
          </View>

          {/* For each active day, render its time picker section */}
          {activeDays.map((day) => {
            const dayIndex = Object.values(DaysOfWeek).indexOf(day)
            return (
              <View key={day} style={styles.timePickerSection}>
                {/* X icon to disable this day */}
                <TouchableOpacity 
                  style={styles.removeIcon} 
                  onPress={() => handleToggleDay(day)}
                >
                  <Text style={styles.removeIconText}>X</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Set Time for {day}</Text>
                <View style={styles.timePickerRow}>
                  <View style={styles.timePickerItem}>
                  <Text style={styles.timePickersLabel}>Available From</Text>
                  <TimePicker
                    label="From"
                    value={typeof tempAvailabilities[dayIndex] === "object" && tempAvailabilities[dayIndex]?.startTime || new Date()}
                    onTimeSelected={(time) =>
                      handleUpdateDayRange(day, time, undefined)
                    }
                  />
                  </View>
                    <View style={styles.timePickerItem}>
                      <Text style={styles.timePickersLabel}>Available Until</Text>
                      <TimePicker
                      label="Until"
                      value={typeof tempAvailabilities[dayIndex] === "object" && tempAvailabilities[dayIndex]?.endTime || new Date()}
                      onTimeSelected={(time) =>
                        handleUpdateDayRange(day, undefined, time)
                      }
                      />
                    </View>
                  </View>
              </View>
              );
            })}

          {/* Swimming Types Section (Temporary State) */}
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
                <Text style={styles.swimRowItemText}>{formatSpecialty(specialty)}</Text>
                <Text style={styles.swimRowItemIcon}>✓</Text>
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

        {/* Footer */}
        <Footer navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default InstructorScreen;