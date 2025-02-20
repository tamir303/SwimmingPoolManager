import { StyleSheet, Dimensions, StatusBar } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    paddingTop: StatusBar.currentHeight || 24,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  calendarContainer: {
    paddingVertical: 10,
  },
  lessonItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  lessonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  lessonTime: {
    fontSize: 14,
    color: "#555",
  },
  backButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});
