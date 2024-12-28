import { Image, StyleSheet, RefreshControl, Platform, Text, View, ImageBackground, TouchableOpacity, ScrollView, Linking, } from 'react-native';
import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import DialogInvoice from '@/components/dialog/DiaLogListInvoice';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { get_oderGrap_on_month, get_oderGrap_byIdGrap_andstatus } from '@/api/grapserviceApi';
import { getUser } from '@/api/apiLogin';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const items = [
    { name: 'Sản phẩm 1', address: 'Địa chỉ 1' },
    { name: 'Sản phẩm 2', address: 'Địa chỉ 2' },
    { name: 'Sản phẩm 3', address: 'Địa chỉ 3' },
    { name: 'Sản phẩm 4', address: 'Địa chỉ 4' },
    { name: 'Sản phẩm 5', address: 'Địa chỉ 5' },
    // Bạn có thể thêm nhiều item ở đây
  ];
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

  const [oderData, setOderData] = useState({
    success: [],
    received: [],

  })
  const [user, setUser] = useState({})

  const [doanhThu, setDoanhThu] = useState(0)
  const getData = async () => {
    const response = await getUser()
    try {
      response.name
    } catch (error) {
      navigation.navigate('login')
      return
    }
    const responseSuccess = await get_oderGrap_on_month(response.id, 'success');
    const responseReceived = await get_oderGrap_byIdGrap_andstatus(response.id, 'received')




    setUser(response)
    console.log('log get user index', user)

    // console.log('check suse ', response.id, responseSuccess.data.length)
    // setOderData((prevData) => ({
    //   ...prevData,
    //   success: responseSuccess.data, // Cập nhật đúng dữ liệu thành công từ API
    // }))

    setDoanhThu(responseSuccess.data.reduce(
      (accumulator, currentValue) => accumulator + currentValue.priceForGrap,
      0,
    ))
    // console.log("check received", responseSuccess.data)
    // setOderData({
    //   ...oderData,
    //   success: responseSuccess.data
    // })
    // setOderData({
    //   ...oderData,
    //   received: responseReceived.data
    // })
    setOderData({
      ...oderData,
      success: responseSuccess.data,
      received: responseReceived.data
    })

  }
  const onRefresh = () => {
    setRefreshing(true);
    // Giả lập một tác vụ tải lại dữ liệu
    setTimeout(() => {
      setRefreshing(false);
      getData();
    }, 2000);
  };

  const makePhoneCall = () => {
    const phoneUrl = `tel:0984586393`;

    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Không thể thực hiện cuộc gọi", "Thiết bị của bạn không hỗ trợ gọi điện.");
        } else {
          return Linking.openURL(phoneUrl);
        }
      })
      .catch((err) => console.error('Lỗi khi cố gắng gọi điện thoại', err));
  };

  useEffect(() => {
    getData()
  }, [])


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#d599e7', dark: '#1D3D47' }}
      headerImage={
        // <Image
        //   source={require('@/assets/images/partial-react-logo.png')}
        //   style={styles.reactLogo}
        // />

        <ImageBackground source={require('@/assets/images/logo_grap.gif')} resizeMode="cover" style={styles.reactLogo}>

          <View style={{
            top: 20,
            left: 0,
            position: 'absolute',
          }}>
            <ScrollView
              // horizontal={true}
              // style={{ flexDirection: 'row' }}
              showsHorizontalScrollIndicator={false}

              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >
              <View style={styles.header_view}>
                <Text style={styles.header}>Chào nhân viên: {user?.name}</Text>
              </View>
            </ScrollView>
          </View>

        </ImageBackground>



      }>

      <ImageBackground
        source={require('@/assets/img/background-boxstatus.png')}
        style={styles.boxstatus}
        resizeMode="stretch" // Điều chỉnh kích thước ảnh để phù hợp với khung
      >
        <View style={styles.container}>
          <View style={styles.box}>
            <Entypo name="wallet" size={24} color="white" />
          </View>
          <View style={styles.box2}>
            <Text style={[styles.text, { fontSize: 15 }]}>Doanh thu tháng này</Text>
            <Text style={[styles.text, { fontSize: 19, fontWeight: 'bold' }]}>{doanhThu.toLocaleString('vi-VN')} VND</Text>
          </View>
          <View style={styles.box3}>
            {/* <Text style={styles.text}>Dòng 1</Text>
            <Text style={styles.text}>Dòng 2</Text> */}
          </View>
        </View>
      </ImageBackground>
      <View>
        <Text>
          <Text>Đơn hàng đang giao: <Text style={{ fontWeight: "bold" }}>{oderData.received.length}</Text> </Text>
          <Text>Đơn đã giao tháng này:  <Text style={{ fontWeight: "bold" }}>{oderData.success.length}</Text> </Text>
        </Text>
      </View>


      <View style={styles.containerItem}>

        <TouchableOpacity style={styles.boxItem} onPress={() => { navigation.navigate('OrderList'); }} >
          <FontAwesome name="hourglass-half" size={25} color="rgb(237, 104, 195)" />
          <Text style={[styles.label]}>Đơn chưa nhận</Text>


        </TouchableOpacity>

        <TouchableOpacity style={styles.boxItem} onPress={() => { navigation.navigate('ReceivedOderList'); }}>
          <FontAwesome name="file-text" size={25} color="rgb(237, 104, 195)" />
          <Text style={styles.label}>Đơn đang giao</Text>
          <View style={{ position: "absolute", right: 0, top: -4, width: 20, borderRadius: 10, backgroundColor: "red", alignItems: 'center' }}>
            <Text style={{ color: "white" }}>{oderData.received.length}</Text>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.boxItem}>
          <FontAwesome name="bell" size={25} color="rgb(237, 104, 195)" />
          <Text style={styles.label}>Thông báo</Text>

        </TouchableOpacity> */}
        <TouchableOpacity style={styles.boxItem} onPress={() => makePhoneCall()}>
          <FontAwesome name="phone" size={25} color="rgb(237, 104, 195)" />
          <Text style={styles.label}>Tư vấn hỗ trợ</Text>

        </TouchableOpacity>
      </View>
      {/* ///// danh sách hóa đơn đã được chọn và đang chờ giao */}
      {/* <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Đơn đang giao</ThemedText>
      </ThemedView>
      <Collapsible title={"Đơn đã nhận" + "ay"}>
        <View>
          <Text>ssss</Text>
          <DialogInvoice />
        </View>
      </Collapsible>
      <View style={styles.containerList}>
        <ScrollView style={styles.scrollView}>
          {items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemAddress}>{item.address}</Text>
            </View>
          ))}
        </ScrollView>
      </View> */}
      {/* <ThemedView style={styles.stepContainer}>
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
      </ThemedView> */}
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
    width: "100%",
    top: 0,
    left: 0,
    position: 'absolute',
  },
  header: {

    // width: 200,
    // borderTopRightRadius: 60,
    // borderBottomRightRadius: 60,

  },
  header_view: {
    // top: 20,
    // left: 0,
    // position: 'absolute',
    // position: 'relative',
    backgroundColor: 'rgb(255, 210, 234)',
    padding: 10,
    borderTopRightRadius: 60,
    borderBottomRightRadius: 60,
  },
  image: {
    zIndex: 1000,
  },
  boxstatus: {
    // padding: 20,
    backgroundColor: "rgb(243, 187, 230)",
    // backgroundColor: "rgb(255, 171, 219)",
    width: '100%',
    height: 100,
    borderRadius: 10,
    overflow: 'hidden', // Đảm bảo nội dung bên trong không tràn ra ngoài
    // backgroundColor: '#D291BC',   // Màu tím nhạt cho nền
    // borderRadius: 10,
    // justifyContent: 'center',
    alignItems: 'center',
    // Tạo hiệu ứng "gradient giả" bằng cách thêm bóng mờ
    // shadowColor: '#957DAD',       // Màu tím đậm hơn cho bóng mờ
    // shadowOpacity: 0.6,
    // shadowOffset: { width: 0, height: 10 },
    // shadowRadius: 20,
    // elevation: 10,
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto'

  },
  box: {
    width: '15%', // Thẻ con 1
    alignItems: 'flex-end',
    padding: 10,

  },
  text: {
    textAlign: 'center',
    color: 'white',

  },

  box2: {
    width: '55%', // Thẻ con 2
    alignItems: 'flex-start',
    padding: 10,

  },
  box3: {
    width: '30%', // Thẻ con 2
    alignItems: 'center',
    padding: 10,
  },
  containerItem: {
    flexDirection: 'row', // Sắp xếp các thẻ con theo hàng
    flexWrap: 'wrap', // Tự động xuống dòng khi không đủ không gian
    justifyContent: 'space-around', // Căn đều khoảng cách giữa các thẻ con
    padding: 10,
  },
  boxItem: {
    width: 70, // Chiều rộng thẻ con
    height: 70, // Chiều cao thẻ con
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Màu nền cho thẻ con
    borderRadius: 10, // Bo góc cho thẻ con
    margin: 5, // Khoảng cách giữa các thẻ con
    borderWidth: 1,
    borderColor: "rgb(255, 140, 240)"
  },
  label: {
    marginTop: 5, // Khoảng cách giữa icon và chữ
    textAlign: 'center',
    fontSize: 8, // Kích thước chữ
    color: "rgb(237, 104, 195)",


  },




  containerList: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0', // Màu nền cho thẻ View chính
    padding: 10,
  },
  scrollView: {
    flex: 1, // Đảm bảo ScrollView chiếm toàn bộ không gian còn lại
  },
  item: {
    width: '100%', // Chiều rộng gần bằng thẻ View chính
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff', // Màu nền cho từng item
    borderRadius: 5, // Bo góc cho từng item
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // Đổ bóng cho Android
  },
  itemName: {
    fontSize: 16, // Kích thước chữ cho tên
    fontWeight: 'bold', // Chữ đậm
  },
  itemAddress: {
    fontSize: 14, // Kích thước chữ cho địa chỉ
    color: '#555', // Màu chữ cho địa chỉ
  },

});
