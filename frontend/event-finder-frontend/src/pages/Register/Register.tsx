import {
    Card,
    CardBody,
    CardHeader,
    Heading,
    Input,
    Stack,
    FormControl,
    FormLabel,
    Button,
    Flex,
    FormErrorMessage,
    Link,
    Text,
    InputRightElement,
    IconButton,
    InputGroup,
    Checkbox
} from "@chakra-ui/react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import isEmailValid from "@helpers/isEmailValid.ts";

const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [repeatPasswordError, setRepeatPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [acceptedRules, setAcceptedRules] = useState(false);

    // password checks
    const hasLength = password.length >= 8 && password.length <= 40;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*()\-+=\[\]{};:'",.<>/?\\|]/.test(password);
    const hasNoSpaces = !/\s/.test(password);

    const passwordValid =
        hasLength &&
        hasUppercase &&
        hasSpecial &&
        hasNoSpaces;

    const emailValid = isEmailValid(email);

    const passwordsMatch =
        password !== "" &&
        repeatPassword !== "" &&
        password === repeatPassword;

    const onSubmitClick = () => {

        let hasError = false;

        if (!email) {
            setEmailError("Введите email");
            hasError = true;
        } else if (!isEmailValid(email)) {
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

        if (!acceptedRules) {
            hasError = true;
        }

        if (hasError) return;

        alert(`Register: ${email}`);
    };

    const onEmailChange = (e) => {

        const value = e.target.value;

        setEmail(value);

        if (!value) {
            setEmailError("");
        } else if (!isEmailValid(value)) {
            setEmailError("Некорректный формат email");
        } else {
            setEmailError("");
        }
    };

    const onPasswordChange = (e) => {

        const value = e.target.value;

        setPassword(value);
        setPasswordError("");

        if (repeatPassword && value !== repeatPassword) {
            setRepeatPasswordError("Пароли не совпадают");
        } else {
            setRepeatPasswordError("");
        }
    };

    const onRepeatPasswordChange = (e) => {

        const value = e.target.value;

        setRepeatPassword(value);

        if (password && value !== password) {
            setRepeatPasswordError("Пароли не совпадают");
        } else {
            setRepeatPasswordError("");
        }
    };

    const formValid =
        emailValid &&
        passwordValid &&
        passwordsMatch &&
        acceptedRules;

    return (
        <Flex minH="100vh" align="center" justify="center">

            <Card w="420px">

                <CardHeader padding="none">
                    <Heading
                        size="lg"
                        color="var(--primary-text-color)"
                        textAlign="center"
                        padding={2}
                    >
                        Регистрация
                    </Heading>
                </CardHeader>

                <CardBody>

                    <Stack spacing="4">

                        {/* EMAIL */}

                        <FormControl isInvalid={!!emailError}>

                            <FormLabel color="var(--primary-text-color)">
                                Email
                            </FormLabel>

                            <Input
                                type="email"
                                value={email}
                                onChange={onEmailChange}
                                placeholder="Ваш email..."
                                _hover={{
                                    borderColor: "var(--primary-hover-color)"
                                }}
                                _focusVisible={{
                                    borderColor: emailError
                                        ? "var(--error-dark)"
                                        : "var(--primary-color)",
                                    boxShadow: emailError
                                        ? "0 0 0 1px var(--error-color)"
                                        : "0 0 0 1px var(--primary-color)"
                                }}
                            />

                            <FormErrorMessage>
                                {emailError}
                            </FormErrorMessage>

                        </FormControl>

                        {/* PASSWORD */}

                        <FormControl isInvalid={!!passwordError}>

                            <FormLabel color="var(--primary-text-color)">
                                Пароль
                            </FormLabel>

                            <InputGroup>

                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={onPasswordChange}
                                    placeholder="Введите пароль"
                                    _hover={{
                                        borderColor: "var(--primary-hover-color)"
                                    }}
                                    _focusVisible={{
                                        borderColor: passwordError
                                            ? "var(--error-dark)"
                                            : "var(--primary-color)",
                                        boxShadow: passwordError
                                            ? "0 0 0 1px var(--error-color)"
                                            : "0 0 0 1px var(--primary-color)"
                                    }}
                                />

                                <InputRightElement>

                                    <IconButton
                                        aria-label={"toogle password visibility"}
                                        variant="ghost"
                                        size="sm"
                                        icon={
                                            showPassword
                                                ? <ViewOffIcon/>
                                                : <ViewIcon/>
                                        }
                                        onClick={() => setShowPassword(!showPassword)}
                                    />

                                </InputRightElement>

                            </InputGroup>

                            <FormErrorMessage>
                                {passwordError}
                            </FormErrorMessage>

                        </FormControl>

                        {/* PASSWORD CHECKLIST */}

                        <Stack spacing="1" fontSize="sm">

                            <Text color={hasLength ? "var(--success-dark)" : "var(--secondary-text-color)"}>
                                • 8-40 символов
                            </Text>

                            <Text color={hasUppercase ? "var(--success-dark)" : "var(--secondary-text-color)"}>
                                • минимум 1 заглавная буква
                            </Text>

                            <Text color={hasSpecial ? "var(--success-dark)" : "var(--secondary-text-color)"}>
                                • минимум 1 спецсимвол
                            </Text>

                            <Text color={hasNoSpaces ? "var(--success-dark)" : "var(--secondary-text-color)"}>
                                • без пробелов
                            </Text>

                        </Stack>

                        {/* REPEAT PASSWORD */}

                        <FormControl isInvalid={!!repeatPasswordError}>

                            <FormLabel color="var(--primary-text-color)">
                                Повторите пароль
                            </FormLabel>

                            <InputGroup>

                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={repeatPassword}
                                    onChange={onRepeatPasswordChange}
                                    placeholder="Повторите пароль"
                                    _hover={{
                                        borderColor: "var(--primary-hover-color)"
                                    }}
                                    _focusVisible={{
                                        borderColor: repeatPasswordError
                                            ? "var(--error-dark)"
                                            : "var(--primary-color)",
                                        boxShadow: repeatPasswordError
                                            ? "0 0 0 1px var(--error-color)"
                                            : "0 0 0 1px var(--primary-color)"
                                    }}
                                />

                                <InputRightElement>

                                    <IconButton
                                        aria-label="toggle password visibility"
                                        variant="ghost"
                                        size="sm"
                                        icon={
                                            showPassword
                                                ? <ViewOffIcon/>
                                                : <ViewIcon/>
                                        }
                                        onClick={() => setShowPassword(!showPassword)}
                                    />

                                </InputRightElement>

                            </InputGroup>

                            <FormErrorMessage>
                                {repeatPasswordError}
                            </FormErrorMessage>

                        </FormControl>

                        {/* RULES */}

                        <Checkbox
                            isChecked={acceptedRules}
                            onChange={(e) =>
                                setAcceptedRules(e.target.checked)
                            }
                            colorScheme="var(--primary-color);"
                        >
                            Я согласен с{" "}
                            <Link color="var(--primary-color)">
                                условиями использования
                            </Link>{" "}
                            и{" "}
                            <Link color="var(--primary-color)">
                                политикой конфиденциальности
                            </Link>
                        </Checkbox>

                        {/* SUBMIT */}

                        <Button
                            mt="2"
                            bg="var(--primary-color)"
                            color="white"
                            isDisabled={!formValid}
                            _hover={{
                                bg: "var(--primary-hover-color)",
                                transition: "var(--hover-button-transition)"
                            }}
                            onClick={onSubmitClick}
                        >
                            Зарегистрироваться
                        </Button>

                        {/* LOGIN LINK */}

                        <Stack pt="2" align="center">

                            <Text
                                fontSize="sm"
                                color="var(--primary-text-color)"
                            >
                                Уже есть аккаунт?{" "}
                                <Link
                                    href="/login"
                                    color="var(--primary-color)"
                                    _hover={{
                                        color: "var(--primary-hover-color)",
                                        fontWeight: "var(--hover-text-font-weight)"
                                    }}
                                >
                                    Войти
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </CardBody>
            </Card>
        </Flex>
    );
};

export default Register;