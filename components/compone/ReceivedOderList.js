import { useNavigation } from "@react-navigation/native";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { cutAddressString } from '@/api/api';
import { getUser } from '@/api/apiLogin';
import { get_oderGrap_byIdGrap_andstatus } from '@/api/grapserviceApi';
import { useEffect, useState } from "react";

export default function ReceivedOderList() {
    const navigation = useNavigation();
    const [user, setUser] = useState({})
    // sử lý load lại trang bằng cách vuốt màn hình
    const [refreshing, setRefreshing] = useState(false);

    const [data, setData] = useState([]);

    const getData = async () => {

        try {
            const responseUser = await getUser()
            setUser(responseUser)
            // console.log('userssssss', user.id)
            const response = await get_oderGrap_byIdGrap_andstatus(responseUser.id, 'received');
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
                    <TouchableOpacity key={index} style={styles.item} onPress={() => { navigation.navigate('DetailReceivedOder', { soHD: item.sohd }) }}>
                        {/* <Text style={styles.itemName} numberOfLines={2} >Địa chỉ: {cutAddressString(item.diachi).address}</Text> */}
                        <Text style={styles.itemName}>Số hóa đơn: {item.sohd}</Text>
                        <Text style={styles.itemAddress}>Thời gian nhận: {item.time_get}</Text>
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