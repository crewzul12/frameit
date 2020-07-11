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
  PanResponder,
} from 'react-native';
import BackButtonIcon from '../../assets/icons/angle-left.svg';
import styles from './AdjustPicture.scss';
import UndoIcon from '../../assets/icons/undo-alt.svg';
import CheckCircleIcon from '../../assets/icons/check-circle.svg';

export default function AdjustPicture({route, navigation}) {
  const {imageSource} = route.params;
  const onPressFramePreview = () => navigation.navigate('FramePreview');
  const onPressSaveImage = () => navigation.navigate('SaveImage');
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver: false}),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;
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
          onPress={onPressFramePreview}
        />
        <Text style={styles.headerText}>Frame-It!</Text>
      </View>
      <View>
        <Text style={styles.adjustPictureText}>Adjust Picture</Text>
      </View>
      <View style={[stylesPlus.addFrameShadow, styles.cardStyle]}>
        <Animated.View
          style={{
            transform: [{translateX: pan.x}, {translateY: pan.y}],
          }}
          {...panResponder.panHandlers}>
          <Image
            source={imageSource}
            resizeMethod="scale"
            resizeMode="contain"
            style={styles.adjustPictureImage}
          />
        </Animated.View>
      </View>
      <View style={styles.alignButtons}>
        <View>
          <TouchableOpacity style={styles.undoIconLayout}>
            <UndoIcon
              width={33}
              height={33}
              fill="white"
              style={styles.undoIcon}
            />
          </TouchableOpacity>
          <Text style={styles.alignButtonText}>Undo</Text>
        </View>
        <View>
          <TouchableOpacity onPress={onPressSaveImage}>
            <CheckCircleIcon width={58} height={58} fill="#76A6EF" />
          </TouchableOpacity>
          <Text style={styles.alignButtonText}>Proceed</Text>
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
