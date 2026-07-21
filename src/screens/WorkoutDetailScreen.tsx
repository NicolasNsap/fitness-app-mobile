import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { workoutService } from "../services/api";

//{ route } recibe los parametros de navegacion
export default function WorkoutDetailScreen({ route }: any) {
    //workoutId es el id  del workout que tocamos
    const { workoutId } = route.params;//route.params contiene los datos que le  pasamos
    const [workout, setWorkout] = useState<any>(null);//aun  no tenemos datos
    const [loading, setLoading] = useState(true);//empieza cargando

    //carga de datos
    useEffect(() => {
        //cuando la pantalla carga ejecuta loadWorkout() una vez
        loadWorkout();
    }, []);

    //funcion loadWorkout
    const loadWorkout = async () => {
        try {
            const data = await workoutService.getWorkoutById(workoutId);
            setWorkout(data);
        }catch (error) {
            console.log('Error:', error);
        }finally{
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!workout) {
        return (
            <View style={styles.container}>
                <Text>No se encontro el workout</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{workout.name}</Text>
            <Text style={styles.date}>{workout.date}</Text>
            
            {workout.notes && (
                <Text style={styles.notes}>{workout.notes}</Text>
            )}

            <View style={styles.stats}>
                <Text>Ejercicios: {workout.totalExercises}</Text>
                <Text>Sets: {workout.totalSets}</Text>
            </View>

            <Text style={styles.sectionTitle}>Ejercicios</Text>

            {workout.exercises?.length === 0 ? (
                <Text style={styles.empty}>No hay ejercicios aún</Text>
            ) : (
                <FlatList
                    data={workout.exercises}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.exerciseCard}>
                            <Text style={styles.exerciseName}>{item.exerciseName}</Text>
                            <Text>{item.sets?.length || 0} sets</Text>
                        </View>
                    )}
                />
            )}
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
    },
    date: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    notes: {
        fontSize: 14,
        color: '#888',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    stats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    empty: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    exerciseCard: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
    },
});