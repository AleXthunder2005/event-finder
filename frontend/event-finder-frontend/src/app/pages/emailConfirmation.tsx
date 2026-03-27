import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export const EmailConfirmation = () => {
    const [searchParams] = useSearchParams();
    const tokenParam = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorCode, setErrorCode] = useState<number | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!tokenParam) {
            setStatus("error");
            setErrorCode(404);
            return;
        }

        verifyEmail(tokenParam)
            .then((data) => {
                login(data.token);
                setStatus("success");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            })
            .catch((err: any) => {
                setStatus("error");
                setErrorCode(err.status || 500);
            });
    }, [tokenParam, login, navigate]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p>Проверка email...</p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        let message = "";
        switch (errorCode) {
            case 404:
                message = "Некорректная ссылка для подтверждения.";
                break;
            case 410:
                message = "Ссылка для подтверждения email устарела.";
                break;
            case 500:
                message = "Ошибка сервера, попробуйте позже.";
                break;
            default:
                message = "Произошла ошибка.";
        }
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1>{errorCode}</h1>
                    <p className="text-muted-foreground">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1>Регистрация прошла успешно!</h1>
                <p className="text-muted-foreground">
                    Email адрес успешно подтвержден. Перенаправление на главную...
                </p>
            </div>
        </div>
    );
};