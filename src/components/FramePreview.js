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
  const {tag, element} = route.params; // receive parameter from DiscoverFrame component
  const onPressDiscoverFrame = () => navigation.navigate('DiscoverFrame'); // navigate to Discover Frame page
  const options = {
    title: 'Choose your image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  const passElement = [];
  element.map((data) => {
    data.element_tag === tag ? passElement.push(data) : null;
  });
  const [elementSource, setElementSource] = React.useState();
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
        const source = {uri: `${response.uri}`}; // source of user image in device storage
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        navigation.navigate('AdjustPicture', {
          imageSource: source,
          elementSource: elementSource,
        });
        console.log(elementSource);
      }
    });
  };
  const swiper = useRef(); // ref for Swiper component
  const carousel = useRef(); // ref for Carousel component to be used in next and previous frame button
  const [frameCurrIndex, setFrameCurrIndex] = React.useState(0);
  async function onPressNextFrameButton() {
    carousel.current.snapToNext();
    swiper.current.scrollBy(1); // swipe frame to next frame
    setFrameCurrIndex(frameCurrIndex + 1);
    console.log(frameCurrIndex);
  }
  async function onPressPrevFrameButton() {
    carousel.current.snapToPrev();
    swiper.current.scrollBy(-1); // swiper frame to previous frame
    setFrameCurrIndex(frameCurrIndex - 1);
    console.log(frameCurrIndex);
  }
  const renderFrames = ({item, index}) => {
    if (frameCurrIndex === index) {
      setElementSource(item.element_img);
    }
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
          ref={swiper}
          showsPagination={false}
          loop={false}
          scrollEnabled={false}
          nextButton={
            <NextButtonIcon
              fill="#76A6EF"
              stroke="#707070"
              strokeWidth={10}
              width={30}
              height={30}
              onPress={onPressNextFrameButton}
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
              onPress={onPressPrevFrameButton}
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
          layout={'default'}
          ref={carousel}
          renderItem={renderFrames}
          data={passElement}
          sliderWidth={400}
          itemWidth={150}
          inactiveSlideOpacity={1}
          loop={false}
          scrollEnabled={false}
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
