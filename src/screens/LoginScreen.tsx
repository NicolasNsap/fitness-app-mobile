//pantalla de  login
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { useState,  } from 'react';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function LoginScreen(){
    //datos que cambian
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    //funcion del boton por el momento solo imprime los datos por consola
    const handleLogin = async () => {
        console.log('handleLogin ejecutado');

        if(!username || !password) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }
        
        setLoading(true);
        try{
            const data = await authService.login(username, password);
            await AsyncStorage.setItem('token', data.token); //guardar el token
            navigation.navigate('Home' as never);//navegar a home
            Alert.alert('Exito', 'Login correcto');
            console.log('Token guardado');
        } catch (error) {
            Alert.alert('Error', 'Credenciales inválidas');
        }finally {
            setLoading(false);
        }
    };

    //formulario
    return(
        <View style={styles.container}>
            <Text style={styles.title}>fitness App</Text>

            <TextInput
                style={styles.input}
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </Text>
            </TouchableOpacity>

        </View>
    );


}
//estilos
const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding:15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

})