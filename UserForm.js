import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const UserForm = ({ onSubmit, onCancel, initialValues, isEditing }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (initialValues) {
      setFirstName(initialValues.firstName || '');
      setLastName(initialValues.lastName || '');
      setPhoneNumber(initialValues.phoneNumber || '');
      setEmail(initialValues.email || '');
      setRole(initialValues.role || '');
    }
  }, [initialValues]);

  const validateForm = () => {
    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(firstName)) {
      Alert.alert('Validation Error', 'First Name must contain only letters and cannot be empty.');
      return false;
    }

    if (!nameRegex.test(lastName)) {
      Alert.alert('Validation Error', 'Last Name must contain only letters and cannot be empty.');
      return false;
    }

    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Email is not valid and cannot be empty.');
      return false;
    }

    if (!role) {
      Alert.alert('Validation Error', 'Role is required.');
      return false;
    }

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
        keyboardType='numeric'
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address'
        style={styles.input}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Role" value="" />
          <Picker.Item label="Manager" value="Manager" />
          <Picker.Item label="Waiter" value="Waiter" />
        </Picker>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>{isEditing ? 'Update' : 'Save'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
  pickerContainer: {
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#79afd1',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#ff6f61',
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default UserForm;
