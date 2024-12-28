import { getUser, removeUser } from '@/api/apiLogin';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';

const AccountInfo = () => {
    const [user, setUser] = useState({})
    const getUserf = async () => {
        const respose = await getUser()
        setUser(respose)
    }
    useEffect(() => {
        getUserf()
    }, [])
    const navigation = useNavigation()
    const handleLogout = () => {
        // Logic đăng xuất (có thể thêm logic thực tế ở đây)
        removeUser().then(() => Alert.alert('Thông báo', 'Đăng xuất thành công!'), navigation.navigate('login'))

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thông Tin Tài Khoản</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Họ và Tên:</Text>
                <Text style={styles.value}>{user.name}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.gmail}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Số điện thoại:</Text>
                <Text style={styles.value}>{user.sdt}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Số căn cước công dân:</Text>
                <Text style={styles.value}>{user.scccd}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Ngày sinh:</Text>
                <Text style={styles.value}>{user.birth}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Giới tính:</Text>
                <Text style={styles.value}>{user.gender}</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Địa chỉ:</Text>
                <Text style={styles.value}>{user.address}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Đăng Xuất</Text>
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
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AccountInfo;
