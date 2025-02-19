import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "../../../utils/constants";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 5,
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
  // Content
  content: {
    paddingHorizontal: 20,
    // Extra bottom padding so that footer doesn't overlap content:
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 10,
    color: "#333",
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 10,
  },
  dayLabel: {
    fontSize: 16,
    color: "#333",
  },
  // Time Picker Section (when a day is unsaved/active)
  timePickerSection: {
    marginVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  timePickersLabel: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  // Saved Availability (final list of saved availabilities)
  savedAvailabilityContainer: {
    backgroundColor: "#eaeaea",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  savedAvailabilityText: {
    fontSize: 14,
    color: "#333",
    marginVertical: 2,
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4, // Removed extra rounding to match "pointy" style if desired.
    margin: 5,
  },
  swimChipText: {
    fontSize: 14,
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
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  swimRowItemText: {
    fontSize: 16,
    color: "#333",
  },
  swimRowItemIcon: {
    fontSize: 18,
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
  },
  cancelButton: {
    width: "40%",
    borderColor: "#6C63FF",
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  timePickerItem: {
    flex: 1,
    marginHorizontal: 5,
  },
});
