import React, { useRef, useState } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView, StatusBar, StyleSheet, Platform, Text, View, Button, TouchableOpacity, Image } from 'react-native';

export default function Cameraqr({ dataUser, setDataUser, toggleScreen }) {
    const qrLock = useRef(false);
    const [scannedData, setScannedData] = useState(null); // State lưu dữ liệu mã QR đã quét
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState(null)
    const cameraRef = useRef(null);  // Tham chiếu đến CameraView

    if (!permission) {
        // tải chờ quyền truy cập ảnh
        return <View />;
    }

    if (!permission.granted) {

        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>Chúng tôi cần sự cho phép của bạn để hiển thị máy ảnh</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }
    const convertDate = (dateString) => {
        // Lấy các phần của chuỗi ngày
        const day = dateString.substring(0, 2);
        const month = dateString.substring(2, 4);
        const year = dateString.substring(4, 8);

        // Tạo chuỗi mới theo định dạng yyyy-MM-dd
        return `${year}-${month}-${day}`;
    }
    const dataScandHadnle = (data) => {
        setScannedData(data)
        console.log('data q', data)
        arr = data.split('|');
        setDataUser({
            ...dataUser,
            name: arr[2],
            address: arr[5],
            gender: arr[4],
            birth: convertDate(arr[3]),
            scccd: arr[0],
            // imageCCCCD: null,
        })
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 1, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            setPhoto(data.uri);  // Lưu URI của ảnh vào biến photo
            setDataUser({
                ...dataUser,
                imageCCCCD: data.uri,
            })
        }
    };


    return (
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            {/* Ẩn thanh trạng thái trên Android */}
            {Platform.OS === 'android' ? <StatusBar hidden /> : null}

            {/* CameraView để quét mã QR */}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing='back'
                ref={cameraRef}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={({ data }) => {
                    if (data && !qrLock.current) {
                        qrLock.current = true;
                        dataScandHadnle(data); // Lưu dữ liệu mã QR vào state
                        setTimeout(() => {
                            qrLock.current = false; // Reset để cho phép quét lần nữa
                        }, 1000);
                    }
                }}
            >


            </CameraView>
            {/* Hiển thị dữ liệu mã QR đã quét */}
            <View style={styles.overlay} />
            {scannedData && (
                <Text style={styles.qrText} numberOfLines={1} ellipsizeMode="tail">Scanned QR Code: {scannedData}</Text>
            )}
            {scannedData && (
                <View style={styles.buttonContainer}>

                    <TouchableOpacity style={styles.takepicture} onPress={takePicture}>
                        <Text style={{ color: 'white', fontSize: 18 }}>Chụp ảnh</Text>
                    </TouchableOpacity>
                </View>
            )}
            {photo && (
                <View style={styles.preview}>
                    <Image source={{ uri: photo }} style={styles.image} />

                </View>
            )}

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    qrText: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
    },
    takepicture: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    image: {
        width: '50%',
        height: "50%",
    },
    overlay: {

        position: 'absolute',
        top: '0%',
        left: '50%',
        width: "80%",
        height: '40%',
        backgroundColor: 'transparent',
        borderWidth: 5,
        borderColor: 'gold',
        borderRadius: 20,
        marginLeft: "-40%", // Giảm một nửa chiều rộng
        marginTop: "40%", // Giảm một nửa chiều cao
    }
});
