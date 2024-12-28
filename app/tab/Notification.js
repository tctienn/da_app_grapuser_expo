import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ScrollView, RefreshControl, TouchableOpacity, Modal } from 'react-native';
import { get_notificationForUser } from '@/api/notificationApi'
import { getUser } from '@/api/apiLogin';



export default function Notification() {
    const [user, setUser] = useState({})
    const [data, setData] = useState([])
    const [load, setLoad] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const getData = async () => {
        const responseUser = await getUser()
        const response = await get_notificationForUser(responseUser.id)
        setData(response.data)
        setLoad(false)
    }
    // load lại trang bằng hành động vuốt
    const onRefresh = () => {
        setRefreshing(true);
        // Giả lập một tác vụ tải lại dữ liệu
        setTimeout(() => {
            setRefreshing(false);
            getData()
        }, 2000);
    };

    const handleItemPress = (item) => {
        setSelectedItem(item); // Lưu lại item được chọn
        setModalVisible(true); // Hiển thị modal
    };
    useEffect(() => {
        getData()
    }, [])

    if (load) {
        return (
            <View>
                <Text>
                    Đang tải...
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Danh Sách Thông Báo</Text>
            <ScrollView style={[styles.container, { padding: 0, width: '100%' }]}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}>

                {
                    data?.map((e, i) => {
                        return (
                            <TouchableOpacity style={[styles.notificationItem]} key={i} onPress={() => handleItemPress(e)}>
                                <Text style={styles.title}>{e.title}</Text>
                                <Text style={styles.message} numberOfLines={1} >{e.body}</Text>
                                <Text style={styles.date}>{e.createTime}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </ScrollView>
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nội dung</Text>
                        {selectedItem && (
                            <ScrollView style={{ width: '100%', height: '50%' }}>
                                <Text style={styles.title}>{selectedItem.title}</Text>
                                <Text style={styles.message}  >{selectedItem.body}</Text>
                                <Text style={styles.date}>{selectedItem.createTime}</Text>
                            </ScrollView>
                        )}
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    notificationItem: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a73e8',
    },
    message: {
        fontSize: 16,
        color: '#555',
    },
    date: {
        fontSize: 12,
        color: '#aaa',
        marginTop: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalDetails: {
        fontSize: 16,
        marginBottom: 20,
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#2196F3',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});


