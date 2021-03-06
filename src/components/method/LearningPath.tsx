import React, { useContext, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image
} from 'react-native';
import { MethodBanner } from '../../common_components/MethodBanner';
import { utils } from '../../utils';
import { themeStyles } from '../../themeStyles';
import { getImageUri } from '../../common_components/cards/cardhelpers';
import { Gradient } from '../../common_components/Gradient';
import { ThemeContext } from '../../state/theme/ThemeContext';
import type {
  Foundation,
  Level,
  Method,
  Unit
} from '../../interfaces/method.interfaces';
import { UserContext } from '../../state/user/UserContext';
import { completedCircle, inProgressCircle } from '../../images/svgs';

const window = Dimensions.get('window');
let windowW = window.width < window.height ? window.width : window.height;

interface Props {
  learningPath: Method | Foundation;
  onCardPress: (url: string, published_on: string) => void;
}

export const LearningPath: React.FC<Props> = ({
  learningPath,
  onCardPress
}) => {
  const { theme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  const styles = useMemo(() => setStyles(theme), [theme]);

  const renderCard = (l: Level, index: number) => {
    return (
      <TouchableOpacity
        key={l.id}
        onPress={() => onCardPress(l.mobile_app_url, l.published_on)}
        style={styles.levelBtn}
      >
        <ImageBackground
          resizeMethod='resize'
          imageStyle={{ borderRadius: 5 }}
          source={{
            uri: getImageUri(l.thumbnail_url, l.published_on, 'method')
          }}
          style={{ aspectRatio: 1, width: windowW / 4 }}
        >
          {new Date(l.published_on) < new Date() && (
            <View style={styles.gradientContainer}>
              <Gradient
                colors={[
                  'transparent',
                  'transparent',
                  utils.getColorWithAlpha(0.6),
                  utils.color
                ]}
                height={'100%'}
                width={'100%'}
              />
            </View>
          )}
          <View style={styles.greyBackground}>
            <Text style={styles.levelOverImg}>LEVEL {index + 1}</Text>
            <View
              style={[
                styles.progressOverlay,
                {
                  backgroundColor:
                    l.progress_percent === 100
                      ? 'rgba(11, 118, 219, .5)'
                      : l.progress_percent > 0
                      ? 'rgba(0, 0, 0, .5)'
                      : 'transparent'
                }
              ]}
            >
              {l.progress_percent === 100
                ? completedCircle({
                    icon: {
                      fill: '#ffffff',
                      width: windowW / 10,
                      height: windowW / 10
                    }
                  })
                : l.progress_percent > 0
                ? inProgressCircle({
                    icon: {
                      fill: '#ffffff',
                      width: windowW / 10,
                      height: windowW / 10
                    }
                  })
                : null}
            </View>
          </View>
        </ImageBackground>

        <View style={styles.instructorContainer}>
          {!!l.instructor && (
            <Text
              numberOfLines={1}
              style={styles.artist}
              ellipsizeMode={'tail'}
            >
              {l.instructor
                .map(i => i.name)
                .join(', ')
                .toUpperCase()}
            </Text>
          )}
          {!!l.title && (
            <Text
              numberOfLines={1}
              style={[
                styles.levelTitle,
                {
                  color:
                    new Date(l.published_on) < new Date()
                      ? themeStyles[theme].textColor
                      : themeStyles[theme].contrastTextColor
                }
              ]}
            >
              {l.title}
            </Text>
          )}
          {!!l.description && (
            <Text style={styles.levelDescription} numberOfLines={3}>
              {l.description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <React.Fragment>
      <MethodBanner {...learningPath} expandableInfo={true} />
      <View style={styles.container}>
        {(learningPath as Method).levels && (
          <View style={styles.profileContainer}>
            <Image
              style={styles.profilePicture}
              source={{ uri: user?.avatarUrl }}
            />
            <Text style={styles.levelText}>
              LEVEL {learningPath?.level_rank}
            </Text>
          </View>
        )}
        {(learningPath as Method)?.levels?.map((l: Level, index: number) =>
          renderCard(l, index)
        )}
        {(learningPath as Foundation)?.units?.map((l: Unit, index: number) =>
          renderCard(l, index)
        )}
      </View>
    </React.Fragment>
  );
};

const setStyles = (theme: string, current = themeStyles[theme]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: current.background
    },
    greyBackground: {
      width: '100%',
      height: '100%',
      borderRadius: 5,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,.5)'
    },
    levelOverImg: {
      color: 'white',
      textAlign: 'center',
      fontSize: utils.figmaFontSizeScaler(18),
      fontFamily: 'OpenSans-Bold'
    },
    progressOverlay: {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: 5,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center'
    },
    artist: {
      fontSize: utils.figmaFontSizeScaler(8),
      color: utils.color,
      fontFamily: 'OpenSans-Bold'
    },
    placeHolder: {
      position: 'absolute',
      height: '50%',
      bottom: 0,
      width: '100%'
    },
    levelBtn: {
      padding: 15,
      alignItems: 'center',
      flexDirection: 'row'
    },
    profilePicture: {
      height: 50,
      aspectRatio: 1,
      borderRadius: 25
    },
    profileContainer: {
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      paddingVertical: 15
    },
    levelText: {
      fontSize: utils.figmaFontSizeScaler(30),
      fontFamily: 'OpenSans-Bold',
      marginLeft: 10,
      color: current.textColor
    },
    levelTitle: {
      fontSize: utils.figmaFontSizeScaler(14),
      fontFamily: 'OpenSans-Bold'
    },
    levelDescription: {
      fontSize: utils.figmaFontSizeScaler(12),
      fontFamily: 'OpenSans',
      color: current.contrastTextColor
    },
    gradientContainer: {
      height: '100%',
      position: 'absolute',
      width: '100%',
      bottom: 0
    },
    instructorContainer: {
      flex: 1,
      paddingHorizontal: 10,
      justifyContent: 'center'
    }
  });
