import { cutAddressString } from '@/api/api';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { SuccessOderCamera } from './SuccessOderCamera'
import { getUser } from '@/api/apiLogin';
function formatDate(timeString) {
    if (!timeString) {
        return timeString
    }
    const year = timeString.slice(0, 4);
    const month = timeString.slice(4, 6);
    const day = timeString.slice(6, 8);

    return `${day}/${month}/${year}`;
}
function cutStringProduct(input) {
    // Chia chuỗi theo dòng và sau đó map để chuyển đổi mỗi dòng thành đối tượng
    return input.split('|').map(line => {
        const parts = line.split(','); // Tách từng phần bằng dấu phẩy
        const namePart = parts[0].split(':')[1].trim(); // Lấy phần name
        const quantityPart = parts[1].split(':')[1].trim(); // Lấy phần quantity

        return {
            name: namePart,
            quantity: parseInt(quantityPart, 10), // Chuyển đổi thành số nguyên
        };
    });
}
export default function SuccessOder({ route }) {
    const { invoice } = route.params
    const [user, setUser] = useState({})
    const [currentStep, setCurrentStep] = useState(0);
    // console.log('dats___', route.params)
    const steps = [
        step1(invoice),
        step2(user.id, invoice),

    ];

    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const getData = async () => {
        const responseUser = await getUser()
        setUser(responseUser)
    }
    useEffect(() => {
        getData()
    }, [])
    return (
        <View style={styles.container}>
            {/* Thanh trạng thái */}
            <View style={styles.statusBar}>
                {steps.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.statusDot,
                            index <= currentStep ? styles.activeDot : styles.inactiveDot
                        ]}
                    />
                ))}
            </View>

            {/* Hiển thị thành phần hiện tại */}
            <View style={styles.content}>
                {steps[currentStep]}
            </View>

            {/* Nút OK */}
            {
                currentStep == 1 ? '' : (<View style={styles.buttonContainer} >
                    <Button title="Tiếp" onPress={handleNextStep} />
                </View>)
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0'
    },
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    statusDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: 'green',
    },
    inactiveDot: {
        backgroundColor: 'lightgray',
    },
    content: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        // borderWidth: 10
    },
    component: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 20,
    },

    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4B5563',
        marginBottom: 15,
        textAlign: 'center',
    },
    scrollContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
        // borderWidth: 10
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start', // Đảm bảo tiêu đề và nội dung cách nhau đều
        marginBottom: 10,
        paddingVertical: 5, // Padding dọc giữa các dòng
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: '#555',
    },
});



// form 

const step1 = (data) =>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Chi tiết đơn</Text>

        <View style={styles.row}>
            <Text style={styles.label}>Tên người dùng: </Text>
            <Text style={styles.value}>{data.tennguoinhan}</Text>
        </View>


        <View style={styles.row}>
            <Text style={styles.label}>Mã đơn (số hóa đơn): </Text>
            <Text style={styles.value}>{data.sohd}</Text>
        </View>

        <View style={styles.row}>
            <Text style={styles.label}>Số điên thoại:</Text>
            <Text style={styles.value}>{data.sdt}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>Gmail:</Text>
            <Text style={styles.value}>{data.gmail}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>Địa chỉ: </Text>
            <Text style={styles.value}>{cutAddressString(data.diachi).address}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>Thời gian mua: </Text>
            <Text style={styles.value}>{formatDate(data.ngaytao)}</Text>
        </View>
        <View style={styles.row}>
            <Text style={styles.label}>Sản phẩm</Text>
            <Text style={styles.value}>{cutStringProduct(data.sp).map(e => { return (e.name + ' số lượng: ' + e.quantity + '\n') })}</Text>
        </View>
        <Text style={styles.header}>Giá trị đơn hàng: {data.tongtien.toLocaleString('vi-VN')} vnd  </Text>


    </ScrollView>

const step2 = (idGrap, data) => {
    return (<SuccessOderCamera data={{ idGrap: idGrap, soHD: data.sohd }} />)

}