import { Image, StyleSheet, Platform, Text, View, ImageBackground, } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DialogInvoice from '@/components/dialog/DiaLogListInvoice';
// import { View } from 'react-native-reanimated/lib/typescript/Animated';

// import AsyncStorage from '@react-native-async-storage/async-storage';
export default function HomeScreen() {


  // const demo = async () => {
  //   try {
  //     await AsyncStorage.setItem('@user_token', "ayyyyy").then(() => ays())
  //   } catch (error) {
  //     console.error('Failed to save the user session', error);
  //   }



  // }
  // demo()
  // const ays = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('@user_token');
  //     if (token !== null) {
  //       alert(token)
  //       // Token tồn tại
  //       return token;
  //     }
  //     // Token không tồn tại
  //     return null;
  //   } catch (error) {
  //     console.error('Failed to fetch the user session', error);
  //     return null;
  //   }
  // }


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#d599e7', dark: '#1D3D47' }}
      headerImage={
        // <Image
        //   source={require('@/assets/images/partial-react-logo.png')}
        //   style={styles.reactLogo}
        // />
        <ImageBackground source={require('@/assets/images/back.png')} resizeMode="cover" style={styles.reactLogo}>
          <View>
            <Text style={styles.header}>Chào mừng {'s'} đến với ct Shop!</Text>
          </View>
        </ImageBackground>


      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Chi tết thông tin đơn!</ThemedText>
        <HelloWave />
      </ThemedView>
      <Collapsible title={"Đơn đã nhận" + "ay"}>
        <View>
          <Text>ssss</Text>
          <DialogInvoice />
        </View>


      </Collapsible>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 400,
    width: 290,
    top: 0,
    left: 0,
    position: 'absolute',
  },
  header: {
    top: 20,
    left: 0,
    position: 'absolute',
  },
  image: {
    zIndex: 1000,
  }
});
