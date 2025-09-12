import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const travelImage = require('../../assets/icons/promos/travel-pass.png');
const carIcon = require('../../assets/icons/promos/car-icon.png');
const airportIcon = require('../../assets/icons/promos/airport-icon.png');
const calendarIcon = require('../../assets/icons/promos/calendar-icon.png');
const FoodIcon = require('../../assets/icons/promos/food-icon.png');

const banners = [
  {
    id: 1,
    image: travelImage,
    title: 'Buy Travel Pass now',
    subtitle: 'Save up to S$120.00 for just S$1.00',
    cards: [
      { text: '10% off All ride types', icon: carIcon },
      { text: 'Up to 50% off Airport rides', icon: airportIcon },
      { text: '15% off Airport rides', icon: airportIcon },
    ],
  },
  {
    id: 2,
    image: travelImage,
    title: 'Get Food Deals now',
    subtitle: 'Only S$2.00 for daily food discounts',
    cards: [
      { text: '20% off Premium Ride', icon: carIcon },
      { text: '20% off Pre-booked rides', icon: calendarIcon },
      { text: '20% cashback at dinner', icon: FoodIcon },
    ],
  },
];

const PromoBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [iconsLoaded, setIconsLoaded] = useState<{ [key: number]: boolean }>({});
  const [allReady, setAllReady] = useState(false);
  const blinkAnim = useRef(new Animated.Value(0.3)).current;

  const banner = banners[currentIndex];
  const totalIcons = banner.cards.length;

  // Showing the different banner with id, one by one
  useEffect(() => {
    const getNextBannerIndex = async () => {
      try {
        const storedIndex = await AsyncStorage.getItem('lastBannerIndex');
        const nextIndex = storedIndex
          ? (parseInt(storedIndex, 10) + 1) % banners.length
          : 0;
        setCurrentIndex(nextIndex);
        await AsyncStorage.setItem('lastBannerIndex', nextIndex.toString());
      } catch {
        setCurrentIndex(0);
      }
    };
    getNextBannerIndex();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.6,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 0.3,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (imageLoaded && Object.keys(iconsLoaded).length === totalIcons) {
      setAllReady(true);
    }
  }, [imageLoaded, iconsLoaded]);

  const handleIconLoad = (idx: number) => {
    setIconsLoaded(prev => (prev[idx] ? prev : { ...prev, [idx]: true }));
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: allReady ? '#ffffff' : '#d6e8f3',
            opacity: allReady ? 1 : blinkAnim,
          },
        ]}
      >
        {/* Always render banner image for loading */}
        <Image
          source={banner.image}
          style={styles.bannerImage}
          resizeMode="cover"
          onLoadEnd={() => setImageLoaded(true)}
        />

        {/* Always render icons hidden, like ServiceGrid */}
        {banner.cards.map((card, idx) => (
          <Image
            key={`preload-${idx}`}
            source={card.icon}
            style={styles.preloadImage}
            onLoadEnd={() => handleIconLoad(idx)}
          />
        ))}

        {/* Show content only after all assets are ready */}
        {allReady && (
          <View style={styles.overlayContent}>
            <View style={styles.textSection}>
              <Text style={styles.title}>{banner.title}</Text>
              <Text style={styles.subtitle}>{banner.subtitle}</Text>
            </View>
            <View style={styles.promoCards}>
              {banner.cards.map((card, idx) => (
                <View key={idx} style={styles.card}>
                  <View style={{ flex: 1, justifyContent: 'space-between' }}>
                    <Text style={styles.cardText}>{card.text}</Text>
                    <Image
                      source={card.icon}
                      style={[
                        styles.cardIcon,
                        card.icon === calendarIcon && styles.calendarIcon,
                        card.icon === FoodIcon && styles.foodIcon,
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default PromoBanner;

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  wrapper: {
    width: screenWidth,
    overflow: 'hidden',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: -330,
  },
  container: {
    width: screenWidth,
    minHeight: 450,
    backgroundColor: '#FEF2C0',
  },
  bannerImage: {
    position: 'absolute',
    width: screenWidth,
    height: 450,
    top: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  preloadImage: {
    width: 1,
    height: 1,
    opacity: 0,
    position: 'absolute',
  },
  overlayContent: {
    paddingTop: 140,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  textSection: {
    marginTop: 90,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: -20,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginTop: 15,
    marginBottom: 7,
  },
  promoCards: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  card: {
    backgroundColor: '#FFE57F',
    width: (screenWidth - 30) / 3,
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: 'space-between',
    minHeight: 100,

  },
  cardIcon: {
    width: 80,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginBottom: -30,
  },
  calendarIcon: {
    width: 90,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginBottom: -25,
    marginRight: -20,
  },
  foodIcon: {
    width: 80,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'flex-end',
    marginBottom: -15,
    marginRight: -15,
  },
  cardText: {
    fontSize: 15,
    color: '#000',
    lineHeight: 16,
    fontWeight: 'bold',
  },
});


