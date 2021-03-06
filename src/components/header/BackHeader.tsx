import React, { useContext, useMemo } from 'react';
import { StyleSheet, Text, StatusBar, View } from 'react-native';

import { themeStyles, DARK } from '../../themeStyles';
import { ThemeContext } from '../../state/theme/ThemeContext';

import { back, settings } from '../../images/svgs';
import { utils } from '../../utils';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamListBase } from '@react-navigation/native';

interface Props {
  title: string;
  transparent?: boolean;
  settingsVisible?: boolean;
  textColor?: string;
  onBack?: () => void;
}
export const BackHeader: React.FC<Props> = ({
  title,
  transparent,
  settingsVisible,
  textColor,
  onBack
}) => {
  const { top, left, right } = useSafeAreaInsets();
  const { navigate, goBack } =
    useNavigation<StackNavigationProp<ParamListBase>>();

  const { theme } = useContext(ThemeContext);
  const styles = useMemo(() => setStyles(theme), [theme]);

  return (
    <View
      style={[
        styles.safeAreaContainer,
        transparent ? { backgroundColor: 'transparent' } : {},
        { paddingTop: top, paddingLeft: left, paddingRight: right }
      ]}
    >
      <StatusBar
        backgroundColor={themeStyles[theme].background}
        barStyle={theme === DARK ? 'light-content' : 'dark-content'}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.title, textColor ? { color: textColor } : {}]}>
          {title}
        </Text>
        {back({
          icon: {
            height: 20,
            fill: textColor ? textColor : themeStyles[theme].headerNavColor
          },
          container: {
            paddingVertical: 7.5,
            paddingRight: 20
          },
          onPress: onBack || goBack
        })}
        {!!settingsVisible &&
          settings({
            icon: {
              height: 20,
              fill: textColor ? textColor : themeStyles[theme].headerNavColor
            },
            container: { paddingVertical: 7.5, paddingLeft: 20 },
            onPress: () => navigate('settings')
          })}
      </View>
    </View>
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
      position: 'absolute',
      alignSelf: 'center',
      width: '100%',
      textAlign: 'center',
      textTransform: 'capitalize'
    }
  });
