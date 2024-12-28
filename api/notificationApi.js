import axios from 'axios';
import { urlNotification } from './domain'
const apiNotification = axios.create({
    baseURL: urlNotification,
    timeout: 100000, // set timeout to 10 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

export const get_notificationForUser = (idGrap) => {
    return apiNotification.get(`notification/get-notification-grapuser?idGrap=${idGrap}`)
}


