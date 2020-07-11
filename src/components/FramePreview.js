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
import styles from './FramePreview.scss';
import Swiper from 'react-native-swiper';
import NextButtonIcon from '../../assets/icons/chevron-circle-right.svg';
import PreviousButtonIcon from '../../assets/icons/chevron-circle-left.svg';
import CheckCircleIcon from '../../assets/icons/check-circle.svg';
import Carousel from 'react-native-snap-carousel';
import ImagePicker from 'react-native-image-picker';

export default function FramePreview({route, navigation}) {
  const {tag, element} = route.params; //receive parameter from DiscoverFrame component
  const onPressDiscoverFrame = () => navigation.navigate('DiscoverFrame');
  const options = {
    title: 'Choose your image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  const onPressAdjustPicture = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: `${response.uri}`};
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        navigation.navigate('AdjustPicture', {imageSource: source});
      }
    });
  };
  const passElement = [];
  element.map((data) => {
    data.element_tag === tag ? passElement.push(data) : null;
  });
  const renderFrames = ({item, index}) => {
    return item.element_tag === tag ? (
      <TouchableOpacity
        style={[styles.carouselStyle, stylesPlus.addFrameShadow]}>
        <Image
          resizeMethod="auto"
          resizeMode="contain"
          source={{uri: item.element_img}}
          style={styles.smallFrame}
        />
      </TouchableOpacity>
    ) : null;
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
          onPress={onPressDiscoverFrame}
        />
        <Text style={styles.headerText}>Frame-It!</Text>
      </View>
      <View>
        <Text style={styles.tagsText}>{tag}</Text>
      </View>
      <View style={[stylesPlus.addFrameShadow, styles.cardStyle]}>
        <Swiper
          autoplay={true}
          showsPagination={false}
          nextButton={
            <NextButtonIcon
              fill="#76A6EF"
              stroke="#707070"
              strokeWidth={10}
              width={30}
              height={30}
              style={styles.nextAndPrevButtonIcon}
            />
          }
          prevButton={
            <PreviousButtonIcon
              fill="#76A6EF"
              stroke="#707070"
              strokeWidth={10}
              width={30}
              height={30}
              style={styles.nextAndPrevButtonIcon}
            />
          }
          showsButtons={true}>
          {element
            ? element.map((item) => {
                return item.element_tag === tag ? (
                  <Image
                    key={item.id}
                    resizeMethod="auto"
                    resizeMode="contain"
                    style={styles.frameStyle}
                    source={{uri: item.element_img}}
                  />
                ) : null;
              })
            : null}
        </Swiper>
      </View>
      <View style={styles.carouselLayout}>
        <Carousel
          enableMomentum={true}
          autoplay={true}
          autoplayDelay={1000}
          autoplayInterval={1000}
          layout={'default'}
          renderItem={renderFrames}
          data={passElement}
          sliderWidth={400}
          itemWidth={150}
          inactiveSlideOpacity={1}
        />
      </View>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={onPressAdjustPicture}>
        <View style={styles.alignTextAndIcon}>
          <Text style={styles.selectText}>Select</Text>
          <CheckCircleIcon
            width={18}
            height={18}
            fill="#F8FAFD"
            style={styles.checkCircleIcon}
          />
        </View>
      </TouchableOpacity>
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
