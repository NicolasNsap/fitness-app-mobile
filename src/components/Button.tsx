//componentes de react native para un boton
import { Text, TouchableOpacity, StyleSheet } from "react-native";
//acceso al theme del boton
import { useTheme } from "../theme/ThemeContext";


type ButtonProps = {
    text: string;
    type: 'primary' | 'secondary' | 'danger' | 'succes';
    onPress: () => void;
    disabled?: boolean;
};


export default function Button({text, type, onPress, disabled}: ButtonProps) {
    //obtener el tema
    const { theme } = useTheme();
    const styles = createStyles(theme);

    //lo que se mostrara
    return (
        <TouchableOpacity
            style={[styles.button, styles[type], disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    );
}

const createStyles = (theme: any) => StyleSheet.create({
    //estilos base
    button: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    primary: {
        backgroundColor: theme.primaty,
    },
    secondary: {
        backgroundColor: theme.cardBackground,
    },
    danger: {
        backgroundColor: theme.danger,
    },
    success: {
        backgroundColor: theme.success,
    },
    disabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: theme.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});