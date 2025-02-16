import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  refreshIcon: {
    fontSize: 24,
    color: "#4C63D2",
  },
  purpleLine: {
    height: 2,
    backgroundColor: "#6C63FF", // Purple color matching Register/Login style
    marginBottom: 20,
    borderRadius: 1,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "#DDD",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#333",
    backgroundColor: "#FFF",
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
});