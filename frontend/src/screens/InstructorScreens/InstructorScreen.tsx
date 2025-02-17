import React, { useEffect, useState } from "react";
import { View, ScrollView, TextInput, FlatList } from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import CustomModal from "../../components/Modal";
import TimePicker from "../../components/TimePicker";
import { Swimming } from "../../utils/swimming-enum.utils";
import { DaysOfWeek } from "../../utils/days-week-enum.utils";
import { useInstructors } from "../../hooks/instructorHooks/useInstructors";
import { useInstructorForm } from "../../hooks/instructorHooks/useInstructorForm";
import Instructor from "../../dto/instructor/instructor.dto";
import { addItem, removeItem } from "..//../utils/arrayHelpers";
import { sortDays } from "..//../utils/sortHelpers";
import { isInstructorValid } from "../../utils/validation";
import styles from "./styles/InstructorScreen.styles";

const InstructorScreen: React.FC = () => {
  const {
    instructors,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    fetchInstructors,
  } = useInstructors();

  const {
    name,
    setName,
    specialties,
    setSpecialties,
    availableSpecialties,
    setAvailableSpecialties,
    availabilities,
    setAvailabilities,
    availableDays,
    setAvailableDays,
    selectedDay,
    setSelectedDay,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    clearForm,
  } = useInstructorForm();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchInstructors();
  }, []);

  const handleAddSpecialty = (specialty: Swimming) => {
    setSpecialties((prev) => addItem(prev, specialty));
    setAvailableSpecialties((prev) => removeItem(prev, specialty));
  };

  const handleRemoveSpecialty = (specialty: Swimming) => {
    setSpecialties((prev) => prev.filter((s) => s !== specialty));
    setAvailableSpecialties((prev) => [...prev, specialty]);
  };

  const handleAddAvailability = () => {
    if (selectedDay && startTime && endTime) {
      const dayIndex = Object.values(DaysOfWeek).indexOf(selectedDay);
      const newAvailability = { startTime, endTime };
      const updatedAvailabilities = [...availabilities];
      updatedAvailabilities[dayIndex] = newAvailability;
      setAvailabilities(updatedAvailabilities);
      setAvailableDays((prev) => prev.filter((d) => d !== selectedDay));
      setSelectedDay(null);
      setStartTime(null);
      setEndTime(null);
    }
  };

  const handleRemoveAvailability = (dayIndex: number) => {
    const updatedAvailabilities = [...availabilities];
    updatedAvailabilities[dayIndex] = -1;
    const removedDay = Object.values(DaysOfWeek)[dayIndex];
    setAvailabilities(updatedAvailabilities);
    setAvailableDays((prev) => sortDays([...prev, removedDay]));
  };

  const checkIfValidInstructor = (): boolean => {
    const { valid, message } = isInstructorValid(name, specialties, availabilities);
    if (!valid) {
      // You could display an alert here if needed.
      return false;
    }
    return true;
  };

  const handleSaveInstructor = async () => {
    if (!checkIfValidInstructor()) return;
    if (selectedInstructor && selectedInstructor.instructorId) {
      await updateInstructor({
        id: selectedInstructor.instructorId,
        data: { name, specialties, availabilities },
      });
    } else {
      await addInstructor({ name, specialties, availabilities });
    }
    await fetchInstructors();
    clearForm();
    setModalVisible(false);
  };

  const handleDeleteInstructor = async () => {
    if (selectedInstructor?.instructorId) {
      await deleteInstructor({ id: selectedInstructor.instructorId });
      clearForm();
      await fetchInstructors();
      setModalVisible(false);
    }
  };

  const renderInstructorCard = ({ item }: { item: Instructor | { id: string; title: string } }) => {
    if ("id" in item && item.id === "add") {
      return (
        <Button
          mode="contained"
          style={styles.addCard}
          onPress={() => {
            clearForm();
            setSelectedInstructor(null);
            setModalVisible(true);
          }}
        >
          {item.title}
        </Button>
      );
    } else {
      return (
        <Button
          mode="contained"
          style={styles.instructorCard}
          onPress={() => {
            setSelectedInstructor(item as Instructor);
            setModalVisible(true);
            setName((item as Instructor).name);
            setSpecialties((item as Instructor).specialties);
            setAvailabilities((item as Instructor).availabilities);
            const updatedSpecialties = Object.values(Swimming).filter(
              (specialty) => !(item as Instructor).specialties.includes(specialty)
            );
            setAvailableSpecialties(updatedSpecialties);
            const updatedDays = Object.values(DaysOfWeek).filter(
              (_, index) => (item as Instructor).availabilities[index] === -1
            );
            setAvailableDays(updatedDays);
          }}
        >
          <Text style={styles.instructorCardText}>{(item as Instructor).name}</Text>
          <Text style={styles.instructorCardSubText}>
            Specialties: {(item as Instructor).specialties.join(", ")}
          </Text>
        </Button>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with "Profile Settings" */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <TouchableOpacity onPress={() => console.log("Profile icon tapped")}>
          <Text style={styles.profileIcon}>🧑</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "AVAILABILITY" && styles.activeTab]}
          onPress={() => handleTabSwitch("AVAILABILITY")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "AVAILABILITY" && styles.activeTabText,
            ]}
          >
            Availability
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "SWIMMING_TYPES" && styles.activeTab]}
          onPress={() => handleTabSwitch("SWIMMING_TYPES")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "SWIMMING_TYPES" && styles.activeTabText,
            ]}
          >
            Swimming Types
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === "AVAILABILITY" ? (
          <>
            <Text style={styles.sectionTitle}>Set Your Availability</Text>
            {dayLabels.map(({ label, value }) => {
              const dayInfo = daySettings[value];
              return (
                <View key={value} style={styles.dayRow}>
                  <View style={styles.dayLabelContainer}>
                    <Text style={styles.dayLabel}>{label}</Text>
                    <Switch
                      value={dayInfo.enabled}
                      onValueChange={() => handleToggleDay(value)}
                    />
                  </View>
                  {dayInfo.enabled && (
                    <View style={styles.timePickersContainer}>
                      <Text style={styles.timePickersLabel}>Available From</Text>
                      <TimePicker
                        label="From"
                        onTimeSelected={(time) =>
                          handleUpdateDayRange(value, time, undefined)
                        }
                      />
                      <Text style={styles.timePickersLabel}>Available Until</Text>
                      <TimePicker
                        label="Until"
                        onTimeSelected={(time) =>
                          handleUpdateDayRange(value, undefined, time)
                        }
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Select Swimming Types</Text>
            <View style={styles.specialtiesContainer}>
              {ALL_SPECIALTIES.map((specialty) => (
                <TouchableOpacity
                  key={specialty}
                  style={[
                    styles.specialtyChip,
                    selectedSpecialties.includes(specialty) &&
                      styles.specialtyChipSelected,
                  ]}
                  onPress={() => handleToggleSpecialty(specialty)}
                >
                  <Text
                    style={[
                      styles.specialtyText,
                      selectedSpecialties.includes(specialty) &&
                        styles.specialtyTextSelected,
                    ]}
                  >
                    {specialty}
                  </Text>
                  {selectedSpecialties.includes(specialty) && (
                    <Text style={styles.checkMark}> ✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Current Settings */}
        <Text style={styles.sectionTitle}>Current Settings</Text>
        <View style={styles.currentSettingsContainer}>
          {Object.entries(daySettings).map(([dayKey, dayInfo]) => {
            if (!dayInfo.enabled || !dayInfo.range) return null;
            return (
              <Text style={styles.currentSettingsText} key={dayKey}>
                {dayKey}:
                {"  "}
                {new Date(dayInfo.range.startTime).toLocaleTimeString()} -{" "}
                {new Date(dayInfo.range.endTime).toLocaleTimeString()}
              </Text>
            );
          })}
          {selectedSpecialties.length > 0 && (
            <Text style={styles.currentSettingsText}>
              Selected Types: {selectedSpecialties.join(", ")}
            </Text>
          )}
        </View>

        {/* Save / Cancel Buttons */}
        <View style={styles.buttonRow}>
          <Button mode="contained" style={styles.saveButton} onPress={handleSaveChanges}>
            Save Changes
          </Button>
          <Button mode="outlined" style={styles.cancelButton} onPress={handleCancel}>
            Cancel
          </Button>
        </View>
      </ScrollView>

      {/* Confirmation Modal (example) */}
      <CustomModal
        visible={confirmModalVisible}
        title="Changes Saved"
        onClose={() => setConfirmModalVisible(false)}
      >
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 16, marginBottom: 20 }}>
            Your availability and swimming types have been updated.
          </Text>
          <Button
            mode="contained"
            onPress={() => setConfirmModalVisible(false)}
          >
            OK
          </Button>
        </View>
      </CustomModal>
    </View>
  );
};
export default InstructorScreen;
