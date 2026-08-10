import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ProfileScreen() {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Perfil</Text>

            {/*boton de usuario*/}
            <TouchableOpacity style={styles.userButton}>
                <View style={styles.userAvatar}>
                    <Text style={styles.avatarText}>👤</Text>
                </View>
                <Text style={styles.userName}>Usuario</Text>
            </TouchableOpacity>
        </View>
    );

}

//estilos para los elementos de la pantalla
const styles= StyleSheet.create({
    //container principal
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    //title
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    //boton se usuario
    userButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
    },
    //circulo para la foto
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 24,
    },
    userName: {
        fontSize: 18,
        marginLeft: 15,
    },
});