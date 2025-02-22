import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../hooks/authContext";
import Lesson from "../../dto/lesson/lesson.dto";
import Instructor from "../../dto/instructor/instructor.dto";
import useLesson from "../../hooks/LessonHooks/useLessons";
import { useInstructors } from "../../hooks/instructorHooks/useInstructors";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../components/Footer";
import Icon from "react-native-vector-icons/FontAwesome";
import styles from "./styles/CalenderScreen.styles";
import CustomModal from "../../components/Modal";
import Student from "../../dto/student/student.dto";
import useAlert from "../../hooks/useAlert";

const HOUR_HEIGHT = 60; // Height per hour
const START_HOUR = 8; // 8 AM
const END_HOUR = 22; // 10 PM
const TOTAL_HOURS = END_HOUR - START_HOUR; // 14 hours
const DAY_WIDTH = 150; // Width per day
const MARGIN = 5; // Margin between lessons
const HOUR_BAR_WIDTH = 50; // Width of the fixed hour bar
const FOOTER_HEIGHT = 60; // Define footer height explicitly

interface LessonWithPosition extends Lesson {
  adjustedWidth: number;
  offsetX: number;
}

const formatSpecialty = (specialty: string): string => {
  const lower = specialty.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const CalendarScreen: React.FC = () => {
  const { user } = useAuth();
  const { getLessonsWithinRange } = useLesson();
  const { getInstructorById, instructors, fetchInstructors } = useInstructors();
  const { showAlert } = useAlert(); // Added useAlert hook
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [userInstructor, setUserInstructor] = useState<Instructor | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [weekRange, setWeekRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(),
  });

  const fetchData = async (start: Date, end: Date) => {
    console.log(`Fetching data for range: ${start} to ${end}`);
    try {
      const fetchedLessons: Lesson[] = await getLessonsWithinRange(start, end);
      const fetchedInstructors: Instructor[] = await fetchInstructors();
      console.log("Fetched lessons:", fetchedLessons);
      console.log("Fetched instructors:", fetchedInstructors);
      setLessons(fetchedLessons);
      setAllInstructors(fetchedInstructors);
      setWeekRange({ start, end });
      showAlert("Lessons and instructors loaded successfully!");
    } catch (error) {
      console.error("Error fetching lessons:", error);
      showAlert("Failed to load lessons. Please try again.");
    }

    if (user?.id && !userInstructor) {
      try {
        console.log(`Fetching instructor for user ID: ${user.id}`);
        const instructor: Instructor = await getInstructorById(user.id);
        console.log("Fetched user instructor:", instructor);
        setUserInstructor(instructor);
        showAlert(`Loaded instructor profile: ${instructor.name}`);
      } catch (error) {
        console.error("Error fetching instructor:", error);
        showAlert("Failed to load your instructor profile.");
      }
    }
  };

  useEffect(() => {
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    sunday.setHours(0, 0, 0, 0);

    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    console.log("Initial week range:", { start: sunday, end: saturday });
    fetchData(sunday, saturday);
  }, [user]);

  const handlePreviousWeek = () => {
    const newStart = new Date(weekRange.start);
    newStart.setDate(newStart.getDate() - 7);
    const newEnd = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + 6);
    newEnd.setHours(23, 59, 59, 999);
    console.log("Navigating to previous week:", { start: newStart, end: newEnd });
    fetchData(newStart, newEnd);
  };

  const handleNextWeek = () => {
    const newStart = new Date(weekRange.start);
    newStart.setDate(newStart.getDate() + 7);
    const newEnd = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + 6);
    newEnd.setHours(23, 59, 59, 999);
    console.log("Navigating to next week:", { start: newStart, end: newEnd });
    fetchData(newStart, newEnd);
  };

  const getInstructorNameById = (id: string): string => {
    if (allInstructors.length > 0) {
      const instructor = allInstructors.findLast((instructor: Instructor) => instructor.id === id);
      return instructor ? instructor.name : "undefined";
    }
    return "undefined";
  };

  const calculateLessonPositions = (): LessonWithPosition[] => {
    console.log("Calculating lesson positions for lessons:", lessons);
    const lessonsByDay: { [dayIndex: number]: Lesson[] } = {};

    lessons.forEach((lesson) => {
      const start = new Date(lesson.startAndEndTime.startTime);
      const dayIndex = Math.floor(
        (start.getTime() - weekRange.start.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (!lessonsByDay[dayIndex]) lessonsByDay[dayIndex] = [];
      lessonsByDay[dayIndex].push(lesson);
    });

    const positionedLessons: LessonWithPosition[] = [];

    Object.keys(lessonsByDay).forEach((dayIndexStr) => {
      const dayIndex = parseInt(dayIndexStr, 10);
      const dayLessons = lessonsByDay[dayIndex];

      dayLessons.sort(
        (a, b) =>
          new Date(a.startAndEndTime.startTime).getTime() -
          new Date(b.startAndEndTime.startTime).getTime()
      );

      const overlapGroups: Lesson[][] = [];
      dayLessons.forEach((lesson) => {
        const start = new Date(lesson.startAndEndTime.startTime).getTime();
        const end = new Date(lesson.startAndEndTime.endTime).getTime();

        let placed = false;
        for (const group of overlapGroups) {
          const overlaps = group.some((other) => {
            const otherStart = new Date(other.startAndEndTime.startTime).getTime();
            const otherEnd = new Date(other.startAndEndTime.endTime).getTime();
            return start < otherEnd && end > otherStart;
          });
          if (overlaps) {
            group.push(lesson);
            placed = true;
            break;
          }
        }
        if (!placed) overlapGroups.push([lesson]);
      });

      overlapGroups.forEach((group) => {
        const count = group.length;
        const totalMargin = (count - 1) * MARGIN;
        const adjustedWidth = (DAY_WIDTH - totalMargin) / count;

        group.forEach((lesson, index) => {
          positionedLessons.push({
            ...lesson,
            adjustedWidth,
            offsetX: index * (adjustedWidth + MARGIN),
          });
        });
      });
    });

    console.log("Positioned lessons:", positionedLessons);
    return positionedLessons;
  };

  const renderStudents = (students: Student[]) => {
    if (!students || students.length === 0) {
      return <Text style={styles.noStudentsText}>No students enrolled.</Text>;
    }

    return (
      <ScrollView style={styles.studentTableContainer} horizontal>
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: 100 }]}>Phone</Text>
            <Text style={[styles.tableHeaderCell, { width: 150 }]}>Name</Text>
            <Text style={[styles.tableHeaderCell, { width: 200 }]}>Preferences</Text>
          </View>
          {students.map((student, index) => (
            <View key={student.id || index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: 100 }]}>{student.id}</Text>
              <Text style={[styles.tableCell, { width: 150 }]}>{student.name}</Text>
              <Text style={[styles.tableCell, { width: 200 }]}>
                {student.preferences.map(formatSpecialty).join(", ")}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>📅 Schedule Your Lessons</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.navButton} onPress={handlePreviousWeek}>
          <Icon name="arrow-left" size={18} color="#FFF" />
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={handleNextWeek}>
          <Text style={styles.buttonText}>Next</Text>
          <Icon name="arrow-right" size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        {/* Fixed Hour Bar on the Left */}
        <View style={styles.hourBar}>
          {Array.from({ length: TOTAL_HOURS }).map((_, hourIndex) => (
            <View key={hourIndex} style={styles.hourBarMarker}>
              <Text style={styles.hourBarText}>
                {START_HOUR + hourIndex}:00
              </Text>
            </View>
          ))}
        </View>

        {/* Scrollable Gantt Chart */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ height: TOTAL_HOURS * HOUR_HEIGHT + FOOTER_HEIGHT, paddingBottom: FOOTER_HEIGHT }}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            horizontal
            contentContainerStyle={{ width: DAY_WIDTH * 7 }}
            showsHorizontalScrollIndicator={false}
          >
            <View style={[styles.calendarContainer, { marginLeft: HOUR_BAR_WIDTH }]}>
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <View
                  key={dayIndex}
                  style={[
                    styles.dayColumn,
                    { left: dayIndex * DAY_WIDTH },
                    dayIndex % 2 === 0 ? styles.dayColumnEven : styles.dayColumnOdd,
                  ]}
                >
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayText}>
                      {new Date(
                        weekRange.start.getTime() + dayIndex * 86400000
                      ).toLocaleDateString("en-US", { weekday: "short" })}
                    </Text>
                    <Text style={styles.dateText}>
                      {new Date(
                        weekRange.start.getTime() + dayIndex * 86400000
                      ).getDate()}
                    </Text>
                  </View>
                </View>
              ))}

              {calculateLessonPositions().map((lesson) => {
                const start = new Date(lesson.startAndEndTime.startTime);
                const end = new Date(lesson.startAndEndTime.endTime);
                const dayIndex = Math.floor(
                  (start.getTime() - weekRange.start.getTime()) / (1000 * 60 * 60 * 24)
                );
                const startHour = start.getHours() + start.getMinutes() / 60;
                const endHour = end.getHours() + end.getMinutes() / 60;

                if (startHour >= END_HOUR || endHour <= START_HOUR) {
                  return null;
                }

                const adjustedStartHour = Math.max(startHour, START_HOUR);
                const adjustedEndHour = Math.min(endHour, END_HOUR);
                const top = (adjustedStartHour - START_HOUR) * HOUR_HEIGHT;
                const height = (adjustedEndHour - adjustedStartHour) * HOUR_HEIGHT;
                const left = dayIndex * DAY_WIDTH + lesson.offsetX;

                console.log(`Rendering lesson ${lesson.lessonId}:`, {
                  instructorId: lesson.instructorId,
                  userInstructorId: userInstructor?.id,
                  color: lesson.instructorId === userInstructor?.id ? "#6C63FF" : "#4CAF50",
                });

                return (
                  <TouchableOpacity
                    key={lesson.lessonId}
                    style={[
                      styles.lessonBar,
                      {
                        left,
                        top,
                        width: lesson.adjustedWidth,
                        height,
                        backgroundColor:
                          lesson.instructorId === userInstructor?.id ? "#6C63FF" : "#4CAF50",
                      },
                    ]}
                    onPress={() => {
                      console.log("Selected lesson:", lesson);
                      setSelectedLesson(lesson);
                      setModalVisible(true);
                    }}
                  >
                    <View style={styles.lessonContent}>
                      <Text style={styles.lessonInstructor} numberOfLines={1}>
                        <Icon name="user" size={12} color="#FFF" /> {getInstructorNameById(lesson.instructorId)}
                      </Text>
                      <Text style={styles.lessonType} numberOfLines={1}>
                        {formatSpecialty(lesson.typeLesson)}
                      </Text>
                      <Text style={styles.lessonTime} numberOfLines={1}>
                        {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                        {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </ScrollView>
      </View>

      {selectedLesson && (
        <CustomModal
          title={`${getInstructorNameById(selectedLesson.instructorId)} - ${formatSpecialty(selectedLesson.typeLesson)}`}
          visible={modalVisible}
          onClose={() => {
            console.log("Closing modal");
            setSelectedLesson(null);
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {formatSpecialty(selectedLesson.typeLesson)} Lesson
            </Text>
            <View style={styles.detailRow}>
              <Icon name="user" size={18} color="#6C63FF" style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Instructor:</Text>
              <Text style={styles.detailValue}>{getInstructorNameById(selectedLesson.instructorId)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="tag" size={18} color="#6C63FF" style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Lesson Type:</Text>
              <Text style={styles.detailValue}>{formatSpecialty(selectedLesson.typeLesson)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="swimmer" size={18} color="#6C63FF" style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Specialties:</Text>
              <Text style={styles.detailValue}>
                {selectedLesson.specialties.map(formatSpecialty).join(", ")}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="clock-o" size={18} color="#6C63FF" style={styles.detailIcon} />
              <Text style={styles.detailLabel}>Start Time:</Text>
              <Text style={styles.detailValue}>
                {new Date(selectedLesson.startAndEndTime.startTime).toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="clock-o" size={18} color="#6C63FF" style={styles.detailIcon} />
              <Text style={styles.detailLabel}>End Time:</Text>
              <Text style={styles.detailValue}>
                {new Date(selectedLesson.startAndEndTime.endTime).toLocaleString()}
              </Text>
            </View>
            {selectedLesson.students.length !== 0 ? (
              <>
                <Text style={styles.sectionTitle}>Students:</Text>
                {renderStudents(selectedLesson.students)}
              </>
            ) : (
              <Text style={{ paddingTop: 5 }}>No Students Assigned To Lesson!</Text>
            )}
          </View>
        </CustomModal>
      )}

      <View style={styles.footerContainer}>
        <Footer navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;