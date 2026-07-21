import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { workoutService } from '../services/api';

export default function CreateWorkoutScreen() {
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('')
    const [loading, setLoading] = useState(false);//estas procesando? false
    const navigation = useNavigation();

    //obtiene la fecha de hoy en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    //funcion que se ejecuta al presionar el boton
    const handleCreate = async () => {
        //vallida si name esta vacio
        if (!name) {
            Alert.alert('Error', 'El nombre es obligatorio');
            return;
        }

        //activa el estado de carga
        setLoading(true);
        try {
            //llama a la api y espera
            await workoutService.createWorkout(name, today, notes); 
            Alert.alert('Exito', 'Workout creado');
            //vuelve a la pantalla anterior(home)
            navigation.goBack();

        }catch (error) {//captura el error si lo hay
            Alert.alert('Error', 'No se pudo crear el workout');

        }finally {//desactiva el estado de carga siempre
            setLoading(false)
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nuevo entrenamiento</Text>

            <Text style={styles.label}>Nombre *</Text>
            <TextInput
                style={styles.input}
                placeholder="Ej: Piernas, Espalda, Full Body"
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Fecha</Text>
            <Text style={styles.dateText}>{today}</Text>

            <Text style={styles.label}>Notas (opcional)</Text>
            <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Observaciones del entrenamiento"
                value={notes}
                onChangeText={setNotes}
                multiline
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleCreate}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Creando...' : 'Crear Workout'}
                </Text>
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
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        fontSize: 16,
    },
    notesInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    dateText: {
        fontSize: 16,
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});