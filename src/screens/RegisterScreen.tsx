import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";//guardar datos que cambian
import { useNavigation } from "@react-navigation/native";//navegar entre pantallas
import { authService } from "../services/api";//llamar a la api

export default function RegisterScreen(){
    //datos que cambian
    const [ username, setUsername] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword] = useState('');
    const [ loading, setLoading] = useState(false);
    const navigation = useNavigation();//hook de navegacion, nos permite cambiar de pantalla

    //se ejecuta cuando el usuario presiona el boton de registrarse
    const handleRegister = async () => {
        //si algun campo esta vacio, muestra la alerta y no continua
        if (!username || !email || !password) {
            Alert.alert('Error', 'Completa todos los campos');
            return;
        }
        //activa el estado cargando
        setLoading(true);

        try {
            await authService.register(username, email, password);
            Alert.alert('Exito', 'Cuenta creada correctamente');
            navigation.navigate('Login' as never);
            
        } catch (error) {
            Alert.alert('Error', 'No se puedo crear la cuenta');
            
        }finally{
            setLoading(false);

        }


    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear cuenta</Text>

            <TextInput
                style={styles.input}
                placeholder="Usuario"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
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
                onPress={handleRegister}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Creando...' : 'Registrarse'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',   
    },
    title: {
        fontSize:28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding:15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: '#007AFF',
        textAlign: 'center',
        fontSize: 14,
    },
});