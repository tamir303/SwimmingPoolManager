import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    marginTop: 20,
  },
  // Styles for swimming preferences
  swimmingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  swimmingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
  },
  swimmingText: {
    fontSize: 14,
    color: "#333",
  },
  checkMark: {
    fontSize: 14,
    color: "#6C63FF",
    marginLeft: 5,
  },
});
