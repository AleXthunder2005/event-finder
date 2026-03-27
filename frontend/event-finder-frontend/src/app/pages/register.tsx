import { useState } from "react";
import { useNavigate } from "react-router-dom";
import isEmailValid from "../helpers/isEmailValid";
import { register } from "../api/authApi";

export const RegisterPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [repeatPasswordError, setRepeatPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [acceptedRules, setAcceptedRules] = useState(false);

    const hasLength = password.length >= 8 && password.length <= 40;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*()\-+=\[\]{};:'",.<>/?\\|]/.test(password);
    const hasNoSpaces = !/\s/.test(password);

    const passwordValid = hasLength && hasUppercase && hasSpecial && hasNoSpaces;
    const emailValid = isEmailValid(email);
    const passwordsMatch = password === repeatPassword && password !== "";

    const formValid = emailValid && passwordValid && passwordsMatch && acceptedRules;

    const onSubmitClick = async () => {
        let hasError = false;

        if (!email) {
            setEmailError("Введите email");
            hasError = true;
        } else if (!emailValid) {
            setEmailError("Некорректный формат email");
            hasError = true;
        } else {
            setEmailError("");
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

        if (!acceptedRules) hasError = true;

        if (hasError) return;

        try {
            await register(email, password);
            alert("Регистрация прошла успешно! Подтвердите email.");
            navigate("/email-confirmation");
        } catch (err: any) {
            switch (err.status) {
                case 409:
                    setEmailError("Email уже занят");
                    break;
                case 500:
                    alert("Ошибка сервера, попробуйте позже");
                    break;
                default:
                    alert("Произошла ошибка");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-[420px] bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-medium text-center mb-4 text-[var(--primary-text-color)]">
                    Регистрация
                </h2>
                <div className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block mb-1 text-[var(--primary-text-color)]">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Введите email..."
                            className={`w-full px-3 py-2 border rounded-md outline-none transition ${
                                emailError
                                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400"
                            }`}
                        />
                        {emailError && <p className="text-sm text-red-500 mt-1">{emailError}</p>}
                    </div>

                    {/* Password */}
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

                    {/* Repeat password */}
                    <div>
                        <label className="block mb-1 text-[var(--primary-text-color)]">Повторите пароль</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            placeholder="Повторите пароль..."
                            className={`w-full px-3 py-2 border rounded-md outline-none transition ${
                                repeatPasswordError
                                    ? "border-red-500 focus:ring-1 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-1 focus:ring-indigo-500 hover:border-indigo-400"
                            }`}
                        />
                        {repeatPasswordError && (
                            <p className="text-sm text-red-500 mt-1">{repeatPasswordError}</p>
                        )}
                    </div>

                    {/* Rules */}
                    <label className="flex items-start gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={acceptedRules}
                            onChange={(e) => setAcceptedRules(e.target.checked)}
                            className="mt-1 accent-indigo-500 cursor-pointer"
                        />
                        <span>
              Я согласен с{" "}
                            <a href="#" className="text-[var(--primary-color)] hover:underline">
                условиями использования
              </a>{" "}
                            и{" "}
                            <a href="#" className="text-[var(--primary-color)] hover:underline">
                политикой конфиденциальности
              </a>
            </span>
                    </label>

                    <button
                        disabled={!formValid}
                        onClick={onSubmitClick}
                        className={`w-full py-2 rounded-md text-white transition ${
                            formValid
                                ? "bg-[var(--primary-color)] cursor-pointer hover:bg-[var(--primary-hover-color)]"
                                : "bg-gray-400 cursor-not-allowed"
                        }`}
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </div>
        </div>
    );
};