import React, { useState } from 'react';
import { Modal, Text, Pressable, View, StyleSheet, Button } from 'react-native';

const dialogInvoice = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View >
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.ay}>
                    <Text>ssssssssssss</Text>
                    <Button
                        onPress={() => {
                            setModalVisible(!modalVisible);
                        }}
                        title="Press Me"
                    />
                </View>
            </Modal>

            <View>
                <Pressable
                    style={[styles.button, styles.buttonOpen]}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.textStyle}>Show Modal</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },

    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    ay: {
        width: '90%',
        height: '40%',
        position: 'absolute',
        top: '20%',
        left: 20,
        backgroundColor: 'rgb(125, 74, 151)',

    }

});

export default dialogInvoice;