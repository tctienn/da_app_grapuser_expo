import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
// import { get_threater } from '@/api/dataApi';
import { useRoute } from '@react-navigation/native';

const initialRegion = {
    latitude: 21.046410234833445,
    longitude: 105.78494717443672,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export default function MapDirections(props) {
    // const route = useRoute();
    // const { coordinateEntity, idThreater } = route.params;
    // console.log("props-------------------", props.address)
    const mapRef = useRef(null);  // dùng để đôir địa chỉ hiển thị trên bản đồ
    const Endpoint = {
        latitude: props.address.region.latitude,
        longitude: props.address.region.longitude
    };

    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [currentLocation, setCurrentLocation] = useState({
        latitude: 21.046410234833445,
        longitude: 105.78494717443672,

    });
    const [load, setLoad] = useState(true)
    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.error('Permission to access location was denied');
            alert('Có vấn đề khi lấy địa chỉ hiện tại');
            return null;
        }


        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
        mapRef.current.animateToRegion(currentLocation, 1000);
        setLoad(false)
    };

    useEffect(() => {
        // console.log("map s", coordinateEntity);
        getLocation();
    }, []);

    const getRoute = async () => {
        setLoad(true)

        // get_threater(idThreater);
        try {
            const location = currentLocation;
            if (!location) {
                console.error("Failed to get current location");
                return;
            }

            const response = await axios.get(
                `http://router.project-osrm.org/route/v1/driving/${location.longitude},${location.latitude};${Endpoint.longitude},${Endpoint.latitude}?overview=full&geometries=geojson`
            );

            const coordinates = response.data.routes[0].geometry.coordinates.map((coord) => ({
                latitude: coord[1],
                longitude: coord[0],
            }));
            console.log('Route fetched');
            setRouteCoordinates(coordinates);
            mapRef.current.animateToRegion(currentLocation, 1000);

        } catch (error) {
            alert("Lỗi: " + error);
            console.error(error);
        }
        setLoad(false)
    };

    return (
        <View style={styles.container}>

            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={initialRegion}
            // region={currentLocation}
            >
                <Pressable style={styles.button} onPress={() => getRoute()}>
                    <Text style={styles.buttonText}>Chỉ đường</Text>
                </Pressable>


                {currentLocation && <Marker coordinate={currentLocation} title="Địa chỉ hiện tại của bạn" >
                    <Image source={require('@/assets/img/location2.gif')} style={{ height: 100, width: 100 }} />
                </Marker>}
                <Marker coordinate={Endpoint} title={props.address.address} >
                    <Image source={require('@/assets/img/location.gif')} style={{ height: 35, width: 35 }} />
                </Marker>
                {routeCoordinates.length > 0 && (
                    <Polyline coordinates={routeCoordinates} strokeColor="#000" strokeWidth={3} />
                )}
            </MapView>
            {load && (
                <View style={styles.overlay}>
                    <Text style={styles.loadText}>Đang xử lý...</Text>
                </View>
            )}


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 'auto',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền trong suốt nhạt
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadText: {
        color: 'white',
        fontSize: 20,
    },
    button: {
        backgroundColor: '#007BFF', // Màu nền nút
        paddingVertical: 10, // Khoảng cách đứng của nút
        paddingHorizontal: 20, // Khoảng cách ngang của nút
        borderRadius: 5, // Bo tròn góc của nút
        marginBottom: 20, // Khoảng cách dưới cùng của nút
    },
    buttonText: {
        color: 'white', // Màu chữ của nút
        fontSize: 16, // Kích thước chữ của nút
        textAlign: 'center', // Canh giữa chữ
    },

});
