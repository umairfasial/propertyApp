import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import EmailIcon from '../assets/icons/email.svg';
import BackIcon from '../assets/icons/backArrorIcon.svg';
import InputField from '../components/ui/InputLabelField';
import {resetPasswordsEmailSlice} from '../redux/slices/auth/authSlice';
import {useDispatch} from 'react-redux';

export default function ForgotPassword({navigation}) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  // Validation Schema using Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const handleForgotPassword = values => {
    setLoading(true);
    const {email} = values;
    dispatch(resetPasswordsEmailSlice({email})).then(() => {
      setLoading(false);
      navigation.goBack();
    });
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}

      {/* Title and Subtitle */}
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Enter your email address to receive a password reset link
      </Text>

      {/* Formik Form */}
      <Formik
        initialValues={{email: ''}}
        validationSchema={validationSchema}
        onSubmit={handleForgotPassword}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <InputField
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

            {/* Send Reset Link Button */}
            <TouchableOpacity onPress={handleSubmit} style={styles.resetButton}>
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.resetButtonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>

      {/* Back to Login */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backToLogin}>
        <BackIcon width={16} height={16} />
        <Text style={styles.backToLoginText}> Back to Login</Text>
      </TouchableOpacity>

      {/* Contact Support */}
      <Text style={styles.supportText}>
        Need help? <Text style={styles.supportLink}>Contact Support</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'Inter',
    color: '#1F2937',
  },
  subtitle: {
    textAlign: 'center',
    color: '#4B5563',
    marginVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 14,
    marginHorizontal: 30,
  },
  resetButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  backToLoginText: {
    color: '#2563EB',
    marginLeft: 5,
    fontSize: 14,
    fontFamily: 'Inter',
    fontWeight: '500',
  },
  supportText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: 'gray',
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 14,
  },
  supportLink: {
    color: '#2563EB',
    fontWeight: '500',
    fontSize: 14,
  },
  mainInputContainer: {
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
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Inter',
  },
  errorStyle: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
