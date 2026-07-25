import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { exerciseService } from '../services/api';


export default function AddExerciseScreen({route}: any) {
    //workout donde se agragaran los ejercicios
    const { workoutId } = route.params;
    //lista de ejercicios dosponibles
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    //objeto para nevagar
    const navigation = useNavigation();

    //cargar ejercicios al entrar
    useEffect(() => {
        loadExercises();
    }, []);

    //funcion loadExercises
    const loadExercises = async () => {
        try {
            //llama a la  api y espera la lista de ejercicios
            const data = await exerciseService.getExercises();
            //guarda los ejercicios 
            setExercises(data);
        } catch (error) {
            console.log('Error:', error);
            
        }finally {
            setLoading(false);//siempre desactiva el spinner
        }
    }

    const handleSelectExercise = (exercise: any) => {
        (navigation as any).navigate('AddSets', {
            workoutId, 
            exerciseId: exercise.id,
            exerciseName: exercise.name
        });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecciona un ejercicio</Text>

            <FlatList
                data={exercises}
                keyExtractor={(item: any) => item.id}
                renderItem={({item}) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleSelectExercise(item)}
                    >
                        <Text style={styles.exerciseName}>{item.name}</Text>
                        <Text style={styles.muscleGroup}>{item.muscleGroup}</Text>
                    </TouchableOpacity>
                )}
            />
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    card: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 10,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
    },
    muscleGroup: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});