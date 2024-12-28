import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Giả lập đăng nhập (có thể thay thế bằng logic thực tế)
        if (email === '' || password === '') {
            Alert.alert('Error', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }
        Alert.alert('Success', 'Đăng nhập thành công!');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng Nhập</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Đăng Nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert('Chức năng chưa được triển khai!')}>
                <Text style={styles.link}>Quên mật khẩu?</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 15,
        color: '#6200EE',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default LoginForm;
