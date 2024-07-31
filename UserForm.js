import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';


const UserForm = ({ onSubmit, onCancel }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const validateForm = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (firstName.trim() !== '' && !nameRegex.test(firstName)) {
      alert('First Name must contain only letters.');
      return false;
    }

    if (lastName.trim() !== '' && !nameRegex.test(lastName)) {
      alert('Last Name must contain only letters.');
      return false;
    }

    if (phoneNumber.trim() !== '' && !phoneRegex.test(phoneNumber)) {
      alert('Phone Number must contain only numbers.');
      return false;
    }

    if (email.trim() !== '' && !emailRegex.test(email)) {
      alert('Email is not valid.');
      return false;
    }

    // if (role.trim() === '') {
    //   alert('Role must be selected.');
    //   return false;
    // }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({ firstName, lastName, phoneNumber, email, role });
    }
  };

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
          <TextInput
        placeholder="Role (Manager/Waiter)"
        value={role}
        onChangeText={setRole}
        style={styles.input}
      />
      <View style={styles.row}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'blue',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#7bb5db',
    padding: 10,
    borderRadius: 10,
    // fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#7bb5db',
    padding: 10,
    borderRadius: 10,
    // fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  saveButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
});

export default UserForm;



{/* <View style={styles.dropdownContainer}>
        <SelectDropdown
          data={['Manager', 'Waiter']}
          onSelect={(selectedItem) => {
            setRole(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem) => selectedItem}
          rowTextForSelection={(item) => item}
          defaultButtonText="Select a role"
          buttonStyle={styles.dropdownButton}
          buttonTextStyle={styles.dropdownButtonText}
          dropdownStyle={styles.dropdownDropdown}
          rowStyle={styles.dropdownRow}
          rowTextStyle={styles.dropdownRowText}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View> */}