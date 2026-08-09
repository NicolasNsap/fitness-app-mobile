import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Modal, TextInput} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { exerciseService, setService, workoutService } from "../services/api";


//{ route } recibe los parametros de navegacion
export default function WorkoutDetailScreen({ route }: any) {
    //workoutId es el id  del workout que tocamos
    const { workoutId } = route.params;//route.params contiene los datos que le  pasamos
    const [workout, setWorkout] = useState<any>(null);//aun  no tenemos datos
    const [loading, setLoading] = useState(true);//empieza cargando
    //estados para el tiempo de entrenaiento(duracion)
    const [workoutSeconds, setWorkoutSeconds] = useState(0);
    const [workoutTimerActive, setWorkoutTimerActive] = useState(true);
    //estados para la ventala modal de editar sets
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSet, setSelectedSet] = useState<any>(null);
    const [editWeight, setEditWeight] = useState('');
    const [editReps, setEditReps] = useState('');
    //estados para el modal de editar workouts
    const [editWorkoutModalVisible, setEditWorkoutModalVisible] = useState(false);
    const [editName, setEditName] = useState('');
    const [editNotes, setEditNotes] = useState('');
    const [editDuration, setEditDuration] = useState('');
    //estados de tiempo de descanso
    const [editingRestSetId, setEditingRestSetId] = useState<string | null>(null);
    //valor temporal mientras el usuario escribe
    const [editRestValue, setEditRestValue] = useState('');
    //estados para el timer activo
    //que set(serie) tiene el timer corriendo
    const [activeTimerSetId, setActiveTimerSetId] = useState<string | null>(null);
    //segundos restantes del countDown
    const [timerSeconds, setTimerSeconds] = useState(0);
    //estados para ingresar datos en cada set
    const [editingSetId, setEditingSetId] = useState<string | null>(null);
    const [inlineWeight, setInlineWeight] = useState('');
    const [inlineReps, setInlineReps] = useState('');
    //modal para agredar ejercicios
    const [addExerciseModal, setAddExerciseModal] = useState(false);
    //estados para el catalogo de ejercicios
    const [exerciseList, setExerciseList] = useState([]);
    //estados para selecionar ejercicios del modal de catalogo de ejercicios 
    const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

    const navigation = useNavigation();

    //corre cada vez que la pantalla aparece en pantalla
    useFocusEffect(
        useCallback(() => {
            loadWorkout();
        }, [workoutId])
        //cuando la pantalla carga ejecuta loadWorkout() una vez
    );
    //useEffect para el timer del entrenamiento
    useEffect(() => {
        if (workoutTimerActive) {
            const interval = setInterval(() => {
                setWorkoutSeconds(prev => prev + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [workoutTimerActive]);

    //useEffect para activar el modal
    useEffect(() => {
        //validar si modal esta en true
        if (addExerciseModal === true){
            //cargar la lista de ejercicios del catalogo
            loadExerciseList();
        }
        //observando comportamiento 
    },[addExerciseModal]);

    //useEffect para cuenta atras del timer de descando
    //cuando el estado del set cambia se activa el useEffect
    useEffect(() => {
        //si hay timer activo y quedan segundos
        if (activeTimerSetId && timerSeconds > 0) {
            //crear un intervalo que se ejecuta cada 1000ms(1 segundo)
            const interval = setInterval(() => {
                //toma el valor anterior y resta 1
                setTimerSeconds(prev => prev -1);
            }, 1000);
            //limpiar el intervalo cuando el efecto se re-ejecuta
            return () => clearInterval(interval);
        }
        //si hay timer activo y llego a 0
        if (activeTimerSetId && timerSeconds === 0) {
            Alert.alert('¡Descanso terminado!', 'Es hora del siguiente set')
            //desactivar timer
            setActiveTimerSetId(null);
        }
        //observar  estos valores para ejecutar el useEffect
    }, [activeTimerSetId, timerSeconds]);

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

    //cargar la lista de ejercicios para el modal
    const loadExerciseList = async () => {
        try {
            const exercises = await exerciseService.getExercises();
            setExerciseList(exercises);
        } catch (error) {
            console.log('Error', error);
            
        }
    }

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
    //metodo para agregar un set(serie)
    const handleAddSet = async (exercise: any) => {
        try {
            //obtener ultimo set del ejercicio
            const lastSet = exercise.sets[exercise.sets.length -1];
            //calcular valores del nuevo set
            const newSetNumber = lastSet ? lastSet.setNumber + 1 : 1;
            const newWeight = lastSet ? lastSet.weight : 0;
            const newReps = lastSet ? lastSet.reps : 0;
            const newRestSeconds = lastSet ? lastSet.restSeconds : 120;
            //llamar a la api
            await setService.createSet(exercise.id, newSetNumber, newWeight, newReps, newRestSeconds);
            //recargar
            loadWorkout();

        } catch (error) {
            Alert.alert('Error', 'No se pudo agregar el set');
        }
    }
    //abrir ventana modal de editar sets
    const handleEditSet = (set: any) => {
        //guardar el set seleccionado
        setSelectedSet(set);
        //llevar el input de peso
        setEditWeight(set.weight.toString());
        //llenar el input de reps
        setEditReps(set.reps.toString());
        //abrir el modal
        setModalVisible(true);
    };
    //guardar set actulizado
    const handleSaveSet = async () => {
        try {
            await setService.updateSet(selectedSet.id, parseFloat(editWeight), parseInt(editReps), selectedSet.completed, selectedSet.restSeconds || 0);
            loadWorkout();
            setModalVisible(false);
        } catch (error) {
            Alert.alert('No se pudo actulizar el set')
        }
    };

    //eliminar un set
    const handleDeleteSet = async () => {
        if (!selectedSet) return;
        //mensaje de alerta
        Alert.alert(
            'Eliminar set',
            `¿Eliminar set ${selectedSet.setNumber}?`,
            //array de botones
            [
                {text: 'Cancelar', style: 'cancel'},
                {text: 'Eliminar', style: 'destructive',
                    onPress: async () => {
                        try {
                            await setService.deleteSet(selectedSet.id);
                            loadWorkout();
                            setModalVisible(false);
                        } catch (error) {
                            Alert.alert('Error', 'No se puede eliminar el set')
                            
                        }
                    }
                }
            ]
        )
    };

    //fucion para abrir modal de editar workout
    const handleOpenEditWorkout = () => {
        setEditName(workout.name || '');
        setEditNotes(workout.notes || '');
        setEditDuration(workout.durationMinutes?.toString() || '');
        setEditWorkoutModalVisible(true);
    }

    //funcion para guardar los cambios del workout
    const handleSaveWorkout = async () => {
        try {
            await workoutService.updateWorkout(workoutId, editName, editNotes, parseInt(editDuration));
            loadWorkout();
            setEditWorkoutModalVisible(false);
        } catch (error) {
            Alert.alert('Error', 'No se pudo actulizar el workout')
            
        }
    };

    //funcion para iniciar timer al marcar
    const handleToggleCompleted = async (set: any) => {
        try {
            //el simbolo ! invierte al valor
            const newCompleted =  !set.completed;
            //llamada a la api
            await setService.updateSet(set.id, set.weight, set.reps, newCompleted, set.restSeconds || 0);
            //si  marca como completado y tiene tiempo de descanso, iniciar timer
            if ( newCompleted && set.restSeconds > 0) {
                setActiveTimerSetId(set.id);
                setTimerSeconds(set.restSeconds);
            }
            //recargar workout
            loadWorkout();            
        } catch (error) {
            Alert.alert('Error', 'No se pudo actulizar el set');
            
        } 
    };

    //funcione para editar el tiempo de descando
    const handleEditRest = (set: any) => {
        //guardar el id del set que vamos a editar
        setEditingRestSetId(set.id);
        //llenar le valor con los segundos actuales
        setEditRestValue(set.restSeconds?.toString() || '0');

    };

    //funcion para guardar el timpo seteado por el uaurio
    const handleSaveRest = async (set: any) => {
        try {
            //llamar a updateSet con el nuevo restSeconds
            await setService.updateSet(set.id, set.weight, set.reps, set.completed, parseInt(editRestValue));
            //cerrar el modo ediccion
            setEditingRestSetId(null);
            //recargar workout 
            loadWorkout();
            
        } catch (error) {
            Alert.alert('Error', 'No se pudo actulizar el tiempo de descanso');
        }
        
    }

    //crear funcion para terminar entrenaiento
    const handleCompleteWorkout = async () => {
        try {
            //detener el timer
            setWorkoutTimerActive(false);

            await workoutService.completeWorkout(workoutId, workoutSeconds);
            Alert.alert('¡Entrenamiento completado!', 'Buen trabajo 💪');
            (navigation as any).navigate('Home');
        } catch (error) {
            Alert.alert('Error', 'No se pudo completar el entrenamiento');
        }
    };

    //funcion para cada edicion de set
    const handleStartInlineEdit = (set: any) => {
        setEditingSetId(set.id);
        setInlineWeight(set.weight?.toString() || '');
        setInlineReps(set.reps?.toString() || '');
    };

    //funcion para guardar info de los set en linea
    const handleSaveInlineEdit = async (set: any) => {
        try {
            await setService.updateSet(
                set.id, 
                parseFloat(inlineWeight), 
                parseInt(inlineReps), 
                set.completed, 
                set.restSeconds || 0
            );
            setEditingSetId(null);
            loadWorkout();
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el set');
        }
    };

    //funcion para esetados de seleccion de ejercicios del catalogo
    const toggleSelectedExercises = (exercise: any) => {
        //verficar si el id ya esta en la lista
        if (selectedExercises.includes(exercise.id)) {
            //ya esta seleccionado, quitalo
            //crea un nuevo array sin el elemento que queremos quitar
            setSelectedExercises(selectedExercises.filter(id => id !== exercise.id))
        }else {
            //no esta seleccionado, agregalo
            //...(spread) copia todos los elementos y agrega uno nuevo al final
            setSelectedExercises([...selectedExercises, exercise.id]);
        }

    };

    //metodo al momento de cliquear el boton cancelar en el modal
    const handleCancelExercisesModal = () => {
        setAddExerciseModal(false);
        setSelectedExercises([]);
    }
    //funcion para agregar ejercicios al workour desde el catalogo(modal)
    const handleAddExercisesModal = async () => {
        try {
            for (const exerciseId of selectedExercises) {
                await workoutService.addExerciseToWorkout(workoutId, exerciseId, [{ setNumber: 1, weight: 0, reps: 0, restSeconds: 120 }]);
            }
            setAddExerciseModal(false);
            setSelectedExercises([]);
            loadWorkout();

        } catch (error) {
            console.log('Error', error);
            
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
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{workout.name}</Text>
                    <Text style={styles.timerText}>
                        ⏱️ {Math.floor(workoutSeconds / 3600)}:{(Math.floor(workoutSeconds / 60) % 60).toString().padStart(2, '0')}:{(workoutSeconds % 60).toString().padStart(2, '0')}
                    </Text>
                </View>
                <TouchableOpacity style={styles.completeButton} onPress={handleCompleteWorkout}>
                    <Text style={styles.completeButtonText}>terminar</Text>
                </TouchableOpacity>
                
            </View>

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
                    onPress={() => setAddExerciseModal(true)}
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
                                    onPress={() => handleDeleteExercise(item.id, item.exerciseName)}
                                >
                                    <Text style={styles.deleteButton}>✕</Text>
                                </TouchableOpacity>
                            </View>
        
                            {item.sets?.map((set: any, index: number) => (
                                <View key={index} style={styles.setContainer}>
                                    <View key={index} style={styles.setRow}>
                                        <Text style={styles.setNumber}>{set.setNumber}</Text>

                                        {editingSetId === set.id ? (
                                            <>
                                                <TextInput
                                                    style={styles.inlineInput}
                                                    value={inlineWeight}
                                                    onChangeText={setInlineWeight}
                                                    keyboardType="numeric"
                                                    placeholder="kg"
                                                    autoFocus={true}
                                                />
                                                <TextInput
                                                    style={styles.inlineInput}
                                                    value={inlineReps}
                                                    onChangeText={setInlineReps}
                                                    keyboardType="numeric"
                                                    placeholder="reps"
                                                    onBlur={() => handleSaveInlineEdit(set)}
                                                />
                                            </>
                                        ) : (
                                            <TouchableOpacity style={styles.setValues} onPress={() => handleStartInlineEdit(set)}>
                                                <Text style={styles.setText}>{set.weight}kg</Text>
                                                <Text style={styles.setText}>{set.reps} reps</Text>
                                            </TouchableOpacity>
                                        )}

                                        <TouchableOpacity onPress={() => handleToggleCompleted(set)}>
                                            <Text style={styles.checkbox}>
                                                {set.completed ? '✓' : '○'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    {/*editando este set*/}
                                    {editingRestSetId === set.id ? (
                                        <View style={styles.restEditRow}>
                                            <Text style={styles.restText}>Descando (seg): </Text>
                                            <TextInput
                                                style={styles.restInput}
                                                value={editRestValue}
                                                onChangeText={setEditRestValue}
                                                keyboardType="numeric"
                                                //teclado aparece automaticamente                                            
                                                autoFocus={true}
                                                //guardar cuando el usuario sale del input
                                                onBlur={() => handleSaveRest(set)}
                                            />
                                        </View>
                                    ) : (
                                        <TouchableOpacity onPress={() => handleEditRest(set)}>
                                            <Text style={[styles.restText, activeTimerSetId === set.id && styles.activeTimer]}>
                                                {activeTimerSetId === set.id 
                                                    ? `⏱️ ${Math.floor(timerSeconds / 60)}:${(timerSeconds % 60).toString().padStart(2, '0')}`
                                                    : `${set.restSeconds ? `${Math.floor(set.restSeconds / 60)}:${(set.restSeconds % 60).toString().padStart(2, '0')}` : '0:00'}`
                                                }
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                </View>
                            ))}
                            <TouchableOpacity style={styles.addSetButton} onPress={() => handleAddSet(item)}>
                                <Text style={styles.addSetButtonText}>agregar serie</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
            <TouchableOpacity style={styles.deleteWorkoutButton} onPress={() => handleDeleteWorkout(workoutId, workout.name)}>
                <Text style={styles.buttonText}>Eliminar entrenamiento</Text>
            </TouchableOpacity>
            
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Set {selectedSet?.setNumber}</Text>

                        <TextInput
                            style={styles.modalInput}
                            value={editWeight}
                            onChangeText={setEditWeight}
                            placeholder="Peso (kg)"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.modalInput}
                            value={editReps}
                            onChangeText={setEditReps}
                            placeholder="reps"
                            keyboardType="numeric"
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSaveSet()}>
                                <Text>Guardar</Text>
                            </TouchableOpacity>                            
                        </View>
                        <TouchableOpacity style={styles.deleteSetButton} onPress={() => handleDeleteSet()}>
                            <Text style={styles.deleteSetText}>Eliminar set</Text>
                        </TouchableOpacity>               
                    </View>
                </View>
            </Modal>

            <Modal visible={editWorkoutModalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar entrenamiento{workout.name}</Text>

                        <TextInput
                            style={styles.modalInput}
                            value={editName}
                            onChangeText={setEditName}
                            placeholder="Nombre"
                            keyboardType= "default"
                        />
                        <TextInput
                            style={styles.modalInput}
                            value={editNotes}
                            onChangeText={setEditNotes}
                            placeholder="notas"
                            keyboardType="default"
                        />
                        <TextInput
                            style={styles.modalInput}
                            value={editDuration}
                            onChangeText={setEditDuration}
                            placeholder="minutos"
                            keyboardType="numeric"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setEditWorkoutModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveWorkout()}>
                                <Text style={styles.saveButtonText}>Guardar</Text>
                            </TouchableOpacity>                            
                        </View>    

                    </View>
                </View>
            </Modal>
            <Modal visible={addExerciseModal} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>catalogo de ejercicios</Text>
                        <FlatList 
                            data={exerciseList} 
                            keyExtractor={(item: any) => item.id}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    //al tocar selecciona/deselecciona
                                    onPress={() => toggleSelectedExercises(item)}
                                    style={[
                                        styles.catalogExerciseItem,
                                        //esta seleccionado  ,  si esta seleccionado aplica estilo verde
                                        selectedExercises.includes(item.id) && styles.catalogExerciseItemSelected
                                    ]}
                                >
                                    <Text style={styles.catalogExerciseName}>{item.name}</Text>
                                    <Text style={styles.catalogExerciseMuscle}>{item.muscleGroup}</Text>

                                </TouchableOpacity>

                            )}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelExercisesModal}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleAddExercisesModal}>
                                <Text style={styles.saveButtonText}>Agregar ({selectedExercises.length})</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>

            </Modal>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    completeButton: {
        backgroundColor: '#34C759',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    completeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    timerText: {
        fontSize: 16,
        alignItems: 'center',
        color: '#666',
        marginTop: 5,
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    cancelButton: {
        padding: 10,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#ccc',
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    saveButton: {
        padding: 10,
        flex: 1,
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#007AFF',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    updateSet: {
        padding: 5,
    },
    deleteSetButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    deleteSetText: {
        color: '#FF3B30',
        fontSize: 14,
    },
    titleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editButton: {
        fontSize: 20,
        padding: 5,
    },
    setRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    checkbox: {
        fontSize: 20,
        padding: 10,
        color: '#007AFF',
    },
    setContainer: {
      marginBottom: 10,
    },
    restText: {
        fontSize: 15,
        color: '#888',
        marginLeft: 5,
        marginTop: 2,
        
    },
    restEditRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    restInput: {
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        width: 60,
        fontSize: 14,
        textAlign: 'center',
    },
    activeTimer: {
        color: '#007AFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    setNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        width: 25,
        color: '#333',
    },
    inlineInput: {
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        width: 60,
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 5,
    },
    setValues: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
    },
        catalogExerciseItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#f5f5f5',
    },
    catalogExerciseItemSelected: {
        backgroundColor: '#34C759',
    },
    catalogExerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    catalogExerciseMuscle: {
        fontSize: 14,
        color: '#666',
    },
    addSetButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    addSetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
 
});
