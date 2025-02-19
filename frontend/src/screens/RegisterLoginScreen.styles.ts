import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get("window")

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: height * 0.1, 
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  loginText: {
    color: '#6a5acd',
    fontWeight: 'bold',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  roleButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#6a5acd',
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#4A148C'
  },
  activeRoleButton: {
    backgroundColor: '#6C63FF',
    borderWidth: 3,
    borderColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 8,
    transform: [{ scale: 1.1 }],
  },
  roleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});