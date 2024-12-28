import { getUser } from '@/api/apiLogin';
import { get_oderGrap_byIdGrap_andstatus, get_oderGrap_on_month } from '@/api/grapserviceApi';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, RefreshControl } from 'react-native';

const deliveryHistory = [
    { id: '1', orderId: 'DH001', date: '2024-10-01', status: 'Đã giao', address: '123 Đường ABC, TP.HCM' },
    { id: '2', orderId: 'DH002', date: '2024-10-02', status: 'Đã giao', address: '456 Đường DEF, Hà Nội' },
    { id: '3', orderId: 'DH003', date: '2024-10-03', status: 'Đang giao', address: '789 Đường GHI, Đà Nẵng' },
    { id: '4', orderId: 'DH004', date: '2024-10-04', status: 'Đã giao', address: '101 Đường JKL, Cần Thơ' },
    { id: '5', orderId: 'DH005', date: '2024-10-05', status: 'Đã giao', address: '202 Đường MNO, Nha Trang' },
];

const DeliveryItem = ({ item }) => {
    return (
        <View style={styles.deliveryItem}>
            <Text style={styles.orderId}>Mã đơn hàng: {item.orderId}</Text>
            <Text style={styles.date}>Ngày giao: {item.date}</Text>
            <Text style={styles.status}>Trạng thái: {item.status}</Text>
            <Text style={styles.address}>Địa chỉ: {item.address}</Text>
        </View>
    );
};

export default function History() {
    const [data, setData] = useState({
        successMonth: [],
        FalseMonth: [],
        successAll: [],
        FalseAll: []

    })
    const [user, setUser] = useState({})
    const [loading, setLoad] = useState(true)
    const [refreshing, setRefreshing] = useState(false);

    const getData = async () => {
        const responseUser = await getUser()
        const responseSuccessMonth = await get_oderGrap_on_month(responseUser.id, 'success')
        const responeFalseMonth = await get_oderGrap_on_month(responseUser.id, 'false')
        const responseSuccessAll = await get_oderGrap_byIdGrap_andstatus(responseUser.id, 'success')
        const responseFalseAll = await get_oderGrap_byIdGrap_andstatus(responseUser.id, 'false')

        // console.log("data false", responseUser.id, responeFalseMonth.data)
        setUser(responseUser)
        setData({
            successAll: responseSuccessAll.data,
            FalseAll: responseFalseAll.data,
            successMonth: responseSuccessMonth.data, FalseMonth: responeFalseMonth.data
        })

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
    useEffect(() => {
        getData().then(() => setLoad(false))
    }, [])
    return (
        loading == true ? (
            <View>
                <Text style={{ fontSize: 14 }}>
                    Đang tải..
                </Text>
            </View>
        ) : (
            <View style={styles.container}>
                <Text style={styles.header}>Lịch Sử Giao Hàng</Text>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />}
                >
                    <Text>Lịch sử tháng này</Text>
                    {data?.successMonth.map((item, key) => (
                        <View style={styles.deliveryItem} key={key}>
                            <Text style={styles.orderId}>Mã đơn hàng: {item.sohd}</Text>
                            <Text style={styles.date}>Ngày giao: {item.time_get}</Text>
                            <Text style={styles.status}>Trạng thái: {item.status}</Text>
                            {/* <Text style={styles.address}>Địa chỉ: {item.address}</Text> */}
                        </View>
                    ))}
                    {data?.FalseMonth.map((item, key) => (
                        <View style={[styles.deliveryItem, { backgroundColor: 'rgb(215, 146, 146)' }]} key={key}>
                            <Text style={styles.orderId}>Mã đơn hàng: {item.sohd}</Text>
                            <Text style={styles.date}>Ngày giao: {item.time_get}</Text>
                            <Text style={styles.status}>Trạng thái: {item.status}</Text>
                            {/* <Text style={styles.address}>Địa chỉ: {item.address}</Text> */}
                        </View>
                    ))}
                    <Text>Toàn bộ lịch sử</Text>
                    {data?.successAll.map((item, key) => (
                        <View style={styles.deliveryItem} key={key}>
                            <Text style={styles.orderId}>Mã đơn hàng: {item.sohd}</Text>
                            <Text style={styles.date}>Ngày giao: {item.time_get}</Text>
                            <Text style={styles.status}>Trạng thái: {item.status}</Text>
                            {/* <Text style={styles.address}>Địa chỉ: {item.address}</Text> */}
                        </View>
                    ))}
                    {data?.FalseAll.map((item, key) => (
                        <View style={[styles.deliveryItem, { backgroundColor: 'rgb(215, 146, 146)' }]} key={key}>
                            <Text style={styles.orderId}>Mã đơn hàng: {item.sohd}</Text>
                            <Text style={styles.date}>Ngày giao: {item.time_get}</Text>
                            <Text style={styles.status}>Trạng thái: {item.status}</Text>
                            {/* <Text style={styles.address}>Địa chỉ: {item.address}</Text> */}
                        </View>
                    ))}
                </ScrollView>
            </View>
        )

    )
}
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
    deliveryItem: {
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
    orderId: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a73e8',
    },
    date: {
        fontSize: 16,
        color: '#555',
    },
    status: {
        fontSize: 16,
        color: '#555',
    },
    address: {
        fontSize: 16,
        color: '#555',
    },
});
