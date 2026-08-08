//ActivityIndicator es un spinner de  carga
//flatList lista eficiente para mostrar muchos items
//keysExtractor ID unico para cada item
//renderItem como se ve cada workout
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { workoutService } from '../services/api';
//AsyncStorage -> acceder al almacenamiento donde se guardo el token
import AsyncStorage from '@react-native-async-storage/async-storage';
//useNavigation -> poder nevegar a otra pantalla
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    //acceso a la navegacion para para poder cambiar de pantalla
    const navigation = useNavigation();


    //corre cada vez que la pantalla aparece en pantalla
    useFocusEffect(
        useCallback(() => {
            loadWorkouts();
        }, [workouts])
            //cuando la pantalla carga ejecuta loadWorkout() una vez
    );

    //funcion de cargar los entrenamientos
    const loadWorkouts = async () => {
        try {
            const data = await workoutService.getWorkouts();
            setWorkouts(data);
        } catch (error) {
            console.log('Error', error);
            
        } finally {
            setLoading(false);
        }
    };

    //funcion de logout
    const handlelogout = async () => {
        //borra el token del almacenamiento, sin token,, no autenticacion
        await AsyncStorage.removeItem("token");
        //reinicia la navegacion y va a login
        navigation.reset({
            index: 0,
            routes: [{name: 'Login' as never}],
        });
    }

    if (loading){
        return (
        <View style={styles.container}>
            <ActivityIndicator size="large"/>
        </View>
        );
    }

    //funcion para inicio rapido
    const handleQuickStart = async () => {
        try {
            //crear workout con fecha de hoy y nombre generico
            const today = new Date().toISOString().split('T')[0];//"2026-08-06"
            const workout = await workoutService.createWorkout('Entrenamiento', today);

            //navega  directo al detalle
            (navigation as any).navigate('WorkoutDetail', {workoutId: workout.id});
        } catch (error) {
            console.log('Error al crear entrenamiento:', Error);
            
        }
    };
    //mostrar los elementos que de la pantalla
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Entrenamientos</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={handleQuickStart}
            >
                <Text style={styles.addButtonText}>Iniciar entrenamiento vacio</Text>
            </TouchableOpacity>

            {workouts.length === 0 ?(
                <Text>No tienes entrenamientos</Text>

            ) : (
                <FlatList
                    data={workouts}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.card}
                            onPress={() => (navigation as any).navigate('WorkoutDetail', { workoutId: item.id })}
                        >
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text>{item.date}</Text>
                            <Text>
                                {item.durationSeconds
                                    ? `⏱️ ${Math.floor(item.durationSeconds / 3600)}:${Math.floor((item.durationSeconds % 3600) / 60).toString().padStart(2, '0')}:${(item.durationSeconds % 60).toString().padStart(2, '0')}`  // ✅
                                    : ''
                                }
                                </Text>
                        </TouchableOpacity>
                    )}
                />
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={handlelogout}>
                <Text style={styles.buttonText}>Cerrar Sesion</Text>
            </TouchableOpacity>
        </View>
    );
    
}

//estilo que se le dara a los elementos de la pantalla
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
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 15,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',

    },
    card: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton: {
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
});