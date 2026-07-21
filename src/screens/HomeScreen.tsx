//ActivityIndicator es un spinner de  carga
//flatList lista eficiente para mostrar muchos items
//keysExtractor ID unico para cada item
//renderItem como se ve cada workout
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { workoutService } from '../services/api';
//AsyncStorage -> acceder al almacenamiento donde se guardo el token
import AsyncStorage from '@react-native-async-storage/async-storage';
//useNavigation -> poder nevegar a otra pantalla
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    //acceso a la navegacion para para poder cambiar de pantalla
    const navigation = useNavigation();


    //se ejecuta una vez cuando la pantalla carga
    useEffect(() => {
        loadWorkouts();
    }, []);

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mis Entrenamientos</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('CreateWorkout' as never)}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            {workouts.length === 0 ?(
                <Text>No tienes entrenamientos</Text>

            ) : (
                <FlatList
                    data={workouts}
                    keyExtractor={(item: any) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text>{item.date}</Text>
                        </View>
                    )}
                />
            )}

            <TouchableOpacity style={styles.logoutButton} onPress={handlelogout}>
                <Text style={styles.buttonText}>Cerrar Sesion</Text>
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
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 24,
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