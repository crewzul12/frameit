import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import BackButtonIcon from '../../assets/icons/angle-left.svg';
import styles from './SaveImage.scss';
import SaveIcon from '../../assets/icons/save.svg';
import ShareIcon from '../../assets/icons/share-alt.svg';

export default function SaveImage({navigation}) {
  const onPressAdjustPicture = () => navigation.navigate('AdjustPicture');
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
      <View style={[stylesPlus.addFrameShadow, styles.cardStyle]}></View>
      <View style={styles.alignFrameDetailsText}>
        <Text style={styles.frameDetailsText}>Name:</Text>
        <Text style={styles.frameDetailsText}>Date:</Text>
        <Text style={styles.frameDetailsText}>Time:</Text>
        <Text style={styles.frameDetailsText}>Frame:</Text>
      </View>
      <View style={styles.alignButtons}>
        <View>
          <TouchableOpacity style={styles.saveIconLayout}>
            <SaveIcon width={33} height={33} fill="white" />
          </TouchableOpacity>
          <Text style={styles.alignButtonText}>Save</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.shareIconLayout}>
            <ShareIcon width={33} height={33} fill="white" />
          </TouchableOpacity>
          <Text style={styles.alignButtonText}>Share</Text>
        </View>
      </View>
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
});
