import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchImageLibrary} from 'react-native-image-picker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import CameraIcon from '../assets/icons/camera.svg';
import InputField from '../components/ui/InputLabelField';
import Dropdown from '../components/ui/Dropdown';
import {CountryCodes, UserRoles} from '../contants/Constants';
import IntegrationOption from '../components/ui/IntegrationOption';
import GoogleIntegrationIcon from '../assets/icons/googleIntegrationIcon.svg';
import OutlookIntegrationIcon from '../assets/icons/outlookIntegrationIcon.svg';
import AppleIntegrationIcon from '../assets/icons/appleIntegrationIcon.svg';
import {useDispatch} from 'react-redux';
import {userAccountEmailSlice} from '../redux/slices/auth/authSlice';

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  role: Yup.string().required('Role is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const CreateProfile = ({navigation}) => {
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(null);
  const [emailMarketing, setEmailMarketing] = useState(false);
  const [pushNotification, setPushNotification] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async values => {
    console.log('Form values:', values);
    setSignUpLoading(true);
    // Ensure all required values exist
    const payload = {
      photourl: profileImage,
      email: values.email, // Fix: Ensure email is extracted from values
      fullName: values.fullName, // Fix: Ensure fullName is extracted
      phoneNumber: `${values.countryCode}${values.phone}`, // Fix: Concatenation using template literals
      role: values.role,
      password: values.password, // Fix: Ensure password is extracted
      emailMarketing,
      pushNotification,
      navigation,
    };

    dispatch(userAccountEmailSlice(payload)).then(() => {
      setSignUpLoading(false);
    }); // Fix: Correct thunk dispatch
  };

  console.log('Signup screen rendered');

  return (
    <KeyboardAwareScrollView
      style={{flex: 1}}
      enableOnAndroid={true}
      extraScrollHeight={100}
      keyboardShouldPersistTaps="handled">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity style={styles.avatarWrapper}>
              {profileImage ? (
                <Image source={{uri: profileImage}} style={styles.avatar} />
              ) : (
                <View style={styles.emptyAvatar} />
              )}
              <View style={styles.cameraIcon}>
                <TouchableOpacity onPress={pickImage}>
                  <CameraIcon width={18} height={18} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>

          <Formik
            initialValues={{
              fullName: '',
              email: '',
              countryCode: '',
              phone: '',
              role: '',
              password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {props => {
              const {
                values,
                touched,
                errors,
                isSubmitting,
                handleChange,
                handleBlur,
                handleSubmit,
              } = props;
              return (
                <>
                  <View style={styles.miniContainer}>
                    <InputField
                      label="Full Name"
                      placeholder="Enter your full name"
                      value={values.fullName}
                      onChangeText={handleChange('fullName')}
                      onBlur={handleBlur('fullName')}
                      error={touched.fullName && errors.fullName}
                      containerStyle={styles.formGroup}
                      labelStyle={styles.label}
                      inputContainerStyle={styles.inputContainer}
                      inputStyle={styles.input}
                      errorStyle={styles.errorText}
                      secureTextEntry={false}
                    />

                    <InputField
                      label="Email"
                      placeholder="Enter your email"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      error={touched.email && errors.email}
                      containerStyle={styles.formGroup}
                      labelStyle={styles.label}
                      inputContainerStyle={styles.inputContainer}
                      inputStyle={styles.input}
                      errorStyle={styles.errorText}
                      secureTextEntry={false}
                    />

                    <View style={styles.phoneContainer}>
                      <View style={styles.formGroup}>
                        <Text style={styles.label}>Code</Text>
                        <Dropdown
                          data={CountryCodes}
                          defaultValue={'+44'}
                          onSelect={handleChange('countryCode')}
                          error={touched.countryCode && errors.countryCode}
                        />
                      </View>
                      <InputField
                        label="Phone"
                        placeholder="Enter your phone number"
                        value={values.phone}
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        error={touched.phone && errors.phone}
                        containerStyle={styles.phoneFormGroup}
                        labelStyle={styles.label}
                        inputContainerStyle={styles.phoneInputContainer}
                        inputStyle={styles.input}
                        errorStyle={styles.errorText}
                        secureTextEntry={false}
                      />
                    </View>
                  </View>

                  <View style={styles.miniContainer}>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Role</Text>
                      <Dropdown
                        data={UserRoles}
                        defaultValue={'propertyManager'}
                        onSelect={handleChange('role')}
                        error={touched.role && errors.role}
                      />
                    </View>
                    <InputField
                      label="Password"
                      placeholder="Enter your password"
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
                  </View>

                  <View style={styles.miniContainer}>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Calender Integration</Text>
                      <IntegrationOption
                        icon={GoogleIntegrationIcon}
                        title="Google Calendar"
                        onPress={() => navigation.navigate('VerifyEmail')}
                      />
                      <IntegrationOption
                        icon={OutlookIntegrationIcon}
                        title="Outlook Calendar"
                        onPress={() =>
                          console.log('Navigate to Outlook Calendar')
                        }
                      />
                      {Platform.OS === 'ios' && (
                        <IntegrationOption
                          icon={AppleIntegrationIcon}
                          title="Apple Calendar"
                          onPress={() =>
                            console.log('Navigate to Apple Calendar')
                          }
                        />
                      )}
                    </View>
                  </View>
                  <View style={styles.miniContainer}>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Marketing Preferences</Text>
                      <View style={styles.switchContainer}>
                        <Text style={styles.marketingLabel}>
                          Email Marketing
                        </Text>
                        <Switch
                          value={emailMarketing}
                          onValueChange={setEmailMarketing}
                          trackColor={{false: '#BEBEBE', true: '#007bff'}}
                          thumbColor="#f4f3f4"
                        />
                      </View>
                      <View style={styles.switchContainer}>
                        <Text style={styles.marketingLabel}>
                          Push Notification
                        </Text>
                        <Switch
                          value={pushNotification}
                          onValueChange={setPushNotification}
                          trackColor={{false: '#BEBEBE', true: '#007bff'}}
                          thumbColor="#f4f3f4"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.formGroup}>
                    <Text
                      style={[
                        styles.label,
                        {
                          marginBottom: 20,
                          textAlign: 'center',
                          color: '#000',
                          fontSize: 12,
                        },
                      ]}>
                      By creating an account, I agree to all terms and
                      conditions.
                    </Text>

                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => {
                        console.log('pressed');
                        handleSubmit();
                      }}>
                      {!signUpLoading ? (
                        <Text style={styles.submitText}>Create an account</Text>
                      ) : (
                        <ActivityIndicator color="white" size="small" />
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              );
            }}
          </Formik>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#E5E7EB',
  },
  avatarContainer: {
    alignItems: 'center',
    padding: 30,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 50,
  },
  emptyAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    borderRadius: 15,
    padding: 8,
  },
  cameraText: {
    color: '#fff',
    fontSize: 12,
  },
  miniContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 5,
    borderRadius: 10,
    paddingBottom: 15,
  },
  formGroup: {
    marginHorizontal: 15,
    marginTop: 15,
  },
  phoneFormGroup: {
    marginTop: 15,
    flex: 1,
    marginRight: 15,
  },
  label: {
    fontFamily: 'Inter',
    fontWeight: 500,
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
  phoneInputContainer: {
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
  phoneContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  marketingLabel: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter',
    lineHeight: 16,
    color: '#000',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  switchStyle: {
    backgroundColor: 'grey',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30,
    borderRadius: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CreateProfile;
