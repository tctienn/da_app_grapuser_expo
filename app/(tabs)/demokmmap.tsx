import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 10.762622; // Ho Chi Minh City
const LONGITUDE = 106.660172; // Ho Chi Minh City
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
    const [distance, setDistance] = useState(null);

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

    const handleMapPress = async (e) => {
        setDestination(e.nativeEvent.coordinate);
        await fetchDistance(e.nativeEvent.coordinate);
    };

    const fetchDistance = async (destination) => {
        const start = `${region.longitude},${region.latitude}`;
        const end = `${destination.longitude},${destination.latitude}`;

        try {
            const response = await axios.get(`http://router.project-osrm.org/route/v1/driving/${start};${end}?overview=false`);
            const distanceInMeters = response.data.routes[0].distance; // Distance in meters
            setDistance(distanceInMeters);
        } catch (error) {
            console.error('Error fetching distance:', error);
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
            </MapView>
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>Starting Point: {region.latitude.toFixed(5)}, {region.longitude.toFixed(5)}</Text>
                {destination && (
                    <Text style={styles.infoText}>Destination: {destination.latitude.toFixed(5)}, {destination.longitude.toFixed(5)}</Text>
                )}
                {distance !== null && (
                    <Text style={styles.infoText}>Distance: {(distance / 1000).toFixed(2)} km</Text>
                )}
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => fetchDistance(destination)}
                disabled={!destination}
            >
                <Text style={styles.buttonText}>Calculate Distance</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    infoContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Map;
