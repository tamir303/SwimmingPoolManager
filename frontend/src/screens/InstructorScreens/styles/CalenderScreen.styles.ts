import { StyleSheet, Dimensions, StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 10,
    paddingTop: StatusBar.currentHeight || 24,
  },
  simpleHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  simpleHeaderText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  weekNavContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  navButton: {
    backgroundColor: "#6C63FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  navButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  calendarContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  // Hours column
  hoursColumn: {
    width: 50,
    justifyContent: "flex-start",
    alignItems: "center",
    marginRight: 5,
  },
  hourCell: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  hourLabel: {
    fontSize: 14,
    color: "#555",
  },
  // Day column
  dayColumn: {
    width: 150,
    marginHorizontal: 5,
    alignItems: "center",
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
    height: 40,
  },
  timeline: {
    width: "100%",
    backgroundColor: "#eee",
    position: "relative",
  },
  cell: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    alignSelf: "center",
  },
  // Modal styles
  modalContainer: {
    position: "absolute",
    top: "20%",
    left: "10%",
    right: "10%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
  modalContent: {
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalScroll: {
    marginBottom: 10,
  },
  lessonItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  lessonText: {
    fontSize: 16,
    color: "#333",
  },
  lessonTime: {
    fontSize: 14,
    color: "#666",
  },
});
