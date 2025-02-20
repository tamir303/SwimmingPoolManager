import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "../../../utils/constants";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backArrow: {
    fontSize: 24,
    color: "#333",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  profileIcon: {
    fontSize: 24,
    color: "#333",
  },
  // Content
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#333",
  },
  // Current Settings
  currentSettingsContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Availability Days Grid (two columns)
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  dayBox: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 10,
  },
  dayLabel: {
    fontSize: 16,
    color: "#333",
  },
  // Time Picker Section (when a day is unsaved/active)
  timePickerSection: {
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  timePickersLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  // Saved Availability (final list of saved availabilities)
  savedAvailabilityContainer: {
    backgroundColor: "#eaeaea",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  savedAvailabilityText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  // Swimming Types: Available (wrap container)
  swimWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginVertical: 10,
  },
  swimChip: {
    backgroundColor: "#eee",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
    margin: 5,
  },
  swimChipText: {
    fontSize: 16,
    color: "#333",
  },
  // Chosen Swimming Types: vertical column list.
  swimColumn: {
    marginVertical: 10,
  },
  swimRowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  swimRowItemText: {
    fontSize: 16,
    color: "#333",
  },
  swimRowItemIcon: {
    fontSize: 20,
    color: "#6C63FF",
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
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    width: "40%",
    paddingVertical: 12,
    borderColor: "#6C63FF",
    borderWidth: 1,
    borderRadius: 8,
  },
  timePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  timePickerItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  currentSettingsText: {
    fontSize: 18,      // Increased font size for better readability
    color: "#222",
    marginBottom: 8,
    fontWeight: "500",
  },
  // New style for the "X" remove icon on active day sections.
  removeIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 10,
    backgroundColor: "#ff6666",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  removeIconText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
