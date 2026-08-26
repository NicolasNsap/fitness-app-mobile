//pantalla de  login
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { useState,  } from 'react';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import Button from '../components/Button';


export default function LoginScreen(){
    const {theme} = useTheme();
    const styles = createStyles(theme);
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
            navigation.navigate('MainTabs' as never);//navegar a mainTabs
            
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
                placeholderTextColor={theme.textSecundary}
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor={theme.textSecundary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button
                text={loading ? 'Cargando...' : 'Iniciar Sesion'}
                type="primary"
                onPress={handleLogin}
                disabled={loading}
            />

            <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>

        </View>
    );


}
//estilos
const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex:1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: theme.background,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
        color: theme.textPrimary,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
        color: theme.textPrimary,

    },
    link: {
        color: '#007AFF',
        textAlign: 'center',
        fontSize: 14,
        marginTop: 15,
    },
})