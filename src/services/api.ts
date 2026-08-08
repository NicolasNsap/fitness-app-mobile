import AsyncStorage from "@react-native-async-storage/async-storage";

//direccion del backend en aws, una sola varible para no repetirla
const API_URL = 'https://fitness-app-backend-production-5506.up.railway.app/api';

//objeto que contendra funciones relacionadas con autenthicacion
export const authService = {
    //funcion que recibe usuario y contrasenia y async porque hace una peticion que tarda
    login: async (username: string, password: string) => {
        //fetch hace la peticion HTTP await espera la respuesta antes de continuar
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            //le dice al servidor que enviamos un json 
            headers: {
                'Content-Type': 'application/json',
            },
            //convierte los datos de inicio de sesion(credenciales) a texto JSON para enviarlo
            body: JSON.stringify({ usernameOrEmail: username, password}),
        });

        //si el servidor responde con error, lanza una excepcion
        if (!response.ok){
            throw new Error('Credenciales invalidas');   
        }
        //convierte la respuesta en un objeto JavasCript, retorna el token
        return response.json();

    },
    
    //funcion para registro
    register: async (username: string, email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ username, email, password}),
      });
      
      if (!response.ok) {
        throw new Error('Error al registrar');
      }
      return response.json();
    }

    
}
//objeto con funciones relacionadas con workouts
export const workoutService = {
  //metodo para mostrar los entrenamientos
  getWorkouts: async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/workouts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener workouts');
    }

    return response.json();
  },

  //metodo para crear un entrenamiento
  createWorkout: async (name: string, date: string, notes?: string) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, date, notes}),
    });

    if (!response.ok) {
      throw new Error('Error al crear workout')
    }
    return response.json();
  },
  //buscar workout por el id
  getWorkoutById: async (id: string) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/workouts/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok){
      throw new Error('Error al obtener workout')
    }
    return response.json();
  },
  //aniadir ejercicios al workout
  addExerciseToWorkout: async (workoutId: string, exerciseId: string, sets: any[]) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/workouts/${workoutId}/exercises`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        exerciseId,
        orderIndex: 1,
        notes: '',
        sets,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Error al agregar ejercicio');

    }
    return response.json();
  },

  //remover ejercicio del entrenamiento
  removeExerciseFromWorkout: async (workoutId: string, exerciseId:string) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/workouts/${workoutId}/exercises/${exerciseId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error al aliminar el ejercicio');
    }
  },

  //metodo para eliminar un workout
  deleteWorkout: async (workoutId: string) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/workouts/${workoutId}`,{
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error al elimiar el entrenamiento');
    }
  },
//editar entrenamiento
  updateWorkout: async (workoutId: string, name: string, notes: string, durationSeconds: number) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/workouts/${workoutId}`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({name, notes, durationSeconds}),
    });
    if (!response.ok) {
      throw new Error('Error al editar el entrenamiento')
    }
    return response.json();
  },

  completeWorkout: async (workoutId: string, durationSeconds?: number) => {
    const token = await AsyncStorage.getItem('token');
    const url = durationSeconds
      ? `${API_URL}/workouts/${workoutId}/complete?durationSeconds=${durationSeconds}`
      : `${API_URL}/workouts/${workoutId}/complete`;
    const  response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error al completar el entrenaiento');
    }
    return response.json();

  },

    
};

//objeto con funciones relacionadas con exercises
export const exerciseService = {
  //metodo para obtener los ejercicios
  getExercises: async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/exercises`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error en obtener el ejercicio');
    }

    return response.json();
  }
}

//objeto con funciones realcionadas con sets(series)
export const setService = {
  //metodo para actulizar set
  updateSet: async (setId: string, weight: number, reps: number, completed: boolean, restSeconds: number) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/sets/${setId}`,{
      method:'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,

      },
      body: JSON.stringify({weight, reps, completed, restSeconds}),
    });
    if (!response.ok) {
      throw new Error('Error al editar el set')
    }
    return response.json();

  },

  //metodo para eliminar set
  deleteSet: async (setId: string) => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(`${API_URL}/sets/${setId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Error al elimiar el set');
    }
  }
}