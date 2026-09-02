import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Modal, TextInput} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { exerciseService, setService, workoutService } from "../services/api";
import { useTheme } from "../theme/ThemeContext";
import ExercisesScreen from "./ExercisesScreen";

//{ route } recibe los parametros de navegacion
export default function WorkoutDetailScreen({ route }: any) {
    const {theme} = useTheme();
    const styles = createStyles(theme);
    
    //ESTADOS DEL ENTRENAMIENTO
    //workoutId es el id  del workout que tocamos
    const { workoutId, isNew } = route.params as { workoutId: string, isNew: boolean };//route.params contiene los datos que le  pasamos
    //guarda el entrenamiento completo que viene del backend
    const [workout, setWorkout] = useState<any>(null);//aun  no tenemos datos
    const [loading, setLoading] = useState(true);//empieza cargando

    //TIMER DEL ENTRENAMIENTO
    //estados para el tiempo de entrenaiento(duracion)
    const [workoutSeconds, setWorkoutSeconds] = useState(0);
    //esetado del timer, isnew= true entrenamiento nuevo, comienza a contar isnew= false  inactivo entre,pasado, solo vez el tiempo
    const [workoutTimerActive, setWorkoutTimerActive] = useState(isNew);
    

    //TIMER DE DESCANSO
    //estados de tiempo de descanso
    const [editingRestSetId, setEditingRestSetId] = useState<string | null>(null);
    //valor temporal mientras el usuario escribe
    const [editRestValue, setEditRestValue] = useState('');
    //estados para el timer activo
    //que set(serie) tiene el timer corriendo, si es null no hay timer coorriendo
    const [activeTimerSetId, setActiveTimerSetId] = useState<string | null>(null);
    //segundos restantes del countDown
    const [timerSeconds, setTimerSeconds] = useState(0);

    //EDICION INLINE DE LOS SETS
    //estados para ingresar datos en cada set
    const [editingSetId, setEditingSetId] = useState<string | null>(null);
    const [inlineWeight, setInlineWeight] = useState('');
    const [inlineReps, setInlineReps] = useState('');

    //ESETADOS PARA EDITAR NOMBRE DEL ENTRENAIENTO INLINE
    const [editingWorkoutName, setEditingWorkoutName] = useState(false);
    const [inlineWorkoutName, setInlineWorkoutName] = useState('');

    //MODAL EGREGAR EJERCICIOS
    //modal para agredar ejercicios al tocar "+" el modal de los ejercicio pasa a estado= true 
    const [addExerciseModal, setAddExerciseModal] = useState(false);
    //estados para el catalogo de ejercicios, todos los ejercicios de la lista
    const [exerciseList, setExerciseList] = useState([]);
    //estados para selecionar ejercicios del modal de catalogo de ejercicios, IDs de los ejercicios que el usuario marco
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


    //useEffect para cargar ejercicios cuando abre modal
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
        //si hay timer activo y llego a 0 descando terminado desactiva el timer
        if (activeTimerSetId && timerSeconds === 0) {
            Alert.alert('¡Descanso terminado!', 'Es hora del siguiente set')
            //desactivar timer
            setActiveTimerSetId(null);
        }
        //observar  estos valores para ejecutar el useEffect
    }, [activeTimerSetId, timerSeconds]);


    //OBTNER DEL BACKEND

    //funcion loadWorkout(cargar entrenamiento), obtener desde el backend
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

     //cargar la lista de ejercicios para el modal
    const loadExerciseList = async () => {
        try {
            const exercises = await exerciseService.getExercises();
            setExerciseList(exercises);
        } catch (error) {
            console.log('Error', error);
            
        }
    };

    //ACCIONES SOBRE LOS EJERCICIOS

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
    };

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

   

    //ACCIONES SOBRE EL ENTRENAMIENTO 
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
                            (navigation as any).navigate('MainTabs');
                        } catch (error) {
                            Alert.alert('Error', 'No se puede eliminar el entrenamiento');
                            
                        }
                    }
                },
            ]
        )
        
    };

   


    //crear funcion para terminar entrenaiento
    const handleCompleteWorkout = async () => {
        try {
            //detener el timer
            setWorkoutTimerActive(false);

            await workoutService.completeWorkout(workoutId, workoutSeconds);
            Alert.alert('¡Entrenamiento completado!', 'Buen trabajo 💪');
            (navigation as any).navigate('MainTabs');
        } catch (error) {
            Alert.alert('Error', 'No se pudo completar el entrenamiento');
        }
    };


    //ACCIONES SOBRE  LOS SETS

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

        //funcion para cada edicion de set
    const handleStartInlineEdit = (set: any) => {
        //editar set(serie)
        setEditingSetId(set.id);
        //editar peso
        setInlineWeight(set.weight?.toString() || '');
        //editar repeticiones
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

    //EDITAR TIEMPO DE DESCANDO

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
        
    };

    //EDITAR NOMBRE DEL ENTRENAMIENTO

    //iniciar edicion del nombre
    const handleStartEditName = () => {
        setEditingWorkoutName(true);
        setInlineWorkoutName(workout.name || '');
    };

    //guardar nombre editado
    const handleSaveInlineName = async () => {
        try {
            await workoutService.updateWorkout(workoutId, inlineWorkoutName, workout.notes, workout.durationMinutes);
            setEditingWorkoutName(false);
            loadWorkout();
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar el nombre');
            
        }
    };

    


   

    //mientras espera datos del backend
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    };
    //el backend no devolvio datos
    if (!workout) {
        return (
            <View style={styles.container}>
                <Text>No se encontro el workout</Text>
            </View>
        );
    };

    //FUNCION PARA FORMATEAR FECHA
    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00');
        const today = new Date();

        const days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

        const dayName = days[date.getDay()];
        const dayNumber = date.getDate();
        const monthName = months[date.getMonth()];
        const year = date.getFullYear();

        //si es otro anio, mostrar el anio
        if (year !== today.getFullYear()) {
            return `${dayName} ${dayNumber} ${monthName} ${year}`;
        }
        return `${dayName} ${dayNumber} ${monthName}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    {/* editar el nombre del entrenamiento*/}
                    {editingWorkoutName ? (
                        <TextInput
                            style={styles.title}
                            value={inlineWorkoutName}
                            onChangeText={setInlineWorkoutName}
                            autoFocus={true}
                            onBlur={handleSaveInlineName}
                        />
                    ) : (
                        <TouchableOpacity onPress={handleStartEditName}>
                            <Text style={styles.title}>{workout.name}</Text>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.timerText}>
                        ⏱️ {Math.floor(workoutSeconds / 3600)}:{(Math.floor(workoutSeconds / 60) % 60).toString().padStart(2, '0')}:{(workoutSeconds % 60).toString().padStart(2, '0')}
                    </Text>
                </View>
                {/* boton para terminar entrenamiento */}
                <TouchableOpacity style={styles.completeButton} onPress={handleCompleteWorkout}>
                    <Text style={styles.completeButtonText}>terminar</Text>
                </TouchableOpacity>
                
            </View>

            <Text style={styles.date}>{formatDate(workout.date)}</Text>
            
            {workout.notes && (
                <Text style={styles.notes}>{workout.notes}</Text>
            )}
            {/* tarjeta contador ejercicios y sets*/}
            <View style={styles.countExerciseSets}>
                <Text style={styles.totalExercises}>Ejercicios: {workout.totalExercises}</Text>
                <Text style={styles.totalSets}>Sets: {workout.totalSets}</Text>
            </View>

            {/* titulo de ejercicios y boton de agregar ejercicios */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ejercicios</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => setAddExerciseModal(true)}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* agregar ejecicios al entrenamiento */}
            {workout.exercises?.length === 0 ? (
                <Text style={styles.empty}>No hay ejercicios aún</Text>
            ) : (
                <FlatList
                    //los datos (array)
                    data={workout.exercises}
                    //ID unico de cada uno de los datos
                    keyExtractor={(item: any) => item.id}
                    //renderItem indica como dibujar cada elemento de la lista
                    renderItem={({ item: exercise }) => (
                        <View style={styles.exerciseCard}>
                            <View style={styles.exerciseHeader}>
                                <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>

                                {/*boton para eliminar ejercicios */}
                                <TouchableOpacity 
                                    onPress={() => handleDeleteExercise(exercise.id, exercise.exerciseName)}
                                >
                                    <Text style={styles.deleteButton}>x</Text>
                                </TouchableOpacity>
                            </View>

                            {exercise.sets?.map((set: any, index: number) => (
                                <View key={index} style={styles.setContainer}>
                                    <View key={index} style={styles.setRow}>
                                        <Text style={styles.setNumber}>{set.setNumber}</Text>

                                        {editingSetId === set.id ? (
                                            <>
                                                <TextInput
                                                    style={styles.inlineInputWeight}
                                                    value={inlineWeight}
                                                    onChangeText={setInlineWeight}
                                                    keyboardType="numeric"
                                                    placeholder="kg"
                                                    autoFocus={true}
                                                />
                                                <Text style={styles.textX}>x</Text>
                                                
                                                <TextInput
                                                    style={styles.inlineInputReps}
                                                    value={inlineReps}
                                                    onChangeText={setInlineReps}
                                                    keyboardType="numeric"
                                                    placeholder="reps"
                                                    onBlur={() => handleSaveInlineEdit(set)}
                                                />
                                            </>
                                        ) : (
                                            //editar peso y reps de la serie
                                            <TouchableOpacity style={styles.setValues} onPress={() => handleStartInlineEdit(set)}>
                                                <Text style={styles.setEditText}>{set.weight}kg</Text>
                                                <Text style={styles.textX}>x</Text>
                                                <Text style={styles.setEditText}>{set.reps} reps</Text>
                                            </TouchableOpacity>
                                        )}

                                        {/* marcar serie como completada */}
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
                            <TouchableOpacity style={styles.addSetButton} onPress={() => handleAddSet(exercise)}>
                                <Text style={styles.addSetButtonText}>agregar serie</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
            <TouchableOpacity style={styles.deleteWorkoutButton} onPress={() => handleDeleteWorkout(workoutId, workout.name)}>
                <Text style={styles.buttonText}>Eliminar entrenamiento</Text>
            </TouchableOpacity>

            {/* modal que muestra el catalogo de ejercicios para seleccionar*/}
            <Modal visible={addExerciseModal} transparent={true} animationType="slide">
                <View style={styles.modalAddExerciseCatalog}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitleExerciseCatalog}>catalogo de ejercicios</Text>
                        <FlatList 
                            data={exerciseList} 
                            keyExtractor={(item: any) => item.id}
                            renderItem={({item: exercise}) => (
                                <TouchableOpacity
                                    //al tocar selecciona/deselecciona
                                    onPress={() => toggleSelectedExercises(exercise)}
                                    style={[
                                        styles.catalogExerciseItem,
                                        //esta seleccionado  ,  si esta seleccionado aplica estilo verde
                                        selectedExercises.includes(exercise.id) && styles.catalogExerciseItemSelected
                                    ]}
                                >
                                    <Text style={styles.catalogExerciseName}>{exercise.name}</Text>
                                    <Text style={styles.catalogExerciseMuscle}>{exercise.muscleGroup}</Text>

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

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: theme.background,
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
        color: theme.textPrimary,
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
    countExerciseSets: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 15,
        backgroundColor: theme.cardBackground,
        borderRadius: 9,
        marginBottom: 20,
        
    },
    totalExercises: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: theme.textPrimary,
    },
    totalSets: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 9,
        color: theme.textPrimary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: theme.textPrimary,
    },
    empty: {
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    exerciseCard: {
        padding: 15,
        backgroundColor: theme.cardBaground,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'column',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.textPrimary,
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
    setEditText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        backgroundColor: theme.cardBackground,
    },
    textX: {
        fontSize: 16,
        color: theme.textPrimary,


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
    modalAddExerciseCatalog: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.Background,
        borderRadius: 10,
    },
    modalContent: {
        padding: 20,
        borderRadius: 10,
        width: '80%',
        backgroundColor: theme.background,
    },
    modalContentEditweight: {
        padding: 20,
        borderRadius: 10,
        width: '80%',
        backgroundColor: theme.cardBackground,
    },
    modalContentEditReps: {
        padding: 20,
        borderRadius: 10,
        width: '80%',
        backgroundColor: theme.cardBackground,
    },
    modalTitleExerciseCatalog: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: theme.textPrimary,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 16,
    },
    modalInputWeight: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: theme.cardBackground,
    },
    modalInputReps: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: theme.cardBackground,
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
    inlineInputWeight: {
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        width: 60,
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 5,
        backgroundColor: theme.cardBackground,
    },
    inlineInputReps: {
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        width: 60,
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 5,
        backgroundColor: theme.cardBackground,
    },
    setValues: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
    },
    catalogExerciseItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#435663',
        backgroundColor: theme.background,
        
    },
    catalogExerciseItemSelected: {
        backgroundColor: theme.cardBackground,
    },
    catalogExerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.textPrimary,
    },
    catalogExerciseMuscle: {
        fontSize: 14,
        color: theme.textSecondary,
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
    modalEditSetContainer: {

    }
 
});
