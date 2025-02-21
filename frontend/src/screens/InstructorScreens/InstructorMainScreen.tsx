import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Button, RadioButton } from "react-native-paper";
import Lesson from "../../dto/lesson/lesson.dto";
import CustomModal from "../../components/Modal";
import CustomCard from "../../components/Card";
import TimePicker from "../../components/TimePicker";
import NewLesson from "../../dto/lesson/new-lesson.dto";
import { LessonType } from "../../utils/lesson-enum.utils";
import StartAndEndTime from "../../dto/instructor/start-and-end-time.dto";
import { useAuth } from "../../hooks/authContext";
import Footer from "../../components/Footer";
import styles from "./styles/MainScreen.styles";
import Instructor from "../../dto/instructor/instructor.dto";
import InstructorService from "../../services/instructor.service";
import { DaysOfWeek, getDayIndexInMonth } from "../../utils/days-week-enum.utils";
import useAlert from "../../hooks/useAlert";
import useLesson from "../../hooks/LessonHooks/useLessons";

type LessonTab = "MY" | "COMPLETED";
const days: DaysOfWeek[] = Object.values(require("../../utils/days-week-enum.utils").DaysOfWeek);

// Helper: Format a swimming type string (unused in this example but kept for reference)
const formatSpecialty = (specialty: string): string => {
  const lower = specialty.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const MainScreen: React.FC = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { createLesson, updateLesson, getLessonsWithinRange, deleteLessonById, getLessonById ,error } = useLesson();

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Lessons list states
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [activeTab, setActiveTab] = useState<LessonTab>("MY");

  // Modal state for create/edit lesson
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Fields for lesson creation/editing
  const [lessonType, setLessonType] = useState<LessonType | null>(null);
  const [lessonStartTime, setLessonStartTime] = useState<Date | null>(null);
  const [lessonEndTime, setLessonEndTime] = useState<Date | null>(null);
  const [selectedLessonDay, setSelectedLessonDay] = useState<DaysOfWeek | null>(null);

  const [userInstructor, setUserInstructor] = useState<Instructor | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id && isFocused) {
        await fetchLessons();
        const instructorData = await InstructorService.getInstructorById(user.id);
        setUserInstructor(instructorData);
      }
    };
  
    fetchData();
  }, [user, isFocused]);  

  useEffect(() => {
    filterLessons();
  }, [allLessons, activeTab]);

  const fetchLessons = async () => {
    try {
      const start = new Date();
      start.setDate(start.getDate() - 30);
      const end = new Date();
      end.setDate(end.getDate() + 30);
      const lessons = await getLessonsWithinRange(start, end);
      // Only show lessons created by the logged-in instructor
      const myLessons = lessons.filter(
        (lesson) => lesson.instructorId === user?.id
      );
      setAllLessons(myLessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      showAlert("Failed to fetch lessons")
    }
  };

  // Filtering lessons based on active tab:
  const filterLessons = () => {
    const now = new Date();
    const filtered = allLessons.filter((lesson) => {
      if (activeTab === "MY") {
        return new Date(lesson.startAndEndTime.startTime) > now;
      } else {
        return new Date(lesson.startAndEndTime.startTime) < now;
      }
    });
    setFilteredLessons(filtered);
  };
  

  // Open modal for creating a new lesson
  const openCreateModal = () => {
    setSelectedLesson(null);
    setLessonType(null);
    setLessonStartTime(new Date());
    setLessonEndTime(new Date());
    setModalVisible(true);
  };

  // Open modal for editing an existing lesson
  const openEditModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setLessonType(lesson.typeLesson);
    setLessonStartTime(lesson.startAndEndTime.startTime);
    setLessonEndTime(lesson.startAndEndTime.endTime);
    setModalVisible(true);
  };

  const adjustTime = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
  };

  const handleSaveLesson = async () => {
    console.log(`${lessonType} ${selectedLessonDay} ${lessonStartTime} ${lessonEndTime}`)

    if (!lessonType || !lessonStartTime || !lessonEndTime || !userInstructor || !selectedLessonDay) {
      showAlert("One or more lessons fields are empty!")
      return;
    }

    const day: number = getDayIndexInMonth(Object.values(DaysOfWeek).indexOf(selectedLessonDay)) + 1
    const adjustStartTime: Date = adjustTime(lessonStartTime)
    const adjustEndTime: Date = adjustTime(lessonEndTime)
    adjustStartTime.setDate(day)
    adjustEndTime.setDate(day)

    try {
      if (selectedLesson) {
        await updateLesson(selectedLesson.lessonId || "", {
          ...selectedLesson,
          typeLesson: lessonType,
          startAndEndTime: new StartAndEndTime(adjustStartTime, adjustEndTime),
        });
        showAlert("Lesson Updated!")
      } else {
        const day = Object.values(DaysOfWeek).indexOf(selectedLessonDay);
        const newLesson = new NewLesson(
          lessonType,
          userInstructor.id,
          userInstructor.specialties,
          new StartAndEndTime(adjustStartTime, adjustEndTime),
          []
        );
        await createLesson(newLesson, day);
        showAlert("Lesson Created!")
      }
      fetchLessons();
      setModalVisible(false);
    } catch (err) {
      console.error("Error saving lesson:", err);
      showAlert("Failed to save lesson!")
    }
  };

  const renderLesson = ({ item }: { item: Lesson }) => {
    // Determine status and set a color accordingly.
    const status = item.students.length > 0 ? "Active" : "Completed";
    const statusColor = status === "Active" ? "#4CAF50" : "#F44336";
    // Format start and end times.
    const startTime = new Date(item.startAndEndTime.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = new Date(item.startAndEndTime.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return (
      <CustomCard onPress={() => openEditModal(item)} style={styles.card} title={`${userInstructor}-${startTime}-${endTime}`}>
        <Text style={styles.cardText}>
          Instructor: {item.instructorId}
        </Text>
        <Text style={styles.cardText}>Type: {item.typeLesson}</Text>
        <Text style={styles.cardText}>
          Specialties: {item.specialties.map(formatSpecialty).join(", ")}
        </Text>
        <Text style={[styles.lessonStatus, { color: statusColor }]}>
          {status} | {startTime} - {endTime}
        </Text>
      </CustomCard>
    );
  };

  // Header component showing user info
  const HeaderUserInfo = () => (
    <View style={styles.headerUserInfo}>
          {userInstructor ? (
            <View>
              <Text style={styles.userName}>
                Name: {userInstructor.name}
              </Text>
              {
                userInstructor.availabilities.every((availability) => availability === -1) ? (
                  <Text style={styles.emptyText}>No Availabilities Set Yet!</Text>
                ) : (
                  userInstructor.availabilities.map((availability, idx) => {
                    if (availability === -1) return null;
                    const day = Object.values(DaysOfWeek)[idx];
                    return (
                      <Text key={day}>
                        {day}: {new Date(availability.startTime).toLocaleTimeString()} -{" "}
                        {new Date(availability.endTime).toLocaleTimeString()}
                      </Text>
                    );
                  })
                )
              }
              {userInstructor.specialties.length > 0 ? (
                <Text>
                    Specialties:{" "}
                  {userInstructor.specialties.map(formatSpecialty).join(", ")}
                </Text>
              ) : (
                <Text style={styles.emptyText}>
                  No Specialities Set Yet!
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.emptyText}>Loading current settings...</Text>
          )}
    </View>
  );

    // Render a day picker for the lesson modal
    const renderLessonDayPicker = () => (
      <View style={styles.dayPickerContainer}>
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayPickerButton,
              selectedLessonDay === day && styles.dayPickerButtonActive,
            ]}
            onPress={() => setSelectedLessonDay(day)}
          >
            <Text
              style={[
                styles.dayPickerText,
                selectedLessonDay === day && styles.dayPickerTextActive,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1}}>
    <View style={styles.container}>
      {/* Header with User Info */}
      <HeaderUserInfo />

      {/* Purple UI Line */}
      <View style={styles.purpleLine} />

      {/* Toggle Buttons for Lesson Filtering */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === "MY" && styles.activeToggleButton,
          ]}
          onPress={() => setActiveTab("MY")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              activeTab === "MY" && styles.activeToggleButtonText,
            ]}
          >
            My Lessons
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === "COMPLETED" && styles.activeToggleButton,
          ]}
          onPress={() => setActiveTab("COMPLETED")}
        >
          <Text
            style={[
              styles.toggleButtonText,
              activeTab === "COMPLETED" && styles.activeToggleButtonText,
            ]}
          >
            Completed Lessons
          </Text>
        </TouchableOpacity>
      </View>

      {/* Lesson List */}
      <FlatList
        data={filteredLessons}
        keyExtractor={(item) => item.lessonId || Math.random().toString()}
        renderItem={renderLesson}
        ListEmptyComponent={<Text style={styles.emptyText}>No lessons found.</Text>}
        contentContainerStyle={styles.listContainer}
      />

      {/* Create Lesson Button */}
      <View style={styles.createButtonContainer}>
        <Button
          mode="contained"
          style={styles.createButton}
          onPress={openCreateModal}
        >
          Create New Lesson
        </Button>
      </View>

        {/* Create/Edit Lesson Modal */}
        <CustomModal
          visible={modalVisible}
          title={selectedLesson ? "Edit Lesson" : "Create Lesson"}
          onClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {/* Day Picker */}
            <Text style={styles.modalLabel}>Select Lesson Day:</Text>
            {renderLessonDayPicker()}

            {/* Lesson Type Picker */}
            <Text style={styles.modalLabel}>Select Lesson Type:</Text>
            <RadioButton.Group
              onValueChange={(value) => setLessonType(value as LessonType)}
              value={lessonType || "undefined"}
            >
              {Object.values(LessonType).map((type) => (
                <View key={type} style={styles.option}>
                  <RadioButton value={type} />
                  <Text>{formatSpecialty(type.toString())}</Text>
                </View>
              ))}
            </RadioButton.Group>

            {/* Time Pickers */}
            <Text style={styles.modalLabel}>Select Start Time</Text>
            <TimePicker
              label="Start Time"
              onTimeSelected={(time) => setLessonStartTime(time)}
            />
            <Text style={styles.modalLabel}>Select End Time</Text>
            <TimePicker
              label="End Time"
              onTimeSelected={(time) => setLessonEndTime(time)}
            />
            <Button
              mode="contained"
              onPress={handleSaveLesson}
              style={styles.saveButton}
            >
              Save Lesson
            </Button>
          </View>
        </CustomModal>

      {/* Footer */}
      <Footer navigation={navigation} />
    </View>
    </SafeAreaView>
  );
};

export default MainScreen;
