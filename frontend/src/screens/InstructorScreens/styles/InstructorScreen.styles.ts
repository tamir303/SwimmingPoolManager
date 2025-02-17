import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "../../../utils/constants"; 

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backArrow: {
    fontSize: 20,
    color: "#333",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileIcon: {
    fontSize: 20,
    color: "#333",
  },
  // Tabs
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginHorizontal: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#6C63FF", // Purple accent
  },
  tabText: {
    fontSize: 16,
    color: "#999",
  },
  activeTabText: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  // Content
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginVertical: 10,
  },
  // Availability
  dayRow: {
    marginVertical: 8,
  },
  dayLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  dayLabel: {
    fontSize: 14,
    color: "#333",
  },
  timePickersContainer: {
    marginLeft: 10,
    marginVertical: 5,
  },
  timePickersLabel: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
    color: "#666",
  },
  // Swimming Types
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  specialtyChip: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  specialtyChipSelected: {
    backgroundColor: "#6C63FF",
  },
  specialtyText: {
    fontSize: 14,
    color: "#333",
  },
  specialtyTextSelected: {
    color: "#fff",
  },
  checkMark: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 14,
  },
  // Current Settings
  currentSettingsContainer: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  currentSettingsText: {
    fontSize: 14,
    color: "#333",
    marginVertical: 2,
  },
  // Buttons
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    width: "40%",
  },
  cancelButton: {
    width: "40%",
    borderColor: "#6C63FF",
  },
});