import { View, Text, TouchableOpacity, StyleSheet, FlatList} from "react-native";
import { workoutService } from "../services/api";
import { useEffect, useState } from "react";

export default function HistoryScreen() {
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
            <Text style={styles.title}>Historial</Text>
            {/**/}
            <FlatList 
                data={workouts}
                keyExtractor={(item: any) => item.id}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.workoutCard}>
                        <Text style={styles.workoutName}>{item.name}</Text>
                        <Text style={styles.workoutDate}>{item.date}</Text>
                    </TouchableOpacity>

                )}
            >
            </FlatList>

        </View> 
    );
}

const styles = StyleSheet.create({
   container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    workoutCard: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    workoutName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    workoutDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    }, 

});