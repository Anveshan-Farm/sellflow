import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput as TextInputType,
} from 'react-native';
import { Text, Button, Avatar, TextInput } from 'exoflex';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import { DatePicker } from '../core-ui';
import { FONT_SIZE } from '../constants/fonts';
import { COLORS } from '../constants/colors';
import { useDimensions, ScreenSize } from '../helpers/dimensions';
import {
  INVALID_EMAIL_MESSAGE,
  INVALID_PASSWORD_MESSAGE,
  validateEmail,
  validatePassword,
} from '../helpers/validation';
import formatDateLong from '../helpers/formatDateLong';
import { profile } from '../../assets/images';
import { defaultButtonLabel, defaultButton } from '../constants/theme';

export default function EditProfileScene() {
  let [profilePicture, setProfilePicture] = useState(profile);
  let [isPickerVisible, setIsPickerVisible] = useState(false);
  let [birthDate, setBirthDate] = useState('');
  let [name, setName] = useState('');
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let [isEmailValid, setIsEmailValid] = useState(true);
  let [isPasswordValid, setIsPasswordValid] = useState(true);
  let nameRef = useRef<TextInputType>(null);
  let emailRef = useRef<TextInputType>(null);
  let passwordRef = useRef<TextInputType>(null);
  let dimensions = useDimensions();

  let togglePickerVisible = () => {
    setIsPickerVisible(!isPickerVisible);
  };

  let openGallery = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      Alert.alert(t('Camera Roll permission not granted.'));
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setProfilePicture({ uri: result.uri });
      }
    }
  };

  let containerStyle = () => {
    if (dimensions.screenSize === ScreenSize.Small) {
      return styles.container;
    } else {
      return [styles.container, { marginHorizontal: 36 }];
    }
  };
  let saveChanges = () => {
    if (isPasswordValid && isEmailValid) {
      //TODO: save fields here
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContentContainer}
    >
      <DatePicker
        isVisible={isPickerVisible}
        onCancel={() => setIsPickerVisible(false)}
        onConfirm={(date: string) => {
          setBirthDate(date);
          setIsPickerVisible(false);
        }}
      />
      <View style={containerStyle()}>
        <KeyboardAvoidingView behavior="position">
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.profilePictureEditContainer}
              onPress={openGallery}
            >
              <Avatar.Image source={profilePicture} size={92} />
              <Text style={styles.changePictureClickable}>
                {t('Change Profile Picture')}
              </Text>
            </TouchableOpacity>

            <View style={styles.formsContainer}>
              <View style={styles.individualFormContainer}>
                <Text style={styles.greyText}>{t('Name')}</Text>
                <TextInput
                  ref={nameRef}
                  autoFocus={true}
                  clearTextOnFocus={false}
                  autoCapitalize="none"
                  textContentType="name"
                  mode="flat"
                  value={name}
                  onChangeText={setName}
                  containerStyle={styles.textInputContainer}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    emailRef.current && emailRef.current.focus();
                  }}
                />
              </View>
              <View style={styles.individualFormContainer}>
                <Text style={styles.greyText}>{t('Email Address')}</Text>
                <TextInput
                  onFocus={() => {
                    setIsEmailValid(true);
                  }}
                  onBlur={() => {
                    setIsEmailValid(validateEmail(email));
                  }}
                  clearTextOnFocus={false}
                  autoCapitalize="none"
                  errorMessage={
                    !isEmailValid ? INVALID_EMAIL_MESSAGE : undefined
                  }
                  ref={emailRef}
                  textContentType="emailAddress"
                  mode="flat"
                  value={email}
                  containerStyle={styles.textInputContainer}
                  onChangeText={setEmail}
                  errorMessageStyle={styles.errorMessage}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    passwordRef.current && passwordRef.current.focus();
                  }}
                />
              </View>
              <View style={styles.individualFormContainer}>
                <Text style={styles.greyText}>{t('Password')}</Text>
                <TextInput
                  onFocus={() => {
                    setIsPasswordValid(true);
                  }}
                  onBlur={() => {
                    setIsPasswordValid(validatePassword(password));
                  }}
                  ref={passwordRef}
                  textContentType="password"
                  autoCapitalize="none"
                  errorMessage={
                    !isPasswordValid ? INVALID_PASSWORD_MESSAGE : undefined
                  }
                  secureTextEntry={true}
                  mode="flat"
                  value={password}
                  onChangeText={setPassword}
                  containerStyle={styles.textInputContainer}
                  errorMessageStyle={styles.errorMessage}
                  returnKeyType="next"
                  onSubmitEditing={togglePickerVisible}
                />
              </View>
              <View style={styles.individualFormContainer}>
                <Text style={styles.greyText}>{t('Date of Birth')}</Text>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={togglePickerVisible}
                >
                  <TextInput
                    mode="flat"
                    value={formatDateLong(birthDate)}
                    disabled={true}
                    editable={false}
                    pointerEvents="none"
                    containerStyle={styles.textInputContainer}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={styles.buttonSaveContainer}>
          <Button
            onPress={saveChanges}
            style={defaultButton}
            labelStyle={defaultButtonLabel}
          >
            {t('Save Changes')}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.white,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  container: {
    marginHorizontal: 24,
    justifyContent: 'space-between',
    flexGrow: 2,
  },
  greyText: {
    color: COLORS.grey,
  },
  profilePictureEditContainer: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  changePictureClickable: {
    paddingTop: 16,
    fontSize: FONT_SIZE.medium,
    color: COLORS.primaryColor,
  },
  formsContainer: {
    marginVertical: 12,
    alignSelf: 'flex-start',
    width: '100%',
  },
  individualFormContainer: {
    marginVertical: 15,
    height: 45,
  },
  buttonSaveContainer: {
    marginTop: 12,
    marginBottom: 24,
    backgroundColor: COLORS.red,
  },
  textInputContainer: {
    margin: 0,
    paddingVertical: 8,
  },
  errorMessage: {
    padding: 0,
    marginTop: 0,
  },
});