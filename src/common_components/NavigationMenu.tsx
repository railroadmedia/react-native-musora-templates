import React, {
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import {
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { x } from '../images/svgs';
import { ThemeContext } from '../state/theme/ThemeContext';
import { themeStyles } from '../themeStyles';
import { utils } from '../utils';
import { ConnectionContext } from '../state/connection/ConnectionContext';

const titles = [
  { title: 'Home', route: 'home' },
  { title: 'Method', route: 'method' },
  { title: 'Packs', route: 'packs' },
  { title: 'Courses', route: 'courses' },
  { title: 'Shows', route: 'shows' },
  { title: 'Songs', route: 'songs' },
  { title: 'Play-Alongs', route: 'playAlongs' },
  { title: 'Student Focus', route: 'studentFocus' },
  { title: 'Live', route: 'live' },
  { title: 'Schedule', route: 'scheduled' }
];

interface Props {
  activeButton: string;
}

export const NavigationMenu = forwardRef<{ toggle: () => void }, Props>(
  (props, ref) => {
    const { navigate } = useNavigation<
      NavigationProp<ReactNavigation.RootParamList> & {
        navigate: (scene: string, props?: {}) => void;
      }
    >();
    const { theme } = useContext(ThemeContext);
    const { isConnected, showNoConnectionAlert } =
      useContext(ConnectionContext);

    const styles = useMemo(() => setStyles(theme), [theme]);

    const [visible, setVisible] = useState(false);

    const toggleModal = useCallback(() => {
      setVisible(!visible);
    }, [visible]);

    useImperativeHandle(ref, () => ({
      toggle() {
        toggleModal();
      }
    }));

    const onNavigate = useCallback(
      (route: string) => {
        if (!isConnected) return showNoConnectionAlert();

        toggleModal();
        if (route === 'coachOverview') {
          navigate(route, { id: 281906 });
        } else {
          navigate(route);
        }
      },
      [toggleModal, isConnected]
    );

    const decideColor = useCallback(
      (page: string) => {
        if (props.activeButton === page) return utils.color;
        return themeStyles[theme].textColor;
      },
      [props.activeButton]
    );

    return (
      <Modal transparent={true} animationType='slide' visible={visible}>
        <SafeAreaView edges={['bottom']} style={styles.container}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.modalContentContainer}
          >
            {titles.map(
              ({ title, route }: { title: string; route: string }) => (
                <TouchableOpacity
                  key={title}
                  onPress={() => onNavigate(route)}
                  style={{ padding: 10 }}
                >
                  <Text
                    style={[styles.smallTitle, { color: decideColor(route) }]}
                  >
                    {title}
                  </Text>
                </TouchableOpacity>
              )
            )}
            <View style={styles.xBtn}>
              {x({
                icon: { height: 30, width: 30, fill: 'white' },
                onPress: toggleModal
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  }
);

const setStyles = (theme: string, current = themeStyles[theme]) =>
  StyleSheet.create({
    container: {
      backgroundColor: current.background,
      flex: 1
    },
    modalContentContainer: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    xBtn: {
      margin: 10,
      padding: 20,
      borderRadius: 35,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: utils.color
    },
    smallTitle: {
      fontSize: utils.figmaFontSizeScaler(24),
      fontFamily: 'OpenSans-Bold'
    }
  });
