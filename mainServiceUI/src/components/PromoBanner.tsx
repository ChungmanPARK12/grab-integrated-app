import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { PromoT as T } from '../ui/tokens/promoBanner';

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

  // banner-level preload readiness
  const [imageLoaded, setImageLoaded] = useState(false);
  const [iconsLoaded, setIconsLoaded] = useState<{ [key: number]: boolean }>({});
  const [allReady, setAllReady] = useState(false);

  // visible card icon readiness (for simultaneous show)
  const [cardIconsLoaded, setCardIconsLoaded] = useState<{ [key: number]: boolean }>({});
  const [showCardIcons, setShowCardIcons] = useState(false);

  const blinkAnim = useRef(new Animated.Value(0.3)).current;
  const blinkLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const banner = banners[currentIndex];
  const totalIcons = banner.cards.length;

  /** rotate banner index (on mount only) */
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

  /** ✅ reset states whenever banner changes */
  useEffect(() => {
    setImageLoaded(false);
    setIconsLoaded({});
    setAllReady(false);

    setCardIconsLoaded({});
    setShowCardIcons(false);
  }, [currentIndex]);

  /** blinking loop (start/stop) */
  useEffect(() => {
    if (!blinkLoopRef.current) {
      blinkLoopRef.current = Animated.loop(
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
      );
    }

    if (!allReady) {
      blinkLoopRef.current.start();
    } else {
      blinkLoopRef.current.stop();
      blinkAnim.setValue(1);
    }

    return () => blinkLoopRef.current?.stop();
  }, [allReady, blinkAnim]);

  const handlePreloadIconLoad = (idx: number) => {
    setIconsLoaded(prev => (prev[idx] ? prev : { ...prev, [idx]: true }));
  };

  const handleCardIconLoad = (idx: number) => {
    setCardIconsLoaded(prev => (prev[idx] ? prev : { ...prev, [idx]: true }));
  };

  /** strict icon readiness (preload icons) */
  const preloadIconsReady = useMemo(() => {
    for (let i = 0; i < totalIcons; i++) {
      if (!iconsLoaded[i]) return false;
    }
    return true;
  }, [iconsLoaded, totalIcons]);

  /** strict icon readiness (visible card icons) */
  const visibleIconsReady = useMemo(() => {
    for (let i = 0; i < totalIcons; i++) {
      if (!cardIconsLoaded[i]) return false;
    }
    return true;
  }, [cardIconsLoaded, totalIcons]);

  /** banner readiness: image + preload icons */
  useEffect(() => {
    if (!allReady && imageLoaded && preloadIconsReady) {
      setAllReady(true);
    }
  }, [imageLoaded, preloadIconsReady, allReady]);

  /** show visible icons simultaneously only after all visible icons are loaded */
  useEffect(() => {
    if (allReady && visibleIconsReady && !showCardIcons) {
      setShowCardIcons(true);
    }
  }, [allReady, visibleIconsReady, showCardIcons]);

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
        {/* banner image */}
        <Image
          source={banner.image}
          style={styles.bannerImage}
          resizeMode="cover"
          onLoadEnd={() => setImageLoaded(true)}
          fadeDuration={0} // Android: avoid per-image fade feeling
        />

        {/* preload icons hidden */}
        {banner.cards.map((card, idx) => (
          <Image
            key={`preload-${currentIndex}-${idx}`}
            source={card.icon}
            style={styles.preloadImage}
            onLoadEnd={() => handlePreloadIconLoad(idx)}
            fadeDuration={0}
          />
        ))}

        {/* content only when banner assets are ready */}
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

                    {/* Always render icon to load it, but keep it hidden until all 3 are ready */}
                    <Image
                      source={card.icon}
                      onLoadEnd={() => handleCardIconLoad(idx)}
                      fadeDuration={0}
                      style={[
                        styles.cardIcon,
                        card.icon === calendarIcon && styles.calendarIcon,
                        card.icon === FoodIcon && styles.foodIcon,
                        !showCardIcons && styles.hiddenIcon, // <- 핵심
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
    marginTop: -330,
  },
  container: {
    width: screenWidth,
    minHeight: 450,
  },
  bannerImage: {
    position: 'absolute',
    width: screenWidth,
    height: 450,
    top: 0,
    left: 0,
  },
  preloadImage: {
    width: 1,
    height: 1,
    opacity: 0,
    position: 'absolute',
  },
  overlayContent: {
    paddingTop: T.overlayPaddingTop,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  textSection: {
    marginTop: T.textSectionMarginTop,
  },
  title: {
    fontSize: 18 * (T.titleFontScale ?? 1),
    fontWeight: 'bold',
    color: '#000',
    marginTop: T.titleMarginTop,
  },
  subtitle: {
    fontSize: 16 * (T.subtitleFontScale ?? 1),
    color: '#444',
    marginTop: T.subtitleMarginTop,
    marginBottom: 7,
  },
  promoCards: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: T.promoCardsMarginTop,
  },
  card: {
    backgroundColor: '#FFE57F',
    width: (screenWidth - 30) / 3 + (T.promoCardWidthDelta ?? 0),
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 10,
    minHeight: 100 + (T.promoCardHeightDelta ?? 0),
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
    marginBottom: -25,
    marginRight: -20,
  },
  foodIcon: {
    width: 80,
    height: 60,
    marginBottom: -15,
    marginRight: -15,
  },
  hiddenIcon: {
    opacity: 0,
  },
  cardText: {
    fontSize: 15 * (T.cardTextFontScale ?? 1),
    lineHeight: 16 * (T.cardTextFontScale ?? 1),
    color: '#000',
    fontWeight: 'bold',
  },

});