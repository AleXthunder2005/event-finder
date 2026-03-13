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
    Text, InputRightElement, IconButton, InputGroup
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon} from '@chakra-ui/icons'
import {useState} from "react";
import isEmailValid from "@helpers/isEmailValid.ts";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const onSubmitClick = () => {

        let hasError = false;

        // email validation
        if (!email) {
            setEmailError("Введите email");
            hasError = true;
        } else if (!isEmailValid(email)) {
            setEmailError("Неверный формат email");
            hasError = true;
        } else {
            setEmailError("");
        }

        // password validation
        if (!password) {
            setPasswordError("Введите пароль");
            hasError = true;
        } else {
            setPasswordError("");
        }

        // prevent submit
        if (hasError) return;

        alert(`Your login is ${email} and password is ${password}`);
    };

    const onEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        if (!value) {
            setEmailError("");
        } else if (!isEmailValid(value)) {
            setEmailError("Неверный формат email");
        } else {
            setEmailError("");
        }
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError("");
    }

    return (
        <Flex minH="100vh" align="center" justify="center">
            <Card w="400px">

                <CardHeader padding="none">
                    <Heading
                        size="lg"
                        color="var(--primary-text-color)"
                        textAlign="center"
                        padding={2}
                    >
                        Вход
                    </Heading>
                </CardHeader>

                <CardBody>
                    <Stack spacing="4">

                        <FormControl isInvalid={!!emailError}>
                            <FormLabel color="var(--primary-text-color)">
                                Логин
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

                        <FormControl isInvalid={!!passwordError}>
                            <FormLabel color="var(--primary-text-color)">
                                Пароль
                            </FormLabel>

                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Ваш пароль..."
                                    value={password}
                                    onChange={onPasswordChange}
                                    _focusVisible={{
                                        borderColor: passwordError
                                            ? "var(--error-dark)"
                                            : "var(--primary-color)",
                                        boxShadow: passwordError
                                            ? "0 0 0 1px var(--error-color)"
                                            : "0 0 0 1px var(--primary-color)"
                                    }}
                                    _hover={{
                                        borderColor: "var(--primary-hover-color)"
                                    }}
                                />

                                <InputRightElement>
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        variant="ghost"
                                        size="sm"
                                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                        onClick={() => setShowPassword(!showPassword)}
                                    />
                                </InputRightElement>
                            </InputGroup>

                            <FormErrorMessage>
                                {passwordError}
                            </FormErrorMessage>
                        </FormControl>

                        <Button
                            mt="2"
                            bg="var(--primary-color)"
                            color="white"
                            _hover={{
                                bg: "var(--primary-hover-color)",
                                transition: "var(--hover-button-transition)"
                            }}
                            onClick={onSubmitClick}
                        >
                            Войти
                        </Button>

                        <Stack spacing="1" pt="2" align="center">
                            <Link
                                href="/forgot-password"
                                fontSize="sm"
                                color="var(--primary-color)"
                                _hover={{
                                    color: "var(--primary-hover-color)",
                                    fontWeight: "var(--hover-text-font-weight)",
                                }}
                            >
                                Забыли пароль?
                            </Link>

                            <Text fontSize="sm" color="var(--primary-text-color)">
                                Нет аккаунта?{" "}
                                <Link
                                    href="/register"
                                    color="var(--primary-color)"
                                    _hover={{
                                        color: "var(--primary-hover-color)",
                                        fontWeight: "var(--hover-text-font-weight)",
                                    }}
                                >
                                    Создать аккаунт
                                </Link>
                            </Text>
                        </Stack>

                    </Stack>
                </CardBody>

            </Card>
        </Flex>
    );
};

export default Login;