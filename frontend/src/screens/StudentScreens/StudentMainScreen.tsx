import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useStudent } from "../../hooks/studentHooks/useStudent";
import { useAuth } from "../../hooks/authContext";
import styles from "./styles/StudentMainScreen.styles";
import Footer from "../../components/Footer";
import Icon from "react-native-vector-icons/FontAwesome";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Student from "../../dto/student/student.dto";
import { useInstructors } from "../../hooks/instructorHooks/useInstructors";
import Instructor from "../../dto/instructor/instructor.dto";
import Lesson from "../../dto/lesson/lesson.dto";
import CustomCard from "../../components/Card";
import CustomModal from "../../components/Modal";
import useAlert from "../../hooks/useAlert";

type TabOption = "MY_LESSONS" | "AVAILABLE_LESSONS";

const formatSpecialty = (specialty: string): string => {
  const lower = specialty.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const StudentMainScreen: React.FC = () => {
  const {
    fetchMyLessons,
    fetchAvailableLessons,
    fetchStudent,
    joinLesson,
    leaveLesson,
  } = useStudent();
  const { fetchInstructors } = useInstructors();
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<TabOption>("MY_LESSONS");
  const [userStudent, setUserStudent] = useState<Student | null>(null);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [allMyLessons, setAllMyLessons] = useState<Lesson[]>([]);
  const [allAvailableLessons, setAllAvailableLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (user && user.id && isFocused) {
        try {
          console.log(`Fetching student data for user ID: ${user.id}`);
          const student: Student = await fetchStudent(user.id);
          setUserStudent(student);
          console.log("Student data fetched successfully:", student);
        } catch (error) {
          console.error("Error fetching student data:", error);
          showAlert("Failed to fetch student data. Please try again.");
        }
      } else {
        console.log("User or user ID missing, or screen not focused.");
      }
    };

    fetchStudentData();
  }, [user, isFocused]);

  useEffect(() => {
    const fetchLessonData = async () => {
      if (user && user.id) {
        try {
          console.log(`Fetching lessons for student ID: ${user.id}`);
          const mylessons =  await fetchMyLessons(user.id);
          const availablelessons =  await fetchAvailableLessons(user.id);
          setAllMyLessons(mylessons);
          setAllAvailableLessons(availablelessons);
          console.log("My Lessons:", allMyLessons);
          console.log("Available Lessons:", allAvailableLessons);
        } catch (error) {
          console.error("Error fetching lessons:", error);
          showAlert("Failed to fetch lessons. Please try again.");
        }
      } else {
        console.log("No userStudent available to fetch lessons.");
      }
    };

    fetchLessonData();
  }, [user]);

  useEffect(() => {
    const fetchInstructorsData = async () => {
      if (user && user.id) {
        try {
          console.log("Fetching instructors...");
          const instructors: Instructor[] = await fetchInstructors();
          setAllInstructors(instructors);
          console.log("Instructors fetched successfully:", instructors);
        } catch (error) {
          console.error("Error fetching instructors:", error);
          showAlert("Failed to fetch instructors. Please try again.");
        }
      } else {
        console.log("No userStudent available to fetch instructors.");
      }
    };

    fetchInstructorsData();
  }, [user]);

  const getInstructorNameById = (id: string): string => {
    if (allInstructors.length > 0) {
      const instructor = allInstructors.findLast(
        (instructor: Instructor) => instructor.id === id
      );
      return instructor ? instructor.name : "undefined";
    }
    console.log("No instructors available to find name for ID:", id);
    return "undefined";
  };

  const handleLessonAction = async () => {
    try {
      if (userStudent?.id && selectedLesson?.lessonId) {
        console.log(`Handling lesson action for student ID: ${userStudent.id}, lesson ID: ${selectedLesson.lessonId}`);
        if (activeTab === "MY_LESSONS") {
          console.log("Attempting to leave lesson...");
          await leaveLesson(userStudent.id, selectedLesson.lessonId);
          console.log("Lesson left successfully.");
          showAlert("You have successfully left the lesson!");
          setAllMyLessons((prev) =>
            prev.filter((lesson) => lesson.lessonId !== selectedLesson.lessonId)
          );
        } else {
          console.log("Attempting to join lesson...");
          await joinLesson(userStudent.id, selectedLesson.lessonId);
          console.log("Lesson joined successfully.");
          showAlert("You have successfully joined the lesson!");
          setAllAvailableLessons((prev) =>
            prev.filter((lesson) => lesson.lessonId !== selectedLesson.lessonId)
          );
          setAllMyLessons((prev) => [...prev, selectedLesson]);
        }
        setIsModalVisible(false); // Close modal after action
      } else {
        console.log("Missing student ID or lesson ID.");
        showAlert("Student or lesson ID is missing!");
      }
    } catch (error) {
      console.error(`Error during lesson action (${activeTab}):`, error);
      showAlert(`Failed to ${activeTab === "MY_LESSONS" ? "leave" : "join"} the lesson. Please try again.`);
    }
  };

  // Render individual lesson item
  const renderLesson = ({ item }: { item: Lesson }) => {
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
      <CustomCard
        style={styles.card}
        title={`${item.typeLesson} Lesson`}
        onPress={() => {
          console.log("Lesson selected:", item);
          setSelectedLesson(item);
          setIsModalVisible(true);
        }}
      >
        <Text style={styles.cardTitle}>{formatSpecialty(item.typeLesson)}</Text>
        <View style={styles.instructorRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.cardText}>Instructor: {instructorName}</Text>
        </View>
        <Text style={styles.cardText}>
          <Icon name="swimmer" size={18} color="#7F8C8D" /> Specialties:{" "}
          {item.specialties.map(formatSpecialty).join(", ")}
        </Text>
        <View style={styles.lessonStatusContainer}>
          <Text style={styles.lessonTime}>
            <Icon name="clock-o" size={14} color="#7F8C8D" /> {date} | {startTime} - {endTime}
          </Text>
        </View>
      </CustomCard>
    );
  };

  const HeaderUserInfo = () => (
    <View style={styles.headerUserInfo}>
      {userStudent ? (
        <View>
          <Text style={styles.userName}>
            <Icon name="user" size={20} color="#6C63FF" /> {userStudent.name}
          </Text>
          {userStudent.preferences.length > 0 ? (
            <View>
              <Text style={styles.sectionHeader}>Specialties</Text>
              <Text style={styles.sectionText}>
                {userStudent.preferences.map(formatSpecialty).join(", ")}
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HeaderUserInfo />
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === "MY_LESSONS" && styles.activeToggleButton,
            ]}
            onPress={() => {
              console.log("Switching to MY_LESSONS tab");
              setActiveTab("MY_LESSONS");
            }}
          >
            <Icon
              name="book"
              size={16}
              color={activeTab === "MY_LESSONS" ? "#FFF" : "#666"}
              style={{ marginRight: 5 }}
            />
            <Text
              style={[
                styles.toggleButtonText,
                activeTab === "MY_LESSONS" && styles.activeToggleButtonText,
              ]}
            >
              My Lessons
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeTab === "AVAILABLE_LESSONS" && styles.activeToggleButton,
            ]}
            onPress={() => {
              console.log("Switching to AVAILABLE_LESSONS tab");
              setActiveTab("AVAILABLE_LESSONS");
            }}
          >
            <Icon
              name="plus"
              size={16}
              color={activeTab === "AVAILABLE_LESSONS" ? "#FFF" : "#666"}
              style={{ marginRight: 5 }}
            />
            <Text
              style={[
                styles.toggleButtonText,
                activeTab === "AVAILABLE_LESSONS" && styles.activeToggleButtonText,
              ]}
            >
              Available Lessons
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={activeTab === "MY_LESSONS" ? allMyLessons : allAvailableLessons}
          renderItem={renderLesson}
          keyExtractor={(item) => item.lessonId || Math.random().toString()}
          ListEmptyComponent={<Text style={styles.emptyText}>No lessons found.</Text>}
          contentContainerStyle={styles.listContainer}
        />

        <CustomModal
          visible={isModalVisible}
          title={selectedLesson ? `${selectedLesson.typeLesson} Lesson Details` : ""}
          onClose={() => {
            console.log("Closing modal");
            setIsModalVisible(false);
          }}
        >
          {selectedLesson && (
            <View>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Type: {formatSpecialty(selectedLesson.typeLesson)}
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Specialties: {selectedLesson.specialties.map(formatSpecialty).join(", ")}
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Instructor: {getInstructorNameById(selectedLesson.instructorId)}
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Date: {new Date(selectedLesson.startAndEndTime.startTime).toLocaleDateString()}
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 5 }}>
                Time:{" "}
                {new Date(selectedLesson.startAndEndTime.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(selectedLesson.startAndEndTime.endTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              {activeTab === "MY_LESSONS" ? (
                <TouchableOpacity
                  onPress={handleLessonAction}
                  style={{
                    marginTop: 20,
                    padding: 10,
                    backgroundColor: "#FF6347",
                    borderRadius: 5,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Leave Lesson</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleLessonAction}
                  style={{
                    marginTop: 20,
                    padding: 10,
                    backgroundColor: "#4CAF50",
                    borderRadius: 5,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>Join Lesson</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </CustomModal>

        <Footer navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default StudentMainScreen;