//contenedor que maneja toda la navegacion
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import CreateWorkoutScreen from "./src/screens/CreateWorkoutScreen";
import WorkoutDetailScreen from "./src/screens/WorkoutDetailScreen";
import AddExerciseScreen from "./src/screens/AddExerciseScreen";
import AddSetsScreen from "./src/screens/AddSetsScreen";
//imports de las pantallas creadas para el tabNavigator
import ProfileScreen from "./src/screens/ProfileScreen";
import HistoryScreen from "./src/screens/HistoryScreen";
import ExercisesScreen from "./src/screens/ExercisesScreen";

const Stack = createNativeStackNavigator();
//Stack.Navigator define un "stack" de pantallas (como una pila de cartas)
//Stack.Screen registra cada pantalla con un nombre
//initialRouteName="Login" la primera pantalla que se muestra
//headerShown: false oculta el header en Login(oculta barra superior)

const Tab = createBottomTabNavigator();

//crear componente de Tabs
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio'}} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Historial' }} />
      <Tab.Screen name="Exercises" component={ExercisesScreen} options={{ title: 'Ejercicios' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  )
}
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
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false}}
        />
        <Stack.Screen
          name="CreateWorkout"
          component={CreateWorkoutScreen}
          options={{ title: 'Nuevo Entrenaiento'}}
        />
        <Stack.Screen
          name="WorkoutDetail"
          component={WorkoutDetailScreen}
          options={{title: 'Detalle'}}
        />
        <Stack.Screen
          name="AddExercise"
          component={AddExerciseScreen}
          options={{ title: 'Agregar Ejercicio'}}
        />
        <Stack.Screen
          name="AddSets"
          component={AddSetsScreen}
          options={{title: 'Agregar Sets'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}