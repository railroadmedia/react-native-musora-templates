import React, {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { ThemeContext } from '../state/theme/ThemeContext';
import { utils } from '../utils';
import { themeStyles } from '../themeStyles';
import { NextLesson } from '../commons/NextLesson';
import { methodService } from '../services/method.service';
import { CardsContext } from '../state/cards/CardsContext';
import type { ILevel, IMethodCourse } from '../state/method/MethodInterfaces';
import { LibraryCard } from '../commons/cards/LibraryCard';
import { LevelBanner } from './LevelBanner';
import ActionModal from '../commons/modals/ActionModal';
import { userService } from '../services/user.service';

interface ILevelProps {
  mobile_app_url: string;
}

export const Level: React.FC<ILevelProps> = ({ mobile_app_url }) => {
  const { theme } = useContext(ThemeContext);
  const { addCards } = useContext(CardsContext);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [level, setLevel] = useState({} as ILevel);
  const [refreshing, setRefreshing] = useState(false);
  const isMounted = useRef(true);
  const abortC = useRef(new AbortController());

  let styles = setStyles(theme);
  useEffect(() => {
    styles = setStyles(theme);
  }, [theme]);

  useEffect(() => {
    isMounted.current = true;
    abortC.current = new AbortController();
    getLevel();
    return () => {
      isMounted.current = false;
      abortC.current.abort();
    };
  }, []);

  const getLevel = (): Promise<void> =>
    methodService
      .getLevel(mobile_app_url, abortC.current.signal)
      .then(levelRes => {
        if (isMounted.current) {
          const castLevel: ILevel = levelRes as ILevel;
          addCards([castLevel.next_lesson]);
          addCards(castLevel.courses);
          setLevel(castLevel);
          setRefreshing(false);
        }
      });

  const refresh = () => {
    abortC.current.abort();
    abortC.current = new AbortController();
    setRefreshing(true);
    getLevel();
  };

  const toggleMyList = useCallback(() => {
    if (level) {
      if (level.is_added_to_primary_playlist) {
        if (showRemoveModal) {
          userService.removeFromMyList(level.id);
          setShowRemoveModal(false);
          setLevel({ ...level, is_added_to_primary_playlist: false });
        } else {
          setShowRemoveModal(true);
        }
      } else {
        userService.addToMyList(level.id);
        setLevel({ ...level, is_added_to_primary_playlist: true });
      }
    }
  }, [level.is_added_to_primary_playlist, showRemoveModal]);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={themeStyles[theme].background}
        barStyle={theme === 'DARK' ? 'light-content' : 'dark-content'}
      />
      {!!level?.id ? (
        <React.Fragment>
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                colors={[utils.color]}
                tintColor={utils.color}
              />
            }
          >
            <LevelBanner
              {...level}
              is_added_to_primary_playlist={level.is_added_to_primary_playlist}
              onToggleMyList={toggleMyList}
              onMainBtnPress={() => {}}
            />
            <View style={styles.container}>
              {!level.courses?.length && (
                <Text style={styles.emptyText}>There are no courses</Text>
              )}
              {level.courses.map((c: IMethodCourse) => (
                <LibraryCard
                  key={c.id}
                  item={c}
                  subtitle={`Level ${c.level_rank}`}
                  onBtnPress={() => {}}
                />
              ))}
            </View>
          </ScrollView>
          {level.next_lesson && (
            <NextLesson
              item={level.next_lesson.id}
              text={`METHOD - ${level.progress_percent.toFixed(2)}% COMPLETE `}
              progress={level.progress_percent}
            />
          )}
        </React.Fragment>
      ) : (
        <ActivityIndicator
          size={'large'}
          style={{ flex: 1 }}
          color={utils.color}
        />
      )}
      {showRemoveModal && (
        <ActionModal
          title='Hold your horses...'
          message={`This will remove this lesson from\nyour list and cannot be undone.\nAre you sure about this?`}
          btnText='REMOVE'
          onAction={toggleMyList}
          onCancel={() => setShowRemoveModal(false)}
        />
      )}
    </View>
  );
};

const setStyles = (theme: string, current = themeStyles[theme]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: current.background
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 100,
      color: utils.color,
      height: '100%',
      fontSize: 14,
      fontFamily: 'OpenSans'
    }
  });
