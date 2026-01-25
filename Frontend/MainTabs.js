import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import SchemeLandingScreen from './screens/SchemeLandingScreen';
import SchemeListeningScreen from './screens/SchemeListeningScreen';
import SchemeResultsScreen from './screens/SchemeResultsScreen';
import FormAssistantScreen from './screens/FormAssistantScreen';
import HistoryScreen from './screens/HistoryScreen';
import HelpScreen from './screens/HelpScreen';
import { COLORS } from './designSystem';
import { useLanguage } from './LanguageContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function SchemeStack() {
  const { language } = useLanguage();
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SchemeLanding"
        component={SchemeLandingScreen}
        options={{ 
          title: language === 'hi' ? 'सरकारी योजनाएं खोजें' : 'Find Government Schemes'
        }}
      />
      <Stack.Screen 
        name="SchemeListening"
        component={SchemeListeningScreen}
        options={{ 
          title: language === 'hi' ? 'सरकारी योजनाएं खोजें' : 'Find Government Schemes'
        }}
      />
      <Stack.Screen 
        name="SchemeResults"
        component={SchemeResultsScreen}
        options={{ 
          title: language === 'hi' ? 'सरकारी योजनाएं खोजें' : 'Find Government Schemes'
        }}
      />
    </Stack.Navigator>
  );
}

function FormStack() {
  const { language } = useLanguage();
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="FormUpload"
        component={FormAssistantScreen}
        options={{ 
          title: language === 'hi' ? 'फॉर्म समझें और भरें' : 'Understand & Fill a Form'
        }}
      />
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: { 
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'History') iconName = 'time';
          else if (route.name === 'Help') iconName = 'help-circle';
          else if (route.name === 'SchemeDiscovery') iconName = 'search';
          else if (route.name === 'FormAssistant') iconName = 'document-text';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home"
        options={{ 
          title: language === 'hi' ? 'होम' : 'Home'
        }}
      >
        {({ navigation }) => <HomeScreen language={language} setLanguage={setLanguage} navigation={navigation} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="SchemeDiscovery"
        component={SchemeStack}
        options={{ 
          tabBarLabel: language === 'hi' ? 'योजनाएं' : 'Schemes'
        }}
      />
      
      <Tab.Screen 
        name="FormAssistant"
        component={FormStack}
        options={{ 
          tabBarLabel: language === 'hi' ? 'फॉर्म' : 'Forms'
        }}
      />
      
      <Tab.Screen 
        name="History"
        options={{ 
          title: language === 'hi' ? 'इतिहास' : 'History'
        }}
      >
        {() => <HistoryScreen language={language} />}
      </Tab.Screen>
      
      <Tab.Screen 
        name="Help"
        options={{ 
          title: language === 'hi' ? 'मदद' : 'Help'
        }}
      >
        {() => <HelpScreen language={language} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
