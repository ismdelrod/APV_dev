import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../components/Navigation/Header";

//VapeStores SECTION
import VapeStoresListComponent from "../screens/VapeStores";
import VapeStoreDetailComponent from "../screens/VapeStores/VapeStore";
import AddVapeStoreFormComponent from "../screens/VapeStores/AddVapeStore";
import AddReviewVapeStoreFormComponent from "../screens/VapeStores/AddReviewVapeStore";
//END VapeStores SECTION

// Ranking SECTION
import TopVapeStoresListComponent from "../screens/VapeStores/TopVapeStores";
//END Ranking SECTION

// Favorites SECTION
import FavoritesVapeStoresComponent from "../screens/Favorites/FavoritesVapeStores";
//END Favorites SECTION

// Search SECTION
import SearchVapeStoresComponent from "../screens/Search/SearchVapeStores";
//END Search SECTION

// Account SECTION
import AccountInfoComponent from "../screens/Account/Account";
import RegisterFormComponent from "../screens/Account/Register";
import LoginFormComponent from "../screens/Account/Login";
//END  SECTION

const VapeStoreStack = createStackNavigator();

const VapeStoresStackScreen = () => {
  return (
    <VapeStoreStack.Navigator>
      <VapeStoreStack.Screen
        name="VapeStores"
        component={VapeStoresListComponent}
        options={{
          title: "Tiendas",
          headerTitleAlign:"center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
      <VapeStoreStack.Screen
        name="VapeStore"
        component={VapeStoreDetailComponent}
        options={({ route }) => ({
          title: route.params.store.name,
          headerTitleAlign:"center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        })}
      />
      <VapeStoreStack.Screen
        name="AddVapeStore"
        component={AddVapeStoreFormComponent}
        options={{
          title: "Añadir Nueva Tienda",
          headerTitleAlign:"center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
      <VapeStoreStack.Screen
        name="AddReviewVapeStore"
        component={AddReviewVapeStoreFormComponent}
        options={{
          title: "Añadir Opinión",
          headerTitleAlign:"center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </VapeStoreStack.Navigator>
  );
};

const TopVapeStoresStack = createStackNavigator();
const TopVapeStoresStackScreen = () => {
  return (
    <TopVapeStoresStack.Navigator>
      <TopVapeStoresStack.Screen
        name="Top 5"
        component={TopVapeStoresListComponent}
        options={{
          title: "Ranking",
          headerTitleAlign:"center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </TopVapeStoresStack.Navigator>
  );
};

const AccountStack = createStackNavigator();
const AccountStackScreen = () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="Account"
        component={AccountInfoComponent}
        options={{
          title: "Perfil de Usuario",
          headerTitleAlign:"center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
      <AccountStack.Screen
        name="Login"
        component={LoginFormComponent}
        options={{
          title: "LogIn de Usuario",
          headerTitleAlign:"center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
      <AccountStack.Screen
        name="Register"
        component={RegisterFormComponent}
        options={{
          title: "Registrar Nuevo Usuario",
          headerTitleAlign:"center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </AccountStack.Navigator>
  );
};

const SearchVapeStoresStack = createStackNavigator();
const SearchVapeStoresStackScreen = () => {
  return (
    <SearchVapeStoresStack.Navigator>
      <SearchVapeStoresStack.Screen
        name="SearchVapeStores"
        component={SearchVapeStoresComponent}
        options={{
          title: "Buscar",
          headerTitleAlign:"center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </SearchVapeStoresStack.Navigator>
  );
};

const FavoritesVapeStoresStack = createStackNavigator();
const FavoritesVapeStoresStackScreen = () => {
  return (
    <FavoritesVapeStoresStack.Navigator>
      <FavoritesVapeStoresStack.Screen
        name="FavoritesVapeStores"
        component={FavoritesVapeStoresComponent}
        options={{
          title: "Favoritos",
          headerTitleAlign:"center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </FavoritesVapeStoresStack.Navigator>
  );
};

const VapeStoresTabs = createBottomTabNavigator();
const VapeStoresTabsScreen = () => (
  <VapeStoresTabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Stores") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "FavoritesVapeStores") {
          iconName = focused ? "heart" : "heart-outline";
        } else if (route.name === "Top 5") {
          iconName = focused ? "star" : "star-outline";
        } else if (route.name === "Account") {
          iconName = focused ? "account" : "account-outline";
        } else if (route.name === "SearchVapeStores") {
          iconName = focused ? "feature-search" : "feature-search-outline";
        }
        return (
          <MaterialCommunityIcons name={iconName} size={size} color={color} />
        );
      },
    })}
    tabBarOptions={{
      activeTintColor: "#008EE1",
      inactiveTintColor: "#D1D1D1",
    }}
  >
    <VapeStoresTabs.Screen name="Stores" component={VapeStoresStackScreen} />
    <VapeStoresTabs.Screen
      name="FavoritesVapeStores"
      component={FavoritesVapeStoresStackScreen}
    />
    <VapeStoresTabs.Screen name="Top 5" component={TopVapeStoresStackScreen} />
    <VapeStoresTabs.Screen name="SearchVapeStores" component={SearchVapeStoresStackScreen} />
    <VapeStoresTabs.Screen name="Account" component={AccountStackScreen} />
  </VapeStoresTabs.Navigator>
);

const AppDrawer = createDrawerNavigator();
const AppDrawerScreen = () => (
  <AppDrawer.Navigator>
    <AppDrawer.Screen
      name="VapeStoreTabs"
      component={VapeStoresTabsScreen}
      options={{ drawerLabel: "Tiendas" }}
    />
  </AppDrawer.Navigator>
);

export default Navigation = () => {
  return (
    <NavigationContainer>
      <AppDrawerScreen />
    </NavigationContainer>
  );
};
