import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { urlGrap } from './domain';

const user = {
    id: 1,
    name: "user",
    password: "1",
    gmail: "ay@gmail.com"
}
// Hàm lưu biến user
export const saveUser = async (user) => {
    const uc = await getUser()
    if (uc != null) {
        removeUser()
    }
    try {
        await AsyncStorage.setItem('@user', JSON.stringify(user));
        // console.log('User saved successfully');
    } catch (error) {
        console.error('Failed to save the user session', error);
    }
};


// Hàm lấy biến user
export const getUser = async () => {
    try {
        const user = await AsyncStorage.getItem('@user');
        if (user !== null) {
            return JSON.parse(user);
        }
        console.log('No user found');
        return null;
    } catch (error) {
        console.error('Failed to fetch the user session', error);
        return null;
    }
};


// Hàm hủy bỏ biến user
export const removeUser = async () => {
    try {
        await AsyncStorage.removeItem('@user');
        console.log('User removed successfully');
    } catch (error) {
        console.error('Failed to remove the user session', error);
    }
};


///// luu token để lắng nghe thông báo
export const saveUTokenNotification = async (token) => {
    const uc = await getTokenNotification()
    if (uc != null) {
        removeTokenNotification()
    }
    try {
        await AsyncStorage.setItem('@notificationToken', JSON.stringify(token));
        console.log('TokenNotification saved successfully', token);
    } catch (error) {
        console.error('Failed to save the TokenNotification session', error);
    }
};

export const getTokenNotification = async () => {
    try {
        const user = await AsyncStorage.getItem('@notificationToken');
        if (user !== null) {
            return JSON.parse(user);
        }
        console.log('can; find token');
        return null;
    } catch (error) {
        console.error('Failed to fetch the user session', error);
        return null;
    }
};
export const removeTokenNotification = async () => {
    try {
        await AsyncStorage.removeItem('@notificationToken');
        console.log('TokenNotification removed successfully');
    } catch (error) {
        console.error('Failed to remove the user session', error);
    }
};



///////////// api login

const axiosInstance = axios.create({
    baseURL: urlGrap, // URL API của bạn
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});
// Interceptor để bắt và xử lý lỗi trong response
axiosInstance.interceptors.response.use(
    function (response) {
        // Trả về dữ liệu phản hồi

        return response;
    }, function (error) {
        // Xử lý lỗi
        // if (error.response.status === 403) {
        //     notify("xác thực không hợp lệ : 403", "error")
        // } else {
        //     notify(error.response.data, "error")
        // }
        if (error.response.status === 400) {
            // alert("xác thực không hợp lệ : 403")
        }

        alert("Đăng nhập không thành công co thể không đúng gmail và mật khẩu")
        console.log(' log lỗi', error, " 8081", error.response)
        return Promise.reject(error);
    })

export const post_login = (gmail, password) => {
    // console.log('user logsa' + gmail + password)
    return axiosInstance.post('/grapuser/login', {
        gmail: gmail,
        password: password
    })

};

export const post_createUser = (dataUser) => {
    const formData = new FormData();

    // Thêm các trường vào formData một cách thủ công
    formData.append('name', dataUser.name); // Hoặc giá trị thực tế
    formData.append('sdt', dataUser.sdt); // Hoặc giá trị thực tế
    formData.append('address', dataUser.address); // Hoặc giá trị thực tế
    formData.append('gender', dataUser.gender); // Hoặc giá trị thực tế
    formData.append('birth', dataUser.birth); // Hoặc giá trị thực tế
    formData.append('scccd', dataUser.scccd); // Hoặc giá trị thực tế
    formData.append('password', dataUser.password); // Hoặc giá trị thực tế

    formData.append('imageCCCD', {
        uri: dataUser.imageCCCCD,
        type: 'image/jpeg',
        name: 'imageCCCCD.jpg', // Tên tệp
    });
    formData.append('imageFace', {
        uri: dataUser.imageFace,
        type: 'image/jpeg',
        name: 'imageFace.jpg', // Tên tệp
    });

    formData.append('gmail', dataUser.gmail);

    // console.log('check data ', soHD, idGrap)
    try {
        const response = axios.post(`${urlGrap}/grapuser/create-grapuser`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response;  // Xử lý dữ liệu trả về nếu cần
    } catch (error) {
        console.error('Tạo tài khoản thất bại', error);
        alert("tạo Tài khoản thất bại")
        // throw error;
    }
};