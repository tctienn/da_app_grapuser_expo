import { cutAddressString, get_detail_invoice_bysohd } from '@/api/api';
import { post_createOder, post_destroyOder } from '@/api/grapserviceApi'
import { getUser } from '@/api/apiLogin'
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, ScrollView, TouchableOpacity, Linking, Modal, TextInput, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import MapDirections from './MapDirections'

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

const DetailReceivedOder = ({ route }) => {
    const navigation = useNavigation()
    const { soHD } = route.params
    const [user, setUser] = useState({})
    const [invoice, SetInvoice] = useState(null)

    const [dialogDestroy, setDialogDestroy] = useState(false)

    const [address, setAddress] = useState("")
    // const [km, setKm] = useState(0)
    const [region, setRegion] = useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });
    const getDataPrice = async () => {
        const responseInvoice = await get_detail_invoice_bysohd(soHD)
        SetInvoice(responseInvoice.data)
        // console.log("data", soHD, responseInvoice.data)
        setAddress(cutAddressString(responseInvoice.data.diachi).address)
        setRegion({
            latitude: cutAddressString(responseInvoice.data.diachi).latitude,
            longitude: cutAddressString(responseInvoice.data.diachi).longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        })

        // const response = await get_price_manageGrap()
        const responseUser = await getUser()
        setUser(responseUser)


    }


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

    const showConfirm = () => {
        Alert.alert(
            "Xác nhận",
            "Bạn có chắc muốn hủy đơn hàng này",
            [
                {
                    text: "không",
                    onPress: () => { setDialogDestroy(false); return; },
                    style: "cancel"
                },
                {
                    text: "Chắc chắn",
                    onPress: () => {
                        if (text.trim() == '') {
                            alert("bạn chưa nhập gì ")
                            return
                        }
                        post_destroyOder(invoice.sohd, user.id, text).then(() => { showConfirm2() })

                    }
                }
            ],
            { cancelable: false }
        );
    };
    const showConfirm2 = () => {
        Alert.alert(
            "Xác nhận",
            "Hủy thành công hóa đơn",
            [

                {
                    text: "ok",
                    onPress: () => {
                        navigation.navigate('home')
                    }
                }
            ],
            { cancelable: false }
        );
    };
    const [text, setText] = useState()
    const destroyOderHandle = () => {
        showConfirm()
    }


    useEffect(() => {
        getDataPrice()
    }, [])
    if (invoice == null) {
        return (
            <View>
                <Text>lỗi tải dữ liệu </Text>
            </View>
        )
    }
    return (

        <View style={styles.container}>
            {/* <MapView
                style={styles.map}
                region={region}
            // onPress={handleMapPress}
            >
                <Marker coordinate={region} />
            </MapView> */}
            <View style={styles.map}>
                <MapDirections address={{ address, region }} />

            </View>

            <ScrollView horizontal={true} style={styles.scrollContainer}>
                <View style={styles.infoContainer}>
                    {/* Bảng thông tin đơn hàng */}
                    <ScrollView style={styles.innerScroll}>
                        <Text style={styles.header}>Chi tiết đơn hàng</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Mã hóa đơn</Text>
                            <Text style={styles.valueText}>{invoice.sohd}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Tên người dùng</Text>
                            <Text style={styles.valueText}>{invoice.tennguoinhan}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>SĐT khách hàng</Text>
                            {/* <Text style={styles.valueText}>{invoice.sdt}</Text> */}
                            <TouchableOpacity style={{ margin: 0, padding: 0, width: 100 }} onPress={() => { Linking.openURL(`tel:${invoice.sdt}`); }} >
                                <Text style={[styles.valueText, { color: 'rgb(24, 209, 255)', width: 'auto' }]}>{invoice.sdt}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Địa chỉ</Text>
                            <Text style={styles.valueText}>{address}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Thời gian mua</Text>
                            <Text style={styles.valueText}>{formatDate(invoice.ngaytao)}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Giá trị đơn hàng</Text>
                            <Text style={styles.valueText}>{invoice.tongtien?.toLocaleString('vi-VN')} VND</Text>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SuccessOder', { invoice: invoice })}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }} >
                                xác nhận giao hàng
                            </Text>


                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { borderWidth: 1, borderColor: 'rgb(195, 106, 106)', backgroundColor: 'white', margin: 5 }]} onPress={() => { setDialogDestroy(true) }}>
                            <Text style={{ color: 'rgb(212, 100, 100)', fontWeight: 'bold', fontSize: 18 }} >
                                Hủy đơn hàng
                            </Text>


                        </TouchableOpacity>
                        {/* dialog hủy đơn */}
                        <Modal visible={dialogDestroy} transparent={true} animationType="slide">
                            <View style={styles.overlay}>
                                <View style={styles.containerDialog}>
                                    {/* Nút thoát */}
                                    <TouchableOpacity onPress={() => setDialogDestroy(false)} style={styles.exitButton}>
                                        <Text style={styles.exitButtonText}>X</Text>
                                    </TouchableOpacity>

                                    {/* Ô nhập văn bản */}
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Nhập lý do hủy"
                                        value={text}
                                        onChangeText={setText}
                                    />

                                    {/* Nút xác nhận */}
                                    <TouchableOpacity onPress={() => {
                                        // Xử lý khi nhấn nút xác nhận hủy
                                        destroyOderHandle()
                                    }} ><Text>Xác nhận hủy</Text></TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                        {/* dialog hủy đơn */}

                    </ScrollView>
                </View>

                <View>

                </View>
                {/* <View style={styles.infoContainer}>
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
                </View> */}
            </ScrollView >
        </View >
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
        justifyContent: 'flex-start', // Đảm bảo tiêu đề và nội dung cách nhau đều
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


    // dialog hủy đơn
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Màu nền mờ
    },
    containerDialog: {
        width: '90%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    exitButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#ff4d4d',
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    exitButtonText: {
        color: 'white',
        fontSize: 18,
    },
    textInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
        marginBottom: 20,
        paddingHorizontal: 10,
    },

});

export default DetailReceivedOder;
