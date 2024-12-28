import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 10.762622; // Example starting latitude (Ho Chi Minh City)
const LONGITUDE = 106.660172; // Example starting longitude (Ho Chi Minh City)
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map = () => {
    const [region, setRegion] = useState({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });

    const [destination, setDestination] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                ...region,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        })();
    }, []);

    const handleMapPress = (e) => {
        setDestination(e.nativeEvent.coordinate);
        fetchRoute(e.nativeEvent.coordinate);
    };

    const fetchRoute = async (destination) => {
        const start = `${region.latitude},${region.longitude}`;
        const end = `${destination.latitude},${destination.longitude}`;

        try {

            const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`);
            // const response = await axios.get(`YOUR_NEW_API_URL`); // Thay YOUR_NEW_API_URL bằng URL mới của bạn

            const route = response.data.routes[0].geometry.coordinates;

            const coordinates = route.map(coord => ({
                latitude: coord[1],
                longitude: coord[0],
            }));
            setRouteCoordinates(coordinates);
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
                onPress={handleMapPress}
            >
                <Marker coordinate={region} />
                {destination && <Marker coordinate={destination} />}
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: height,
        width: width,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default Map;
