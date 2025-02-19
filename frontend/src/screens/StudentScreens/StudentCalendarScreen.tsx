import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, Button } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import LessonService from "../../services/lesson.service";
import Lesson from "../../dto/lesson/lesson.dto";
import { useAuth } from "../../hooks/authContext";
import Footer from "../../components/Footer";
import styles from "./styles/StudentCalendarScreen.styles";

const StudentCalendarScreen: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const start = new Date();
        start.setDate(start.getDate() - 30);
        const end = new Date();
        end.setDate(end.getDate() + 30);
        const fetchedLessons = await LessonService.getLessonsWithinRange(start, end);
        setLessons(fetchedLessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    if (isFocused && user && user.id) {
      fetchLessons();
    }
  }, [isFocused, user]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>Calendar</Text>
        <ScrollView contentContainerStyle={styles.calendarContainer}>
          {lessons.map((lesson) => (
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
        <Footer navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default StudentCalendarScreen;
