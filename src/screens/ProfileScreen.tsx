import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";



export default function ProfileScreen() {
    const { theme, themeType, toggleTheme } = useTheme();
    const styles = createStyles(theme);

    return(
        <View style={styles.container}>

            {/*boton de usuario*/}
            <TouchableOpacity style={styles.userButton}>
                <View style={styles.userAvatar}>
                    <Text style={styles.avatarText}>👤</Text>
                </View>
                <Text style={styles.userName}>Usuario</Text>
            </TouchableOpacity>
            {/* boton para cambiar theme */}
            <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
                <Text style={styles.themeButtonText}>
                    {themeType === 'dark' ? '☀️ Tema claro' : '🌙 Tema oscuro'}
                </Text>
            </TouchableOpacity>
        </View>
    );

}

//estilos para los elementos de la pantalla
const createStyles = (theme: any) => StyleSheet.create({
    //container principal
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.background,
    },
    //boton se usuario
    userButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.cardBackground,
        padding: 15,
        borderRadius: 10,
    },
    //circulo para la foto
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.inputBackground,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 24,
    },
    userName: {
        fontSize: 18,
        marginLeft: 15,
        color: theme.textPrimary
    },
    themeButton: {
        backgroundColor: theme.cardBackground,
        padding: 15, 
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center'
    },
    themeButtonText: {
        color: theme.textPrimary,
        fontSize: 16,
    }
});

