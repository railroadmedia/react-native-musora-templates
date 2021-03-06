import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamListBase } from '@react-navigation/native';

import { ThemeContext } from '../../state/theme/ThemeContext';
import { CardsContext } from '../../state/cards/CardsContext';
import { MethodContext } from '../../state/method/MethodContext';
import { methodService } from '../../services/method.service';
import { utils } from '../../utils';
import { themeStyles } from '../../themeStyles';
import { ConnectionContext } from '../../state/connection/ConnectionContext';
import { LearningPath } from './LearningPath';
import { NextLesson } from '../../common_components/NextLesson';

export const Method: React.FC = () => {
  const { navigate } = useNavigation<StackNavigationProp<ParamListBase>>();

  const { theme } = useContext(ThemeContext);
  const { isConnected, showNoConnectionAlert } = useContext(ConnectionContext);

  const { addCards } = useContext(CardsContext);
  const { method, updateMethod } = useContext(MethodContext);

  const [refreshing, setRefreshing] = useState(false);

  const isMounted = useRef(true);
  const abortC = useRef(new AbortController());

  const styles = useMemo(() => setStyles(theme), [theme]);

  useEffect(() => {
    isMounted.current = true;
    abortC.current = new AbortController();
    setMethod();
    return () => {
      isMounted.current = false;
      abortC.current.abort();
    };
  }, []);

  const setMethod = () => {
    if (!isConnected) return showNoConnectionAlert();

    methodService.getMethod(abortC.current.signal).then(methodRes => {
      if (isMounted.current) {
        if (methodRes.next_lesson) addCards([methodRes.next_lesson]);
        setRefreshing(false);
        updateMethod(methodRes);
      }
    });
  };

  const refresh = (): void => {
    if (!isConnected) return showNoConnectionAlert();

    abortC.current.abort();
    abortC.current = new AbortController();
    setRefreshing(true);
    setMethod();
  };

  const onLevelPress = useCallback(
    (mobile_app_url: string, published_on: string): void => {
      if (!isConnected) return showNoConnectionAlert();

      if (new Date() > new Date(published_on)) {
        navigate('level', { mobile_app_url });
      }
    },
    [isConnected]
  );

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={themeStyles[theme].background}
        barStyle={theme === 'DARK' ? 'light-content' : 'dark-content'}
      />

      {method?.id ? (
        <React.Fragment>
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => refresh()}
                colors={[utils.color]}
                tintColor={utils.color}
              />
            }
          >
            <LearningPath learningPath={method} onCardPress={onLevelPress} />
          </ScrollView>
          {method?.next_lesson && (
            <NextLesson
              item={method.next_lesson.id}
              text={`METHOD - ${method?.progress_percent?.toFixed(
                2
              )}% COMPLETE`}
              progress={method.progress_percent || 0}
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
    </View>
  );
};

const setStyles = (theme: string, current = themeStyles[theme]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: current.background
    }
  });
