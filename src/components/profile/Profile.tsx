import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { Gradient } from '../../common_components/Gradient';

import { userService } from '../../services/user.service';

import { ThemeContext } from '../../state/theme/ThemeContext';
import { UserContext } from '../../state/user/UserContext';

import { themeStyles } from '../../themeStyles';

import { utils } from '../../utils';

import { Notification } from './Notification';

import {
  profileReducer,
  SET_PROFILE,
  UPDATE_PROFILE
} from '../../state/profile/ProfileReducer';
import type { Notification as I_Notification } from '../../interfaces/notification.interfaces';
import { ProfileSettings } from './ProfileSettings';
import { ConnectionContext } from '../../state/connection/ConnectionContext';

export const Profile: React.FC = () => {
  const isMounted = useRef(true);
  const page = useRef(1);
  const abortC = useRef(new AbortController());
  const scrollY = useRef(new Animated.Value(0));

  const [flHeaderHeight, setFLHeaderHeight] = useState(0);
  const [headerNavHeight, setHeaderNavHeight] = useState(0);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const { user, updateUserAndCache } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const { isConnected, showNoConnectionAlert } = useContext(ConnectionContext);

  const [{ notifications, loadingMore, refreshing }, dispatchProfile] =
    useReducer(profileReducer, {
      notifications: [],
      loadingMore: false,
      refreshing: true
    });

  const styles = useMemo(() => setStyles(theme), [theme]);

  useEffect(() => {
    isMounted.current = true;
    page.current = 1;
    abortC.current = new AbortController();
    getProfile();
    return () => {
      isMounted.current = false;
      abortC.current.abort();
    };
  }, []);

  const getProfile = () => {
    if (!isConnected) return showNoConnectionAlert();

    Promise.all([
      userService.getUserDetails({}),
      userService.getNotifications({
        signal: abortC.current.signal,
        page: page.current++
      })
    ]).then(([userDetails, { data }]) => {
      if (isMounted.current) {
        updateUserAndCache(userDetails);
        dispatchProfile({
          type: SET_PROFILE,
          loadingMore: false,
          refreshing: false,
          notifications: data || []
        });
      }
    });
  };

  const getNotifications = () => {
    if (!isConnected) return showNoConnectionAlert();

    userService
      .getNotifications({ signal: abortC.current.signal, page: page.current++ })
      .then(({ data }) => {
        if (isMounted.current)
          dispatchProfile({
            type: UPDATE_PROFILE,
            loadingMore: false,
            refreshing: false,
            notifications: data || []
          });
      });
  };

  const showEditProfile = () => {
    setShowProfileSettings(!showProfileSettings);
  };

  const renderStickyHeader = () => (
    <View
      style={styles.stickyHeaderContainer}
      ref={r => {
        r?.measure((_, __, ___, ____, _____, pageY) =>
          setHeaderNavHeight(pageY || 0)
        );
      }}
    >
      <Animated.Image
        blurRadius={10}
        source={{ uri: user?.avatarUrl || utils.fallbackAvatar }}
        resizeMode={'cover'}
        style={{
          height: flHeaderHeight + headerNavHeight,
          width: '100%',
          position: 'absolute',
          marginTop: -headerNavHeight,
          transform: [
            {
              scale: scrollY.current.interpolate({
                inputRange: [-1000, 0],
                outputRange: [10, 1],
                extrapolate: 'clamp'
              })
            }
          ]
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          height: flHeaderHeight + headerNavHeight,
          width: '100%',
          backgroundColor: themeStyles[theme].background,
          marginTop: -headerNavHeight,
          transform: [
            {
              scale: scrollY.current.interpolate({
                inputRange: [-1000, 0],
                outputRange: [10, 1],
                extrapolate: 'clamp'
              })
            }
          ],
          opacity: scrollY.current.interpolate({
            inputRange: [0, flHeaderHeight],
            outputRange: [0.5, 1]
          })
        }}
      />
    </View>
  );

  const renderFLHeader = () => (
    <>
      <View
        style={{ alignItems: 'center' }}
        onLayout={({
          nativeEvent: {
            layout: { height }
          }
        }) => setFLHeaderHeight(height)}
      >
        <View style={styles.gradient}>
          <Gradient
            width='100%'
            height='100%'
            colors={['transparent', themeStyles[theme].background || '']}
          />
        </View>
        <Image
          source={{ uri: user?.avatarUrl || utils.fallbackAvatar }}
          resizeMode={'cover'}
          style={styles.avatar}
        />
        <Text style={styles.displayName}>{user?.display_name}</Text>
        <TouchableOpacity
          style={styles.editProfileTOpacity}
          onPress={showEditProfile}
        >
          <Text style={styles.editProfileTxt}>EDIT PROFILE</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.xpLabelContainer}>
        <Text style={styles.xpLabel}>XP</Text>
        <Text style={styles.xpLabel}>{utils.brand} METHOD</Text>
      </View>
      <View style={styles.xpValueContainer}>
        <Text style={styles.xpValue}>{user?.totalXp}</Text>
        <Text style={styles.xpValue}>{user?.xpRank}</Text>
      </View>
      <Text style={styles.notificationsHeader}>Notifications</Text>
      {showProfileSettings && (
        <ProfileSettings closeModal={() => setShowProfileSettings(false)} />
      )}
    </>
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

  const renderFLItem = ({ item }: { item: I_Notification }) => (
    <View style={{ backgroundColor: themeStyles[theme].background }}>
      <Notification {...item} />
    </View>
  );

  const renderFLFooter = () => (
    <ActivityIndicator
      size='small'
      color={utils.color}
      animating={loadingMore}
      style={{ padding: 15 }}
    />
  );

  const renderFLEmptyComponent = () => (
    <Text style={styles.emptyText}>You don't have any notifications</Text>
  );

  const refresh = () => {
    if (!isConnected) return showNoConnectionAlert();

    page.current = 1;
    dispatchProfile({ type: UPDATE_PROFILE, refreshing: true });
    getProfile();
  };

  const loadMore = () => {
    if (!isConnected) return showNoConnectionAlert();

    dispatchProfile({ type: UPDATE_PROFILE, loadingMore: true });
    getNotifications();
  };

  return (
    <>
      {renderStickyHeader()}
      <FlatList
        scrollEventThrottle={1}
        onScroll={({ nativeEvent }) =>
          Animated.timing(scrollY.current, {
            toValue: nativeEvent.contentOffset.y,
            duration: 0,
            useNativeDriver: true
          }).start()
        }
        showsVerticalScrollIndicator={false}
        windowSize={10}
        data={notifications}
        style={{ flex: 1 }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps='handled'
        renderItem={renderFLItem}
        keyExtractor={({ id }) => id.toString()}
        refreshControl={renderFLRefreshControl()}
        ListEmptyComponent={renderFLEmptyComponent()}
        ListHeaderComponent={renderFLHeader()}
        ListFooterComponent={renderFLFooter()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.01}
      />
    </>
  );
};

let setStyles = (theme: string, current = themeStyles[theme]) =>
  StyleSheet.create({
    stickyHeaderContainer: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      backgroundColor: current.background
    },
    gradient: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '50%'
    },
    avatar: {
      width: '50%',
      aspectRatio: 1,
      borderRadius: 999
    },
    displayName: {
      color: current.textColor,
      fontSize: utils.figmaFontSizeScaler(18),
      fontFamily: 'OpenSans',
      fontWeight: '700'
    },
    editProfileTOpacity: {
      backgroundColor: '#002039',
      padding: 5,
      paddingHorizontal: 20,
      borderRadius: 99,
      marginTop: 10,
      marginBottom: 40
    },
    editProfileTxt: {
      color: 'white',
      fontFamily: 'OpenSans',
      fontWeight: '700'
    },
    xpLabelContainer: {
      flexDirection: 'row',
      borderTopColor: current.borderColor,
      borderTopWidth: 1,
      paddingVertical: 20,
      backgroundColor: current.background
    },
    xpLabel: {
      textTransform: 'uppercase',
      color: utils.color,
      flex: 1,
      textAlign: 'center',
      fontFamily: 'OpenSans',
      fontWeight: '600',
      fontSize: utils.figmaFontSizeScaler(12)
    },
    xpValueContainer: {
      flexDirection: 'row',
      borderBottomColor: current.borderColor,
      borderBottomWidth: 1,
      paddingBottom: 20,
      backgroundColor: current.background
    },
    xpValue: {
      textTransform: 'uppercase',
      color: current.textColor,
      flex: 1,
      textAlign: 'center',
      fontFamily: 'RobotoCondensed-Regular',
      fontWeight: '700',
      fontSize: utils.figmaFontSizeScaler(24)
    },
    notificationsHeader: {
      color: current.textColor,
      fontFamily: 'OpenSans',
      fontWeight: '700',
      fontSize: utils.figmaFontSizeScaler(20),
      padding: 5,
      paddingTop: 40,
      backgroundColor: current.background
    },
    emptyText: {
      color: current.textColor,
      fontFamily: 'OpenSans',
      padding: 5,
      backgroundColor: current.background
    }
  });
