import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { exerciseService } from "../services/api";

export default function ExercisesScreen() {
    //estados para ejercicios y busqueda
    const  [ exercises, setExercises ] = useState([]);
    const [ searchText, setSearchText ] = useState('');

    //funcion para cargar ejercicos
    const loadExercises = async () => {
        try {
            //llamar a la api
            const exerciseList = await exerciseService.getExercises();
            //setear la lista de ejercicios
            setExercises(exerciseList);
        } catch (error) {
            console.log('Error:',  error);
        }
    };

    //para cargar al seleccionar la pantalla
    useEffect(() => {
        loadExercises();
    }, []);

    const filteredExercises = exercises.filter((exercise: any) => 
    exercise.name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ejercicios</Text>
            {/*cuadro de texto para filtrar por nombre*/}
            <TextInput 
                style={styles.searchInput}
                placeholder="buscar ejercicio..."
                value={searchText}
                onChangeText={setSearchText}
            />
            {/*flatList para mostrar los ejercicios*/}
            <FlatList
                data={filteredExercises}
                keyExtractor={(item: any) => item.id}
                renderItem={({item}) => (
                    <TouchableOpacity style={styles.exerciseCard}>
                        <Text style={styles.exerciseName}>{item.name}</Text>
                        <Text style={styles.exerciseMuscle}>{item.muscleGroup}</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    exerciseCard: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    exerciseMuscle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
});