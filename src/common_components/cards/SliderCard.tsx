import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import type { Card } from '../../interfaces/card.interfaces';
import { CardsContext } from '../../state/cards/CardsContext';
import { ThemeContext } from '../../state/theme/ThemeContext';
import { themeStyles } from '../../themeStyles';
import { utils } from '../../utils';
import { decideSubtitle } from './cardhelpers';
import { CardIcon } from './CardIcon';
import { CardImage } from './CardImage';

const windowWidth = Dimensions.get('screen').width;

interface Props {
  id: number;
  route: string;
}

const SliderCard: React.FC<Props> = props => {
  const { id, route } = props;
  const { cards } = useContext(CardsContext);
  const item: Card = cards[id];

  const { theme } = useContext(ThemeContext);
  let styles = setStyles(theme);

  useEffect(() => {
    styles = setStyles(theme);
  }, [theme]);

  const onCardPress = useCallback(() => {}, []);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.cardContainer,
        { width: route === 'songs' ? windowWidth / 2.2 : (windowWidth * 3) / 4 }
      ]}
      onPress={onCardPress}
    >
      <View style={{ aspectRatio: route === 'songs' ? 1 : 16 / 9 }}>
        <CardImage size={50} {...item} route={route} />
      </View>
      <View style={styles.cardTextContainerBig}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>
            {item.title}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={styles.subtitle}
          >
            {decideSubtitle({ item, route })}
          </Text>
        </View>
        <CardIcon item={item} />
      </View>
    </TouchableOpacity>
  );
};

let setStyles = (theme: string, current = themeStyles[theme]) =>
  StyleSheet.create({
    cardContainer: {
      marginBottom: 20,
      paddingHorizontal: 10
    },
    cardTextContainerBig: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      color: current.textColor,
      fontSize: utils.figmaFontSizeScaler(14),
      fontFamily: 'OpenSans-Bold'
    },
    subtitle: {
      color: current.textColor,
      fontSize: utils.figmaFontSizeScaler(12),
      fontFamily: 'OpenSans'
    }
  });

export default SliderCard;