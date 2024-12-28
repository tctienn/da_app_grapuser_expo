import axios from "axios";
import { urlProduct } from './domain'

// hàm cắt chuỗi địa chỉ trong hóa đơn
export const cutAddressString = (inputString) => {

    // console.log(inputString)
    // Tách chuỗi theo dấu '|'
    try {
        const parts = inputString.split('|');

        // Lấy địa chỉ và tọa độ
        const address = parts[1].trim();
        const latitude = parts[2].replace('LAT:', '').trim();
        const longitude = parts[3].replace('LON:', '').trim();

        // Tạo mảng đối tượng
        const result = {
            address: address,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
        };

        return result;
    } catch (err) {
        return "";
    }
}

export const addressStore = {
    latitude: 21.047047623091505,
    longitude: 105.78830344150275,
}

// const url = "https://66870f8683c983911b0472c4.mockapi.io"
// export const ip = "192.168.1.9"
// const ip = "172.20.10.2"  // iphone
// export const url = "http://" + ip + ":8080"

const apiUser = axios.create({
    baseURL: urlProduct,
    timeout: 100000, // set timeout to 10 seconds
    headers: {
        // 'Content-Type': 'application/json',
    },
});

export const get_invoice_wait = () => {
    return apiUser.get(`public/ManageGrap/invoice/get-invoice-wait`)
}

export const get_price_manageGrap = () => {
    return apiUser.get(`public/ManageGrap/get-detail`)
}
export const get_detail_invoice_bysohd = (soHD) => {
    return apiUser.get(`public/personnel/get-invoice-bysohdv2?soHD=${soHD}`)
}


// tính toán khoảng cách và đường đi giữa 2 tọa độ
export const get_calculateDistance = (startPoint, endPoint) => {
    // console.log("test data start", startPoint)
    const start = `${startPoint.longitude},${startPoint.latitude}`;
    const end = `${endPoint.longitude},${endPoint.latitude}`;
    return axios.get(`http://router.project-osrm.org/route/v1/driving/${start};${end}?overview=false`)
}