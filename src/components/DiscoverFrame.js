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
import styles from './DiscoverFrame.scss';
import BackButtonIcon from '../../assets/icons/angle-left.svg';
import SearchIcon from '../../assets/icons/search.svg';
import {REACT_APP_API_KEY} from '@env';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
const axios = require('axios');
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

const {width} = Dimensions.get('window');
const PADDING = 16;
const SEARCH_FULL_WIDTH = width - PADDING * 2; //search_width when unfocused
const SEARCH_SHRINK_WIDTH = width - PADDING - 70; //search_width when focused
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function haOnEvent() {
  const eventObj = {
    testString: 'StrContent',
    testInt: 20,
    testDouble: 2.2,
    testBoolean: false,
  };
  haSDK.onEvent('newTestEvent', eventObj);
}
export default function DiscoverFrame({navigation}) {
  const [element, setElement] = useState(); // Render all element
  const tags = [
    'Latest Release',
    'Popular Release',
    'Eid Mubarak',
    'Deepavali',
    'Chinese New Year',
    'Christmas Day',
  ];
  const [searchActive, setSearchActive] = React.useState(false);
  const onPressHome = () => navigation.navigate('Home');
  const onPressSearchInactive = () => setSearchActive(false);
  const cancelPosition = new Animated.Value(0);
  const opacity = new Animated.Value(0);
  const input = useRef(null);
  const handleFocusTextInput = () => {
    setSearchActive(true);
  };
  const [loading, setLoading] = useState(true); // Loading state for skeleton component
  const inputLength = new Animated.Value(SEARCH_FULL_WIDTH),
    onFocus = () => {
      Animated.parallel([
        Animated.timing(inputLength, {
          toValue: SEARCH_SHRINK_WIDTH,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(cancelPosition, {
          toValue: 16,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();
    };
  useEffect(() => {
    haOnEvent();
  }, []);
  useEffect(() => {
    let unmounted = false;
    let source = axios.CancelToken.source();
    axios
      .get(`https://frameitdjangorestapi.herokuapp.com/api/elements/`, {
        cancelToken: source.token,
        headers: {
          Authorization: `${REACT_APP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      })
      .then(function (response) {
        // handle success
        if (!unmounted) {
          setLoading(false);
          setElement(response.data);
        }
      })
      .catch(function (error) {
        if (!unmounted) {
          if (axios.isCancel()) {
            console.log('request cancelled');
          } else {
            console.log('another error happened');
          }
        }
      })
      .finally(function () {
        // always executed
      });
    return function () {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    };
  }, []);
  let tagsNonNull = [];
  const displayNonDupsTags = new Set();
  const [searchTags, setSearchTags] = useState(''); // Search keyword state
  const handleSearchTags = (event) => {
    setSearchTags(event.nativeEvent.text);
  };
  let filteredTag = tags.filter((tag) => {
    return tag.toLowerCase().includes(searchTags.toLowerCase());
  });
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
      {searchActive ? (
        <View style={[styles.headerBar, stylesPlus.addBannerShadow]}>
          <Animated.View
            style={[
              styles.search,
              {
                width: inputLength,
                position: 'absolute',
                left: 16,
                alignSelf: 'center',
              },
              searchActive === true ? undefined : {justifyContent: 'center'},
            ]}>
            <TextInput
              onFocus={onFocus}
              placeholder="Type something"
              style={styles.searchInputStyle}
              ref={input}
              placeholderTextColor="black"
              onChange={handleSearchTags}
            />
          </Animated.View>
          <AnimatedTouchable
            style={[styles.cancelSearch, {right: cancelPosition}]}
            onPress={onPressSearchInactive}>
            <Animated.Text
              style={[styles.cancelSearchText, {opacity: opacity}]}>
              Cancel
            </Animated.Text>
          </AnimatedTouchable>
        </View>
      ) : (
        <View style={[styles.headerBar, stylesPlus.addBannerShadow]}>
          <BackButtonIcon
            width={25}
            height={39}
            fill="#DDE4EE"
            onPress={onPressHome}
          />
          <Text style={styles.headerText}>Frame-It!</Text>
          <SearchIcon
            width={25}
            height={39}
            fill="#DDE4EE"
            onPress={handleFocusTextInput}
          />
        </View>
      )}
      <SkeletonContent
        containerStyle={{flex: 1}}
        isLoading={loading}
        layout={[
          {
            key: 'loadingTags',
            width: 220,
            height: '7%',
            marginBottom: '6%',
            marginLeft: '5%',
            marginTop: '6%',
          },
          {
            key: 'loadingFrames',
            width: 180,
            height: '20%',
            marginBottom: 6,
            marginLeft: '10%',
          },
          {
            key: 'loadingTags2',
            width: 220,
            height: '7%',
            marginBottom: '6%',
            marginLeft: '5%',
            marginTop: '6%',
          },
          {
            key: 'loadingFrames2',
            width: 180,
            height: '20%',
            marginBottom: 6,
            marginLeft: '10%',
          },
          {
            key: 'loadingTags3',
            width: 220,
            height: '7%',
            marginBottom: '6%',
            marginLeft: '5%',
            marginTop: '6%',
          },
          {
            key: 'loadingFrames3',
            width: 180,
            height: '20%',
            marginBottom: 6,
            marginLeft: '10%',
          },
        ]}>
        <ScrollView scrollEventThrottle={16}>
          <View style={styles.spaceTagsContent}>
            {element
              ? element.map((el) => {
                  filteredTag.map((t) => {
                    el.element_tag === t && el.element_tag
                      ? displayNonDupsTags.add(t)
                      : null;
                    tagsNonNull = [...displayNonDupsTags];
                  });
                })
              : null}
            {element && tags
              ? tagsNonNull.map((data) => {
                  return (
                    <View key={data}>
                      <Text style={styles.tagsText}>{data}</Text>
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        horizontal={true}>
                        {element
                          ? element.map((item) => {
                              return item.element_tag === data ? (
                                <TouchableOpacity
                                  style={[
                                    stylesPlus.addFrameShadow,
                                    styles.cardStyle,
                                  ]}
                                  onPress={() => {
                                    navigation.navigate('FramePreview', {
                                      tag: data,
                                      element: element,
                                    });
                                  }}
                                  key={item.id}>
                                  <Image
                                    resizeMethod="auto"
                                    resizeMode="contain"
                                    style={styles.frameStyle}
                                    source={{uri: item.element_img}}
                                  />
                                </TouchableOpacity>
                              ) : null;
                            })
                          : null}
                      </ScrollView>
                    </View>
                  );
                })
              : null}
          </View>
        </ScrollView>
      </SkeletonContent>
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
