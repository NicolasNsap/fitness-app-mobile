//ActivityIndicator es un spinner de  carga
//flatList lista eficiente para mostrar muchos items
//keysExtractor ID unico para cada item
//renderItem como se ve cada workout
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { workoutService } from '../services/api';

export default function HomeScreen() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    //se ejecuta una vez cuando la pantalla carga
    useEffect(() => {
        loadWorkouts();
    }, []);

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
});