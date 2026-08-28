import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Modal} from "react-native";
import { useEffect, useState } from "react";
import { exerciseService } from "../services/api";
import { useTheme } from "../theme/ThemeContext";



export default function ExercisesScreen() {
    const {theme} = useTheme();
    const styles = createStyles(theme);
    //estados para ejercicios y busqueda
    const [exercises, setExercises ] = useState([]);
    const [ searchText, setSearchText ] = useState('');
    const [ selectedMuscleGroup, setSelectedMuscleGroup ] = useState<string>('');
    //estado para mostrar y ocultar el menu
    const [ showMuscleFilter, setShowMuscleFilter ] = useState(false);
    //estados para el modal del detalle del ejercico
    const [showExerciseModal, setShowExerciseModal] = useState(false);
    //estado para guardar el id del ejercicio selecionado
    const [selectedExercise, setSelectedExercise] = useState<any> (null);
 
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

    //fucion para controlar la accion del modal de info de cada ejercicio
    const handleOpenExerciseModal = (exercise: any) => {
        //abrir el modal al cliquedar
        setShowExerciseModal(true);
        //mostrar info del ejercicio
        setSelectedExercise(exercise);
    }

    return (
        <View style={styles.container}>
            {/*cuadro de texto para filtrar por nombre*/}
            <TextInput 
                style={styles.searchInput}
                placeholder="buscar ejercicio..."
                placeholderTextColor={theme.textSecondary}
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

            {/*agegar el menu desplegable de zona muscular*/}
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
            {/*flatList para mostrar los ejercicios en pantalla*/}
            <FlatList
                data={filteredExercises}
                keyExtractor={(item: any) => item.id}
                renderItem={({item: exercise}) => (
                    <TouchableOpacity style={styles.exerciseCard} onPress={() => handleOpenExerciseModal(exercise)}>
                        <Text style={styles.cardExerciseName}>{exercise.name}</Text>
                        <Text style={styles.cardExerciseMuscle}>{exercise.muscleGroup}</Text>
                    </TouchableOpacity>
                )}
            />
            {/* modal de informacion de un ejercicio */}
            <Modal
                visible={showExerciseModal}//varible que controla al visibilidad del modal showExerciseModal
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    {selectedExercise && (
                        <View style={styles.exerciseModalContent}>
                            {/* encabezado -> nombre del ejercicio boton salir*/}
                            <View style={styles.header}>
                                <View>
                                    <Text style={styles.modalInfoTitle}>{selectedExercise.name}</Text>
                                </View>
                                <TouchableOpacity style={styles.closeModalInfoButton} onPress={() => setShowExerciseModal(false)}>
                                    <Text style={styles.closeModalInfoButtonText}>x</Text>
                                </TouchableOpacity>

                            </View>
                            {/* informacion del ejercicio para mostrar en el modal de info*/}
                            <View>
                                <Text style={styles.infoExercise}>zona muscular: {selectedExercise.muscleGroup}</Text>
                                <Text style={styles.infoExercise}>equipamiento: {selectedExercise.equipmentNeeded}</Text>
                                <Text style={styles.infoExercise}>nivel de dificultad: {selectedExercise.difficultyLevel}</Text>
                            </View>
                    
                        </View>
                    )}
                </View>
                


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
    //cuadro de texto
    searchInput: {
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: theme.inputBackground,
        color: theme.textPrimary,
    },
    //tarjeta de ejercicio
    exerciseCard: {
        backgroundColor: theme.cardBackground,
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    cardExerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.textPrimary,
    },
    cardExerciseMuscle: {
        fontSize: 14,
        color: theme.textSecondary,
        marginTop: 5,
    },
    filterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    filterButton: {
        backgroundColor: theme.primary,
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    filterButtonText: {
        color: theme.textPrimary,
        textAlign: 'center',
    },
    clearFilter: {
        color: theme.danger,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    dropdown: {
        backgroundColor: theme.cardBackground,
        borderRadius: 10,
        maxHeight: '60%',
        alignSelf: 'flex-start',
    },
    dropdownItem: {
        backgroundColor: theme.cardBackground,
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
    },
    dropdownText: {
        fontSize: 16,
        color: theme.textPrimary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 200,
        paddingLeft: 20,
    },
    exerciseModalContent: {
        backgroundColor: theme.cardBackground,
        borderRadius: 15,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    closeModalInfoButton: {
        backgroundColor: theme.cardBackground,
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 5,
        justifyContent: 'center',
        alignContent: 'center',
    },
    closeModalInfoButtonText: {
        color: theme.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
        alignItems: 'center',
    },
    modalInfoTitle: {
        color: theme.textPrimary,

    },
    infoExercise: {
        color: theme.textSecondary,
        fontSize: 14,
        marginBottom: 5,
    },

});

