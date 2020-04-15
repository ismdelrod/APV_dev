import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, HeaderTitle } from "@react-navigation/stack";
import{MaterialCommunityIcons} from "@expo/vector-icons";

import VapeStoresScreen from "../screens/VapeStores";
import VapeStoreScreen from "../screens/VapeStores/VapeStore";
import AddVapeStoreScreen from "../screens/VapeStores/AddVapeStore";
import AddReviewVapeStoreScreen from "../screens/VapeStores/AddReviewVapeStore";

import TopVapeStoresScreen from "../screens/VapeStores/TopVapeStores";
import AccountScreen from "../screens/Account/Account";
import SearchScreen from "../screens/Search";
import LoginScreen from "../screens/Account/Login";
import RegisterScreen from "../screens/Account/Register";

import FavoritesScreen from "../screens/Favorites/Favorites";



const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

VapeStoresStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="VapeStores" options = { {title: 'Tiendas' }} component={VapeStoresScreen} />
      <Stack.Screen name="AddVapeStore" options = { {title: 'Añadir Nueva Tienda' }} component={AddVapeStoreScreen} />
      <Stack.Screen name="VapeStore" options = { ({ route }) => ({ title: route.params.store.name })} component={VapeStoreScreen} />
      <Stack.Screen name="AddReviewVapeStore" options = { {title: 'Añadir Opinión' }} component={AddReviewVapeStoreScreen} />
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

FavoritesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Favorites" options = { {title: 'Favoritos' }} component={FavoritesScreen} />
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
            }else if (route.name === "Favorites") {
              iconName = focused ? "heart" : "heart-outline";
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
        <BottomTab.Screen name="Favorites" component={FavoritesStack} />
        <BottomTab.Screen name="Top 5" component={TopVapeStoresStack} />
        <BottomTab.Screen name="Search" component={SearchStack} />
        <BottomTab.Screen name="Account" component={AccountStack} />
      </BottomTab.Navigator>
    </NavigationContainer>
  );
}