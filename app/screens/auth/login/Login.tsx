import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StatusBar,
} from "react-native";

import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

import { styles, screenWidth } from "./Login.styles";
import { LoginLogic } from "./Login.logic";


const Login = () => {

    const {
        email, setEmail,
        password, setPassword,
        showPassword, setShowPassword,
        navigation,
        loading,
        handleLogin,
        handleLoginGoogle,
    } = LoginLogic();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1e40af" />
            <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="school" size={screenWidth * 0.15} color="#ffffff" />
                    </View>
                    <Text style={styles.appName}>Tembiapo</Text>
                    <Text style={styles.appSubtitle}></Text>
                </View>

                <View style={styles.loginContainer}>
                    <Text style={styles.title}>Iniciar sesión</Text>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
                        <TextInput
                            value={email}
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#94a3b8"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#64748b" style={styles.inputIcon} />
                        <TextInput
                            value={password}
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#94a3b8"
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#1e40af" />
                            <Text style={styles.loadingText}>Iniciando sesión...</Text>
                        </View>
                    ) : (
                        <>
                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                            </TouchableOpacity>

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>o</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <TouchableOpacity onPress={handleLoginGoogle} style={styles.googleButton}>
                                <Ionicons name="logo-google" size={20} color="#db4437" />
                                <Text style={styles.googleButtonText}>Continua con Google</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate("Registro")} style={styles.registerLink}>
                                <Text style={styles.registerText}>
                                    No tienes una cuenta? <Text style={styles.registerTextBold}>Regístrate aquí</Text>
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>
            <Toast />
        </View>
    );
};

export default Login;


