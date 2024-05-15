import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const CustomAlert = ({ visible, message, onClose }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.alertContainer}>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity style={styles.okButton} onPress={onClose}>
                        <Text style={styles.okText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alertContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#9e9e9e'
    },
    okButton: {
        backgroundColor: '#c02221',
        paddingVertical: 10,
        borderRadius: 5,
    },
    okText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
});

export default CustomAlert;
