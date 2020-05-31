import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Header from "../components/Navigation/Header";

//VapeStores Component SECTION
import VapeStoresListComponent from "../screens/VapeStores";
import VapeStoreDetailComponent from "../screens/VapeStores/VapeStore";
import AddVapeStoreFormComponent from "../screens/VapeStores/AddVapeStore";
import AddReviewVapeStoreFormComponent from "../screens/VapeStores/AddReviewVapeStore";
//END VapeStores Component SECTION

//E-liquids Component SECTION
import EliquidsListComponent from "../screens/Eliquids/Eliquids";
import EliquidDetailComponent from "../screens/Eliquids/Eliquid";
import AddEliquidFormComponent from "../screens/Eliquids/AddEliquid";
import AddReviewEliquidFormComponent from "../screens/Eliquids/AddReviewEliquid";
//END E-liquids Component SECTION

//Brands Component SECTION
import BrandsListComponent from "../screens/Brands/Brands";
import BrandDetailComponent from "../screens/Brands/Brand";
import AddBrandFormComponent from "../screens/Brands/AddBrand";
//END E-liquid Component SECTION

//Ranking Component SECTION
import TopVapeStoresListComponent from "../screens/VapeStores/TopVapeStores";
import TopEliquidsListComponent from "../screens/Eliquids/TopEliquids";
//END Ranking Component SECTION

//Favorites Component SECTION
import FavoritesVapeStoresComponent from "../screens/Favorites/FavoritesVapeStores";
import FavoritesEliquidsComponent from "../screens/Favorites/FavoritesEliquids";
//END Favorites Component SECTION

//Search Component SECTION
import SearchVapeStoresComponent from "../screens/Search/SearchVapeStores";
import SearchEliquidsComponent from "../screens/Search/SearchEliquids";
import SearchBrandsComponent from "../screens/Search/SearchBrands";
//END Search Component SECTION

//Account Component SECTION
import AccountInfoComponent from "../screens/Account/Account";
import RegisterFormComponent from "../screens/Account/Register";
import LoginFormComponent from "../screens/Account/Login";
//END Account Component  SECTION

//Search Component SECTION
import ChatComponent from "../screens/Chat/Chat";
//END Search Component SECTION

//VapeStores Stack SECTION
const VapeStoreStack = createStackNavigator();

const VapeStoresStackScreen = () => {
  return (
    <VapeStoreStack.Navigator>
      <VapeStoreStack.Screen
        name="VapeStores"
        component={VapeStoresListComponent}
        options={{
          title: "Tiendas",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
      <VapeStoreStack.Screen
        name="VapeStore"
        component={VapeStoreDetailComponent}
        options={({ route }) => ({
          title: route.params.store &&  route.params.store.name,
          headerTitleAlign: "center",
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
          headerTitleAlign: "center",
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
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </VapeStoreStack.Navigator>
  );
};
//END VapeStores Stack SECTION

//E-liquid Stack SECTION
const EliquidStack = createStackNavigator();

const EliquidsStackScreen = () => {
  return (
    <EliquidStack.Navigator>
      <EliquidStack.Screen
        name="Eliquids"
        component={EliquidsListComponent}
        options={{
          title: "E-liquids",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
      <EliquidStack.Screen
        name="Eliquid"
        component={EliquidDetailComponent}
        options={({ route }) => ({
          title:route.params.eliquid && route.params.eliquid.name,
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        })}
      />
      <EliquidStack.Screen
        name="AddEliquid"
        component={AddEliquidFormComponent}
        options={{
          title: "Añadir Nuevo E-liquid",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
      <EliquidStack.Screen
        name="AddReviewEliquid"
        component={AddReviewEliquidFormComponent}
        options={{
          title: "Añadir Opinión",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </EliquidStack.Navigator>
  );
};
//END E-liquid Stack SECTION

//Brand Stack SECTION
const BrandStack = createStackNavigator();

const BrandsStackScreen = () => {
  return (
    <BrandStack.Navigator>
      <BrandStack.Screen
        name="Brands"
        component={BrandsListComponent}
        options={{
          title: "Brands",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
      <BrandStack.Screen
        name="Brand"
        component={BrandDetailComponent}
        options={({ route }) => ({
          title: route.params.brand && route.params.brand.name,
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        })}
      />
      <BrandStack.Screen
        name="AddBrand"
        component={AddBrandFormComponent}
        options={{
          title: "Añadir Nueva Marca",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </BrandStack.Navigator>
  );
};
//END Brand Stack SECTION

//Ranking Stack SECTION
const TopVapeStoresStack = createStackNavigator();
const TopVapeStoresStackScreen = () => {
  return (
    <TopVapeStoresStack.Navigator>
      <TopVapeStoresStack.Screen
        name="Top 5"
        component={TopVapeStoresListComponent}
        options={{
          title: "Ranking",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </TopVapeStoresStack.Navigator>
  );
};

const TopEliquidsStack = createStackNavigator();
const TopEliquidsStackScreen = () => {
  return (
    <TopEliquidsStack.Navigator>
      <TopEliquidsStack.Screen
        name="Top 5"
        component={TopEliquidsListComponent}
        options={{
          title: "Ranking",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </TopEliquidsStack.Navigator>
  );
};
//END Ranking Stack SECTION

//Search Stack SECTION
const SearchVapeStoresStack = createStackNavigator();
const SearchVapeStoresStackScreen = () => {
  return (
    <SearchVapeStoresStack.Navigator>
      <SearchVapeStoresStack.Screen
        name="SearchVapeStores"
        component={SearchVapeStoresComponent}
        options={{
          title: "Buscar",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </SearchVapeStoresStack.Navigator>
  );
};

const SearchEliquidsStack = createStackNavigator();
const SearchEliquidsStackScreen = () => {
  return (
    <SearchEliquidsStack.Navigator>
      <SearchEliquidsStack.Screen
        name="SearchEliquids"
        component={SearchEliquidsComponent}
        options={{
          title: "Buscar",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </SearchEliquidsStack.Navigator>
  );
};

const SearchBrandsStack = createStackNavigator();
const SearchBrandsStackScreen = () => {
  return (
    <SearchBrandsStack.Navigator>
      <SearchBrandsStack.Screen
        name="SearchBrands"
        component={SearchBrandsComponent}
        options={{
          title: "Buscar",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </SearchBrandsStack.Navigator>
  );
};
//END Search Stack SECTION

//Favorites Stack SECTION
const FavoritesVapeStoresStack = createStackNavigator();
const FavoritesVapeStoresStackScreen = () => {
  return (
    <FavoritesVapeStoresStack.Navigator>
      <FavoritesVapeStoresStack.Screen
        name="FavoritesVapeStores"
        component={FavoritesVapeStoresComponent}
        options={{
          title: "Favoritos",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </FavoritesVapeStoresStack.Navigator>
  );
};

const FavoritesEliquidsStack = createStackNavigator();
const FavoritesEliquidsStackScreen = () => {
  return (
    <FavoritesEliquidsStack.Navigator>
      <FavoritesEliquidsStack.Screen
        name="FavoritesEliquids"
        component={FavoritesEliquidsComponent}
        options={{
          title: "Favoritos",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </FavoritesEliquidsStack.Navigator>
  );
};
//END Favorites Stack SECTION

//Account Stack SECTION
const AccountStack = createStackNavigator();
const AccountStackScreen = () => {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="Account"
        component={AccountInfoComponent}
        options={{
          title: "Perfil de Usuario",
          headerTitleAlign: "center",
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
          headerTitleAlign: "center",
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
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </AccountStack.Navigator>
  );
};
//END Account Stack SECTION

//Account Chat Stack SECTION
const ChatStack = createStackNavigator();
const ChatStackScreen = () => {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="Chat"
        component={ChatComponent}
        options={{
          title: "Chat",
          headerTitleAlign: "center",
          headerStyle: {},
          headerTitleStyle: {},
          headerRight: () => <Header />,
        }}
      />
    </ChatStack.Navigator>
  );
};
//END Chat Stack SECTION

//VapeStores Tabs SECTION
const VapeStoresTabs = createBottomTabNavigator();
const VapeStoresTabsScreen = () => (
  <VapeStoresTabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Tiendas") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Favoritos") {
          iconName = focused ? "heart" : "heart-outline";
        } else if (route.name === "Top 5") {
          iconName = focused ? "star" : "star-outline";
        } else if (route.name === "Perfil") {
          iconName = focused ? "account" : "account-outline";
        } else if (route.name === "Buscar") {
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
    <VapeStoresTabs.Screen name="Tiendas" component={VapeStoresStackScreen} />
    <VapeStoresTabs.Screen
      name="Favoritos"
      component={FavoritesVapeStoresStackScreen}
    />
    <VapeStoresTabs.Screen name="Top 5" component={TopVapeStoresStackScreen} />
    <VapeStoresTabs.Screen
      name="Buscar"
      component={SearchVapeStoresStackScreen}
    />
    <VapeStoresTabs.Screen name="Perfil" component={AccountStackScreen} />
  </VapeStoresTabs.Navigator>
);
//END VapeStores SECTION

//Eliquids Tabs SECTION
const EliquidsTabs = createBottomTabNavigator();
const EliquidsTabsScreen = () => (
  <EliquidsTabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Eliquids") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Favoritos") {
          iconName = focused ? "heart" : "heart-outline";
        } else if (route.name === "Top 5") {
          iconName = focused ? "star" : "star-outline";
        } else if (route.name === "Perfil") {
          iconName = focused ? "account" : "account-outline";
        } else if (route.name === "Buscar") {
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
    <EliquidsTabs.Screen name="Eliquids" component={EliquidsStackScreen} />
    <EliquidsTabs.Screen
      name="Favoritos"
      component={FavoritesEliquidsStackScreen}
    />
    <EliquidsTabs.Screen name="Top 5" component={TopEliquidsStackScreen} />
    <EliquidsTabs.Screen name="Buscar" component={SearchEliquidsStackScreen} />
    <EliquidsTabs.Screen name="Perfil" component={AccountStackScreen} />
  </EliquidsTabs.Navigator>
);
//END Eliquids SECTION


//Brands Tabs SECTION
const BrandsTabs = createBottomTabNavigator();
const BrandsTabsScreen = () => (
  <BrandsTabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Brands") {
          iconName = focused ? "home" : "home-outline";
        }  else if (route.name === "Buscar") {
          iconName = focused ? "feature-search" : "feature-search-outline";
        }else if (route.name === "Perfil") {
          iconName = focused ? "account" : "account-outline";
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
    <BrandsTabs.Screen name="Brands" component={BrandsStackScreen} />
    {/* <BrandsTabs.Screen name="empty" />
    <BrandsTabs.Screen name="empty" /> */}
    <BrandsTabs.Screen name="Buscar" component={SearchBrandsStackScreen} />
    <BrandsTabs.Screen name="Perfil" component={AccountStackScreen} />
  </BrandsTabs.Navigator>
);
//END Brands SECTION

//Chat Tabs SECTION
const ChatTabs = createBottomTabNavigator();
const ChatTabsScreen = () => (
  <ChatTabs.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Chat") {
          iconName = focused ? "home" : "home-outline";
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
    <ChatTabs.Screen name="Chat" component={ChatStackScreen} />
  </ChatTabs.Navigator>
);
//END Eliquids SECTION

const AppDrawer = createDrawerNavigator();
const AppDrawerScreen = () => (
  <AppDrawer.Navigator>
    {/*  */}
    <AppDrawer.Screen
      name="VapeStoreTabs"
      component={VapeStoresTabsScreen}
      options={{ drawerLabel: "Tiendas" }}
    />
    <AppDrawer.Screen
      name="Eliquids"
      component={EliquidsTabsScreen}
      options={{ drawerLabel: "E-liquids" }}
    />
    <AppDrawer.Screen
      name="Brands"
      component={BrandsTabsScreen}
      options={{ drawerLabel: "Brands" }}
    />
    <AppDrawer.Screen
      name="Chat"
      component={ChatTabsScreen}
      options={{ drawerLabel: "Chat" }}
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

//TO DO: Añadir Imagen Logo en Drawer

//import { View, StyleSheet, Image, ImageBackground } from "react-native";

// const LogoTitle =()=> {
//   return (
//     <View style={styles.container}>
//       <ImageBackground source={require("../../assets/img/APV_logo.jpg")} style={styles.image}>
//       <Text style={styles.text}>Inside</Text>
//     </ImageBackground>
//     </View>
//   );
// }
//<AppDrawer.Screen
//       name=" "
//       component={VapeStoresTabsScreen}
//       options={{ headerTitle: (props) => <LogoTitle {...props} /> }}
// />}
// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "white",
//     flex: 1,
//   },

//   image: {
//     flex: 1,
//     resizeMode: "cover",
//     justifyContent: "center"
//   },
// });
