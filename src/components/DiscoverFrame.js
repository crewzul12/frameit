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
const axios = require('axios');

const {width} = Dimensions.get('window');
const PADDING = 16;
const SEARCH_FULL_WIDTH = width - PADDING * 2; //search_width when unfocused
const SEARCH_SHRINK_WIDTH = width - PADDING - 70; //search_width when focused
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
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
    console.log(event.nativeEvent.text);
    setSearchTags(event.nativeEvent.text);
  };
  let filteredTag = tags.filter((tag) => {
    return tag.toLowerCase().includes(searchTags.toLowerCase());
  });
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
