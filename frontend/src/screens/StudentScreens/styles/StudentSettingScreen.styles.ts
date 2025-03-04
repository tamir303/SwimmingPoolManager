// StudentScreen.styles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const FOOTER_HEIGHT = 60;

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
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 15,
    color: "#34495E",
  },
  currentSettingsContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#6C63FF",
  },
  currentSettingsText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontWeight: "500",
    lineHeight: 22,
  },
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    borderColor: "#DDD",
    borderWidth: 1,
    marginBottom: 15,
  },
  swimWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginVertical: 10,
  },
  swimChip: {
    backgroundColor: "#E67E22",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  swimChipText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
  },
  swimColumn: {
    marginVertical: 10,
  },
  swimRowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 15,
    backgroundColor: "#F9FBFC",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  swimRowItemText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    width: "45%",
    paddingVertical: 12,
    borderRadius: 10,
  },
  cancelButton: {
    width: "45%",
    paddingVertical: 12,
    borderColor: "#6C63FF",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 5,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  toggleButtonText: {
    fontSize: 16,
    color: "#666",
  },
  activeToggleButton: {
    backgroundColor: "#6C63FF",
  },
  activeToggleButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 100,
  },
  card: {
    marginBottom: 15,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    lineHeight: 20,
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
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20,
  },
  lessonTypeContainer: {
    marginVertical: 15,
    backgroundColor: "#FFF", // Added for consistency with other sections
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12, // Increased spacing for readability
  },
  radioText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10, // Adjusted for better alignment with RadioButton
    fontWeight: "500",
  },
  priorityContainer: {
    marginLeft: 20, // Indent under Mixed
    marginTop: 10,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#34495E",
    marginTop: 10,
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: "#F9FBFC",
    borderRadius: 8,
    borderColor: "#DDD",
    borderWidth: 1,
    marginBottom: 15,
    overflow: "hidden",
  },
  picker: {
    height: 160,
    color: "#333",
    marginTop: 2
  },
});
