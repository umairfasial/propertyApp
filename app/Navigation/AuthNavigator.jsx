import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../(auth)/Login';
import SignUp from '../(auth)/SignUp';
import VerifyEmail from '../(auth)/VerifyEmail';
import {Text, TouchableOpacity} from 'react-native';
import ForgotPassword from '../(auth)/ForgotPassword';
import ResetPassword from '../(auth)/ResetPassword';

const AuthStack = createNativeStackNavigator();
export function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignUp}
        options={{title: 'Create Profile'}}
      />
      <AuthStack.Screen
        name="VerifyEmail"
        component={VerifyEmail}
        options={({navigation}) => ({
          title: 'Verify OTP',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{marginRight: 15}}>
              <Text style={{color: '#2563EB', fontSize: 16}}>Cancel</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{title: ''}}
      />
      <AuthStack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{title: 'Change Password'}}
      />
    </AuthStack.Navigator>
  );
}
