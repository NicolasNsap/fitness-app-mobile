import AsyncStorage from "@react-native-async-storage/async-storage";

//direccion del backend en aws, una sola varible para no repetirla
const API_URL = 'https://fitness-app-backend-production-f14c.up.railway.app/api';

//se crea un objeto con funciones relacionadas con autenticacion, export permite usarlo desde otros archivos
export const authService = {//authservice es una objeto que agrupa funciones relacionadas con autenticacion no es una funcion, es un objeto con metodos
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
  }
};