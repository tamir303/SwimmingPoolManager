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
    <View
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>FUTURISTIC INSTRUCTORS</Text>
      </View>
      <View style={styles.content}>
        <FlatList
          data={[{ id: "add", title: "+ Add Instructor" }, ...instructors]}
          keyExtractor={(item) => ("id" in item ? item.id.toString() : "add")}
          numColumns={2}
          renderItem={renderInstructorCard}
          contentContainerStyle={styles.listContainer}
        />
      </View>
      <CustomModal
        visible={modalVisible}
        title={selectedInstructor ? "Edit Instructor" : "Add Instructor"}
        onClose={() => {
          clearForm();
          setModalVisible(false);
        }}
      >
        <ScrollView style={styles.modalContent}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter Instructor Name"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.specialtiesContainer}>
            {availableSpecialties.map((specialty) => (
              <Button
                key={specialty}
                onPress={() => handleAddSpecialty(specialty)}
                style={styles.chip}
                mode="contained"
              >
                {specialty}
              </Button>
            ))}
          </View>
          <View style={styles.specialtiesContainer}>
            {specialties.map((specialty) => (
              <Button
                key={specialty}
                onPress={() => handleRemoveSpecialty(specialty)}
                style={styles.chipSelected}
                mode="contained"
              >
                {specialty} <Text style={styles.chipRemove}>×</Text>
              </Button>
            ))}
          </View>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.daysContainer}>
            {availableDays.map((day) => (
              <Button
                key={day}
                onPress={() => {
                  let updatedDays = [...availableDays];
                  if (selectedDay) {
                    updatedDays = [...updatedDays, selectedDay].sort(
                      (a, b) =>
                        Object.values(DaysOfWeek).indexOf(a) -
                        Object.values(DaysOfWeek).indexOf(b)
                    );
                  }
                  updatedDays = updatedDays.filter((d) => d !== day);
                  setAvailableDays(updatedDays);
                  setSelectedDay(day);
                }}
                style={styles.dayChip}
                mode="contained"
              >
                {day}
              </Button>
            ))}
          </View>
          {selectedDay && (
            <>
              <TimePicker label="Select Start Time" onTimeSelected={setStartTime} />
              <TimePicker label="Select End Time" onTimeSelected={setEndTime} />
              <Button
                onPress={handleAddAvailability}
                style={styles.availabilityButton}
                mode="contained"
                disabled={!startTime || !endTime}
              >
                Add Availability
              </Button>
            </>
          )}
          {availabilities.map(
            (availability, index) =>
              availability !== -1 && (
                <Button
                  key={index}
                  onPress={() => handleRemoveAvailability(index)}
                  style={styles.availabilityChip}
                  mode="contained"
                >
                  <Text style={styles.availabilityText}>
                    {Object.values(DaysOfWeek)[index]}{" "}
                    {new Date(availability.startTime).toLocaleTimeString()} -{" "}
                    {new Date(availability.endTime).toLocaleTimeString()}{" "}
                    <Text style={styles.chipRemove}>×</Text>
                  </Text>
                </Button>
              )
          )}
          <Button
            onPress={handleSaveInstructor}
            style={styles.saveButton}
            mode="contained"
          >
            {selectedInstructor ? "Update Instructor" : "Add Instructor"}
          </Button>
          {selectedInstructor && (
            <Button
              onPress={handleDeleteInstructor}
              style={styles.deleteButton}
              mode="contained"
            >
              Delete Instructor
            </Button>
          )}
        </ScrollView>
      </CustomModal>
      <Button
        onPress={() => navigation.goBack()}
        mode="outlined"
        style={styles.backButton}
      >
        Back to Main
      </Button>
    </View>
  );
};

export default InstructorScreen;
