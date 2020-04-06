import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import{MaterialCommunityIcons} from "@expo/vector-icons";

import VapeStoresScreen from "../screens/VapeStores";
import TopVapeStoresScreen from "../screens/TopVapeStores";
import AccountScreen from "../screens/Account/Account";
import SearchScreen from "../screens/Search";
import LoginScreen from "../screens/Account/Login";
import RegisterScreen from "../screens/Account/Register";

import AddVapeStoreScreen from "../screens/VapeStores/AddVapeStore";

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

VapeStoresStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="VapeStores" component={VapeStoresScreen} />
      <Stack.Screen name="AddVapeStore" component={AddVapeStoreScreen} />
    </Stack.Navigator>
  );
};

TopVapeStoresStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Top 5" component={TopVapeStoresScreen} />
    </Stack.Navigator>
  );
};
 
AccountStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
};



export default Navigation = () => {
  return (
    <NavigationContainer>
      <BottomTab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Stores") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Top 5") {
              iconName = focused ? "star" : "star-outline";
            } else if (route.name === "Account") {
              iconName = focused ? "account" : "account-outline";
            } else if (route.name === "Search") {
              iconName = focused ? "feature-search" : "feature-search-outline";
            }
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: "#008EE1",           
          inactiveTintColor: "#D1D1D1",
        }}
      >
        <BottomTab.Screen name="Stores" component={VapeStoresStack} />
        <BottomTab.Screen name="Top 5" component={TopVapeStoresStack} />
        <BottomTab.Screen name="Account" component={AccountStack} />
        <BottomTab.Screen name="Search" component={SearchStack} />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}