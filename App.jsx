import React, {useEffect} from 'react';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {TabsNavigator} from './app/Navigation/TabsNavigator';
import {AuthNavigator} from './app/Navigation/AuthNavigator';
import {useDispatch, useSelector} from 'react-redux';
import {Linking} from 'react-native';
import {MainStackNavigator} from './app/Navigation/MainStackNavigator';
import {stat} from 'react-native-fs';
import {
  fetchCertificatesSlice,
  fetchPropertiesSlice,
} from './app/redux/slices/property/propertySlice';

const linking = {
  prefixes: ['https://capitalprop-2e6d3.firebaseapp.com/app'],
  config: {
    screens: {
      Auth: {
        screens: {
          ResetPassword: 'ResetPassword/:oobCode',
        },
      },
    },
  },
};

const RootStack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

export default function App() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.auth);
  const {properties} = useSelector(state => state.property);
  useEffect(() => {
    if (userData?.uid) {
      dispatch(fetchPropertiesSlice({userId: userData?.uid}));
      dispatch(
        fetchCertificatesSlice({
          userId: userData.uid,
        }),
      );
    }
  }, [userData]);

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <RootStack.Navigator screenOptions={{headerShown: false}}>
        {isAuthenticated ? (
          <RootStack.Screen name="Main" component={MainStackNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
