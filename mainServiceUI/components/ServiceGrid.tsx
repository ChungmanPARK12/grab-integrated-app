import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Animated,
} from 'react-native';

type ServiceItem = {
  name: string;
  icon: any;
  tag?: string;
};

const services: ServiceItem[] = [
  { name: 'Transport', icon: require('../assets/icons/transport.png') },
  { name: 'Food', icon: require('../assets/icons/food.png'), tag: 'SALE' },
  { name: 'Mart', icon: require('../assets/icons/mart.png'), tag: 'SALE' },
  { name: 'Dine Out', icon: require('../assets/icons/dineout.png'), tag: 'SALE' },
  { name: 'Express', icon: require('../assets/icons/express.png') },
  { name: 'Chope', icon: require('../assets/icons/chope.png') },
  { name: 'Shopping', icon: require('../assets/icons/shopping.png') },
  { name: 'All', icon: require('../assets/icons/all.png') },
];

export default function ServiceGrid() {
  const [loadedIcons, setLoadedIcons] = useState<{ [key: string]: boolean }>({});
  const [allLoaded, setAllLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (Object.keys(loadedIcons).length === services.length) {
      setAllLoaded(true);
    }
  }, [loadedIcons]);

  const handleImageLoad = (name: string) => {
    setLoadedIcons((prev) => {
      if (!prev[name]) {
        return { ...prev, [name]: true };
      }
      return prev;
    });
  };

  const renderItem = ({ item }: { item: ServiceItem }) => {
    const isLoaded = loadedIcons[item.name];

    return (
      <View style={styles.item}>
        {item.tag && <Text style={styles.tag}>{item.tag}</Text>}
        <View style={styles.iconWrapper}>
          {!allLoaded && (
            <Animated.View style={[styles.placeholder, { opacity: fadeAnim }]} />
          )}
          <Image
            source={item.icon}
            style={[styles.icon, !allLoaded && styles.hidden]}
            onLoadEnd={() => handleImageLoad(item.name)}
            onError={() => handleImageLoad(item.name)}
          />
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={services}
      keyExtractor={(item) => item.name}
      numColumns={4}
      contentContainerStyle={styles.grid}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: 0,
    paddingTop: 20,
    alignItems: 'center'
  },
  item: {
    width: 63,
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
    position: 'relative',
    marginRight: 5,
    marginLeft: 25, 

  },
  tag: {
    position: 'absolute',
    top: -8,
    right: 12,
    backgroundColor: '#f44',
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  iconWrapper: {
    backgroundColor: '#d2f1f3',
    borderRadius: 16,
    width: 80,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -16,
    overflow: 'hidden',
  },
  icon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  placeholder: {
    width: 65,
    height: 65,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    position: 'absolute',
    opacity: 0.8,
  },
  hidden: {
    opacity: 0,
  },
});
