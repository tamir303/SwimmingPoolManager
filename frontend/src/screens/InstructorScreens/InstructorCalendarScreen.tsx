import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Button } from "react-native-paper";
import LessonService from "../../services/lesson.service";
import InstructorService from "../../services/instructor.service";
import Lesson from "../../dto/lesson/lesson.dto";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useAuth } from "../../hooks/authContext";
import Footer from "../../components/Footer";
import CustomModal from "../../components/Modal";
import styles from "./styles/CalenderScreen.styles";

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

  // Week offset state (in days; multiples of 7)
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [weekDates, setWeekDates] = useState<Date[]>(getWeekDates(currentWeekOffset));
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userInstructor, setUserInstructor] = useState<any>(null);
  const [selectedCell, setSelectedCell] = useState<{
    day: string;
    hour: string;
    lessons: Lesson[];
    date: Date;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Gantt chart settings: Timeline from 8 AM to 10 PM
  const timelineStartHour = 8;
  const timelineEndHour = 22;
  const cellHeight = 40; // each hour cell height
  const timelineTotalHeight = (timelineEndHour - timelineStartHour) * cellHeight;
  const hours = Array.from({ length: timelineEndHour - timelineStartHour }, (_, i) => i + timelineStartHour);

  // Update weekDates when week offset changes.
  useEffect(() => {
    setWeekDates(getWeekDates(currentWeekOffset));
  }, [currentWeekOffset]);

  // Fetch lessons for the current week.
  useEffect(() => {
    const fetchLessons = async () => {
      if (weekDates.length === 0) return;
      const start = new Date(weekDates[0]);
      start.setHours(6, 0, 0, 0);
      const end = new Date(weekDates[6]);
      end.setHours(23, 59, 59, 999);
      try {
        const fetchedLessons = await LessonService.getLessonsWithinRange(start, end);
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

  // Fetch instructor data.
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
    setSelectedCell({ day, hour, lessons: cellLessons, date });
    setModalVisible(true);
  };

  // Render the hours column.
  const renderHoursColumn = () => (
    <View style={styles.hoursColumn}>
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
    let bgColor = "#808080"; // Gray if no lesson.
    if (cellLessons.length > 0) {
      if (
        cellLessons.some(
          (lesson) =>
            userInstructor &&
            lesson.instructorId === userInstructor.instructorId
        )
      ) {
        bgColor = "#008000"; // Green if taught by current instructor.
      } else {
        bgColor = "#00008B"; // Dark blue otherwise.
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
    const isToday = date.toDateString() === new Date().toDateString();
    return (
      <View
        style={[
          styles.dayColumn,
          isToday && { backgroundColor: "#bbdefb" } // highlight current day
        ]}
        key={date.toDateString()}
      >
        <Text style={styles.dayHeader}>
          {date.toLocaleDateString("en-US", { weekday: "short" })}{"\n"}
          {date.getDate()}/{date.getMonth() + 1}
        </Text>
        <View style={[styles.timeline, { height: timelineTotalHeight }]}>
          {Array.from({ length: timelineEndHour - timelineStartHour }, (_, i) => {
            const hour = timelineStartHour + i;
            return renderCell(date, hour);
          })}
        </View>
      </View>
    );
  };

  // Week Navigation Header: Two blue buttons: Previous Week and Next Week.
  const renderWeekNavigation = () => (
    <View style={styles.weekNavContainer}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => setCurrentWeekOffset(currentWeekOffset - 7)}
      >
        <Text style={styles.navButtonText}>Previous Week</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => setCurrentWeekOffset(currentWeekOffset + 7)}
      >
        <Text style={styles.navButtonText}>Next Week</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.simpleHeader}>
          <Text style={styles.simpleHeaderText}>Calendar</Text>
        </View>
        {/* Week Navigation */}
        {renderWeekNavigation()}

        {/* Calendar Grid with Hours Column */}
        <ScrollView contentContainerStyle={styles.calendarContainer} horizontal>
          {renderHoursColumn()}
          {weekDates.map((date) => renderDayColumn(date))}
        </ScrollView>

        {/* Modal for Lesson Details */}
        {modalVisible && selectedCell && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Lessons for {selectedCell.day}, {selectedCell.hour}
              </Text>
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
              <Button mode="contained" onPress={() => setModalVisible(false)}>
                Close
              </Button>
            </View>
          </SafeAreaView>
        )}

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
