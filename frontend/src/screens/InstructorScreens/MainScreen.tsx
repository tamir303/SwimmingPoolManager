import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper";
import LessonService from "../../services/lesson.service";
import Lesson from "../../dto/lesson/lesson.dto";
import CustomModal from "../../components/Modal";
import CustomCard from "../../components/Card";
import { useAuth } from "../../hooks/authContext";
import styles from "./styles/MainScreen.styles"
import StartAndEndTime from "../../dto/instructor/start-and-end-time.dto";
import TimePicker from "../../components/TimePicker";
import NewLesson from "../../dto/lesson/new-lesson.dto";
import { LessonType } from "../../utils/lesson-enum.utils";

const MainScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Lessons list
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [searchText, setSearchText] = useState("");

  // Modal state for create/edit lesson
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Fields for lesson creation/editing
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonStartTime, setLessonStartTime] = useState<Date | null>(null);
  const [lessonEndTime, setLessonEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (user && isFocused) {
      fetchLessons();
    }
  }, [user, isFocused]);

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredLessons(allLessons);
    } else {
      const filtered = allLessons.filter((lesson) =>
        lesson.typeLesson.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredLessons(filtered);
    }
  }, [searchText, allLessons]);

  const fetchLessons = async () => {
    try {
      const start = new Date();
      start.setDate(start.getDate() - 30);
      const end = new Date();
      end.setDate(end.getDate() + 30);
      const lessons = await LessonService.getLessonsWithinRange(start, end);
      // Only show lessons created by this instructor
      const myLessons = lessons.filter(
        (lesson) => lesson.instructorId === user?.id
      );
      setAllLessons(myLessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  const openCreateModal = () => {
    setSelectedLesson(null);
    setLessonTitle("");
    setLessonStartTime(null);
    setLessonEndTime(null);
    setModalVisible(true);
  };

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
    try {
      if (!lessonTitle || !lessonStartTime || !lessonEndTime) {
        console.log("Please fill all fields");
        return;
      }
      
      if (selectedLesson) {
        await LessonService.updateLesson(selectedLesson.lessonId || "", {
          ...selectedLesson,
          typeLesson: lessonTitle as LessonType,
          startAndEndTime: new StartAndEndTime(lessonStartTime, lessonEndTime),
        });
      } else {
        // Create a new lesson
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

  // Render a lesson card
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Lessons</Text>
        <TouchableOpacity onPress={fetchLessons}>
          <Text style={styles.refreshIcon}>⟳</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search lessons..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
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
        <Button mode="contained" style={styles.createButton} onPress={openCreateModal}>
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
          <TextInput
            style={styles.modalInput}
            placeholder="Lesson Type (e.g., PRIVATE)"
            placeholderTextColor="#777"
            value={lessonTitle}
            onChangeText={setLessonTitle}
          />
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
          <Button mode="contained" onPress={handleSaveLesson} style={styles.saveButton}>
            Save Lesson
          </Button>
        </View>
      </CustomModal>
    </View>
  );
};

export default MainScreen;