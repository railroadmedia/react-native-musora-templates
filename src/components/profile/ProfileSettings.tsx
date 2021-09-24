import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView
} from 'react-native';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary
} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

import { utils } from '../../utils';
import { ThemeContext } from '../../state/theme/ThemeContext';
import { themeStyles } from '../../themeStyles';
import { UserContext } from '../../state/user/UserContext';
import { userService } from '../../services/user.service';
import { Loading, LoadingRefObject } from '../../common_components/Loading';
import type {
  UpdateAvatarResponse,
  UserAvatar
} from '../../interfaces/user.interfaces';
import { ActionModal } from '../../common_components/modals/ActionModal';

interface Props {
  closeModal: () => void;
}

export const ProfileSettings: React.FC<Props> = ({ closeModal }) => {
  const customAlert = useRef<React.ElementRef<typeof ActionModal>>(null);
  const textInput = useRef<TextInput>(null);
  const loadingRef = useRef<LoadingRefObject>(null);
  const { theme } = useContext(ThemeContext);
  const { user, updateUser } = useContext(UserContext);
  const [name, setName] = useState(user.display_name);
  const [image, setImage] = useState(user.avatarUrl);
  const [croppedImage, setCroppedImage] = useState<UserAvatar>();

  let styles = useMemo(() => setStyles(theme), [theme]);

  const onSave = useCallback(async () => {
    textInput.current?.blur();
    if (name && name !== user.display_name) {
      let response: { unique: boolean } = await userService.isNameUnique(name);

      if (response.unique) {
        userService.updateUserDetails(null, name);
        updateUser({ ...user, display_name: name });
        closeModal();
      } else {
        customAlert.current?.toggle(
          'Something went wrong.',
          'Username is already used.'
        );
      }
    }
    if (croppedImage?.uri) {
      let res: UpdateAvatarResponse = await userService.updateAvatar(
        croppedImage
      );

      if (res.success) {
        let r = await userService.updateUserDetails(res.data?.[0]?.url);
        updateUser({ ...user, avatarUrl: res.data?.[0]?.url });
      } else {
        customAlert.current?.toggle(
          'Something went wrong.',
          res.errors?.[0]?.detail
        );
      }
    }
  }, [name, croppedImage, customAlert.current]);

  const handleChoosePhoto = useCallback(async () => {
    // if (!this.context.isConnected) {
    //   return this.context.showNoConnectionAlert();
    // }
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      maxHeight: 300,
      maxWidth: 300
    };
    loadingRef.current?.toggleLoading(true);
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response?.assets?.[0]?.uri) {
        ImagePicker.openCropper({
          path: response?.assets?.[0]?.uri,
          width: 300,
          height: 300,
          mediaType: 'photo'
        })
          .then(async image => {
            loadingRef.current?.toggleLoading(false);
            if (image) {
              setImage(image.path);
              const croppedImg = {
                fileName: 'avatar',
                type: image.mime,
                uri: image.path
              };
              setCroppedImage(croppedImg);
            }
          })
          .catch(error => {
            loadingRef.current?.toggleLoading(false);
          });
      } else {
        customAlert.current?.toggle(
          'Something went wrong',
          response.errorMessage || ''
        );
        loadingRef.current?.toggleLoading(false);
      }
    });
  }, [image, loadingRef.current, customAlert.current]);

  return (
    <Modal
      transparent={true}
      visible={true}
      onRequestClose={closeModal}
      supportedOrientations={['portrait', 'landscape']}
    >
      <TouchableOpacity
        testID='modalBackground'
        style={styles.modalBackground}
        onPress={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={utils.isiOS ? 'padding' : undefined}
        >
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>

          <Image source={{ uri: image }} style={styles.profilePic} />
          <TouchableOpacity
            style={styles.changePhotoBtn}
            onPress={handleChoosePhoto}
          >
            <Text style={styles.changePhotoBtnText}>CHANGE PHOTO</Text>
          </TouchableOpacity>
          <TextInput
            ref={textInput}
            value={name}
            style={styles.textInput}
            onChangeText={text => setName(text)}
          />
          <Text
            style={styles.detail}
          >{`This could be your first name or a nickname. It's how you'll appear on ${
            utils.brand.charAt(0).toUpperCase() + utils.brand.slice(1)
          }`}</Text>
        </KeyboardAvoidingView>
      </TouchableOpacity>
      <ActionModal
        ref={customAlert}
        onCancel={() => customAlert.current?.toggle('', '')}
      />
      <Loading ref={loadingRef} />
    </Modal>
  );
};

let setStyles = (theme: string, current = themeStyles[theme]) =>
  StyleSheet.create({
    modalBackground: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,.8)'
    },
    container: {
      padding: 10,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      marginTop: 20,
      flex: 1,
      backgroundColor: current.background
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    cancelBtnText: {
      color: current.textColor,
      fontFamily: 'OpenSans-Bold',
      fontSize: 14
    },
    headerTitle: {
      color: current.textColor,
      fontFamily: 'OpenSans-Bold',
      fontSize: 16
    },
    saveBtnText: {
      color: utils.color,
      fontFamily: 'OpenSans-Bold',
      fontSize: 14
    },
    profilePic: {
      height: 200,
      aspectRatio: 1,
      borderRadius: 100,
      marginTop: 40,
      alignSelf: 'center'
    },
    changePhotoBtn: {
      backgroundColor: current.borderColor,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      marginTop: 20,
      alignSelf: 'center'
    },
    changePhotoBtnText: {
      color: current.textColor,
      fontFamily: 'RobotoCondensed-Bold',
      fontSize: 12,
      paddingVertical: 5,
      paddingHorizontal: 20
    },
    textInput: {
      fontFamily: 'OpenSans-Bold',
      fontSize: 30,
      color: current.textColor,
      borderBottomColor: current.contrastTextColor,
      borderBottomWidth: 1,
      textAlign: 'center'
    },
    detail: {
      fontFamily: 'OpenSans',
      fontSize: 12,
      color: current.contrastTextColor,
      textAlign: 'center',
      marginTop: 10
    }
  });
