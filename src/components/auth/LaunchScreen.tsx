import { useNavigation } from '@react-navigation/core';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamListBase } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNIap from 'react-native-iap';
import { Gradient } from '../../common_components/Gradient';
import { utils } from '../../utils';
import { authenticate, validatePreSignup } from '../../services/auth.service';
import type { AuthenticateResponse } from '../../interfaces/service.interfaces';
import { ActionModal } from '../../common_components/modals/ActionModal';
import { ConnectionContext } from '../../state/connection/ConnectionContext';
import { OrientationContext } from '../../state/orientation/OrientationContext';

export const LaunchScreen: React.FC = () => {
  const { isConnected, showNoConnectionAlert } = useContext(ConnectionContext);
  const { isLandscape } = useContext(OrientationContext);
  const [loading, setLoading] = useState(true);

  const { navigate } = useNavigation<StackNavigationProp<ParamListBase>>();
  let { bottom } = useSafeAreaInsets();
  if (!bottom) bottom = 20;

  const leftAnim = useRef(new Animated.Value(0)).current;

  const warningRef = useRef<React.ElementRef<typeof ActionModal>>(null);
  const scrollview = useRef<ScrollView>(null);
  const activeIndex = useRef(0);
  const scrollviewWidth = useRef(0);

  useEffect(() => {
    new Promise(res => RNIap.initConnection().then(res).catch(res)).then(
      async () => {
        try {
          if (utils.isiOS) await RNIap.clearTransactionIOS();
          else await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
        } catch (e) {}
        login();
      }
    );
    return () => {
      RNIap.endConnection();
    };
  }, []);

  const login = () =>
    authenticate()
      .then(auth => {
        if (auth?.token) {
          if (canNavigateHome(auth)) navigate('home');
          else if (canNavigatePacks(auth)) navigate('packs');
          else if (auth?.isEdgeExpired) {
          }
        } else warningRef.current?.toggle(auth.title, auth.message);
        setLoading(false);
      })
      .catch(e => {
        if (!isConnected) {
          // TBD
          navigate('downloads');
        } else if (e.message !== 'login needed') warningRef.current?.toggle();
        setLoading(false);
      });

  const animateIndicator = (toValue: number, duration = 0) =>
    Animated.timing(leftAnim, {
      toValue,
      duration,
      useNativeDriver: true
    }).start();

  const onLogin = () => {
    if (!isConnected) return showNoConnectionAlert();
    navigate('login');
  };

  const onSignup = async () => {
    if (!isConnected) return showNoConnectionAlert();
    setLoading(true);
    try {
      let subsHistory = (await RNIap.getPurchaseHistory()).filter(h =>
        utils.subscriptionsSkus.includes(h.productId)
      );
      if (!subsHistory?.length) navigate('subscriptions');
      else {
        let a = await validatePreSignup(
          utils.isiOS
            ? subsHistory
            : subsHistory.map(p => ({
                purchase_token: p.purchaseToken,
                package_name: 'com.drumeo',
                product_id: p.productId
              }))
        );
        let { shouldSignup, shouldRenew, message } = a;
        if (message) warningRef.current?.toggle('', message);
        if (shouldSignup) {
          navigate('subscriptions');
        } else if (shouldRenew) {
          navigate('subscriptions', { renew: true });
        } else {
          // TBD
        }
      }
    } catch (e: any) {
      warningRef.current?.toggle('', e.message);
    }
    setLoading(false);
  };

  return (
    <View style={{ backgroundColor: utils.color, flex: 1 }}>
      <StatusBar backgroundColor={utils.color} barStyle={'light-content'} />
      {loading ? (
        <View style={styles.loadingContainer}>
          {utils.svgBrand({ icon: { width: '80%', fill: 'white' } })}
          <Text style={styles.loginBrandMsgTxt}>{utils.loginBrandMsg}</Text>
          <ActivityIndicator
            animating={true}
            size={'large'}
            color={'white'}
            style={styles.loadingIndicator}
          />
        </View>
      ) : (
        <>
          <ScrollView
            ref={scrollview}
            bounces={false}
            horizontal={true}
            pagingEnabled={true}
            contentContainerStyle={{
              width: `${utils.launchScreens.length}00%`
            }}
            showsHorizontalScrollIndicator={false}
            onLayout={({ nativeEvent: { layout } }) =>
              scrollview.current?.scrollTo({
                x:
                  activeIndex.current *
                  (scrollviewWidth.current = layout.width),
                animated: false
              })
            }
            onMomentumScrollEnd={({ nativeEvent: { contentOffset } }) =>
              animateIndicator(
                (activeIndex.current =
                  contentOffset.x / scrollviewWidth.current) * 15,
                200
              )
            }
          >
            {utils.launchScreens.map(s => (
              <View key={s.bold} style={{ flex: 1 }}>
                {!!s.jpg && (
                  <ImageBackground
                    source={s.jpg}
                    resizeMode={'cover'}
                    style={{ flex: 1, justifyContent: 'flex-end' }}
                  >
                    <Gradient
                      key={`${isLandscape}`}
                      colors={['transparent', utils.color]}
                      height={'50%'}
                      width={'100%'}
                    />
                    <Image
                      source={s.png}
                      resizeMode={'contain'}
                      style={styles.pngImg}
                    />
                  </ImageBackground>
                )}
                <View
                  style={{
                    flex: 0.5,
                    alignItems: 'center',
                    justifyContent: s.jpg ? 'flex-start' : 'center'
                  }}
                >
                  <Text
                    style={[styles.txt, { fontWeight: '700', fontSize: 30 }]}
                  >
                    {s.bold}
                  </Text>
                  <Text style={styles.txt}>{s.normal}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.indicatorContainer}>
            <Animated.View
              style={[
                styles.indicator,
                {
                  left: 0,
                  backgroundColor: 'white',
                  position: 'absolute',
                  transform: [{ translateX: leftAnim }]
                }
              ]}
            />
            {[...new Array(5)].map((_, i) => (
              <View key={i} style={styles.indicator} />
            ))}
          </View>
          <View style={[styles.tOpacityContainer, { paddingBottom: bottom }]}>
            <TouchableOpacity
              onPress={onLogin}
              style={[styles.tOpacity, { marginHorizontal: bottom }]}
            >
              <Text style={styles.tOpacityTxt}>LOG IN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSignup}
              style={[
                styles.tOpacity,
                { backgroundColor: 'white', marginRight: bottom }
              ]}
            >
              <Text style={[styles.tOpacityTxt, { color: utils.color }]}>
                SIGN UP
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <ActionModal
        ref={warningRef}
        onAction={() => warningRef.current?.toggle()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  loadingIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  loginBrandMsgTxt: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'OpenSans',
    textAlign: 'center'
  },
  pngImg: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '25%'
  },
  txt: {
    paddingHorizontal: 50,
    color: 'white',
    fontFamily: 'OpenSans',
    fontSize: 20,
    textAlign: 'center'
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  indicator: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 99,
    margin: 2.5
  },
  tOpacityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    maxWidth: 700,
    alignSelf: 'center'
  },
  tOpacity: {
    borderWidth: 1,
    borderColor: 'white',
    padding: 15,
    flex: 1,
    alignItems: 'center',
    borderRadius: 99
  },
  tOpacityTxt: {
    fontFamily: 'RobotoCondensed-Regular',
    fontWeight: '700',
    color: 'white'
  }
});

const canNavigateHome = ({ isEdge, isEdgeExpired }: AuthenticateResponse) =>
  isEdge && !isEdgeExpired;
const canNavigatePacks = ({ isPackOlyOwner }: AuthenticateResponse) =>
  isPackOlyOwner;
