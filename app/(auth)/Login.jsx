import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik} from 'formik';
import {loginSchema} from '../validations/validationSchemas';
import HomeIcon from '../assets/icons/google.svg';
import FacebookIcon from '../assets/icons/facebook.svg';
import AppleIcon from '../assets/icons/apple.svg';
import EmailIcon from '../assets/icons/email.svg';
import PasswordIcon from '../assets/icons/password.svg';
import CheckBox from 'react-native-check-box';
import InputField from '../components/ui/InputLabelField';
import {authSignInWithEmail} from '../redux/slices/auth/authSlice';
import {useDispatch} from 'react-redux';

const LoginScreen = ({navigation}) => {
  const [signInLoading, setSigninLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const dispatch = useDispatch();
  const handleLogin = values => {
    console.log('Login values:', values); // Debugging log
    const {email, password, rememberMe} = values;
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (isValid) {
      console.log('Form submitted');
      setSigninLoading(true);
      try {
        dispatch(
          authSignInWithEmail({
            navigation,
            password: password,
            email: email,
            dispatch,
            setSigninLoading,
          }),
        ).then(() => {
          setEmailError('');
          setPasswordError('');
        });
      } catch (error) {
        console.error('Sign-in failed:', error);
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{flex: 1, backgroundColor: '#2563EB'}}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled">
      <SafeAreaView>
        <View style={[styles.container]}>
          <StatusBar barStyle="light-content" />
          <Text style={[styles.title]}>CapitalProp</Text>
          <Text style={[styles.subtitle]}>Property Management Made Simple</Text>
          <View style={[styles.loginContainer]}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={[styles.welcomeSubtitle]}>
              Login to manage your properties
            </Text>
            {/* Social Login Buttons */}
            <View style={styles.socialButtonContainer}>
              <TouchableOpacity
                style={[styles.socialButton]}
                onPress={() => navigation.navigate('reset-password')}>
                <HomeIcon width={15.25} height={16} />
                <Text style={[styles.socialButtonText]}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.socialButton]}>
                <FacebookIcon width={16} height={16} />
                <Text style={[styles.socialButtonText]}>
                  Continue with Facebook
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.socialButton]}>
                <AppleIcon width={16} height={16} />
                <Text style={[styles.socialButtonText]}>
                  Continue with Apple
                </Text>
              </TouchableOpacity>
            </View>
            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider]} />
              <Text style={[styles.dividerText]}>or</Text>
              <View style={[styles.divider]} />
            </View>

            <Formik
              initialValues={{
                email: '',
                password: '',
                rememberMe: false,
              }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
              }) => (
                <>
                  <InputField
                    label="Email"
                    icon={EmailIcon}
                    placeholder="Enter your email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    error={touched.email && errors.email}
                    containerStyle={styles.mainInputContainer}
                    labelStyle={styles.labelStyle}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    errorStyle={styles.errorStyle}
                    secureTextEntry={false}
                  />

                  <InputField
                    label="Password"
                    icon={PasswordIcon}
                    placeholder="Enter your password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={touched.password && errors.password}
                    containerStyle={styles.mainInputContainer}
                    labelStyle={styles.labelStyle}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    errorStyle={styles.errorStyle}
                    secureTextEntry={true}
                  />

                  {/* Remember Me & Forgot Password */}
                  <View style={styles.rememberMeContainer}>
                    <View style={styles.checkboxContainer}>
                      <CheckBox
                        isChecked={values.rememberMe}
                        onClick={() =>
                          setFieldValue('rememberMe', !values.rememberMe)
                        }
                        checkBoxColor={values.rememberMe ? '#007bff' : '#ccc'}
                        rightTextStyle={{fontSize: 16, color: '#333'}}
                      />

                      <Text style={styles.rememberMeText}>Remember Me</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('ForgotPassword')}>
                      <Text style={styles.forgotPasswordText}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Login Button */}
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => {
                      console.log('Login Button Pressed'); // Debugging log
                      handleSubmit(); // This should trigger Formik's onSubmit
                    }}>
                    {!signInLoading ? (
                      <Text style={styles.loginButtonText}>Login</Text>
                    ) : (
                      <ActivityIndicator color="white" size="small" />
                    )}
                  </TouchableOpacity>
                </>
              )}
            </Formik>
            <View style={styles.createAccountView}>
              <Text style={styles.accountText}>Don't have an account?</Text>
              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.createAccountText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingTop: 150,
  },
  loginContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
    fontFamily: 'Inter',
    lineHeight: 30,
  },
  welcomeText: {
    color: '#1F2937',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 700,
    marginVertical: 10,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#DBEAFE',
  },
  welcomeSubtitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 16,
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 25,
    color: '#6B7280',
    marginTop: 8,
  },
  socialButtonContainer: {
    gap: 15,
    margin: 10,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    gap: 10,
    height: 50,
    borderColor: '#E5E7EB',
  },
  socialButtonText: {
    fontWeight: '400',
    color: '#374151',
    fontSize: 16,
    lineHeight: 16,
  },
  themeButton: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 10,
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: 16,
    lineHeight: 16,
    color: '#6B7280',
  },
  mainInputContainer: {
    marginHorizontal: 15,
    marginTop: 15,
  },
  labelStyle: {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: 14,
    color: '#374151',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: '#E5E7EB',
  },
  inputIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: '#000',
  },
  errorStyle: {
    color: 'red',
    fontSize: 10,
    fontFamily: 'Inter',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 8,
  },
  checked: {
    backgroundColor: 'blue',
  },
  rememberMeText: {
    fontSize: 14,
    color: 'gray',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#2563EB',
  },
  loginButton: {
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#2563EB',
    marginHorizontal: 20,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter',
    fontWeight: 500,
  },
  createAccountView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  accountText: {
    fontSize: 16,
    fontWeight: 400,
    fontFamily: 'Inter',
    lineHeight: 16,
    color: '#4B5563',
    marginBottom: 10,
  },
  createAccountButton: {
    padding: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 10,
  },
  createAccountText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 500,
    color: '#2563EB',
  },
});

export default LoginScreen;
