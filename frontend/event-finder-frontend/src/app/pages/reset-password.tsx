import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/authApi";

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [passwordError, setPasswordError] = useState("");
    const [repeatPasswordError, setRepeatPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // password checks
    const hasLength = newPassword.length >= 8 && newPassword.length <= 40;
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasSpecial = /[!@#$%^&*()\-+=\[\]{};:'",.<>/?\\|]/.test(newPassword);
    const hasNoSpaces = !/\s/.test(newPassword);

    const passwordValid = hasLength && hasUppercase && hasSpecial && hasNoSpaces;
    const passwordsMatch = newPassword !== "" && repeatPassword !== "" && newPassword === repeatPassword;

    const formValid = token && passwordValid && passwordsMatch;

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);
        setPasswordError("");
        if (repeatPassword && value !== repeatPassword) {
            setRepeatPasswordError("Пароли не совпадают");
        } else {
            setRepeatPasswordError("");
        }
    };

    const onRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRepeatPassword(value);
        if (newPassword && value !== newPassword) {
            setRepeatPasswordError("Пароли не совпадают");
        } else {
            setRepeatPasswordError("");
        }
    };

    const onSubmitClick = async () => {
        let hasError = false;

        if (!token) {
            alert("Недействительная ссылка для сброса пароля");
            navigate("/login");
            return;
        }

        if (!passwordValid) {
            setPasswordError("Пароль не соответствует требованиям");
            hasError = true;
        } else {
            setPasswordError("");
        }

        if (!passwordsMatch) {
            setRepeatPasswordError("Пароли не совпадают");
            hasError = true;
        } else {
            setRepeatPasswordError("");
        }

        if (hasError) return;

        setIsLoading(true);

        try {
            await resetPassword(token, newPassword);
            setResetSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err: any) {
            switch (err.status) {
                case 400:
                    setPasswordError("Недействительный или истекший токен");
                    break;
                case 404:
                    setPasswordError("Пользователь не найден");
                    break;
                case 500:
                    alert("Ошибка сервера, попробуйте позже");
                    break;
                default:
                    alert("Произошла ошибка");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Check if token exists
    useEffect(() => {
        if (!token) {
            alert("Недействительная ссылка для сброса пароля");
            navigate("/login");
        }
    }, [token, navigate]);

    if (resetSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-[420px] bg-white rounded-xl shadow-md p-6 text-center">
                    <div className="mb-4 text-green-600 text-5xl">✓</div>
                    <h2 className="text-xl font-medium mb-2 text-[var(--primary-text-color)]">
                        Пароль успешно изменен!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Ваш пароль был обновлен. Через несколько секунд вы будете перенаправлены на страницу входа.
                    </p>
                    <button
                        onClick={() => navigate("/login")}
                        className="text-[var(--primary-color)] hover:underline font-medium"
                    >
                        Перейти ко входу
                    </button>
                </div>
            </div>
        );
    }

    if (!token) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-[420px] bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-medium text-center mb-2 text-[var(--primary-text-color)]">
                    Создание нового пароля
                </h2>
                <p className="text-sm text-gray-500 text-center mb-4">
                    Введите новый пароль для вашей учетной записи
                </p>

                <div className="space-y-4">
                    {/* NEW PASSWORD */}
                    <div>
                        <label className="block mb-1 text-[var(--primary-text-color)]">Новый пароль</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                maxLength={40}
                                onChange={onPasswordChange}
                                placeholder="Введите новый пароль..."
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

                    {/* PASSWORD CHECKLIST */}
                    <div className="text-sm space-y-1">
                        <p className={hasLength ? "text-green-600" : "text-gray-400"}>• 8-40 символов</p>
                        <p className={hasUppercase ? "text-green-600" : "text-gray-400"}>• минимум 1 заглавная буква</p>
                        <p className={hasSpecial ? "text-green-600" : "text-gray-400"}>• минимум 1 спецсимвол</p>
                        <p className={hasNoSpaces ? "text-green-600" : "text-gray-400"}>• без пробелов</p>
                    </div>

                    {/* REPEAT PASSWORD */}
                    <div>
                        <label className="block mb-1 text-[var(--primary-text-color)]">Повторите пароль</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={repeatPassword}
                                maxLength={40}
                                onChange={onRepeatPasswordChange}
                                placeholder="Повторите пароль..."
                                className={`w-full px-3 py-2 border rounded-md outline-none transition pr-10 ${
                                    repeatPasswordError
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
                        {repeatPasswordError && <p className="text-sm text-red-500 mt-1">{repeatPasswordError}</p>}
                    </div>

                    {/* SUBMIT */}
                    <button
                        disabled={!formValid || isLoading}
                        onClick={onSubmitClick}
                        className={`w-full py-2 rounded-md text-white transition ${
                            formValid && !isLoading
                                ? "bg-[var(--primary-color)] cursor-pointer hover:bg-[var(--primary-hover-color)]"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        {isLoading ? "Сохранение..." : "Сбросить пароль"}
                    </button>

                    {/* BACK TO LOGIN */}
                    <p className="text-center text-sm text-[var(--primary-text-color)] pt-2">
                        <a href="/login" className="text-[var(--primary-color)] hover:underline font-medium">
                            Вернуться ко входу
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};