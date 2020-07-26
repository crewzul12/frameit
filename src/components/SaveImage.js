import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import BackButtonIcon from '../../assets/icons/angle-left.svg';
import styles from './SaveImage.scss';
import SaveIcon from '../../assets/icons/save.svg';
import ShareIcon from '../../assets/icons/share-alt.svg';
import CameraRoll from '@react-native-community/cameraroll';
import Modal from 'react-native-modal';
import Share from 'react-native-share';
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

function haOnEvent() {
  const eventObj = {
    testString: 'StrContent',
    testInt: 20,
    testDouble: 2.2,
    testBoolean: false,
  };
  haSDK.onEvent('newTestEvent', eventObj);
}
export default function SaveImage({route, navigation}) {
  const {uri, elementName} = route.params; // Receiver params from AdjustPicture component
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onPressSaveImage = () => {
    CameraRoll.save(uri) // Save image to gallery
      .then(() => {
        console.log('Image saved to gallery');
      })
      .catch((error) => {
        console.log(error);
      });
    setIsModalVisible(true); // show modal message
    console.log(uri);
  };
  const toggleModalOff = () => setIsModalVisible(false);
  const onPressAdjustPicture = () => navigation.navigate('AdjustPicture'); // Navigate to Adjust Picture page
  const onPressShare = () => {
    Share.open({
      message: `This is my picture that edited by me using Frame-It! app.`,
      title: 'Frame-It! Share Feature',
      subject: 'Frame-It! app feature',
      url: uri,
      showAppsToView: true,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };
  var date = new Date().getDate(); //Current Date
  var month = new Date().getMonth() + 1; //Current Month
  var year = new Date().getFullYear(); //Current Year
  var hours = new Date().getHours(); //Current Hours
  var min = new Date().getMinutes(); //Current Minutes
  var sec = new Date().getSeconds(); //Current Seconds
  useEffect(() => {
    haOnEvent();
  }, [])
  return (
    <View style={styles.outerContainer}>
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
      <View style={[styles.headerBar, stylesPlus.addBannerShadow]}>
        <BackButtonIcon
          width={25}
          height={39}
          fill="#DDE4EE"
          onPress={onPressAdjustPicture}
        />
        <Text style={styles.headerText}>Frame-It!</Text>
      </View>
      <View>
        <Text style={styles.saveAndShareText}>Save & Share</Text>
      </View>
      <View style={[stylesPlus.addFrameShadow, styles.cardStyle]}>
        <Image
          source={{uri}}
          style={{width: '100%', height: '100%'}}
          resizeMethod="scale"
          resizeMode="contain"
        />
      </View>
      <View style={styles.alignFrameDetailsText}>
        <Text style={styles.frameDetailsText}>
          Date Created: {date + '/' + month + '/' + year}
        </Text>
        <Text style={styles.frameDetailsText}>
          Time Created: {hours + ':' + min + ':' + sec}
        </Text>
        <Text style={styles.frameDetailsText}>Frame: {elementName}</Text>
      </View>
      <View style={styles.alignButtons}>
        <View>
          <TouchableOpacity
            style={styles.saveIconLayout}
            onPress={onPressSaveImage}>
            <SaveIcon width={33} height={33} fill="white" />
          </TouchableOpacity>
          <Text style={styles.alignButtonText}>Save</Text>
        </View>
        <View>
          <TouchableOpacity
            style={styles.shareIconLayout}
            onPress={onPressShare}>
            <ShareIcon width={33} height={33} fill="white" />
          </TouchableOpacity>
          <Text style={styles.alignButtonText}>Share</Text>
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
            Image has been saved to gallery.
          </Text>
          <TouchableOpacity
            style={styles.buttonFooter}
            onPress={toggleModalOff}>
            <Text style={styles.buttonFooterText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const stylesPlus = StyleSheet.create({
  addBannerShadow: {
    shadowColor: '#91B1E7',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  addFrameShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
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
