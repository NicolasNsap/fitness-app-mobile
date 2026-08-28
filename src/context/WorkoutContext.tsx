import { createContext, useContext, useState, ReactNode } from "react";

//definir el Type
//campos que tendra el objeto -> estados y funciones para controlar el modal
type WorkoutContextType = {
    isWorkoutActive: boolean;
    isMinimized: boolean;
    activeWorkout: any;
    startWorkout: (workout: any) => void;
    endWorkout: () => void;
    toggleMinimize: () => void;

};

//creacion del context
//contenedor vacio que despues guardara los datos del entrenamiento 
const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

//crear el workoutProvider
export function WorkoutProvider({children} : {children: ReactNode}) {
    //estados
    //estado de entrenamientos activos
    const [ isWorkoutActive, setIsWorkoutActive] = useState(false);

    //estado de entrenamiento minimizado
    const [ isMinimized, setIsMinimized] = useState(false);

    //estado del workout actual
    const [ activeWorkout, setActiveWorkout] = useState<any>(null);

    //cear las funciones

    //funcion de inicio entrenamiento
    const startWorkout = (workout: any) => {
        setActiveWorkout(workout);
        setIsWorkoutActive(true);
        setIsMinimized(false);
    };

    //funcion terminar entrenamiento
    const endWorkout = () => {
        setActiveWorkout(null);
        setIsWorkoutActive(false);

    };

    //funcion para minimizar entrenamiento
    const toggleMinimize = () => {
        //si es verdadero pasa a falso y si es falso pasa a verdadero
        setIsMinimized(prev => prev === true ? false : true)
    };

    //retornar el privider con los valores
    return (
        <WorkoutContext.Provider value={{isWorkoutActive, isMinimized, activeWorkout, startWorkout, endWorkout, toggleMinimize}}>
            {/* quienes accederan a los datos del provider */}
            {children}
        </WorkoutContext.Provider>
    );
}

//hook para useWorkout, funcion que permite acceder a los datos 
export function useWorkout() {
    //lee los dastos el constexto 
    const context = useContext(WorkoutContext);

    //si no hay datos en el workoutContex lanza un error
    if (!context) {
        throw new Error("useWorkout debe usarse dentro del WorkoutProvider");
    }
    //retorna los datos del workout
    return context;
}