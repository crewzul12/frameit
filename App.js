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

// Admobs integration
import admob, { MaxAdContentRating, BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
const adUnitId = 'ca-app-pub-6535556449450935/1998103725';

// Test id
// const adUnitId = 'ca-app-pub-3940256099942544/6300978111';

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
      admob()
      .setRequestConfiguration({
        // Update all future requests suitable for parental guidance
        maxAdContentRating: MaxAdContentRating.PG,

        // Indicates that you want your content treated as child-directed for purposes of COPPA.
        tagForChildDirectedTreatment: true,

        // Indicates that you want the ad request to be handled in a
        // manner suitable for users under the age of consent.
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
        // Request config successfully set!
      });
      
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
  return (
    <View style={styles.outerContainer}>
      <View style={styles.spaceMainContentAndFooter}>
        <View style={[styles.adsBanner, stylesPlus.addBannerShadow]}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.FULL_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          
          //advert status log
          onAdLoaded={() => {
            console.log('Advert loaded');
          }}
          onAdFailedToLoad={(error) => {
            console.error('Advert failed to load: ', error);
          }}
        />
        </View>
        <View style={styles.alignAppNameAndLogo}>
          <Text style={styles.appNameHeaderText}>Frame-It!</Text>
          <FrameItLogo width="50%" height="50%" style={styles.frameItLogo} />
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
            We value your privacy. 
            We do not save any information about our users.
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
