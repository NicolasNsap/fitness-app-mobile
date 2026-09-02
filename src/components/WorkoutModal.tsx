import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
//importar useWorkout para acceder a los datos desde un componente
import { useWorkout } from "../context/WorkoutContext";
import { useTheme } from "../theme/ThemeContext";
import { useState, useEffect } from "react";

//cracion del componente
export default function WorkoutModal() {
    //obtener datos del workout
    const {isWorkoutActive, isMinimized, activeWorkout, toggleMinimize, endWorkout} = useWorkout();

    //obtener theme
    const {theme} = useTheme();
    const styles = createStyles(theme);

    //timer antes del return temprano
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    

    //si no hay entrenamiento activo, no mostrar nada
    if (!isWorkoutActive){
        return null;
    }

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;

        const minsStr = mins < 10 ? '0' + mins : mins;
        const secsStr = secs < 10 ? '0' + secs : secs;

        return minsStr +  ':' + secsStr;
    }

    //si hay entrenamiento, mostrar el modal
    return (
        <View style={isMinimized ? styles.containerMinimized : styles.containerExpanded}>
            {/* condicional ternario para verificar si la ventana esta minimizada a no */}
            {isMinimized ? (
                //vista minimizada
                <TouchableOpacity style={styles.minimizedBar} onPress={toggleMinimize}>
                    <Text style={styles.title}>{activeWorkout.name}</Text>
                    <Text style={styles.timer}>{formatTime(seconds)}</Text>
                </TouchableOpacity>
            ) : (
                //vista expandida
                <View style={styles.expandeModal}>
                    {/* rayita para minimizar */}
                    <TouchableOpacity onPress={toggleMinimize}>
                        <View style={styles.dragIndicator}/>
                    </TouchableOpacity>

                    <Text style={styles.title}>{activeWorkout.name}</Text>
                    <Text style={styles.timer}>{formatTime(seconds)}</Text>

                    <TouchableOpacity style={styles.endButton} onPress={endWorkout}>
                        <Text style={styles.endButtonText}>Terminar</Text>
                    </TouchableOpacity>
                </View>

            )}
        </View>
    );

}

const createStyles = (theme: any) => StyleSheet.create({
    containerMinimized: {
        position: 'absolute',
        bottom: 74,
        left: 0,
        right: 0,
        backgroundColor: theme.cardBackground,
        borderRadius: 15,
    },
    containerExpanded: {
        position: 'absolute',
        top: 45,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.cardBackground,
    },
    minimizedBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    expandeModal: {
        height: '100%',
        padding: 20,
    },
    dragIndicator: {
        //rayita blanca centrada
        width: 40,
        height: 5,
        backgroundColor: theme.textPrimary,
        borderRadius: 3,
        alignSelf: 'center',
        marginVertical: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.textPrimary,
    },
    timer: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.textSecondary,
    },
    endButton: {
        backgroundColor: theme.success,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    endButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },

})
