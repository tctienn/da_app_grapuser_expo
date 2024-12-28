import { useNavigation } from "@react-navigation/native";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cutAddressString, get_invoice_wait } from '@/api/api'; // Đảm bảo API này trả về một Promise
import { useEffect, useState } from "react";

export default function OrderList() {
    const navigation = useNavigation();
    // sử lý load lại trang bằng cách vuốt màn hình
    const [refreshing, setRefreshing] = useState(false);

    const [data, setData] = useState([]);

    const getData = async () => {
        try {
            const response = await get_invoice_wait();
            setData(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
            alert("Lỗi khi lấy dữ liệu:", error)
        }
    };

    useEffect(() => {
        getData();
    }, []); // Gọi getData() một lần khi component mount
    function formatDate(timeString) {
        if (!timeString) {
            return timeString
        }
        const year = timeString.slice(0, 4);
        const month = timeString.slice(4, 6);
        const day = timeString.slice(6, 8);

        return `${day}/${month}/${year}`;
    }



    // load lại trang bằng hành động vuốt
    const onRefresh = () => {
        setRefreshing(true);
        // Giả lập một tác vụ tải lại dữ liệu
        setTimeout(() => {
            setRefreshing(false);
            getData();
        }, 2000);
    };

    return (
        <View style={styles.containerList}>
            <ScrollView style={styles.scrollView} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
                {data?.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.item} onPress={() => { navigation.navigate('DetailOrderList', { data: item }) }}>
                        <Text style={styles.itemName} numberOfLines={2} >Địa chỉ: {cutAddressString(item.diachi).address}</Text>
                        <Text style={styles.itemName}>Mã: {item.sohd}</Text>

                        <Text style={styles.itemAddress}>Thời gian mua: {formatDate(item.ngaytao)}</Text>
                    </TouchableOpacity>
                ))}
                {/* <Text>ss</Text> */}
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({

    containerList: {
        width: '100%',
        height: 400,
        backgroundColor: '#f0f0f0', // Màu nền cho thẻ View chính
        padding: 10,
    },
    scrollView: {
        flex: 1, // Đảm bảo ScrollView chiếm toàn bộ không gian còn lại
    },
    item: {
        width: '100%', // Chiều rộng gần bằng thẻ View chính
        padding: 10,
        marginVertical: 5,
        backgroundColor: '#fff', // Màu nền cho từng item
        borderRadius: 5, // Bo góc cho từng item
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2, // Đổ bóng cho Android
    },
    itemName: {
        fontSize: 16, // Kích thước chữ cho tên
        fontWeight: 'bold', // Chữ đậm
    },
    itemAddress: {
        fontSize: 14, // Kích thước chữ cho địa chỉ
        color: '#555', // Màu chữ cho địa chỉ
    },


})