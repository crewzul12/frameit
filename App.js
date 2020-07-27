import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FrameItLogo from './assets/icons/frame-it-logo.svg';
import SearchIcon from './assets/icons/search.svg';
import EditIcon from './assets/icons/edit.svg';
import SplashScreen from 'react-native-splash-screen';
import Modal from 'react-native-modal';
import styles from './App.scss';
import DiscoverFrame from './src/components/DiscoverFrame';
import {PERMISSIONS, request, requestMultiple} from 'react-native-permissions';
import FramePreview from './src/components/FramePreview';
import AdjustPicture from './src/components/AdjustPicture';
import SaveImage from './src/components/SaveImage';
import {
  HMSBanner,
  BannerAdSizes,
  ContentClassification,
  Gender,
  NonPersonalizedAd,
  TagForChild,
  UnderAge,
} from 'react-native-hms-ads';
import haSDK from 'react-native-ha-interface';
import Update from "./Update";

// Compile the haOnEvent function to call the onEvent API in the SDK.
// eventObj is the parameter object contained in the custom event that you want to upload. The parameter can be of the string, number, and bool types.
function haOnEvent() {
  const eventObj = {
    testString: 'StrContent',
    testInt: 20,
    testDouble: 2.2,
    testBoolean: false,
  };
  haSDK.onEvent('newTestEvent', eventObj);
}
const Stack = createStackNavigator();
const Home = ({navigation}) => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const toggleModalOff = () => setIsModalVisible(false);
  const onPressDiscoverFrame = () => navigation.navigate('DiscoverFrame');
  useEffect(() => {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    let mounted = true;
    if (mounted) {
      requestMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ]);
      requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]);
      SplashScreen.hide();
    }
    return function cleanup() {
      mounted = false;
    };
  });
  useEffect(() => {
    haOnEvent();
  }, [])
  return (
    <View style={styles.outerContainer}>
      <View style={styles.spaceMainContentAndFooter}>
        <View style={[styles.adsBanner, stylesPlus.addBannerShadow]}>
          <HMSBanner
            style={{height: 100}}
            bannerAdSize={{
              bannerAdSize: BannerAdSizes.B_PORTRAIT,
              width: 300,
            }}
            adId="a30mm2xhrq" // <== your ad slot id goes here
            adParam={{
              // specific ads for special ad audience
              adContentClassification:
                ContentClassification.AD_CONTENT_CLASSIFICATION_UNKOWN,
              gender: Gender.UNKNOWN,
              nonPersonalizedAd: NonPersonalizedAd.ALLOW_ALL,
              tagForChildProtection:
                TagForChild.TAG_FOR_CHILD_PROTECTION_UNSPECIFIED,
              tagForUnderAgeOfPromise: UnderAge.PROMISE_UNSPECIFIED,
            }}
            onAdLoaded={(e) => {
              console.log('HMSBanner onAdLoaded', e.nativeEvent);
            }}
            onAdFailed={(e) => {
              console.warn('HMSBanner onAdFailed', e.nativeEvent);
            }}
            onAdOpened={(e) => console.log('HMSBanner onAdOpened')}
            onAdClicked={(e) => console.log('HMSBanner onAdClicked')}
            onAdClosed={(e) => console.log('HMSBanner onAdClosed')}
            onAdImpression={(e) => console.log('HMSBanner onAdImpression')}
            onAdLeave={(e) => console.log('HMSBanner onAdLeave')}
          />
        </View>
        <View style={styles.alignAppNameAndLogo}>
          <Text style={styles.appNameHeaderText}>Frame-It!</Text>
          <FrameItLogo width="50%" height="50%" style={styles.frameItLogo} />
          <Update />
        </View>
        <View style={styles.alignButtons}>
          <View style={styles.alignButtonWithText}>
            <TouchableOpacity
              style={styles.searchIconButton}
              onPress={onPressDiscoverFrame}>
              <SearchIcon
                width={45}
                height={45}
                fill="#F8FAFD"
                stroke="#707070"
                strokeWidth={2}
              />
            </TouchableOpacity>
            <Text style={styles.searchIconText}>Discover Frame</Text>
          </View>
          <View style={styles.alignButtonWithText}>
            <TouchableOpacity style={styles.editIconButton}>
              <EditIcon
                width={45}
                height={45}
                fill="#F8FAFD"
                stroke="#707070"
                strokeWidth={2}
              />
            </TouchableOpacity>
            <Text style={styles.editIconText} numberOfLines={2}>
              Edit Photo {'\n'} (Coming soon!)
            </Text>
          </View>
        </View>
      </View>
      <Modal
        style={[styles.modalFooter, stylesPlus.footerShadow]}
        hideModalContentWhileAnimating={true}
        coverScreen={false}
        hasBackdrop={false}
        supportedOrientations={['portrait', 'landscape']}
        isVisible={isModalVisible}>
        <View style={styles.alignFooterTextAndButton}>
          <Text style={styles.footerStatementText}>
            We value your privacy. We do not save any information about our
            users.
          </Text>
          <TouchableOpacity
            style={styles.buttonFooter}
            onPress={toggleModalOff}>
            <Text style={styles.buttonFooterText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const App = () => {
  useEffect(() => {
    haOnEvent();
  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DiscoverFrame"
          component={DiscoverFrame}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FramePreview"
          component={FramePreview}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AdjustPicture"
          component={AdjustPicture}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SaveImage"
          component={SaveImage}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const stylesPlus = StyleSheet.create({
  addBannerShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.3,
    elevation: 13,
  },
  footerShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export default App;
