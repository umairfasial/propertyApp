import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Import Screens
import Home from '../(tabs)/Home';
import Properties from '../(tabs)/Properties';
import Inspections from '../(tabs)/Inspections';
import Chat from '../(tabs)/Chat';
import Settings from '../(tabs)/Settings';

// Import SVG Icons
import OverviewIcon from '../assets/icons/overview.svg';
import PropertiesIcon from '../assets/icons/properties.svg';
import InspectionsIcon from '../assets/icons/inspections.svg';
import ChatIcon from '../assets/icons/chat.svg';
import SettingsIcon from '../assets/icons/settings.svg';
import NotificationIcon from '../assets/icons/notification.svg';
import ArrowClock from '../assets/icons/arrowClock.svg';
import Plus from '../assets/icons/plus.svg';

const Tab = createBottomTabNavigator();

export function TabsNavigator({navigation}) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused}) => {
          let IconComponent;

          switch (route.name) {
            case 'Overview':
              IconComponent = OverviewIcon;
              break;
            case 'Properties':
              IconComponent = PropertiesIcon;
              break;
            case 'Inspections':
              IconComponent = InspectionsIcon;
              break;
            case 'Chat':
              IconComponent = ChatIcon;
              break;
            case 'Settings':
              IconComponent = SettingsIcon;
              break;
          }

          return (
            <IconComponent
              width={24}
              height={24}
              color={focused ? '#2563EB' : '#9CA3AF'}
            />
          );
        },
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#9CA3AF',
      })}>
      <Tab.Screen
        name="Overview"
        component={Home}
        options={{
          headerTitle: 'Overview',
          headerTitleAlign: 'left',
          headerTitleStyle: {fontSize: 20, fontWeight: '700'},
          headerRight: () => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 15,
                marginRight: 15,
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Notification')}>
                <NotificationIcon width={22} height={22} color="#374151" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => console.log('Circle Pressed')}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#E5E7EB',
                  }}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Properties"
        component={Properties}
        options={({navigation}) => ({
          headerTitleStyle: {fontSize: 20, fontWeight: '700'},
          headerTitleAlign: 'left',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PropertyForm');
              }}
              style={{
                marginRight: 16,
                backgroundColor: '#2563eb',
                width: 160,
                height: 40,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                borderRadius: 6,
              }}>
              <Plus
                width={14}
                height={16}
                color="#fff"
                style={{marginRight: 8}}
              />
              <Text style={{color: '#fff', fontWeight: '400', fontSize: 16}}>
                Add Property
              </Text>
            </TouchableOpacity>
          ),
          headerTitle: 'Properties',
        })}
      />

      <Tab.Screen
        name="Inspections"
        component={Inspections}
        options={({navigation}) => ({
          headerTitleStyle: {fontSize: 20, fontWeight: '700'},
          headerTitleAlign: 'left',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ReportIssue');
              }}
              style={{
                marginRight: 16,
                backgroundColor: '#2563eb',
                width: 160,
                height: 40,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                borderRadius: 6,
              }}>
              <Plus
                width={14}
                height={16}
                color="#fff"
                style={{marginRight: 8}}
              />
              <Text style={{color: '#fff', fontWeight: '400', fontSize: 16}}>
                New Issue
              </Text>
            </TouchableOpacity>
          ),
          headerTitle: 'Issue Dashboard',
        })}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={({navigation}) => ({
          headerTitleStyle: {fontSize: 20, fontWeight: '700'},
          headerTitleAlign: 'left',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChatHistory');
              }}
              style={{
                marginRight: 16,
                backgroundColor: 'red',
                width: 160,
                height: 40,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                borderRadius: 6,
              }}>
              <ArrowClock
                width={14}
                height={16}
                color="#fff"
                style={{marginRight: 8}}
              />
              <Text style={{color: '#fff', fontWeight: '400', fontSize: 16}}>
                Chat History
              </Text>
            </TouchableOpacity>
          ),
          headerTitle: 'Chats',
        })}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={() => ({
          headerTitleStyle: {fontSize: 20, fontWeight: '700'},
          headerTitleAlign: 'left',
        })}
      />
    </Tab.Navigator>
  );
}
