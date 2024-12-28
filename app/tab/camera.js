import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState(null);  // Biến lưu ảnh
    const cameraRef = useRef(null);  // Tham chiếu đến CameraView

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 1, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            setPhoto(data.uri);  // Lưu URI của ảnh vào biến photo
        }
    };

    // const savePicture = async () => {
    //     if (photo) {
    //         try {
    //             await MediaLibrary.saveToLibraryAsync(photo);
    //             alert('Photo saved to library!');
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    // };
    const savePicture = async () => {
        if (photo) {
            try {

            } catch (error) {
                console.error(error);
            }
        }
    }


    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.text}>Take Picture</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
            {photo && (
                <View style={styles.preview}>
                    <Image source={{ uri: photo }} style={styles.image} />
                    <TouchableOpacity onPress={savePicture} >
                        Xác nhận ảnh
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    preview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: "100%",
    },
});
