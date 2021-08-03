import React, { useContext, useEffect, useReducer, useRef } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Banner } from '../commons/Banner';

import { CardsContext } from '../state/CardsContext';

import { provider } from '../services/catalogueSceneProvider.service';
import {
  ADD_COMBINED,
  ADD_COMBINED_AND_CACHE,
  catalogueReducer,
  UPDATE_CATALOGUE
} from '../state/catalogue/reducer';
import { ThemeContext } from '../state/ThemeContext';
import { themeStyles } from '../themeStyles';
import { UserContext } from '../state/UserContext';
import { utils } from '../utils';
import { Carousel } from './Carousel';
import { Filters } from './Filters';
import { Sort } from '../commons/Sort';

interface Props {
  scene: string;
}

export const Catalogue: React.FC<Props> = ({ scene }) => {
  const hasMethodBanner = scene.match(/^(home)$/),
    hasUserInfo = scene.match(/^(home)$/);

  const { user } = useContext(UserContext);
  const { addCardsAndCache, updateCard } = useContext(CardsContext);
  const { theme } = useContext(ThemeContext);
  let styles = setStyles(theme);

  const [
    {
      method,
      recentlyViewed,
      inProgress,
      newContent,
      all,
      loadingMore,
      refreshing
    },
    dispatch
  ] = useReducer(catalogueReducer, {
    loadingMore: false,
    refreshing: true
  });

  const isMounted = useRef(true);
  const abortC = useRef(new AbortController());
  const page = useRef(1);

  useEffect(() => {
    styles = setStyles(theme);
  }, [theme]);

  useEffect(() => {
    isMounted.current = true;
    abortC.current = new AbortController();
    provider[scene]?.getCache?.().then(cache => {
      if (isMounted.current) dispatch({ type: ADD_COMBINED, scene, ...cache });
    });
    provider[scene]
      ?.getCombined?.({ page: page.current, signal: abortC.current.signal })
      .then(([all, newContent, inProgress, recentlyViewed, method]) => {
        if (isMounted.current) {
          addCardsAndCache(all?.data);
          dispatch({
            type: ADD_COMBINED_AND_CACHE,
            scene,
            method,
            all: all?.data,
            inProgress: inProgress?.data,
            recentlyViewed: recentlyViewed?.data,
            newContent: newContent?.data,
            refreshing: false
          });
        }
      });
    return () => {
      isMounted.current = false;
      abortC.current.abort();
    };
  }, []);

  const renderFLMethodBanner = () => (
    <Banner {...method} onRightBtnPress={() => {}} onLeftBtnPress={() => {}} />
  );

  const renderCarousel = (items: number[] | undefined, title: string) =>
    items?.length ? (
      <>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Carousel items={items} />
      </>
    ) : null;

  const renderFLHeader = () => (
    <>
      {!!hasMethodBanner && renderFLMethodBanner()}
      {!!hasUserInfo ? (
        <View style={styles.userInfoContainer}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatarImg} />
          <Text style={styles.userStatsTitle}>
            XP{`\n`}
            <Text style={styles.userStatsValue}>{user.totalXp}</Text>
          </Text>
          <Text style={styles.userStatsTitle}>
            {utils.brand} METHOD{`\n`}
            <Text style={styles.userStatsValue}>{user.xpRank}</Text>
          </Text>
        </View>
      ) : (
        <Text style={styles.sceneTitle}>{scene}</Text>
      )}
      {!!recentlyViewed?.length ? (
        renderCarousel(recentlyViewed, 'Recently Viewed')
      ) : (
        <>
          {renderCarousel(inProgress, 'Continue')}
          {renderCarousel(newContent, 'New Lessons')}
        </>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 5
        }}
      >
        <Text style={styles.sectionTitle}>All Lessons</Text>
        <Sort onPress={() => {}} />
        <Filters onPress={() => {}} />
      </View>
    </>
  );

  const renderFLItem = ({ item: {} }) => (
    <View style={{ height: 50, backgroundColor: 'red', marginVertical: 5 }} />
  );

  const renderFLEmpty = () => (
    <Text style={styles.emptyListText}>There is no content.</Text>
  );

  const renderFLFooter = () => (
    <ActivityIndicator
      size='small'
      color={utils.color}
      animating={loadingMore}
      style={{ padding: 15 }}
    />
  );

  const renderFLRefreshControl = () => (
    <RefreshControl
      colors={['white']}
      tintColor={utils.color}
      progressBackgroundColor={utils.color}
      onRefresh={refresh}
      refreshing={!!refreshing}
    />
  );

  const refresh = () => {};

  const loadMore = () => {
    dispatch({ type: UPDATE_CATALOGUE, scene, loadingMore: true });
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={all}
        renderItem={renderFLItem}
        keyExtractor={id => id.toString()}
        ListHeaderComponent={renderFLHeader()}
        ListEmptyComponent={renderFLEmpty()}
        ListFooterComponent={renderFLFooter()}
        refreshControl={renderFLRefreshControl()}
        onEndReached={loadMore}
      />
    </SafeAreaView>
  );
};

const setStyles = (theme: string, current = themeStyles[theme]) =>
  StyleSheet.create({
    container: {
      backgroundColor: current.background,
      flex: 1
    },
    sceneTitle: {
      color: current.textColor,
      fontFamily: 'OpenSans',
      fontSize: utils.figmaFontSizeScaler(30),
      fontWeight: '800',
      textTransform: 'capitalize',
      paddingLeft: 5
    },
    userInfoContainer: {
      flexDirection: 'row',
      padding: 20,
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: current.contrastBackground
    },
    avatarImg: {
      width: 60,
      aspectRatio: 1,
      borderRadius: 32,
      borderWidth: 2,
      borderColor: utils.color
    },
    userStatsTitle: {
      color: current.contrastTextColor,
      fontSize: utils.figmaFontSizeScaler(11),
      fontFamily: 'OpenSans',
      textTransform: 'uppercase',
      textAlign: 'center'
    },
    userStatsValue: {
      color: current.textColor,
      fontSize: utils.figmaFontSizeScaler(26),
      fontWeight: '800'
    },
    sectionTitle: {
      fontSize: utils.figmaFontSizeScaler(20),
      fontFamily: 'OpenSans',
      fontWeight: '700',
      color: current.textColor,
      marginVertical: 20,
      flex: 1
    },
    emptyListText: {
      padding: 20,
      textAlign: 'center',
      color: current.textColor
    }
  });
