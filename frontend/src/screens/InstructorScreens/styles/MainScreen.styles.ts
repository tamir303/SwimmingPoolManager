import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  headerUserInfo: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userDetails: {
    fontSize: 16,
    color: "#666",
  },
  purpleLine: {
    height: 2,
    backgroundColor: "#6C63FF",
    marginVertical: 10,
    borderRadius: 1,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#DDD",
    borderRadius: 25,
  },
  activeToggleButton: {
    backgroundColor: "#4C63D2",
  },
  toggleButtonText: {
    fontSize: 16,
    color: "#333",
  },
  activeToggleButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 15,
    backgroundColor: "#4C63D2",
  },
  lessonStatus: {
    color: "#FFF",
    marginTop: 10,
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20,
  },
  createButtonContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  createButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
  },
  // Modal styles
  modalContent: {
    padding: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    color: "#333",
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
  },
  saveButton: {
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  dayPickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  dayPickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "#4A148C",
  },
  dayPickerButtonActive: {
    backgroundColor: "#6C63FF",
  },
  dayPickerText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dayPickerTextActive: {
    color: "#fff",
  },
});
