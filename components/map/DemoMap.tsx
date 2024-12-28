


import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Image, Button, Pressable, Text } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';


const initialRegion = {
    latitude: 21.053604448535907,
    longitude: 105.78336286326798,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const electricUniversity = {
    latitude: 21.053604448535907,
    longitude: 105.78336286326798,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const bKUniversity = {
    latitude: 20.9970896527313,
    longitude: 105.84578232370626,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

interface Coordinate {
    latitude: number;
    longitude: number;
}



export default function App() {
    const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);

    ///////địa chỉ hiện tại////////

    const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);

    let stopaddress = false
    const stopAddress = () => {
        stopaddress = true
        alert('ok')
    }




    // };
    const watchLocation = async () => {
        if (stopaddress) {
            return
        }
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            return;
        }
        const locationSubscription = await Location.watchPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 2,
        }, (location) => {
            const { latitude, longitude } = location.coords;
            setCurrentLocation({ latitude, longitude });
            // Khi đã nhận được địa chỉ hiện tại, dừng việc cập nhật
            // alert('s')
            locationSubscription.remove();


        });

    };
    watchLocation()

    // Location.stopLocationUpdatesAsync(watchLocation)
    // useEffect(() => {



    //     return () => Location.stopLocationUpdatesAsync(watchLocation);
    // }, []);







    ///////////////


    useEffect(() => {
        alert(" request chỉ đường ")

        const getRoute = async () => {
            try {
                const response = await axios.get(
                    `http://router.project-osrm.org/route/v1/driving/${electricUniversity.longitude},${electricUniversity.latitude};${bKUniversity.longitude},${bKUniversity.latitude}?overview=full&geometries=geojson`
                );
                const coordinates: Coordinate[] = response.data.routes[0].geometry.coordinates.map((coord: [number, number]) => ({
                    latitude: coord[1],
                    longitude: coord[0],
                }));
                setRouteCoordinates(coordinates);
                alert("requset :" + coordinates)
            } catch (error) {
                alert("lỗi :" + error)
                console.error(error);
            }
        };
        getRoute();
    }, []);

    return (
        <View style={styles.container}>
            <Pressable onPress={stopAddress}>
                <Text >dừng cập nhật vị trí hiện tại </Text>
            </Pressable>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
            >
                {currentLocation && <Marker coordinate={currentLocation} title="Your Location" />}

                <Marker coordinate={electricUniversity} title="Electric University" ><Image source={require('../../assets/images/1533406-middle.png')} style={{ height: 35, width: 35 }} /></Marker>
                <Marker coordinate={bKUniversity} title="BK University" />
                {routeCoordinates.length > 0 && (
                    <Polyline coordinates={routeCoordinates} strokeColor="#000" strokeWidth={3} />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        // height: Dimensions.get('window').height,
        height: '100%',

    },
});
