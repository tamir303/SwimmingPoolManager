import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../hooks/authContext";
import { useStudent } from "../../hooks/studentHooks/useStudent";
import styles from "./styles/StudentCalendarScreen.styles";
import Footer from "../../components/Footer";
import Icon from "react-native-vector-icons/FontAwesome";
import Lesson from "../../dto/lesson/lesson.dto";
import { useNavigation } from "@react-navigation/native";
import useLesson from "../../hooks/LessonHooks/useLessons";
import Student from "../../dto/student/student.dto";
import { useInstructors } from "../../hooks/instructorHooks/useInstructors";
import useAlert from "../../hooks/useAlert";
import Instructor from "../../dto/instructor/instructor.dto";
import CustomModal from "../../components/Modal";

const HOUR_HEIGHT = 60;
const START_HOUR = 8;
const END_HOUR = 22;
const TOTAL_HOURS = END_HOUR - START_HOUR;
const DAY_WIDTH = 150;
const MARGIN = 5;
const HOUR_BAR_WIDTH = 50;
const FOOTER_HEIGHT = 60;

interface LessonWithPosition extends Lesson {
  adjustedWidth: number;
  offsetX: number;
  status: "myLesson" | "available" | "other"; // Status for coloring
}

const formatSpecialty = (specialty: string): string => {
  const lower = specialty.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const StudentCalendarScreen: React.FC = () => {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { fetchStudent, fetchAvailableLessons, fetchMyLessons } = useStudent();
  const { getLessonsWithinRange } = useLesson();
  const { fetchInstructors } = useInstructors();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [calendarLessons, setCalendarLessons] = useState<LessonWithPosition[]>([]);
  const [userStudent, setUserStudent] = useState<Student | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([]);
  const [myLessons, setMyLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [weekRange, setWeekRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(),
  });

  const fetchInitialData = async (start: Date, end: Date) => {
    try {
      const fetchedLessons: Lesson[] = await getLessonsWithinRange(start, end);
      const fetchedInstructors: Instructor[] = await fetchInstructors();
      setAllInstructors(fetchedInstructors)
      setLessons(fetchedLessons);
      setWeekRange({ start, end });
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }

    if (user?.id && !userStudent) {
      try {
        const fetchedUserStudent = await fetchStudent(user.id)
        setUserStudent(fetchedUserStudent)

        const fetchedAvailableLessons: Lesson[] = await fetchAvailableLessons(user.id)
        setAvailableLessons(fetchedAvailableLessons)

        const fetchedMyLessons: Lesson[] = await fetchMyLessons(user.id)
        setMyLessons(fetchedMyLessons)
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    }
  };

  // Fetch initial student and instructor data
  useEffect(() => {
    const today = new Date();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    sunday.setHours(0, 0, 0, 0);

    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    fetchInitialData(sunday, saturday);
  }, [user]);

  const handlePreviousWeek = () => {
    const newStart = new Date(weekRange.start);
    newStart.setDate(newStart.getDate() - 7);
    const newEnd = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + 6);
    newEnd.setHours(23, 59, 59, 999);
    fetchInitialData(newStart, newEnd);
  };

  const handleNextWeek = () => {
    const newStart = new Date(weekRange.start);
    newStart.setDate(newStart.getDate() + 7);
    const newEnd = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + 6);
    newEnd.setHours(23, 59, 59, 999);
    fetchInitialData(newStart, newEnd);
  };

  // Update calendarLessons with status based on myLessons and availableLessons
  useEffect(() => {
    const updatedLessons = lessons.map((lesson) => {
      const isMyLesson = myLessons.some((ml) => ml.lessonId === lesson.lessonId);
      const isAvailable = availableLessons.some((al) => al.lessonId === lesson.lessonId);

      // Prioritize "myLesson" over "available"
      let status: "myLesson" | "available" | "other" = "other"; // Default to green
      if (isMyLesson) {
        status = "myLesson"; // Purple
      } else if (isAvailable) {
        status = "available"; // Orange
      }

      return { ...lesson, status };
    });

    const positionedLessons = calculateLessonPositions(updatedLessons);
    setCalendarLessons(positionedLessons);
  }, [lessons, myLessons, availableLessons, weekRange]);

  const calculateLessonPositions = (lessons: any[]): LessonWithPosition[] => {
    const lessonsByDay: { [dayIndex: number]: any[] } = {};

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

      const overlapGroups: any[][] = [];
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
    return positionedLessons;
  };

  const getInstructorNameById = (id: string): string => {
    if (allInstructors.length > 0) {
      const instructor = allInstructors.findLast((instructor: Instructor) => instructor.id === id);
      return instructor ? instructor.name : "undefined";
    }
    return "undefined";
  };

  const getLessonColor = (lesson: LessonWithPosition): string => {
    switch (lesson.status) {
      case "myLesson":
        return "#6C63FF"; // Purple for my lessons
      case "available":
        return "#FFA500"; // Orange for available lessons
      case "other":
        return "#2ECC71"; // Green for all other lessons
      default:
        return "#2ECC71"; // Fallback to green
    }
  };

  const renderCalendarLesson = (lesson: LessonWithPosition) => {
    const start = new Date(lesson.startAndEndTime.startTime);
    const end = new Date(lesson.startAndEndTime.endTime);
    const dayIndex = Math.floor(
      (start.getTime() - weekRange.start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const startHour = start.getHours() + start.getMinutes() / 60;
    const endHour = end.getHours() + end.getMinutes() / 60;
    if (startHour >= END_HOUR || endHour <= START_HOUR) return null;

    const adjustedStartHour = Math.max(startHour, START_HOUR);
    const adjustedEndHour = Math.min(endHour, END_HOUR);
    const top = (adjustedStartHour - START_HOUR) * HOUR_HEIGHT;
    const height = (adjustedEndHour - adjustedStartHour) * HOUR_HEIGHT;
    const left = dayIndex * DAY_WIDTH + lesson.offsetX;

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
            backgroundColor: getLessonColor(lesson),
          },
        ]}
        onPress={() => {
            console.log("Selected lesson:", lesson);
            setSelectedLesson(lesson);
            setModalVisible(true);
          }
        }
        activeOpacity={0.8}
      >
        <View style={styles.lessonContent}>
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text style={styles.lessonInstructor} numberOfLines={1}>
              <Icon name="user" size={12} color="#FFF" /> {getInstructorNameById(lesson.instructorId)}
            </Text>
            <Text style={styles.lessonType} numberOfLines={1}>
              {formatSpecialty(lesson.typeLesson) || "Lesson"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon
              name="clock-o"
              size={12}
              color="#FFF"
              style={{ marginRight: 3 }}
            />
            <Text style={styles.lessonTime} numberOfLines={1}>
              {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
              {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStudents = (students: Student[]) => {
    if (!students || students.length === 0) {
      return <Text style={styles.noStudentsText}>No students enrolled.</Text>;
    }

    return (
        <View style={styles.studentTableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: 100 }]}>Phone</Text>
            <Text style={[styles.tableHeaderCell, { width: 150 }]}>Name</Text>
          </View>
          <ScrollView style={{ paddingBottom: 20 }}>
            {students.map((student, index) => (
              <View key={student.id || index} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: 100 }]}>{student.id}</Text>
                <Text style={[styles.tableCell, { width: 150 }]}>{student.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            height: TOTAL_HOURS * HOUR_HEIGHT + FOOTER_HEIGHT,
            paddingBottom: FOOTER_HEIGHT,
          }}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            horizontal
            contentContainerStyle={{ width: DAY_WIDTH * 7 }}
            showsHorizontalScrollIndicator={false}
          >
            <View style={[styles.hourBar, { marginRight: -45 }]}>
              {Array.from({ length: TOTAL_HOURS }).map((_, hourIndex) => (
                <View key={hourIndex} style={styles.hourBarMarker}>
                  <Text style={styles.hourBarText}>{START_HOUR + hourIndex}:00</Text>
                </View>
              ))}
            </View>

            <View style={[styles.calendarContainer, { marginLeft: HOUR_BAR_WIDTH }]}>
              {Array.from({ length: 7 }).map((_, dayIndex) => (
                <View key={dayIndex} style={[styles.dayColumn, { left: dayIndex * DAY_WIDTH }]}>
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
              {calendarLessons.map(renderCalendarLesson)}
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

export default StudentCalendarScreen;