import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import ClockIcon from '../assets/icons/clock.svg';
import {
  resendVarificationEmailSlice,
  verifyEmailSlice,
} from '../redux/slices/auth/authSlice';
import {useDispatch, useSelector} from 'react-redux';

const VerifyAccountScreen = ({navigation}) => {
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const userData = useSelector(state => state.auth.userData);

  const dispatch = useDispatch();

  const CELL_COUNT = 6;

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleVerify = () => {
    setLoading(true);
    if (timer === 0) {
      Alert.alert(
        'Error',
        'The verification code has been expired. Please get a new verification code',
      );
      setLoading(false);
      return;
    }
    dispatch(
      verifyEmailSlice({
        navigation,
        dispatch,
        verificationCode: value,
        uid: userData.uid,
        setIsInvalid,
      }),
    ).then(() => setLoading(false));
  };

  const handleResend = () => {
    setResendLoading(true);
    dispatch(
      resendVarificationEmailSlice({
        email: userData.email,
        uid: userData.uid,
      }),
    ).then(() => {
      setTimer(60);
      setResendDisabled(true);
      setResendLoading(false);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Enter Verification Code</Text>
      <Text style={styles.description}>We've sent a verification code to</Text>
      <Text style={styles.email}>{userData.email}</Text>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={text => {
          setValue(text);
          if (text.length < 6) {
            setIsInvalid(false);
          }
        }}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        renderCell={({index, symbol, isFocused}) => (
          <View
            key={index}
            style={[
              styles.cell,
              !isInvalid && isFocused && styles.focusCell,
              isInvalid && isFocused && styles.invalidCell,
              symbol &&
                (isInvalid
                  ? styles.invalidCell
                  : {borderColor: '#191970', color: '#191970'}),
            ]}
            onLayout={getCellOnLayoutHandler(index)}>
            <Text style={{color: isInvalid ? 'red' : '#191970', fontSize: 18}}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />

      {!isInvalid ? (
        <View style={styles.timerContainer}>
          <ClockIcon width={16} height={16} />
          <Text style={styles.timer}>
            Code Expires in{' '}
            <Text style={styles.resendText}>
              {`${Math.floor(timer / 60)
                .toString()
                .padStart(2, '0')}:${(timer % 60).toString().padStart(2, '0')}`}
            </Text>
          </Text>
        </View>
      ) : (
        <View style={styles.timerContainer}>
          <Text style={styles.errorText}>Invalid or expired code</Text>
        </View>
      )}

      <View style={styles.textContainer}>
        <Text style={styles.recieveText}>Didn't receivethe code?</Text>
        <TouchableOpacity disabled={isResendDisabled} onPress={handleResend}>
          {resendLoading ? (
            <ActivityIndicator size="small" color="#191970" />
          ) : (
            <Text
              style={[styles.resendText, isResendDisabled && {color: 'grey'}]}>
              Resend Code
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
        {!loading ? (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </View>
        ) : (
          <ActivityIndicator size="small" color="#ffff" />
        )}
      </TouchableOpacity>

      {/* Resend Code */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    paddingTop: 50,
    alignItems: 'center',
  },

  headerText: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter',
    lineHeight: 20,
    textAlign: 'center',
    color: '#000000',
    marginBottom: 15,
    fontFamily: 'Inter',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter',
    lineHeight: 16,
    textAlign: 'center',
    fontWeight: '400',
    color: '#4B5563',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 15,
    fontFamily: 'Inter',
  },
  codeFieldContainer: {},
  codeFieldRoot: {
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'space-between',
    minWidth: '100%',
  },
  cell: {
    width: 48,
    height: 48,
    fontSize: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    padding: 0,
  },

  focusCell: {
    borderColor: '#191970',
  },
  invalidCell: {
    borderColor: 'red',
    color: 'red',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    marginVertical: 40,
    alignItems: 'center',
  },
  timer: {
    marginLeft: 10,
    fontSize: 16,
    color: '#4B5563',
    fontFamily: 'Inter',
    lineHeight: 16,
    fontWeight: '400',
  },

  errorText: {
    fontSize: 14,
    color: 'red',
  },
  verifyButton: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
    marginRight: 10,
  },
  verifyButtonIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  textContainer: {
    display: 'flex',
    marginBottom: 30,
  },
  recieveText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Inter',
    color: '#4B5563',
  },
  resendText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter',
    color: '#2563EB',
  },
  logoutContainer: {},
  logoutButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'inter',
    marginRight: 10,
  },
});

export default VerifyAccountScreen;
