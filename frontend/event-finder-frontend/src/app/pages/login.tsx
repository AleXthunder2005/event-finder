import { useState } from "react";
import { useNavigate } from "react-router-dom";
import isEmailValid from "../helpers/isEmailValid";
import { login as loginApi } from "../api/authApi";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const onSubmitClick = async () => {
        let hasError = false;

        if (!email) {
            setEmailError("Введите email");
            hasError = true;
        } else if (!isEmailValid(email)) {
            setEmailError("Неверный формат email");
            hasError = true;
        } else setEmailError("");

        if (!password) {
            setPasswordError("Введите пароль");
            hasError = true;
        } else setPasswordError("");

        if (hasError) return;

        try {
            const data = await loginApi(email, password);
            login(data.token);
            alert("Вы успешно вошли");
            navigate("/");
        } catch (err: any) {
            switch (err.status) {
                case 404:
                    setEmailError("Пользователь с таким email не найден");
                    break;
                case 401:
                    setPasswordError("Неверный пароль");
                    break;
                case 403:
                    alert("Email не подтверждён, пожалуйста подтвердите email");
                    navigate("/email-confirmation");
                    break;
                case 500:
                default:
                    alert("Ошибка сервера, попробуйте позже");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-[400px] bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-medium text-center mb-4 text-[var(--primary-text-color)]">Вход</h2>
                <div className="space-y-4">
                    {/* EMAIL */}
                    <div>
                        <label className="block mb-1 text-[var(--primary-text-color)]">Логин</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Введите логин..."
                            className={`w-full px-3 py-2 border rounded-md outline-none transition ${
                                emailError
                                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400"
                            }`}
                        />
                        {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label className="block mb-1 text-[var(--primary-text-color)]">Пароль</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль..."
                                className={`w-full px-3 py-2 border rounded-md outline-none transition pr-10 ${
                                    passwordError
                                        ? "border-red-500 focus:ring-1 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-black"
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>
                        </div>
                        {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
                    </div>

                    <button
                        onClick={onSubmitClick}
                        className="w-full py-2 cursor-pointer rounded-md text-white bg-[var(--primary-color)] hover:bg-[var(--primary-hover-color)] transition"
                    >
                        Войти
                    </button>

                    {/* LINKS */}
                    <div className="text-center text-sm space-y-1 pt-2">
                        <a href="/forgot-password" className="text-[var(--primary-color)] hover:text-[var(--primary-hover-color)]">
                            Забыли пароль?
                        </a>
                        <p className="text-[var(--primary-text-color)]">
                            Нет аккаунта?{" "}
                            <a href="/register" className="text-[var(--primary-color)] hover:text-[var(--primary-hover-color)] font-medium">
                                Создать аккаунт
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};