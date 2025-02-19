import { StyleSheet, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  tabButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#6C63FF",
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "#4A148C",
  },
  activeTabButton: {
    backgroundColor: "#6C63FF",
  },
  tabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 100,
  },
  lessonItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  lessonInfo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: "#4CAF50",
    alignSelf: "flex-start",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 20,
  },
  backButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});
