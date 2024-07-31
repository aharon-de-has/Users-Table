import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import UserForm from './UserForm';

const IP = '192.168.1.35'
const URL = `http://${IP}:3000/users`

const App = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addUser = async (user) => {
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const confirmDeleteUser = (id) => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
        },
        {
          text: "OK",
          onPress: () => deleteUser(id)
        }
      ],
    );
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${URL}/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.firstName}</Text>
      <Text style={styles.cell}>{item.lastName}</Text>
      <Text style={styles.cell}>{item.phoneNumber}</Text>
      <Text style={styles.cell}>{item.email}</Text>
      <Text style={styles.cell}>{item.role}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteUser(item.id)}>
        <Text style={styles.deleteButtonText}>Del</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Welcome</Text>
    <View style={styles.headerRow}>
      <Text style={styles.headerCell}>First Name</Text>
      <Text style={styles.headerCell}>Last Name</Text>
      <Text style={styles.headerCell}>Phone Number</Text>
      <Text style={styles.headerCell}>Email</Text>
      <Text style={styles.headerCell}>Role</Text>
      <Text style={styles.headerCell}></Text>
    </View>
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
    <TouchableOpacity style={styles.addButton} onPress={() => setIsModalOpen(true)}>
      <Text style={styles.addButtonText}>Add User</Text>
    </TouchableOpacity>
    <Modal isVisible={isModalOpen} onBackdropPress={() => setIsModalOpen(false)}>
      <View style={styles.modalContent}>
        <UserForm onSubmit={addUser} onCancel={() => setIsModalOpen(false)} />
      </View>
    </Modal>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  padding: 10,
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign: 'center',
},
headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 25,
  backgroundColor: '#7bb5db',
  borderBottomWidth: 7,
  borderRadius: 10,
},
headerCell: {
  flex: 1,
  fontWeight: 'bold',
},
row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 10,
  borderBottomWidth: 1,
},
cell: {
  flex: 1,
},
modalContent: {
  backgroundColor: 'white',
  padding: 22,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 40,
  borderColor: 'rgba(0, 0, 10, 10)',
},
deleteButton: {
  backgroundColor: '#7bb5db',
  padding: 10,
  borderRadius: 50,
},
deleteButtonText: {
  color: 'white',
  fontWeight: 'bold',
},
addButton: {
  backgroundColor: '#7bb5db',
  padding: 15,
  borderRadius: 20,
  alignItems: 'center',
},
addButtonText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: 'white',
},
});

export default App;

