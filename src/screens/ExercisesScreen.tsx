import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Modal} from "react-native";
import { useEffect, useState } from "react";
import { exerciseService } from "../services/api";

export default function ExercisesScreen() {
    //estados para ejercicios y busqueda
    const [exercises, setExercises ] = useState([]);
    const [ searchText, setSearchText ] = useState('');
    const [ selectedMuscleGroup, setSelectedMuscleGroup ] = useState<string>('');
    //estado para mostrar y ocultar el menu
    const [ showMuscleFilter, setShowMuscleFilter ] = useState(false);

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

    //extraer zonas musculares unicas
    const muscleGroups = [...new Set(exercises.map((e: any) => e.muscleGroup))];

    //filtro combinado
    const filteredExercises = exercises.filter((exercise: any) => { 
        const matchesText = exercise.name.toLowerCase().includes(searchText.toLowerCase());
        const matchesMuscle = selectedMuscleGroup === '' || exercise.muscleGroup === selectedMuscleGroup;
        return matchesText && matchesMuscle;
    });

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
            {/*boton para filtro por zona muscular*/}
            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={styles.filterButton}
                    //alterna mostrar/ocualtar menu
                    onPress={() => setShowMuscleFilter(!showMuscleFilter)}
                >
                    <Text style={styles.filterButtonText}>
                        {/*muestra la zona o texto por defecto*/}
                       { selectedMuscleGroup || 'zona muscular' }
                    </Text>
                </TouchableOpacity>
                {/*solo muestra quitar filtro si hay filtro activo*/}
                {selectedMuscleGroup !== '' && (
                    <TouchableOpacity onPress={() => setSelectedMuscleGroup('')}>
                        <Text style={styles.clearFilter}>Quitar filtro</Text>
                    </TouchableOpacity>
                )}
            </View>
            {/*agegar el menu desplegable*/}
            <Modal
                visible={showMuscleFilter}
                transparent={true}
                animationType="fade"
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowMuscleFilter(false)}
                >
                    <View style={styles.dropdown}>
                        {muscleGroups.map((group: string) => (
                            <TouchableOpacity
                                key={group}
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setSelectedMuscleGroup(group);
                                    setShowMuscleFilter(false);
                                }}
                            >  
                                <Text style={styles.dropdownText}>{group}</Text>
                            </TouchableOpacity>
                        ))}

                    </View>

                </TouchableOpacity>

            </Modal>
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
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    filterButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    filterButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    clearFilter: {
        color: '#FF3B30',
        marginLeft: 10,
        fontWeight: 'bold',
    },
    dropdown: {
        backgroundColor: '#fff',
        borderRadius: 10,
        maxHeight: '60%',
        alignSelf: 'flex-start',
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    dropdownText: {
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 200,
        paddingLeft: 20,
    },
});