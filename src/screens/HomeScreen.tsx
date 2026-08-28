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
import { useTheme } from '../theme/ThemeContext';



export default function HomeScreen() {
    //acceso a la navegacion para para poder cambiar de pantalla
    const navigation = useNavigation();

    const {theme} = useTheme();
    const styles = createStyles(theme);

    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    


    //corre cada vez que la pantalla aparece en pantalla
    useFocusEffect(
        useCallback(() => {
            loadWorkouts();
        }, [])
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
            (navigation as any).navigate('WorkoutDetail', { workoutId: workout.id, isNew: true });
        } catch (error) {
            console.log('Error al crear entrenamiento:', Error);
            
        }
    };
    //mostrar los elementos que de la pantalla
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis entrenamientos</Text>
            <TouchableOpacity
                //boton para inico rapido de entrenamiento
                style={styles.quickStartButton}
                onPress={handleQuickStart}
            >
                <Text style={styles.quickStartText}>Iniciar entrenamiento vacio</Text>
            </TouchableOpacity>

            {workouts.length === 0 ?(
                <Text>No tienes entrenamientos</Text>

            ) : (
                <FlatList
                    data={workouts}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item: workout }) => (
                        <TouchableOpacity 
                            style={styles.workoutItem}
                            onPress={() => (navigation as any).navigate('WorkoutDetail', { workoutId: workout.id, isNew: false })}
                        >
                            <Text style={styles.workoutName}>{workout.name}</Text>
                            <Text style={styles.workoutDate}>{workout.date}</Text>
                            <Text style={styles.workoutTimeDuration}>
                                {workout.durationSeconds
                                    ? `⏱️ ${Math.floor(workout.durationSeconds / 3600)}:${Math.floor((workout.durationSeconds % 3600) / 60).toString().padStart(2, '0')}:${(workout.durationSeconds % 60).toString().padStart(2, '0')}`  // ✅
                                    : ''
                                }
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            )}

        </View>
    );
    
}

//estilo que se le dara a los elementos de la pantalla
const createStyles = (theme: any) =>  StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.background,
    },
    title: {
        color: theme.textPrimary,
        fontSize: 24,
        fontWeight: 'bold',
    },
    quickStartButton: {
        backgroundColor: theme.cardBackground,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 15,
    },
    quickStartText: {
        color: theme.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',

    },
    workoutItem: {
        padding: 15,
        backgroundColor: theme.cardBackground,
        borderRadius: 8,
        marginBottom: 10,
    },
    workoutName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.textPrimary,
    },
    workoutDate: {
        fontSize: 13,
        fontWeight: 'bold',
        color: theme.textSecondary,
    },
    workoutTimeDuration: {
        fontSize: 13,
        fontWeight: 'bold',
        color: theme.textSecondary,
    },
    
});