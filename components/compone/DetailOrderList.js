import { addressStore, cutAddressString, get_calculateDistance, get_price_manageGrap } from '@/api/api';
import { post_createOder } from '@/api/grapserviceApi'
import { getUser } from '@/api/apiLogin'
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

const OrderDetailForm = ({ route }) => {
    const navigation = useNavigation()
    const { data } = route.params
    const [user, setUser] = useState({})
    const [priceManage, setPriceManage] = useState({
        priceBase: 0,
        priceOnKM: 0
    })
    const address = cutAddressString(data.diachi)
    const [km, setKm] = useState(0)
    const getDataPrice = async () => {
        const response = await get_price_manageGrap()
        const responseUser = await getUser()
        setUser(responseUser)
        setPriceManage({
            priceBase: response.data.priceBase,
            priceOnKM: response.data.priceOnKM
        })
        // lấy khoảng cách đường đi giữa 2 điểm và đôỉ sang km
        const kmResponse = await get_calculateDistance(addressStore, {
            latitude: address.latitude,
            longitude: address.longitude
        })
        setKm((kmResponse.data.routes[0].distance / 1000).toFixed(2))
    }
    const [region, setRegion] = useState({
        latitude: address.latitude,
        longitude: address.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });

    // const handleMapPress = (e) => {
    //     setRegion({
    //         ...region,
    //         latitude: e.nativeEvent.coordinate.latitude,
    //         longitude: e.nativeEvent.coordinate.longitude,
    //     });
    // };


    function formatDate(timeString) {
        if (!timeString) {
            return timeString
        }
        const year = timeString.slice(0, 4);
        const month = timeString.slice(4, 6);
        const day = timeString.slice(6, 8);

        return `${day}/${month}/${year}`;
    }

    // hàm tạo đơn hàng 
    const createOder = () => {

        post_createOder(data.sohd, user.id, (priceManage.priceBase + priceManage.priceOnKM * km)).then(() =>
            alert("tạo đơn hàng thành công"), navigation.navigate("home"))
    }

    useEffect(() => {
        getDataPrice()
    }, [])
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
            // onPress={handleMapPress}
            >
                <Marker coordinate={region} />
            </MapView>

            <ScrollView horizontal={true} style={styles.scrollContainer}>
                <View style={styles.infoContainer}>
                    {/* Bảng thông tin đơn hàng */}
                    <ScrollView style={styles.innerScroll}>
                        <Text style={styles.header}>Chi tiết đơn hàng</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Mã hóa đơn</Text>
                            <Text style={styles.valueText}>{data.sohd}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Tên người dùng</Text>
                            <Text style={styles.valueText}>{data.tennguoinhan}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>SĐT khách hàng</Text>
                            <Text style={styles.valueText}>{data.sdt}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Địa chỉ</Text>
                            <Text style={styles.valueText}>{address.address}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Thời gian mua</Text>
                            <Text style={styles.valueText}>{formatDate(data.ngaytao)}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Giá trị đơn hàng</Text>
                            <Text style={styles.valueText}>{data.tongtien.toLocaleString('vi-VN')} VND</Text>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={() => createOder()}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }} >
                                Nhận đơn
                            </Text>


                        </TouchableOpacity>

                    </ScrollView>
                </View>

                <View style={styles.infoContainer}>
                    {/* Bảng thông tin bổ sung */}
                    <ScrollView style={styles.innerScroll}>
                        <Text style={styles.header}>Giá trị đối với nhân viên </Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Khoảng cách</Text>
                            <Text style={styles.valueText}>{km}km</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Giá cơ bản 1 hóa đơn</Text>
                            <Text style={styles.valueText}>{priceManage?.priceBase.toLocaleString('vi-VN')} VND</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Giá trên cộng thêm/km</Text>
                            <Text style={styles.valueText}>{priceManage?.priceOnKM.toLocaleString('vi-VN')} VND</Text>
                        </View>
                        <Text style={styles.header}>Tổng giá trị: {(priceManage.priceBase + priceManage.priceOnKM * km).toLocaleString('vi-VN')} VND </Text>

                    </ScrollView>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    map: {
        width: '100%',
        height: height * 0.5, // Chiếm 50% chiều cao màn hình
    },
    scrollContainer: {
        flexDirection: 'row', // Vuốt ngang giữa các bảng
    },
    infoContainer: {
        width: width * 0.9, // Đặt chiều rộng cho mỗi bảng
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginHorizontal: 10, // Khoảng cách giữa các bảng
    },
    innerScroll: {
        maxHeight: height * 0.5, // Đảm bảo chiều cao tối đa cho bảng cuộn
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4B5563',
        marginBottom: 15,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Đảm bảo tiêu đề và nội dung cách nhau đều
        marginBottom: 10,
        paddingVertical: 5, // Padding dọc giữa các dòng
    },
    label: {
        width: '40%', // Cột chứa tiêu đề
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    valueText: {
        width: '60%', // Cột chứa nội dung
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    button: {
        backgroundColor: 'rgb(240, 105, 238)',
        height: 40,
        width: '90%',
        color: 'while',
        margin: 'auto',
        borderRadius: 20,
        alignItems: 'center',
        paddingTop: 7
    },

});

export default OrderDetailForm;
