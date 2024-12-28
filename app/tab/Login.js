import { post_createUser, post_login, saveUser } from '@/api/apiLogin';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Button, Dimensions, ScrollView, Image } from 'react-native';
import Cameraqr from '@/components/compone/Cameraqr'
import CameraFace from '@/components/compone/CameraFace'

// Màn hình Đăng nhập
const LoginScreen = ({ toggleScreen }) => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });

    const validate = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        // Kiểm tra email
        if (email.trim() == '') {
            newErrors.email = 'Email không được để trống';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
            isValid = false;
        }

        // Kiểm tra mật khẩu
        if (password.trim() == '') {
            newErrors.password = 'Mật khẩu không được để trống';
            isValid = false;
        }
        // else if (password.length < 6) {
        //     newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        //     isValid = false;
        // }


        // console.log('insawd', email, {
        //     status: isValid,
        //     errors: (newErrors.password + newErrors.email)
        // })
        return {
            status: isValid,
            errors: (newErrors.password + newErrors.email)
        };
    };

    const loginHandle = async () => {
        var check = validate()
        if (check.status) {
            try {
                console.log('assss')
                const respose = await post_login(email.trim(), password.trim())
                console.log('respose asdfghsssssssssssss ')
                if (respose.data.status != 'working') {
                    alert('tài khoản của bạn không đủ quyền để hoạt động')
                    return
                }
                console.log('sssssssssssssssssssssssssssss')
                await saveUser(respose.data)
                // navigation.navigate('home')
                navigation.push('Home');
            } catch (error) {
                // alert('lỗi đăng nhập không thành công ')
                console.log('log lỗi đăng nhập f', error)
            }

        }
        else {
            alert(check.errors)
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng Nhập</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={() => loginHandle()}>
                <Text style={styles.buttonText}>Đăng Nhập</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleScreen}>
                <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
            </TouchableOpacity>
        </View>
    );
};





// Màn hình Đăng ký



const RegisterScreen = ({ toggleScreen }) => {
    const [dataUser, setDataUser] = useState({

        name: null,
        sdt: null,
        address: null,
        gender: null,
        birth: null,
        scccd: null,
        password: null,
        imageCCCCD: null,
        // imageCCCDFace: null,
        imageFace: null,
        // status: null,
        // stepPrice: null,
        // notice: null,
        gmail: null
    })
    const [currentStep, setCurrentStep] = useState(0);


    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    const handleBacktStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };


    const hendelCreateUser = () => {
        const dataClear = Object.fromEntries(
            Object.entries(dataUser).map(([key, value]) => [key, value?.trim()])
        )
        console.log('dats ls', dataClear)
        const checkNull = Object.values(dataClear).some(value => value === null || value === '');
        if (checkNull) {
            alert("yêu cầu nhập đầy đủ thông tin yêu cầu")
            return
        }
        post_createUser(dataClear).then(() => alert("tạo tài khoản thành công yêu cầu chời tới khi quản trị xác thực danh tính"))
        toggleScreen()
    }
    const steps = [
        <Step1 setDataUser={setDataUser} toggleScreen={toggleScreen} dataUser={dataUser} handleNextStep={handleNextStep} handleBacktStep={handleBacktStep} />,
        <Step2 setDataUser={setDataUser} toggleScreen={toggleScreen} dataUser={dataUser} handleNextStep={handleNextStep} handleBacktStep={handleBacktStep} />,
        <Step3 setDataUser={setDataUser} toggleScreen={toggleScreen} dataUser={dataUser} handleNextStep={handleNextStep} handleBacktStep={handleBacktStep} />,
        <Step4 setDataUser={setDataUser} toggleScreen={toggleScreen} dataUser={dataUser} handleNextStep={handleNextStep} handleBacktStep={handleBacktStep} hendelCreateUser={hendelCreateUser} />


    ];
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
            <Text style={styles.title}>Đăng Ký</Text>
            <View style={styles.content}>
                {steps[currentStep]}
            </View>

            {/* Nút OK */}
            {/* {
                currentStep == 1 ? '' : (<View style={styles.buttonContainer} >
                    <Button title="Tiếp" />
                </View>)
            } */}

            <TouchableOpacity onPress={toggleScreen}>
                <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
            </TouchableOpacity>
        </View>
    );
};

// Điều hướng giữa màn hình Đăng nhập và Đăng ký
export default function Login() {
    const [isLogin, setIsLogin] = useState(true);

    const toggleScreen = () => {
        setIsLogin(!isLogin);
    };

    return isLogin ? <LoginScreen toggleScreen={toggleScreen} /> : <RegisterScreen toggleScreen={toggleScreen} />;
}

// Lấy chiều cao của màn hình
const { height } = Dimensions.get('window');
// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#0066cc',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    link: {
        color: '#0066cc',
        marginTop: 15,
        textAlign: 'center',
    },


    //// đăng ký ste p
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
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
    viewCamera: {
        width: '100%',
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        height: '80%',

    },


    inputContainer: {
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        color: 'black',
    },
    value: {
        fontSize: 16,
        color: 'black',
        backgroundColor: 'transparent',
        padding: 5,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
    },
    imageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    image: {
        width: 100, // Kích thước tùy chỉnh
        height: 100, // Kích thước tùy chỉnh
        borderRadius: 10,
    },
    confirmButton: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText2: {
        color: 'white',
        fontSize: 18,
    },
    container4: {
        flex: 1,
        padding: 20,

        backgroundColor: 'white',
    },




});



const Step1 = ({ dataUser, setDataUser, toggleScreen, handleNextStep, handleBacktStep }) => {

    return (
        <View>
            {/* <Cameraqr /> */}
            <TextInput
                placeholder="Email"
                value={dataUser.gmail}
                onChangeText={(ds) => setDataUser({ ...dataUser, gmail: ds })}
                style={styles.input}
            />
            <TextInput
                placeholder="sdt"
                value={dataUser.sdt}
                onChangeText={(ds) => setDataUser({ ...dataUser, sdt: ds })}

                style={styles.input}
            />
            <TextInput
                placeholder="mật khẩu"
                value={dataUser.password}
                onChangeText={(ds) => setDataUser({ ...dataUser, password: ds })}
                secureTextEntry
                style={styles.input}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={[styles.button, { width: 100 }]} onPress={() => handleBacktStep()} >
                    <Text style={styles.buttonText}>{'<'} Quay lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { width: 100 }]} onPress={() => handleNextStep()} >
                    <Text style={styles.buttonText}>Tiếp{'>'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const Step2 = ({ dataUser, setDataUser, toggleScreen, handleNextStep, handleBacktStep }) => {

    return (
        <View style={{ width: '100%', height: '100%' }}>

            <View style={styles.viewCamera}>
                <Cameraqr setDataUser={setDataUser} toggleScreen={toggleScreen} dataUser={dataUser} />

            </View>
            <Text>Chụp mặt trước thẻ cccd có chip</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={[styles.button, { width: 100 }]} onPress={handleBacktStep} >
                    <Text style={styles.buttonText}>{'<'} Quay lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { width: 100 }]} onPress={handleNextStep} >
                    <Text style={styles.buttonText}>Tiếp{'>'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const Step3 = ({ dataUser, setDataUser, toggleScreen, handleNextStep, handleBacktStep }) => {

    return (
        <View style={{ width: '100%', height: '100%' }}>

            <View style={styles.viewCamera}>
                <CameraFace setDataUser={setDataUser} toggleScreen={toggleScreen} dataUser={dataUser} />

            </View>
            <Text>Chụp mặt trước thẻ cccd có chip</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={[styles.button, { width: 100 }]} onPress={handleBacktStep} >
                    <Text style={styles.buttonText}>{'<'} Quay lại</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { width: 100 }]} onPress={handleNextStep} >
                    <Text style={styles.buttonText}>Tiếp{'>'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const Step4 = ({ dataUser, setDataUser, toggleScreen, handleNextStep, handleBacktStep, hendelCreateUser }) => {

    return (
        <ScrollView style={[styles.container4]}>
            {/* Hiển thị thông tin người dùng */}
            {Object.entries(dataUser).map(([key, value]) => (
                <View key={key} style={styles.inputContainer}>
                    <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
                    <Text style={styles.value}>{value}</Text>
                </View>
            ))}

            {/* Thẻ ảnh nằm trên một dòng */}
            <View style={styles.imageRow}>
                <Image source={{ uri: dataUser.imageCCCCD }} style={styles.image} />
                <Image source={{ uri: dataUser.imageFace }} style={styles.image} />
            </View>

            {/* Nút xác nhận */}
            <TouchableOpacity style={styles.confirmButton} onPress={() => hendelCreateUser()}>
                <Text style={styles.buttonText2}>Xác nhận</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 100 }}>
                <TouchableOpacity style={[styles.button, { width: 100 }]} onPress={handleBacktStep} >
                    <Text style={styles.buttonText}>{'<'} Quay lại</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    )
}
