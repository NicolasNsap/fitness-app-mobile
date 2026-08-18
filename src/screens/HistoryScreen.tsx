import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal, Alert} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { workoutService } from "../services/api";
import { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";

export default function HistoryScreen() {
    const {theme} = useTheme();
    const styles = createStyles(theme);
    //state de workouts
    const  [ workouts, setWorkouts ] = useState([]);
    //controla si el menu esta abierto
    const [menuVisible, setMenuVisible] = useState(false);
    //guarda que workout selecciono el usuario
    const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

    const navigation = useNavigation();

    //para cargar al abrir la pantalla
    useEffect(() => {
        loadWorkouts();
    }, []);
    
    //funcion para cargar los workouts(entrenamientos)
    const loadWorkouts = async () => {
        try {
            //llamar a la API
            const workoutList = await workoutService.getWorkouts();
            //setear los entrenamientos en el estado setWorkouts(cambio de estado)
            setWorkouts(workoutList);
        } catch (error) {
            console.log('Error:',  error);      
        }
    };

    //funcion para abrir el menu
    const handleOpenMenu = (workout: any) => {
        setSelectedWorkout(workout);
        setMenuVisible(true);
    }

    //funcion para repetir el entrenamiento
    const handleRepeatWorkout = async () => {
        try {
            //cerrar el menu, ocultar modal
            setMenuVisible(false);

            //crear un nuevo workout con fecha de hoy
            const today = new Date().toISOString().split('T')[0];
            const newWorkout = await workoutService.createWorkout(selectedWorkout.name, today);

            //copiar cada ejercicio al nuevo workout
            for (const exercise of selectedWorkout.exercises) {
                await workoutService.addExerciseToWorkout(newWorkout.id, exercise.exerciseId, [{setNumber: 1, weight: 0, restSeconds: 120}]);

            }

            //navegar al nuevo workout
            (navigation as any).navigate('WorkoutDetail', {workoutId: newWorkout.id, isNew: true});
        } catch (error) {
            console.log('Error:', error);
            Alert.alert('Error', 'No se puede repetir el entrenamiento')
            
        }
    }

    return(
        <View style={styles.container}>
            {/**/}
            <FlatList 
                data={workouts}
                keyExtractor={(item: any) => item.id}
                renderItem={({item: workout}) => (
                    <View style={styles.workoutCard}>
                        <TouchableOpacity 
                        style={styles.workoutInfo} 
                        onPress={() => (navigation as any).navigate('WorkoutDetail', {workoutId: workout.id, isNew: false})}
                    >
                        <Text style={styles.workoutName}>{workout.name}</Text>
                        <Text style={styles.workoutDate}>{workout.date}</Text>
                        <Text style={styles.timeDuration}>
                            {workout.durationSeconds
                                ? `⏱️ ${Math.floor(workout.durationSeconds / 3600)}:${Math.floor((workout.durationSeconds % 3600) / 60).toString().padStart(2, '0')}:${(workout.durationSeconds % 60).toString().padStart(2, '0')}`  // ✅
                                : ''
                            }
                        </Text>
                        
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => handleOpenMenu(workout)}
                    >
                        <Ionicons name="menu-outline" size={24} color={theme.textPrimary}/>
                    </TouchableOpacity>
                    </View>
                    
                )}
            >
            </FlatList>
            {/* modal para el menu de opciones */}
            <Modal 
                visible={menuVisible}
                transparent={true}
                animationType= "fade"
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => handleRepeatWorkout()}
                        >
                            <Ionicons name="reload-outline" size={20} color={theme.textPrimary}/>
                            <Text style={styles.menuItemText}>Repetir entrenamiento</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.menuItem}
                            onPress={() => setMenuVisible(false)}
                        >
                            <Ionicons name="close-outline" size={20} color={theme.textSecundary}/>
                            <Text style={styles.manuItemTextCancel}>Cancelar</Text>

                        </TouchableOpacity>

                    </View>

                </TouchableOpacity>

            </Modal>

        </View> 
    );
}

const createStyles = (theme: any) => StyleSheet.create({
   container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: theme.textPrimary,
    },
    workoutCard: {
        backgroundColor: theme.cardBackground,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    workoutName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.textPrimary,
    },
    workoutDate: {
        fontSize: 14,
        color: theme.textSecundary,
        marginTop: 5,
    },
    timeDuration: {
        fontSize: 13,
        fontWeight: 'bold',
        color: theme.textSecundary,
    },
    workoutInfo: {
        flex: 1,
    },
    menuButton: {
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: theme.cardBackground,
        borderRadius: 10,
        width: '80%',
        padding: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1, 
        borderBlockColor: theme.border,
    },
    menuItemText: {
        color: theme.textPrimary,
        fontSize: 16,
        marginLeft: 10,
    },
    manuItemTextCancel: {
        color: theme.textPrimary,
        fontSize: 16,
        marginLeft: 10,
    },

});