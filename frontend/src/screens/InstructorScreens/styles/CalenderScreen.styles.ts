import { StyleSheet, Dimensions } from "react-native"
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backArrow: {
    fontSize: 20,
    color: "#333",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  profileIcon: {
    fontSize: 20,
    color: "#333",
  },
  calendarContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
  },
  // Hours column on the left.
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
  // Each day column.
  dayColumn: {
    marginHorizontal: 5,
    alignItems: "center",
  },
  dayHeader: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 5,
  },
  // Each cell in a day column.
  cell: {
    width: 40,
    height: 40,
    marginVertical: 2,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  cellText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    alignSelf: "center",
  },
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