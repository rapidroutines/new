import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const initialState = {
    theme: "light",
    setTheme: () => null,
};

export const ThemeProviderContext = createContext(initialState);

export function ThemeProvider({ children, storageKey = "vite-ui-theme", ...props }) {
    const [theme, setTheme] = useState(() => {
        return "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        root.classList.remove("light", "dark");
        root.classList.add(theme);
        
        if (storageKey) {
            localStorage.setItem(storageKey, theme);
        }
    }, [theme, storageKey]);

    const value = {
        theme,
        setTheme: (newTheme) => {
            setTheme(newTheme);
        },
    };

    return (
        <ThemeProviderContext.Provider
            {...props}
            value={value}
        >
            {children}
        </ThemeProviderContext.Provider>
    );
}

ThemeProvider.propTypes = {
    children: PropTypes.node,
    storageKey: PropTypes.string,
};
