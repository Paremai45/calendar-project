import React, { Component } from 'react';
import { Text, View } from '../components/Themed';
import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';


const PopupModal = ({ open, onClose, title, message, buttonTitle }) => {
  return (
    <Modal
      transparent={true}
      animationType={'fade'}
      visible={open}
      style={{ zIndex: 1100 }}>
      <View style={styles.modalBackground}>
        <View style={styles.popup}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={{ position: 'absolute', bottom: 25 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={onClose}>
              <Text style={styles.buttonTitle}>{buttonTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  },
  popup: {
    backgroundColor: '#FFFFFF',
    height: 200,
    width: '90%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    top: 24,
    fontSize: 20,
    fontWeight: 'bold',
  },
  message: {
    top: 32,
    fontSize: 14,
    paddingLeft: 20,
    paddingRight: 20,
    textDecorationStyle: '',
    flex: 1,
    flexWrap: 'wrap',
    textAlign: 'center'
  },
  buttonTitle: {
    color: 'white',
  },
  button: {
    borderRadius: 25,
    backgroundColor: '#413F42',
    color: '#FFFFFF',
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PopupModal