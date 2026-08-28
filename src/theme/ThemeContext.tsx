import { createContext, useContext, useState, ReactNode} from "react";
import { useColorScheme } from "react-native";//detecta si es telefono esta en modo claro o oscuro
import { lightTheme, darkTheme } from "./colors";

//tipos para el theme
type ThemeType = 'light' | 'dark';

//campos que tendra el objeto, es com oun formulario que define los campos que tendra
type ThemeContextType = {
    theme: typeof darkTheme;
    //light o dark
    themeType: ThemeType;
    //funcion para cambiar theme
    toggleTheme: () => void;
}

//contenedor vacio que despues guardara los datos del tema 
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

//funcion que recibe como parametro cualquier pantalla y provee los datos del tema a estas
export function ThemeProvider({ children }: { children: ReactNode }) {
    //useState, estado que guarda el tema activo empieza con dark
    const [ themeType, setThemeType ] = useState<ThemeType>('dark');

    //selecciona los colores segun el tema activo
    const theme = themeType === 'dark' ? darkTheme : lightTheme;

    //funcion para cambair de theme
    const toggleTheme = () => {
        //si es theme calro cambia a oscuro y viceversa
        setThemeType(prev => prev === 'dark' ? 'light' : 'dark');
    }

    return (
        //envuelve a children y le pasa los datos
        <ThemeContext.Provider value={{theme, themeType, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

//hook para useTheme
export function useTheme() {
    //lee los datos del contexto
    const context = useContext(ThemeContext);
    //si no hay datos lanza un error
    if (!context) {
        //avisa que falta el provider
        throw new Error("useTheme debe usarse dentro de ThemeProvider");
    }
    //retorna los datos del theme
    return context;
}

