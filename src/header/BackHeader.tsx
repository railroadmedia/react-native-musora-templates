import React, { useContext, useEffect, useRef } from 'react';
import { StyleSheet, Text, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { themeStyles, DARK } from '../themeStyles';
import { ThemeContext } from '../state/ThemeContext';

import { back, settings } from '../images/svgs';
import { utils } from '../utils';
import { HeaderContext } from '../state/Headercontext';

interface Props {
  onBack: Function;
  title: string;
  transparent?: boolean;
  onSettings?: Function;
}
export const BackHeader: React.FC<Props> = ({
  onBack,
  title,
  transparent,
  onSettings
}) => {
  const { updateHeaderNavHeight } = useContext(HeaderContext);
  const { theme } = useContext(ThemeContext);
  let styles = setStyles(theme);

  const isMounted = useRef(true);

  useEffect(() => {
    () => (isMounted.current = false);
  }, []);

  useEffect(() => {
    styles = setStyles(theme);
  }, [theme]);

  return (
    <SafeAreaView
      style={[
        styles.safeAreaContainer,
        transparent ? { backgroundColor: 'transparent' } : {}
      ]}
      edges={['top']}
      onLayout={({ nativeEvent }) =>
        updateHeaderNavHeight(nativeEvent.layout.height)
      }
    >
      <StatusBar
        backgroundColor={themeStyles[theme].background}
        barStyle={theme === DARK ? 'light-content' : 'dark-content'}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.title}>{title}</Text>
        {back({
          icon: { height: 20, fill: themeStyles[theme].headerNavColor },
          container: {
            paddingVertical: 7.5,
            paddingRight: 20
          },
          onPress: onBack
        })}
        {!!onSettings &&
          settings({
            icon: { height: 20, fill: themeStyles[theme].headerNavColor },
            container: { paddingVertical: 7.5, paddingLeft: 20 },
            onPress: onSettings
          })}
      </View>
    </SafeAreaView>
  );
};

let setStyles = (theme: string, current = themeStyles[theme]) =>
  StyleSheet.create({
    safeAreaContainer: {
      padding: 5,
      backgroundColor: current.background,
      justifyContent: 'center'
    },
    title: {
      color: current.textColor,
      fontFamily: 'OpenSans',
      fontSize: utils.figmaFontSizeScaler(16),
      fontWeight: '800',
      textTransform: 'capitalize',
      position: 'absolute',
      alignSelf: 'center',
      width: '100%',
      textAlign: 'center'
    }
  });
