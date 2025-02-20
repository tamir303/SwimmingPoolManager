import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { useAuth } from "../../hooks/authContext";
import { useStudent } from "../../hooks/studentHooks/useStudent"
import Lesson from "../../dto/lesson/lesson.dto";
import Footer from "../../components/Footer";
import styles from "./styles/StudentMainScreen.styles"

type TabType = "MY" | "AVAILABLE";

const StudentMainScreen: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useAuth();
  const { myLessons, availableLessons, fetchMyLessons, fetchAvailableLessons, joinLesson } = useStudent();
  const [activeTab, setActiveTab] = useState<TabType>("MY");

  useEffect(() => {
    if (user && user.id && isFocused) {
      fetchMyLessons(user.id);
      fetchAvailableLessons(user.id);
    }
  }, [user, isFocused]);

  const renderLessonItem = (lesson: Lesson) => (
    <View style={styles.lessonItem}>
      <Text style={styles.lessonTitle}>{lesson.typeLesson} Lesson</Text>
      <Text style={styles.lessonInfo}>
        {new Date(lesson.startAndEndTime.startTime).toLocaleTimeString()} -{" "}
        {new Date(lesson.startAndEndTime.endTime).toLocaleTimeString()}
      </Text>
      {activeTab === "AVAILABLE" &&  (
        <Button
          mode="contained"
          onPress={() => joinLesson(user?.id || "undefined", lesson?.lessonId || "undefined")}
          style={styles.joinButton}
        >
          Join Lesson
        </Button>
      )}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}>My & Available Lessons</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "MY" && styles.activeTabButton]}
            onPress={() => setActiveTab("MY")}
          >
            <Text style={styles.tabText}>My Lessons</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "AVAILABLE" && styles.activeTabButton]}
            onPress={() => setActiveTab("AVAILABLE")}
          >
            <Text style={styles.tabText}>Available Lessons</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={activeTab === "MY" ? myLessons : availableLessons}
          keyExtractor={(item) => item.lessonId || Math.random().toString()}
          renderItem={({ item }) => renderLessonItem(item)}
          ListEmptyComponent={<Text style={styles.emptyText}>No lessons found.</Text>}
          contentContainerStyle={styles.listContainer}
        />
        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.backButton}>
          Back
        </Button>
        <Footer navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default StudentMainScreen;
