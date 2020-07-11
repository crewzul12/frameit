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
const axios = require('axios');

const {width} = Dimensions.get('window');
const PADDING = 16;
const SEARCH_FULL_WIDTH = width - PADDING * 2; //search_width when unfocused
const SEARCH_SHRINK_WIDTH = width - PADDING - 70; //search_width when focused
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function DiscoverFrame({navigation}) {
  const [element, setElement] = useState(null);
  const tags = [
    'Latest Release',
    'Popular Release',
    'Eid Mubarak',
    'Deepavali',
    'Chinese New Year',
    'Christmas Day',
  ];
  const tagsLen = tags.length;
  const [searchActive, setSearchActive] = React.useState(false);
  const onPressHome = () => navigation.navigate('Home');
  const onPressSearchInactive = () => setSearchActive(false);
  const cancelPosition = new Animated.Value(0);
  const opacity = new Animated.Value(0);
  const input = useRef(null);
  const handleFocusTextInput = () => {
    setSearchActive(true);
  };
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
    const source = axios.CancelToken.source();
    axios
      .get('https://frameitdjangorestapi.herokuapp.com/api/elements/')
      .then(function (response) {
        // handle success
        setElement(response.data);
      })
      .catch(function (error) {
        if (Axios.isCancel(error)) {
        } else {
          throw error;
        }
      })
      .finally(function () {
        // always executed
      });
    return () => {
      source.cancel();
    };
  }, []);
  return (
    <View style={styles.outerContainer}>
      <View style={[styles.adsBanner, stylesPlus.addBannerShadow]}>
        <Text style={styles.adsBannerText}>Ads Banner here</Text>
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
      <ScrollView scrollEventThrottle={16}>
        {tags
          ? tags.map((data, index) => {
              return tagsLen === index + 1 ? (
                <View style={styles.spaceTagsLastContent} key={data}>
                  {index === 0 ? (
                    <Text style={styles.tagsFirstText}>{data}</Text>
                  ) : (
                    <Text style={styles.tagsText}>{data}</Text>
                  )}
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    horizontal={true}>
                    {element
                      ? element.map((item, index) => {
                          return item.element_tag === data ? (
                            <TouchableOpacity
                              style={[
                                stylesPlus.addFrameShadow,
                                styles.cardStyle,
                              ]}
                              onPress={() =>
                                navigation.navigate('FramePreview', {
                                  tag: data,
                                  element: element,
                                })
                              }
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
              ) : (
                <View style={styles.spaceTagsContent} key={data}>
                  {index === 0 ? (
                    <Text style={styles.tagsFirstText}>{data}</Text>
                  ) : (
                    <Text style={styles.tagsText}>{data}</Text>
                  )}
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    horizontal={true}>
                    {element
                      ? element.map((item, index) => {
                          return item.element_tag === data ? (
                            <TouchableOpacity
                              style={[
                                stylesPlus.addFrameShadow,
                                styles.cardStyle,
                              ]}
                              onPress={() =>
                                navigation.navigate('FramePreview', {
                                  tag: data,
                                  element: element,
                                })
                              }
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
      </ScrollView>
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
