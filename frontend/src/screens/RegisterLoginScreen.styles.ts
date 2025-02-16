import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 14,
      color: '#666',
      marginBottom: 20,
      textAlign: 'center',
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
  },
  activeRoleButton: {
      backgroundColor: '#6a5acd',
  },
  roleText: {
      color: '#fff',
      fontWeight: 'bold',
  },
  });