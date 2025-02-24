import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { useAuth } from "../../hooks/authContext";
import Lesson from "../../dto/lesson/lesson.dto";
import Instructor from "../../dto/instructor/instructor.dto";
import useLesson from "../../hooks/LessonHooks/useLessons";
import { useInstructors } from "../../hooks/instructorHooks/useInstructors";
import { useNavigation } from "@react-navigation/native";
import Footer from "../../components/Footer";
import Icon from "react-native-vector-icons/FontAwesome";
import styles, {
  HOUR_HEIGHT,
  START_HOUR,
  END_HOUR,
  TOTAL_HOURS,
  HOUR_BAR_WIDTH,
  FOOTER_HEIGHT,
} from "./styles/CalenderScreen.styles"; // Removed DAY_WIDTH from static import
import CustomModal from "../../components/Modal";
import Student from "../../dto/student/student.dto";
import useAlert from "../../hooks/useAlert";

const MARGIN = 5;

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
  const { showAlert } = useAlert();
  const navigation = useNavigation();

  // State for dynamic dimensions
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);

  // Calculate DAY_WIDTH dynamically based on screen width
  const DAY_WIDTH = Math.floor((screenWidth - HOUR_BAR_WIDTH) / 3); // Show ~3 days at a time

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [allInstructors, setAllInstructors] = useState<Instructor[]>([]);
  const [userInstructor, setUserInstructor] = useState<Instructor | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [weekRange, setWeekRange] = useState<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(),
  });

  // Update screen width on orientation change
  useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(Dimensions.get("window").width);
    };

    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove(); // Cleanup listener
  }, []);

  const fetchData = async (start: Date, end: Date) => {
    try {
      const fetchedLessons: Lesson[] = await getLessonsWithinRange(start, end);
      const fetchedInstructors: Instructor[] = await fetchInstructors();
      setLessons(fetchedLessons);
      setAllInstructors(fetchedInstructors);
      setWeekRange({ start, end });
    } catch (error) {
      showAlert(`Failed to load lessons. ${error?.response.data.error || "Internal Error!"}`);
    }

    if (user?.id && !userInstructor) {
      try {
        const instructor: Instructor = await getInstructorById(user.id);
        setUserInstructor(instructor);
      } catch (error) {
        showAlert(`Failed to load user. ${error?.response.data.error || "Internal Error!"}`);
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

    fetchData(sunday, saturday);
  }, [user]);

  const handlePreviousWeek = () => {
    const newStart = new Date(weekRange.start);
    newStart.setDate(newStart.getDate() - 7);
    const newEnd = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + 6);
    newEnd.setHours(23, 59, 59, 999);
    fetchData(newStart, newEnd);
  };

  const handleNextWeek = () => {
    const newStart = new Date(weekRange.start);
    newStart.setDate(newStart.getDate() + 7);
    const newEnd = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + 6);
    newEnd.setHours(23, 59, 59, 999);
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
        {/* Scrollable Gantt Chart */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ height: TOTAL_HOURS * HOUR_HEIGHT + FOOTER_HEIGHT, paddingBottom: FOOTER_HEIGHT }}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            horizontal
            contentContainerStyle={{ width: HOUR_BAR_WIDTH + DAY_WIDTH * 7 }} // Adjusted for dynamic DAY_WIDTH
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ flexDirection: "row" }}>
              {/* Hour Bar */}
              <View style={[styles.hourBar, { width: HOUR_BAR_WIDTH, marginRight: 0 }]}>
                {Array.from({ length: TOTAL_HOURS }).map((_, hourIndex) => (
                  <View key={hourIndex} style={[styles.hourBarMarker, { height: HOUR_HEIGHT }]}>
                    <Text style={styles.hourBarText}>
                      {START_HOUR + hourIndex}:00
                    </Text>
                  </View>
                ))}
              </View>

              {/* Gantt Chart */}
              <View style={[styles.calendarContainer, { marginLeft: 0 }]}>
                {Array.from({ length: 7 }).map((_, dayIndex) => (
                  <View
                    key={dayIndex}
                    style={[
                      styles.dayColumn,
                      { left: dayIndex * DAY_WIDTH, width: DAY_WIDTH },
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
            </View>
          </ScrollView>
        </ScrollView>
      </View>

      {selectedLesson && (
        <CustomModal
          title={`${getInstructorNameById(selectedLesson.instructorId)} - ${formatSpecialty(selectedLesson.typeLesson)}`}
          visible={modalVisible}
          onClose={() => {
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