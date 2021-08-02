import React, { useContext, useEffect } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { arrowRight, method, play } from '../images/svgs';
import { ThemeContext } from '../state/ThemeContext';
import { themeStyles } from '../themeStyles';
import { utils } from '../utils';
import { Gradient } from './Gradient';

interface Props {
  thumbnail_url?: string;
  onMainPress: Function;
  onMoreInfoPress: Function;
}

export const Banner: React.FC<Props> = ({
  thumbnail_url,
  onMainPress,
  onMoreInfoPress
}) => {
  const { theme } = useContext(ThemeContext);
  let styles = setStyles(theme);

  useEffect(() => {
    styles = setStyles(theme);
  }, [theme]);

  return (
    <ImageBackground
      style={styles.imageBackground}
      source={{
        uri: `https://cdn.musora.com/image/fetch/fl_lossy,q_auto:eco/${thumbnail_url}`
      }}
    >
      <View style={styles.gradientContainer}>
        <Gradient
          colors={[
            'transparent',
            utils.getColorWithAlpha(30),
            themeStyles[theme].background || ''
          ]}
          height={'100%'}
          width={'100%'}
        />
      </View>
      {utils.svgBrand({ icon: { width: '25%', fill: utils.color } })}
      {method({
        icon: { width: '60%', fill: 'white' },
        container: { paddingTop: 15 }
      })}
      <View style={styles.btnsContainer}>
        <TouchableOpacity
          onPress={() => onMainPress()}
          style={styles.btnTOpacity}
        >
          {play({
            icon: { height: 10, fill: 'white' },
            container: { paddingRight: 5 }
          })}
          <Text style={styles.btnText}>START</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onMoreInfoPress()}
          style={[styles.btnTOpacity, styles.btnTOpacityMoreInfo]}
        >
          {arrowRight({
            icon: { height: 10, fill: 'white' },
            container: { paddingRight: 5 }
          })}
          <Text style={styles.btnText}>MORE INFO</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const setStyles = (theme: string, current = themeStyles[theme]) =>
  StyleSheet.create({
    imageBackground: {
      width: '100%',
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
    gradientContainer: {
      height: '100%',
      position: 'absolute',
      width: '100%',
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)'
    },
    btnsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      paddingVertical: 15,
      paddingBottom: 50
    },
    btnTOpacity: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: utils.color,
      flex: 0.4,
      padding: 15,
      borderRadius: 99
    },
    btnTOpacityMoreInfo: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'white'
    },
    btnText: {
      fontSize: utils.figmaFontSizeScaler(14),
      color: 'white',
      fontFamily: 'RobotoCondensed-Regular',
      fontWeight: '700',
      textAlign: 'center'
    }
  });
