import { View, Text, TextInput , TouchableOpacity, StyleSheet, Alert} from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { workoutService } from "../services/api";

export default function AddSetsScreen({ route }: any) {
    const { workoutId, exerciseId, exerciseName} = route.params;

    const [sets, setSets] = useState([{setNumber: 1, weight: '', reps: ''}]);

    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    //hacer que los inputs fucnionen
    const updateSet = (index: number, field: string, value: string) => {
        //copia del array origianl
        const newSets = [...sets];
        //actulizar un campo con un nuevo valor
        newSets[index] = {...newSets[index], [field]: value};
        //guardar en nuevo array en el estado
        setSets(newSets)
    }

    //funcion para agregar mas sets
    const addSet = () => {
          
        setSets([
            //se mentien sets existentes
            ...sets,
            //y se agrega un set nuevo
             {setNumber: sets.length + 1, weight: '', reps: ''}]);
    };

    
    //funcion para guardar
    const handleSave = async () => {
        //validar que halla al menos 1 set con datos
        const validSets = sets.filter(sets => sets.weight && sets.reps);

        if (validSets.length === 0) {
            Alert.alert('Error', 'agregar al menos un set con peso y reps'); 

        }

        setLoading(true);
        try{
            //formatear sets para el backend
            const formattedSets = validSets.map(sets => ({
                setNumber: sets.setNumber,
                setType: 'WORKING',
                weight: parseFloat(sets.weight),
                reps: parseInt(sets.reps),
                rir: null,
            }));

            console.log('Enviando:', {
                workoutId,
                exerciseId,
                formattedSets
            });

            await workoutService.addExerciseToWorkout(workoutId, exerciseId, formattedSets);
            Alert.alert('Exito', 'ejercicio guardado');
            navigation.goBack();
            navigation.goBack();
        }catch (error) {
            Alert.alert('Error', 'No se pudo agregar el ejercicio');
        } finally {
            setLoading(false);
        }
    }

    //elementos de la pantalla
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{exerciseName}</Text>
            
            {sets.map((set, index) => (
                <View key={index} style={styles.setRow}>
                    <Text style={styles.setNumber}>set {set.setNumber}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Kg"
                        value={set.weight}
                        onChangeText={(v) => updateSet(index, 'weight', v)}
                        keyboardType="numeric"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Reps"
                        value={set.reps}
                        onChangeText={(v) => updateSet(index, 'reps', v)}
                        keyboardType="numeric"
                    />
                  
                </View>
                
            ))}

            <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
                <Text style={styles.addSetText}>+  Agregar Set</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
                disabled={loading}
            >
                <Text style={styles.saveButtonText}>
                {loading ? 'Guardando...' : 'Guardar Ejercicio'}
                </Text>
            </TouchableOpacity>

        </View>
    );
}

//estilos de los elementos del la pantalla
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    setNumber: {
        width: 50,
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 8,
        textAlign: 'center',
    },
    addSetButton: {
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    addSetText: {
        color: '#007AFF',
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});