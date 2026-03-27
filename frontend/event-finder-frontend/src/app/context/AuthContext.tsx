import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    userName: string;
    login: (token: string, userName?: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    isAuthenticated: false,
    userName: "Гость",
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [userName, setUserName] = useState("Гость");

    const login = (newToken: string, name: string = "Гость") => {
        setToken(newToken);
        setUserName(name);
    };

    const logout = () => {
        setToken(null);
        setUserName("Гость");
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: !!token,
                userName,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);