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
import LessonService from "../../services/lesson.service";
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

type LessonTab = "MY" | "COMPLETED";

// Helper: Format a swimming type string (unused in this example but kept for reference)
const formatSpecialty = (specialty: string): string => {
  const lower = specialty.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const MainScreen: React.FC = () => {
  const { user } = useAuth();
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
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonType, setLessonType] = useState<LessonType | null>(null);
  const [lessonStartTime, setLessonStartTime] = useState<Date | null>(null);
  const [lessonEndTime, setLessonEndTime] = useState<Date | null>(null);

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
      const lessons = await LessonService.getLessonsWithinRange(start, end);
      // Only show lessons created by the logged-in instructor
      const myLessons = lessons.filter(
        (lesson) => lesson.instructorId === user?.id
      );
      setAllLessons(myLessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
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
    setLessonTitle("");
    setLessonStartTime(null);
    setLessonEndTime(null);
    setModalVisible(true);
  };

  // Open modal for editing an existing lesson
  const openEditModal = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setLessonTitle(lesson.typeLesson);
    if (lesson.startAndEndTime) {
      setLessonStartTime(new Date(lesson.startAndEndTime.startTime));
      setLessonEndTime(new Date(lesson.startAndEndTime.endTime));
    }
    setModalVisible(true);
  };

  const handleSaveLesson = async () => {
    if (!lessonTitle || !lessonStartTime || !lessonEndTime) {
      console.log("Please fill all fields");
      return;
    }

    try {
      if (selectedLesson) {
        await LessonService.updateLesson(selectedLesson.lessonId || "", {
          ...selectedLesson,
          typeLesson: lessonTitle as LessonType,
          startAndEndTime: new StartAndEndTime(lessonStartTime, lessonEndTime),
        });
      } else {
        const day = lessonStartTime.getDay();
        const newLesson = new NewLesson(
          LessonType.PRIVATE,
          user?.id || "undefined",
          [],
          new StartAndEndTime(lessonStartTime, lessonEndTime),
          []
        );
        await LessonService.createLesson(newLesson, day);
      }
      fetchLessons();
      setModalVisible(false);
    } catch (err) {
      console.error("Error saving lesson:", err);
    }
  };

  const renderLesson = ({ item }: { item: Lesson }) => {
    const status = item.students.length > 0 ? "Active" : "Completed";
    return (
      <CustomCard
        title={`${item.typeLesson} Lesson`}
        description={`Specialties: ${item.specialties.join(", ")}`}
        onPress={() => openEditModal(item)}
        style={styles.card}
      >
        <Text style={styles.lessonStatus}>Status: {status}</Text>
      </CustomCard>
    );
  };

  // Header component showing user info
  const HeaderUserInfo = () => (
    <View style={styles.headerUserInfo}>
      <Text style={styles.userName}>{user?.name || "undefined"} - {user?.phone || "undefined"}</Text>
      <Text style={styles.userDetails}>
        {`Swimming: ${userInstructor?.specialties || "undefined"}\n`}
        {`Availability: ${userInstructor?.availabilities || "undefined"}`}
      </Text>
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>No lessons found.</Text>
        }
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
