
import { Link, useRouter } from 'expo-router';
// import { Text, View } from 'react-native';
import { ScrollView, Text, View, RefreshControl, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import DemoMap from '../../components/map/DemoMap'

export default function ay() {
    const router = useRouter();

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        as()
        // Thực hiện các hành động làm mới tab ở đây
        setTimeout(() => {

            setRefreshing(false);
        }, 2000);
    };

    const goToDetails = () => {
        router.push('/Explores');
    };
    const goToDetailss = () => {
        router.push('/ays');
    };
    const demo = async () => {
        try {
            await AsyncStorage.setItem('@user_token', "ayyyyy").then(() => ays())
        } catch (error) {
            console.error('Failed to save the user session', error);
        }



    }
    demo()
    const ays = async () => {
        try {
            const token = await AsyncStorage.getItem('@user_token');
            if (token !== null) {
                // alert(token)
                // Token tồn tại
                return token;
            }
            // Token không tồn tại
            return null;
        } catch (error) {
            console.error('Failed to fetch the user session', error);
            return null;
        }
    }
    const as = () => {
        alert('s')
    }

    useEffect(() => {
        // as()
    }, []);
    return (
        <ScrollView
            contentContainerStyle={{
                flex: 1
            }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }


        >
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1.4 }}>
                    <Link
                        href={{
                            pathname: "/user/[id]",
                            params: { id: 'bacon' }
                        }}

                    >
                        View users
                    </Link>
                    <Link
                        href={{
                            pathname: "/explore",
                            params: { id: 'bacon' }
                        }}>
                        View user
                    </Link>
                    <Text onPress={goToDetails}>
                        uiiiiii
                    </Text>
                    <Text onPress={goToDetailss} >
                        uiiiiiissss
                    </Text>
                </View>
                <View style={{ flex: 8.6 }}>
                    <DemoMap />

                </View>


            </View>
        </ScrollView>


    );
}
