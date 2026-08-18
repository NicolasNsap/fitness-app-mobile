import { View, Text, TouchableOpacity, StyleSheet, FlatList} from "react-native";
import { workoutService } from "../services/api";
import { useEffect, useState } from "react";
import { useTheme } from "../theme/ThemeContext";

export default function HistoryScreen() {
    const {theme} = useTheme();
    const styles = createStyles(theme);
    //state de workouts
    const  [ workouts, setWorkouts ] = useState([]);

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

    return(
        <View style={styles.container}>
            {/**/}
            <FlatList 
                data={workouts}
                keyExtractor={(item: any) => item.id}
                renderItem={({item: workout}) => (
                    <TouchableOpacity style={styles.workoutCard}>
                        <Text style={styles.workoutName}>{workout.name}</Text>
                        <Text style={styles.workoutDate}>{workout.date}</Text>
                        <Text style={styles.timeDuration}>
                            {workout.durationSeconds
                                ? `⏱️ ${Math.floor(workout.durationSeconds / 3600)}:${Math.floor((workout.durationSeconds % 3600) / 60).toString().padStart(2, '0')}:${(workout.durationSeconds % 60).toString().padStart(2, '0')}`  // ✅
                                : ''
                            }
                        </Text>
                    </TouchableOpacity>

                )}
            >
            </FlatList>

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

});