import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useRoute} from '@react-navigation/native';
import InputField from '../components/ui/InputLabelField';
import TickIcon from '../assets/icons/tick.svg';

export default function ResetPassword() {
  const route = useRoute();
  const {oobCode} = route.params || {};

  const [password, setPassword] = useState('');

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Must contain an uppercase letter')
      .matches(/\d/, 'Must contain a number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain a special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = values => {
    console.log('Reset Password:', values);
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{currentPassword: '', password: '', confirmPassword: ''}}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => {
          setPassword(values.password);

          return (
            <>
              <InputField
                label="Current Password"
                placeholder="Enter current password"
                value={values.currentPassword}
                onChangeText={handleChange('currentPassword')}
                onBlur={handleBlur('currentPassword')}
                error={touched.currentPassword && errors.currentPassword}
                containerStyle={styles.formGroup}
                labelStyle={styles.label}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                errorStyle={styles.errorText}
                secureTextEntry={true}
              />

              <InputField
                label="New Password"
                placeholder="Enter your new password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password && errors.password}
                containerStyle={styles.formGroup}
                labelStyle={styles.label}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                errorStyle={styles.errorText}
                secureTextEntry={true}
              />

              <InputField
                label="Confirm New Password"
                placeholder="Confirm your new password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                error={touched.confirmPassword && errors.confirmPassword}
                containerStyle={styles.formGroup}
                labelStyle={styles.label}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                errorStyle={styles.errorText}
                secureTextEntry={true}
              />

              <View style={styles.passwordRequirements}>
                <Text style={styles.title}>Password Requirements:</Text>
                <View style={styles.iconContainer}>
                  <TickIcon width={15} height={15} />
                  <Text style={styles.requirement}>Minimum 8 characters</Text>
                </View>
                <View style={styles.iconContainer}>
                  <TickIcon width={15} height={15} />
                  <Text style={styles.requirement}>
                    At least one uppercase letter
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <TickIcon width={15} height={15} />
                  <Text style={styles.requirement}>At least one number</Text>
                </View>
                <View style={styles.iconContainer}>
                  <TickIcon width={15} height={15} />
                  <Text style={styles.requirement}>
                    At least one special character
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}>
                <Text style={styles.submitText}>Reset Password</Text>
              </TouchableOpacity>
            </>
          );
        }}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#F9FAFB',
  },
  formGroup: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 18,
    color: '#374151',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 10,
    fontFamily: 'Inter',
  },
  passwordRequirements: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
  },
  requirement: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
});
