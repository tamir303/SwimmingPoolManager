import { StyleSheet } from "react-native";

const HOUR_HEIGHT = 60; // Height per hour
const START_HOUR = 8; // 8 AM
const END_HOUR = 22; // 10 PM
const TOTAL_HOURS = END_HOUR - START_HOUR; // 14 hours
const DAY_WIDTH = 150; // Width per day
const HOUR_BAR_WIDTH = 50; // Width of the fixed hour bar
const FOOTER_HEIGHT = 60; // Define footer height explicitly

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  header: {
    height: 70,
    backgroundColor: "#34495E",
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
    backgroundColor: "#E67E22",
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
  chartContainer: {
    flex: 1,
    flexDirection: "row", // Hour bar and chart side by side
    backgroundColor: "#FFF",
  },
  hourBar: {
    width: HOUR_BAR_WIDTH,
    height: TOTAL_HOURS * HOUR_HEIGHT,
    backgroundColor: "#F4F6F8",
    borderRightWidth: 1,
    borderRightColor: "#E0E0E0",
  },
  hourBarMarker: {
    height: HOUR_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  hourBarText: {
    fontSize: 12,
    color: "#34495E",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  calendarContainer: {
    position: "relative",
    width: DAY_WIDTH * 7,
    height: TOTAL_HOURS * HOUR_HEIGHT,
    backgroundColor: "#F9FBFC",
    marginLeft: HOUR_BAR_WIDTH, // Offset to avoid overlapping hour bar
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
    backgroundColor: "#F4F6F8",
  },
  dayColumnOdd: {
    backgroundColor: "#FFF",
  },
  dayHeader: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#34495E",
    borderBottomWidth: 1,
    borderBottomColor: "#2C3E50",
  },
  dayText: {
    fontSize: 14,
    color: "#BDC3C7",
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
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: FOOTER_HEIGHT,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
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
    maxHeight: "80%",
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
    maxHeight: 200,
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
});