import React from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';
import type { Card } from '../../interfaces/card.interfaces';
import { completedCircle, inProgressCircle, lock } from '../../images/svgs';
import { getImageUri } from './cardhelpers';

interface Props {
  item: Card;
  isLocked?: boolean;
  size: number;
  route: string;
}

export const CardImage: React.FC<Props> = ({ item, size, route, isLocked }) => {
  const { type, thumbnail_url, published_on, completed, progress_percent } =
    item || {};

  return (
    <View style={styles.imageContainer}>
      <ImageBackground
        resizeMethod='resize'
        imageStyle={{ borderRadius: 8 }}
        style={[
          styles.image,
          route === 'songs' ? { aspectRatio: 1 } : { aspectRatio: 16 / 9 }
        ]}
        source={{ uri: getImageUri(thumbnail_url, published_on, type) }}
      >
        {isLocked && (
          <View style={styles.lockOverlay}>
            {lock({
              icon: { height: 12, width: 12, fill: '#ffffff' }
            })}
          </View>
        )}
        {completed && <View style={styles.completedOverlay} />}

        {completed || progress_percent === 100
          ? completedCircle({
              icon: {
                height: size,
                width: size,
                fill: '#FFFFFF'
              }
            })
          : progress_percent && progress_percent !== 0
          ? inProgressCircle({
              icon: {
                height: size,
                width: size,
                fill: '#FFFFFF'
              }
            })
          : null}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    overflow: 'hidden',
    borderRadius: 8
  },
  image: {
    height: '100%',
    borderRadius: 8,
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  lockOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,.3)',
    height: '100%',
    width: '100%',
    alignItems: 'flex-end'
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(11, 118, 219, 0.2)',
    width: '100%',
    height: '100%'
  }
});
