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
//imports para iconos
import { Ionicons } from "@expo/vector-icons";
//import ThemeProvider
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
//import de WorkoutProvider
import { WorkoutProvider } from "./src/context/WorkoutContext";
//import componente WorkoutModal
import WorkoutModal from "./src/components/WorkoutModal";

const Stack = createNativeStackNavigator();
//Stack.Navigator define un "stack" de pantallas (como una pila de cartas)
//Stack.Screen registra cada pantalla con un nombre
//initialRouteName="Login" la primera pantalla que se muestra
//headerShown: false oculta el header en Login(oculta barra superior)

//creacion o instanciacon del tabNavigator
const Tab = createBottomTabNavigator();

//crear componente de Tabs
function MainTabs() {
  return (
    <Tab.Navigator
      //screenOptions funcion que recibe informacion de cada pantalla(route) y retorna la configuracion
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor:'#0D1117',
        },
        headerTintColor: '#FFFFFF', 
        tabBarStyle: {
          backgroundColor: '#0D1117',
          borderTopColor: '#30363D',
        },
        tabBarActiveTintColor: '#4A9EFF',
        tabBarInactiveTintColor: '#8B949E',
        tabBarIcon: ({ focused, color, size }) => {
          //iconName variable que guardara el nombre del icono
          //keyof typeof Ionicons.glyphMap: TypeScript solo acepto nombres de iconos que existen en IonIcons
          let iconName: keyof typeof Ionicons.glyphMap;
          //route.name -> nombre de la pantalla actual
          if (route.name === 'Home') {
            //focused -> el tab esta seleccionado
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Exercises') {
            iconName = focused ? 'barbell' : 'barbell-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }
          //retornar el icono
          return <Ionicons name={iconName} size={size} color={color} />;
        }

      })}  
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio'}} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Historial' }} />
      <Tab.Screen name="Exercises" component={ExercisesScreen} options={{ title: 'Ejercicios' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  )
}
export default function App(){
  return (
    //todas las pantallas estaran  dentro del ThemeProvider pueden usar useTheme() 
    <ThemeProvider>
      <WorkoutProvider>
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
              options={{ headerShown: false}}//tabNavigator ya tiene su propio header
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
          <WorkoutModal/>
        </NavigationContainer>
        
      </WorkoutProvider>  
    </ThemeProvider>  
  )
}