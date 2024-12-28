import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './tab/index'
import Tab from './tab/tab'
import TabDEMO from './(tabs)/_layout'
import login from './tab/Login'

import OrderList from '@/components/compone/OrderList'
import DetailOrderList from '@/components/compone/DetailOrderList'
import SuccessOder from '@/components/compone/SuccessOder'
import ReceivedOderList from '@/components/compone/ReceivedOderList'
import DetailReceivedOder from '@/components/compone/DetailReceivedOder'
import { getUser } from '@/api/apiLogin';
import { ListenNotification } from '@/components/compone/ListenNotification'


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

{/* /// cấu hình draw/// */ }
function DrawerNavigator() {
  // test login /////////////

  const navigation = useNavigation()
  const checkUser = async () => {
    const respose = await getUser()
    if (respose == null) {
      navigation.navigate('login')

    }
  }
  checkUser()

  //////////

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: 'Trang chủ',
          // headerShown: false,
          title: '    ',
          headerStyle: {
            backgroundColor: 'rgb(235, 203, 227)'
          }
        }}
        component={Tab}
      />





      {/* <Drawer.Screen
        name="homemain"
        options={{
          drawerLabel: 'Home demo',
          title: 'Overview',
        }}
        component={TabDEMO}
      /> */}

    </Drawer.Navigator>
  );
}
{/* /// cấu hình router/// */ }
function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={DrawerNavigator}
        options={{ headerShown: false, title: 'Trang Chủ' }}
      />
      <Stack.Screen
        name="OrderList"
        component={OrderList}
        options={{ headerShown: true, title: 'Đơn đang chờ' }}
      />
      <Stack.Screen
        name="DetailOrderList"
        component={DetailOrderList}
        options={{ headerShown: true, title: 'Chi chi tiết đơn chờ' }}
      />
      <Stack.Screen
        name="SuccessOder"
        component={SuccessOder}
        options={{ headerShown: true, title: 'Trang xác nhận giao hàng' }}
      />
      <Stack.Screen
        name="ReceivedOderList"
        component={ReceivedOderList}
        options={{ headerShown: true, title: 'Danh sách hóa đơn đang nhận' }}
      />
      <Stack.Screen
        name="DetailReceivedOder"
        component={DetailReceivedOder}
        options={{ headerShown: true, title: 'Chi tiết đơn hàng (đang giao)' }}
      />
      <Stack.Screen
        name="login"
        component={login}
        options={{ headerShown: false, title: 'Chi tiết đơn hàng (đang giao)' }}
      />

      {/* Thêm các màn hình khác vào đây nếu cần */}
    </Stack.Navigator>
  );
}

export default function Layout() {
  // hàm tạo token và đăng ký token để lắng nghe thông báo
  ListenNotification()

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer independent={true}>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
