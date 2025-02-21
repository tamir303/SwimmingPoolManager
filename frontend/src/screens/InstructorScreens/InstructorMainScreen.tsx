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
import { DaysOfWeek, getDayIndexInMonth } from "../../utils/days-week-enum.utils";
import useAlert from "../../hooks/useAlert";
import useLesson from "../../hooks/LessonHooks/useLessons";
import Icon from "react-native-vector-icons/FontAwesome";
import { useInstructors } from "../../hooks/instructorHooks/useInstructors";
import { now } from "lodash";

type LessonTab = "MY" | "COMPLETED";
const days: DaysOfWeek[] = Object.values(require("../../utils/days-week-enum.utils").DaysOfWeek);

const formatSpecialty = (specialty: string): string => {
  const lower = specialty.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const formatDate = (date: Date): Date => {
  const fdate = new Date(date)
  fdate.setSeconds(0)
  fdate.setMilliseconds(0)
  return fdate
}

const MainScreen: React.FC = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { createLesson, updateLesson, getLessonsWithinRange, deleteLessonById, getLessonById, error } = useLesson();
  const { fetchInstructors, getInstructorById ,instructors } = useInstructors()

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([])
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [activeTab, setActiveTab] = useState<LessonTab>("MY");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonType, setLessonType] = useState<LessonType | null>(null);
  const [lessonStartTime, setLessonStartTime] = useState<Date | null>(null);
  const [lessonEndTime, setLessonEndTime] = useState<Date | null>(null);
  const [selectedLessonDay, setSelectedLessonDay] = useState<DaysOfWeek | null>(null);
  const [userInstructor, setUserInstructor] = useState<Instructor | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id && isFocused) {
        await fetchLessons();
        const instructorData = await getInstructorById(user.id);
        setUserInstructor(instructorData);

        const fetchedInstructors = await fetchInstructors();
        setAllInstructors(fetchedInstructors)
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
      const myLessons = lessons.filter((lesson) => lesson.instructorId === user?.id);
      setAllLessons(myLessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      showAlert("Failed to fetch lessons");
    }
  };

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

  const openCreateModal = () => {
    setSelectedLesson(null);
    setLessonType(null);
    setLessonStartTime(new Date());
    setLessonEndTime(new Date());
    setModalVisible(true);
  };

  const openEditModal = (lesson: Lesson) => {
    if (new Date(lesson.startAndEndTime.endTime).getTime() < Date.now()) return; // Edit only non completed lessons!
    setSelectedLesson(lesson);
    setLessonType(lesson.typeLesson);
    setLessonStartTime(new Date(lesson.startAndEndTime.startTime));
    setLessonEndTime(new Date(lesson.startAndEndTime.endTime));
    setModalVisible(true);
  };

  const adjustTime = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
  };

  const handleSaveLesson = async () => {
    if (!lessonType || !lessonStartTime || !lessonEndTime || !userInstructor || !selectedLessonDay) {
      showAlert("One or more lessons fields are empty!");
      return;
    }

    const day: number = getDayIndexInMonth(Object.values(DaysOfWeek).indexOf(selectedLessonDay)) + 1;
    const adjustStartTime: Date = adjustTime(lessonStartTime);
    const adjustEndTime: Date = adjustTime(lessonEndTime);
    adjustStartTime.setDate(day);
    adjustEndTime.setDate(day);

    try {
      if (selectedLesson) {
        await updateLesson(selectedLesson.lessonId || "", {
          ...selectedLesson,
          typeLesson: lessonType,
          startAndEndTime: new StartAndEndTime(adjustStartTime, adjustEndTime),
        });
        showAlert("Lesson Updated!");
      } else {
        const newLesson = new NewLesson(
          lessonType,
          userInstructor.id,
          userInstructor.specialties,
          new StartAndEndTime(adjustStartTime, adjustEndTime),
          []
        );
        await createLesson(newLesson, day);
        showAlert("Lesson Created!");
      }
      fetchLessons();
      setModalVisible(false);
    } catch (err) {
      console.error("Error saving lesson:", err);
      showAlert("Failed to save lesson!");
    }
  };

  const getInstructorNameById = (id: string): string => {
    console.log(allInstructors)
    if (allInstructors.length > 0) {
      const instructor = allInstructors.findLast((instructor: Instructor) => instructor.id === id)
      return instructor ? instructor.name : "undefined"
    }

    return "undefined"
  }

  const renderLesson = ({ item }: { item: Lesson }) => {
    const status = new Date(item.startAndEndTime.endTime).getTime() < Date.now() ? "Completed" : "Active";
    const statusColor = status === "Active" ? "#4CAF50" : "#F44336";
    const startTime = new Date(item.startAndEndTime.startTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const endTime = new Date(item.startAndEndTime.endTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = new Date(item.startAndEndTime.startTime).toLocaleDateString();
    const instructorName = getInstructorNameById(item.instructorId);
    const initial = instructorName.charAt(0).toUpperCase();
  
    return (
      <TouchableOpacity activeOpacity={0.9} onPress={() => openEditModal(item)}>
        <CustomCard style={styles.card} title={`${item.typeLesson} Lesson`} onPress={() => openEditModal(item)}>
          <Text style={styles.cardTitle}>{formatSpecialty(item.typeLesson)}</Text>
          <View style={styles.instructorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <Text style={styles.cardText}>Instructor: {instructorName}</Text>
          </View>
          <Text style={styles.cardText}>
            Specialties: {item.specialties.map(formatSpecialty).join(", ")}
          </Text>
          <View style={styles.lessonStatusContainer}>
            <View style={[styles.lessonStatusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.lessonStatusText}>{status}</Text>
            </View>
            <Text style={styles.lessonTime}>
              <Icon name="clock-o" size={14} color="#7F8C8D" /> {date} | {startTime} - {endTime}
            </Text>
          </View>
        </CustomCard>
      </TouchableOpacity>
    );
  };

  const HeaderUserInfo = () => (
    <View style={styles.headerUserInfo}>
      {userInstructor ? (
        <View>
          <Text style={styles.userName}>
            <Icon name="user" size={20} color="#6C63FF" /> {userInstructor.name}
          </Text>
          {userInstructor.availabilities.every((availability) => availability === -1) ? (
            <Text style={styles.emptyText}>No Availabilities Set Yet!</Text>
          ) : (
            <View>
              <Text style={styles.sectionHeader}>
                <Icon name="calendar" size={16} color="#6C63FF" /> Availabilities
              </Text>
              {userInstructor.availabilities.map((availability, idx) => {
                if (availability === -1) return null;
                const day = Object.values(DaysOfWeek)[idx];
                return (
                  <Text key={day} style={styles.sectionText}>
                    {day}: {new Date(formatDate(availability.startTime)).toLocaleTimeString()} -{" "}
                    {new Date(formatDate(availability.endTime)).toLocaleTimeString()}
                  </Text>
                );
              })}
            </View>
          )}
          {userInstructor.specialties.length > 0 ? (
            <View>
              <Text style={styles.sectionHeader}>
                Specialties
              </Text>
              <Text style={styles.sectionText}>
                {userInstructor.specialties.map(formatSpecialty).join(", ")}
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>No Specialties Set Yet!</Text>
          )}
        </View>
      ) : (
        <Text style={styles.emptyText}>Loading current settings...</Text>
      )}
    </View>
  );

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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <HeaderUserInfo />
        <View style={styles.purpleLine} />
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

        <FlatList
          data={filteredLessons}
          keyExtractor={(item) => item.lessonId || Math.random().toString()}
          renderItem={renderLesson}
          ListEmptyComponent={<Text style={styles.emptyText}>No lessons found.</Text>}
          contentContainerStyle={styles.listContainer}
        />

        <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
          <Icon name="plus" size={24} color="#FFF" />
        </TouchableOpacity>

        <CustomModal
          visible={modalVisible}
          title={selectedLesson ? "Edit Lesson" : "Create Lesson"}
          onClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedLesson ? "Edit Lesson" : "Create Lesson"}</Text>
            <Text style={styles.modalLabel}>Select Lesson Day:</Text>
            {renderLessonDayPicker()}
            <Text style={styles.modalLabel}>Select Lesson Type:</Text>
            <RadioButton.Group
              onValueChange={(value) => setLessonType(value as LessonType)}
              value={lessonType || "undefined"}
            >
              {Object.values(LessonType).map((type) => (
                <View key={type} style={styles.option}>
                  <RadioButton value={type} color="#6C63FF" />
                  <Text style={styles.optionText}>{formatSpecialty(type.toString())}</Text>
                </View>
              ))}
            </RadioButton.Group>
            <Text style={styles.modalLabel}>Select Time:</Text>
            <View style={styles.timePickerContainer}>
              <TimePicker
                label="Start Time"
                onTimeSelected={(time) => setLessonStartTime(time)}
              />
              <TimePicker
                label="End Time"
                onTimeSelected={(time) => setLessonEndTime(time)}
              />
            </View>
            <Button mode="contained" onPress={handleSaveLesson} style={styles.saveButton}>
              Save Lesson
            </Button>
          </View>
        </CustomModal>

        <Footer navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;