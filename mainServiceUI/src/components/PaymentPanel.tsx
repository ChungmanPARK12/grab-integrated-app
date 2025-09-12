import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';

const walletIcon = require('../../assets/icons/wallet-icon.png');
const crownIcon = require('../../assets/icons/crown-icon.png');

const PaymentPointsSection = () => {
  const blinkAnim = useRef(new Animated.Value(1)).current;
  const [isBlinkDone, setBlinkDone] = useState(false);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.4,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    const timeout = setTimeout(() => {
      animation.stop();
      setBlinkDone(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const renderBox = (title: string, subtitle: string, iconSource: any) => {
    const showContent = isBlinkDone;

    return (
      <View style={styles.wrapper}>
        <Animated.View
          style={[
            styles.box,
            {
              backgroundColor: showContent ? '#ffffff' : '#d6e8f3',
              opacity: showContent ? 1 : blinkAnim,
            },
          ]}
        >
          {showContent ? (
            <>
              <View style={styles.textGroup}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
              <View style={styles.iconWrapper}>
                <Image source={iconSource} style={styles.icon} />
              </View>
            </>
          ) : (
            // Render the actual icon invisibly to trigger early load
            <>
              <View style={styles.textGroup} />
              <View style={styles.iconWrapper}>
                <Image
                  source={iconSource}
                  style={[styles.icon, { opacity: 0 }]}
                />
              </View>
            </>
          )}
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderBox('Payment', 'Add a Card', walletIcon)}
      {renderBox('Points', '0', crownIcon)}
    </View>
  );
};

export default PaymentPointsSection;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 340,
    justifyContent: 'space-between',
  },
  wrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 72,
  },
  title: {
    fontSize: 13,
    color: '#6b6b6b',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
    color: '#000000',
  },
  textGroup: {
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
    marginTop:20,
  },
});


