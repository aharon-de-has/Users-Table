import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import UserForm from './UserForm';

const IP = '192.168.1.35'
const URL = `http://${IP}:3000/users`

type User = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
}


const App = () => {
  const [users, setUsers] = useState <User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState <User | null>(null);

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

  const addUser = async (user: User) => {
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

  const updateUser = async (user: User) => {
    try {
      const response = await fetch(`${URL}/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedUser = await response.json();
      setUsers(users.map(u => (u.id === currentUser.id ? updatedUser : u)));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const confirmDeleteUser = (id: string) => {
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

  const deleteUser = async (id: string) => {
    try {
      await fetch(`${URL}/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleFormSubmit = (user: User) => {
    if (isEditing) {
      updateUser(user);
    } else {
      addUser(user);
    }
  };

  const sortData = (data, sortBy) => {
    if (sortBy === 'firstName') {
      return data.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortBy === 'lastName') {
      return data.sort((a, b) => a.lastName.localeCompare(b.lastName));
    }
    return data;
  };

  const SortBy = (sortBy) => {
    const sortedUsers = sortData([...users], sortBy);  // Make a copy of the users array and sort it
    setUsers(sortedUsers);
  };

  const sort = () => {
    Alert.alert(
      "sort by",
      "choose",
      [
        {
          text: "first name",
          onPress: () => SortBy('firstName')
        },
        {
          text: "last name",
          onPress: () => SortBy('lastName')
        }
      ],
    );
  };
  

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
        renderItem={({ item, index }) => (
          <View style={[styles.row,  { backgroundColor: index % 2 === 0 ? '#ffffff' : '#c2d6ed' }]}>
            <Text style={styles.cell}>{item.firstName}</Text>
            <Text style={styles.cell}>{item.lastName}</Text>
            <Text style={styles.cell}>{item.phoneNumber}</Text>
            <Text style={styles.cell}>{item.email}</Text>
            <Text style={styles.cell}>{item.role}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteUser(item.id)}>
              <Text style={styles.deleteButtonText}>Del</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.addButton} onPress={() => sort() }>
          <Text style={styles.addButtonText}>Sort</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} onPress={() => { setCurrentUser(null); setIsEditing(false); setIsModalOpen(true); }}>
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
        <Modal isVisible={isModalOpen} onBackdropPress={() => setIsModalOpen(false)}>
          <View style={styles.modalContent}>
            <UserForm 
              onSubmit={handleFormSubmit} 
              onCancel={() => setIsModalOpen(false)} 
              initialValues={currentUser} 
              isEditing={isEditing} 
            />
          </View>
        </Modal>
      </View>
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
    backgroundColor: '#79afd1',
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
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#f2cb30',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  editButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#ff6f61',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: '#79afd1',
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginHorizontal: 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',  
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // width: '100%',
    marginVertical: 10,
  },
});

export default App;
