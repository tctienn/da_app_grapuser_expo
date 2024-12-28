import { useEffect, useRef, useState } from 'react';
import { View, Text, Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { saveUTokenNotification } from '../../api/apiLogin'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export function ListenNotification() {
    // const [expoPushToken, setExpoPushToken] = useState('');
    const notificationListener = useRef();

    useEffect(() => {
        // Register for push notifications and get the token
        registerForPushNotificationsAsync().then(token => {
            if (token) {
                // setExpoPushToken(token);
                saveUTokenNotification(token);
            }
        });

        // Listen for incoming notifications
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        });

        return () => {
            notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
        };
    }, []);




}

async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            Alert.alert('Failed to get push token for push notifications!');
            return;
        }
        // Lấy projectId từ cấu hình Expo
        const projectId = Constants.expoConfig.extra.eas.projectId;
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } else {
        Alert.alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}
