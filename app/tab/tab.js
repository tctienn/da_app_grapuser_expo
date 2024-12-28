import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';

import Home from './index';
import Camera from './camera';
import User from './user'
import Notification from './Notification'
import History from './History'

// import datcho from './datcho';
const Tab = createBottomTabNavigator();

export default function TabLayout() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarLabel: 'Trang chủ',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            {/* <Tab.Screen
                name="Camera"
                component={Camera}
                options={{
                    tabBarLabel: 'camera',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color} />
                    ),
                }}
            /> */}
            <Tab.Screen
                name="History"
                component={History}
                options={{
                    tabBarLabel: 'Lịch sử giao hàng',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="history" size={size} color={color} />
                    ),
                    headerShown: false,

                }}
            />
            <Tab.Screen
                name="Notification"
                component={Notification}
                options={{
                    tabBarLabel: 'Thông báo',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="bell" size={size} color={color} />
                    ),
                    headerShown: false,

                }}
            />
            <Tab.Screen
                name="User"
                component={User}
                options={{
                    tabBarLabel: 'Người dùng',
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="user" size={size} color={color} />
                    ),
                    headerShown: false,

                }}
            />



        </Tab.Navigator>
    );
}
