import { StyleSheet, Dimensions, StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");

// Constants for dimensions
const HOUR_HEIGHT = 60; // Height per hour
const START_HOUR = 8; // 8 AM
const END_HOUR = 22; // 10 PM
const TOTAL_HOURS = END_HOUR - START_HOUR; // 14 hours
const DAY_WIDTH = 150; // Width per day

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F4F8", // Light blue-gray background
  },
  header: {
    height: 70,
    backgroundColor: "#34495E", // Dark blue header
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E67E22", // Orange for contrast
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollView: {
    flex: 1,
  },
  calendarContainer: {
    position: "relative",
    width: DAY_WIDTH * 7,
    height: TOTAL_HOURS * HOUR_HEIGHT,
    backgroundColor: "#F9FBFC", // Very light gray for chart
  },
  hourMarker: {
    position: "absolute",
    left: 0,
    width: 50,
    height: HOUR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  hourText: {
    fontSize: 12,
    color: "#7F8C8D", // Muted gray
    fontWeight: "500",
  },
  dayColumn: {
    position: "absolute",
    top: 0,
    width: DAY_WIDTH,
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  dayColumnEven: {
    backgroundColor: "#F4F6F8", // Alternating background
  },
  dayColumnOdd: {
    backgroundColor: "#FFF",
  },
  dayHeader: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#34495E", // Matches header
    borderBottomWidth: 1,
    borderBottomColor: "#2C3E50",
  },
  dayText: {
    fontSize: 14,
    color: "#BDC3C7", // Light gray
    fontWeight: "600",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  lessonBar: {
    position: "absolute",
    borderRadius: 6,
    padding: 6,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  lessonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  chartContainer: {
    flex: 1, // Takes up remaining space
  },
  modalContent: {
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "80%", // Limit height to avoid overflow
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    width: 100,
  },
  detailValue: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495E",
    marginTop: 20,
    marginBottom: 10,
  },
  studentTableContainer: {
    marginTop: 10,
    maxHeight: 200, // Limit table height with scrolling
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#34495E",
    paddingVertical: 8,
    borderRadius: 8,
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#F9FBFC",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tableCell: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  noStudentsText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 10,
  },
  lessonContent: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  lessonInstructor: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 2,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  lessonType: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 2,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  lessonTime: {
    fontSize: 10,
    fontWeight: "400",
    color: "rgba(255, 255, 255, 0.8)",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});