import axios from "axios";
// import { ip } from './api'
import { urlGrap } from './domain'
// export const url = "http://" + ip + ":8081"

const apiGrap = axios.create({
    baseURL: urlGrap,
    timeout: 100000, // set timeout to 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});


apiGrap.interceptors.request.use(function (config) {
    if (config.method === 'get') {

        // config.data = null // xác nhận phương thức get không gửi dữ liệu 
        config.headers = {
            'Accept': 'application/json', // báo cho máy chủ muốn nhận dữ liệu response dạng json 
            'Content-Type': 'application/json'
        };
        return config

    }

    if (config.method === 'post') {


        config.headers = {
            // Authorization: `Bearer ${token2}`,
            'Accept': 'application/json', // báo cho máy chủ muốn nhận dữ liệu response dạng json 
            'Content-Type': 'application/json'
        };
        return config

    }

}, function (error) {
    // Xử lý lỗi

    console.log('lỗi ở intercepter.requset grap user')

    return Promise.reject(error);
});
apiGrap.interceptors.response.use(function (response) {
    // Trả về dữ liệu phản hồi
    // localStorage.setItem('token', response.data.access_token)

    // console.log(localStorage.getItem('token'))
    return response;
}, function (error) {
    // Xử lý lỗi
    // if (error.response.status === 403) {
    //     notify("xác thực không hợp lệ : 403", "error")
    // } else {
    //     notify(error.response.data, "error")
    // }

    alert("lỗi request " + error.response.status + " 8081" + error.response.data)
    console.log('lỗi' + error.response.status + " 8081", error.response)
    return Promise.reject(error);
});

export const post_createOder = (soHD, idGrap, priceOfGrap) => {
    return apiGrap.post(`oder-grap/create-oder?soHD=${soHD}&idGrap=${idGrap}&priceOfGrap=${priceOfGrap}`)
}
// export const ip = "192.168.1.9"
// export const urlGraps = "http://" + ip + ":8081"
export const get_oderGrap_on_month = (idGrap, status) => {
    return apiGrap.get(`oder-grap/oder-filter-by-idgrap-status-month?idGrap=${idGrap}&status=${status}`)
}
export const get_oderGrap_byIdGrap_andstatus = (idGrap, status) => {
    return apiGrap.get(`oder-grap/oder-filter-by-idgrap-status?idGrap=${idGrap}&status=${status}`)
}
// hàm hủy hóa đơn gio không giao được
export const post_destroyOder = (soHD, idGrap, commend) => {
    return apiGrap.post(`oder-grap/destroy-Oder?soHD=${soHD}&idGrap=${idGrap}&commend=${commend}`)
}

// hàm xác nhận đơn hàng với ảnh là uri từ camera
export const post_successOder = async (imageUri, idGrap, token, soHD) => {
    const formData = new FormData();
    formData.append('imageFile', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
    });
    formData.append('soHD', soHD);

    formData.append('idGrap', idGrap);
    // console.log('tesst token', token)
    formData.append('token', token);

    // console.log('check data ', soHD, idGrap)
    try {
        const response = await axios.post(`${urlGrap}/oder-grap/success-Oder`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;  // Xử lý dữ liệu trả về nếu cần
    } catch (error) {
        console.error('xác nhận giao hàng thất bại', error);
        throw error;
    }
};