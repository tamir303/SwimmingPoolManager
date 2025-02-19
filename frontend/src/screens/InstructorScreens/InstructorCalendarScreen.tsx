import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-paper";
import LessonService from "../../services/lesson.service";
import InstructorService from "../../services/instructor.service";
import Lesson from "../../dto/lesson/lesson.dto";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useAuth } from "../../hooks/authContext";
import Footer from "../../components/Footer";
import styles from "./styles/CalenderScreen.styles";
import CustomModal from "../../components/Modal";

// Helper: Format a swimming type string (unused in this example but kept for reference)
const formatSpecialty = (specialty: string): string => {
  const lower = specialty.toLowerCase().replace(/_/g, " ");
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

// Helper function to get the dates for the current week (Sunday to Saturday)
const getWeekDates = (offset: number = 0): Date[] => {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay + offset);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });
};

const CalendarScreen: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useAuth();

  // Week dates for the calendar (current week)
  const [weekDates, setWeekDates] = useState<Date[]>(getWeekDates());
  // All lessons for the current week
  const [lessons, setLessons] = useState<Lesson[]>([]);
  // Fetched instructor data for the current user
  const [userInstructor, setUserInstructor] = useState<any>(null);
  // Selected cell for modal details
  const [selectedCell, setSelectedCell] = useState<{
    day: string;
    hour: string;
    lessons: Lesson[];
    date: Date;
  } | null>(null);
  // Control modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // Hours to display in the left column (8 AM to 10 PM)
  const hours = Array.from({ length: 15 }, (_, i) => i + 8);

  // Fetch lessons for the current week.
  useEffect(() => {
    const fetchLessons = async () => {
      if (weekDates.length === 0) return;
      // Define range: Sunday 6:00 AM to Saturday 11:59:59 PM (you can adjust as needed)
      const start = new Date(weekDates[0]);
      start.setHours(6, 0, 0, 0);
      const end = new Date(weekDates[6]);
      end.setHours(23, 59, 59, 999);
      try {
        const fetchedLessons = await LessonService.getLessonsWithinRange(start, end);
        // Normalize lesson times
        const normalizedLessons: Lesson[] = fetchedLessons.map((lesson) => ({
          ...lesson,
          startAndEndTime: {
            startTime: new Date(lesson.startAndEndTime.startTime),
            endTime: new Date(lesson.startAndEndTime.endTime),
          },
        }));
        setLessons(normalizedLessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    if (isFocused) {
      fetchLessons();
    }
  }, [weekDates, isFocused]);

  // Fetch the instructor data for the current user.
  useEffect(() => {
    const fetchInstructor = async () => {
      if (user && user.id) {
        const instructor = await InstructorService.getInstructorById(user.id);
        setUserInstructor(instructor);
      }
    };
    fetchInstructor();
  }, [user]);

  // Handler when a cell is pressed.
  const handleCellPress = (day: string, hour: string, date: Date) => {
    const cellLessons = lessons.filter((lesson) => {
      const lessonDate = new Date(lesson.startAndEndTime.startTime);
      return (
        lessonDate.toDateString() === date.toDateString() &&
        lessonDate.getHours() === parseInt(hour.split(":")[0], 10)
      );
    });
    setModalVisible(true);
    setSelectedCell({ day, hour, lessons: cellLessons, date });
  };

  // Render the hours column.
  const renderHoursColumn = () => (
    <View style={styles.hoursColumn}>
      {/* Spacer to match the height of the day header */}
      <View style={{ height: 40 }} />
      {hours.map((hour) => (
        <View key={hour.toString()} style={styles.hourCell}>
          <Text style={styles.hourLabel}>{hour}:00</Text>
        </View>
      ))}
    </View>
  );

  // Render a single cell for a given date and hour.
  const renderCell = (date: Date, hour: number) => {
    const cellLessons = lessons.filter((lesson) => {
      const lessonDate = new Date(lesson.startAndEndTime.startTime);
      return (
        lessonDate.toDateString() === date.toDateString() &&
        lessonDate.getHours() === hour
      );
    });

    // Determine cell background:
    // - Gray if no lessons,
    // - Green if at least one lesson is taught by the current instructor,
    // - Dark blue if lessons exist but none are taught by the current instructor.
    let bgColor = "#808080"; // gray for empty
    if (cellLessons.length > 0) {
      if (
        cellLessons.some(
          (lesson) =>
            userInstructor &&
            lesson.instructorId === userInstructor.instructorId
        )
      ) {
        bgColor = "#008000"; // green
      } else {
        bgColor = "#00008B"; // dark blue
      }
    }

    return (
      <TouchableOpacity
        style={[styles.cell, { backgroundColor: bgColor }]}
        key={hour.toString()}
        onPress={() => handleCellPress(date.toDateString(), `${hour}:00`, date)}
      >
        {cellLessons.length > 0 && (
          <Text style={styles.cellText}>{cellLessons.length}</Text>
        )}
      </TouchableOpacity>
    );
  };

  // Render a column for a given day.
  const renderDayColumn = (date: Date) => {
    return (
      <View style={styles.dayColumn} key={date.toDateString()}>
        <Text style={styles.dayHeader}>
          {date.toLocaleDateString("en-US", { weekday: "short" })}{"\n"}
          {date.getDate()}/{date.getMonth() + 1}
        </Text>
        {hours.map((hour) => renderCell(date, hour))}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Calendar</Text>
          <TouchableOpacity onPress={() => console.log("Profile icon tapped")}>
            <Text style={styles.profileIcon}>🧑</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar Grid with Hours Column */}
        <ScrollView contentContainerStyle={styles.calendarContainer} horizontal>
          {renderHoursColumn()}
          {weekDates.map((date) => renderDayColumn(date))}
        </ScrollView>

        {/* Modal for Lesson Details */}
        <CustomModal 
          visible={modalVisible} 
          title={`Lessons for ${selectedCell?.day.toString()}, ${selectedCell?.hour.toString()}`}
          onClose={() => {
            setSelectedCell(null)
            setModalVisible(false)
          }}
          >
          {selectedCell && (
            <SafeAreaView style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView style={styles.modalScroll}>
                  {selectedCell.lessons.map((lesson) => (
                    <View key={lesson.lessonId} style={styles.lessonItem}>
                      <Text style={styles.lessonText}>
                        {lesson.typeLesson} | {lesson.specialties.join(", ")}
                      </Text>
                      <Text style={styles.lessonTime}>
                        {new Date(lesson.startAndEndTime.startTime).toLocaleTimeString()} -{" "}
                        {new Date(lesson.startAndEndTime.endTime).toLocaleTimeString()}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </SafeAreaView>
          )}
        </CustomModal>

        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.backButton}>
          Back
        </Button>

        {/* Footer */}
        <Footer navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;
