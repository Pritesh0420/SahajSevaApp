import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SchemeLandingScreen from '../screens/SchemeLandingScreen';
import SchemeListeningScreen from '../screens/SchemeListeningScreen';
import SchemeResultsScreen from '../screens/SchemeResultsScreen';
import FormAssistantScreen from '../screens/FormAssistantScreen';
import FormExplainSetupScreen from '../screens/FormExplainSetupScreen';
import FormExplanationScreen from '../screens/FormExplanationScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HelpScreen from '../screens/HelpScreen';
import { COLORS } from '../designSystem';
import { useLanguage } from '../contexts/LanguageContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function SchemeStack({ language, setLanguage }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SchemeLanding" options={{ title: language === 'hi' ? 'Find Government Schemes' : 'Find Government Schemes' }}>
        {({ navigation }) => <SchemeLandingScreen navigation={navigation} language={language} />}
      </Stack.Screen>
      <Stack.Screen name="SchemeListening" options={{ title: language === 'hi' ? 'Find Government Schemes' : 'Find Government Schemes' }}>
        {({ navigation }) => <SchemeListeningScreen navigation={navigation} language={language} />}
      </Stack.Screen>
      <Stack.Screen name="SchemeResults" options={{ title: language === 'hi' ? 'Find Government Schemes' : 'Find Government Schemes' }}>
        {() => <SchemeResultsScreen language={language} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function FormStack({ language, setLanguage }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FormUpload" options={{ title: language === 'hi' ? 'Understand & Fill a Form' : 'Understand & Fill a Form' }}>
        {({ navigation }) => <FormAssistantScreen language={language} navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="FormSetup" options={{ title: language === 'hi' ? 'Understand & Fill a Form' : 'Understand & Fill a Form' }}>
        {({ navigation }) => <FormExplainSetupScreen language={language} navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="FormExplanation" options={{ title: language === 'hi' ? 'Understand & Fill a Form' : 'Understand & Fill a Form' }}>
        {() => <FormExplanationScreen language={language} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  const { language, setLanguage } = useLanguage();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: { backgroundColor: COLORS.background },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'History') iconName = 'time';
          else if (route.name === 'Help') iconName = 'help-circle';
          else if (route.name === 'SchemeDiscovery') iconName = 'search';
          else if (route.name === 'FormAssistant') iconName = 'document-text';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home">
        {({ navigation }) => <HomeScreen language={language} setLanguage={setLanguage} navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen name="SchemeDiscovery" options={{ title: language === 'hi' ? 'Find Government Schemes' : 'Find Government Schemes' }}>
        {() => <SchemeStack language={language} setLanguage={setLanguage} />}
      </Tab.Screen>
      <Tab.Screen name="FormAssistant" options={{ title: language === 'hi' ? 'Understand & Fill a Form' : 'Understand & Fill a Form' }}>
        {() => <FormStack language={language} setLanguage={setLanguage} />}
      </Tab.Screen>
      <Tab.Screen name="History">
        {() => <HistoryScreen language={language} />}
      </Tab.Screen>
      <Tab.Screen name="Help">
        {() => <HelpScreen language={language} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}