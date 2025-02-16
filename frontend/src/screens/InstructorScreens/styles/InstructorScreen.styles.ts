import { StyleSheet, Dimensions } from "react-native";
import { Colors, Fonts } from "../../../utils/constants"; 

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.lightGray,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    fontFamily: Fonts.bold, // Custom font for better appearance
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  listContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  addCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    width: "90%",
    marginVertical: 10,
    padding: 15,
    elevation: 5,
  },
  instructorCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    width: "45%", // Responsive width
    margin: 10,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  instructorCardText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.primary,
  },
  instructorCardSubText: {
    fontSize: 14,
    color: Colors.gray,
  },
  modalContent: {
    maxHeight: "80%", // Limit modal height
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.primary,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  chip: {
    backgroundColor: Colors.lightGreen,
    borderRadius: 20,
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  chipSelected: {
    backgroundColor: Colors.darkGreen,
    borderRadius: 20,
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  chipRemove: {
    fontWeight: "bold",
    color: Colors.white,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  dayChip: {
    backgroundColor: Colors.blue,
    borderRadius: 20,
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  availabilityButton: {
    backgroundColor: Colors.primary,
    borderRadius: 5,
    marginVertical: 15,
    paddingVertical: 10,
  },
  availabilityChip: {
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  availabilityText: {
    fontSize: 16,
    color: Colors.black,
  },
  saveButton: {
    backgroundColor: Colors.green,
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 10,
  },
  deleteButton: {
    backgroundColor: Colors.red,
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 10,
  },
  backButton: {
    marginTop: 20,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 5,
  },
});
