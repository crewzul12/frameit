import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import BackButtonIcon from '../../assets/icons/angle-left.svg';
import styles from './SaveImage.scss';
import SaveIcon from '../../assets/icons/save.svg';
import ShareIcon from '../../assets/icons/share-alt.svg';
import CameraRoll from '@react-native-community/cameraroll';
import Modal from 'react-native-modal';
import Share from 'react-native-share';

export default function SaveImage({route, navigation}) {
  const {uri} = route.params; // Receiver params from AdjustPicture component
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
      showAppsToView: true
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };
  return (
    <View style={styles.outerContainer}>
      <View style={[styles.adsBanner, stylesPlus.addBannerShadow]}>
        <Text style={styles.adsBannerText}>Ads Banner here</Text>
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
        <Text style={styles.frameDetailsText}>Name:</Text>
        <Text style={styles.frameDetailsText}>Date:</Text>
        <Text style={styles.frameDetailsText}>Time:</Text>
        <Text style={styles.frameDetailsText}>Frame:</Text>
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
