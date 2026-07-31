import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { workoutService } from "../services/api";

//{ route } recibe los parametros de navegacion
export default function WorkoutDetailScreen({ route }: any) {
    //workoutId es el id  del workout que tocamos
    const { workoutId } = route.params;//route.params contiene los datos que le  pasamos
    const [workout, setWorkout] = useState<any>(null);//aun  no tenemos datos
    const [loading, setLoading] = useState(true);//empieza cargando
    const navigation = useNavigation();

    //corre cada vez que la pantalla aparece en pantalla
    useFocusEffect(
        useCallback(() => {
            loadWorkout();
        }, [workoutId])
        //cuando la pantalla carga ejecuta loadWorkout() una vez
    );

    //funcion loadWorkout(cargar entrenamiento)
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

    //eliminar ejercicio del entrenaiento
    const handleDeleteExercise = (exerciseId: string, exerciseName: string) => {
        console.log('workout.id:', workout.id);
        console.log('exerciseId:', exerciseId);
        //alerta de eliminacion del ejercicio
        Alert.alert(
            'Eliminar ejercicio',
            `¿Eliminar ${exerciseName} del workout?`,
            //array de botones
            [
                { text: 'Cancelar', style: 'cancel'},
                { text: 'Eliminar', style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('Enviando a API:', workout.id, exerciseId);
                            await workoutService.removeExerciseFromWorkout(workout.id, exerciseId);
                            loadWorkout();
                        } catch (error) {
                            console.log('Error:', error);
                            Alert.alert('Error', 'No se puede eliminar el ejercicio');
                        }
                    }
                },
            ]
        )
    };

    //eliminar un entrenamiento
    const handleDeleteWorkout = (workoutId: string, workoutName: string) => {
        //mensaje de alerta
        Alert.alert(
            'Eliminar entrenamiento',
            `¿Eliminar ${workoutName}?`,
            //array de botones
            [
                {text: 'Cancelar', style: 'cancel'},
                {text: 'Eliminar', style: 'destructive', 
                    onPress: async () => {
                        try {
                            await workoutService.deleteWorkout(workoutId);
                            (navigation as any).navigate('Home');
                        } catch (error) {
                            Alert.alert('Error', 'No se puede eliminar el entrenamiento');
                            
                        }
                    }
                },
            ]
        )
        
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

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ejercicios</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => (navigation as any).navigate('AddExercise', { workoutId: workout.id })}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {workout.exercises?.length === 0 ? (
                <Text style={styles.empty}>No hay ejercicios aún</Text>
            ) : (
                <FlatList
                    //los datos (array)
                    data={workout.exercises}
                    //ID unico de cada uno de los datos
                    keyExtractor={(item: any) => item.id}
                    //renderItem indica como dibujar cada elemento de la lista
                    renderItem={({ item }) => (
                        <View style={styles.exerciseCard}>
                            <View style={styles.exerciseHeader}>
                                <Text style={styles.exerciseName}>{item.exerciseName}</Text>
                                <TouchableOpacity 
                                    onPress={() => handleDeleteExercise(item.exerciseId, item.exerciseName)}
                                >
                                    <Text style={styles.deleteButton}>✕</Text>
                                </TouchableOpacity>
                            </View>
        
                            {item.sets?.map((set: any, index: number) => (
                                <Text key={index} style={styles.setText}>
                                    Set {set.setNumber}: {set.weight}kg x {set.reps}
                                </Text>
                            ))}
                        </View>
                    )}
                />
            )}
            <TouchableOpacity style={styles.deleteWorkoutButton} onPress={() => handleDeleteWorkout(workoutId, workout.name)}>
                <Text style={styles.buttonText}>Eliminar entrenamiento</Text>
            </TouchableOpacity>
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
        flexDirection: 'column',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#007AFF',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    setText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    deleteButton: {
        color: '#FF3B30',
        fontSize: 18,
        fontWeight: 'bold',
        padding: 5,
    },
    deleteWorkoutButton: {
        backgroundColor: '#FF3B30',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }

});