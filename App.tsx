//contenedor que maneja toda la navegacion
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";

const Stack = createNativeStackNavigator();
//Stack.Navigator define un "stack" de pantallas (como una pila de cartas)
//Stack.Screen registra cada pantalla con un nombre
//initialRouteName="Login" la primera pantalla que se muestra
//headerShown: false oculta el header en Login
export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Inicio'}}
        />  
      </Stack.Navigator>
    </NavigationContainer>
  )
}