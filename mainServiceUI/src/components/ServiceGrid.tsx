import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, FlatList, StyleSheet, Animated } from "react-native";
import { SERVICE_GRID_TOKENS as T } from "../ui/tokens/serviceGrid";

type ServiceItem = {
  name: string;
  icon: any;
  tag?: string;
};

const services: ServiceItem[] = [
  { name: "Transport", icon: require("../../assets/icons/transport.png") },
  { name: "Food", icon: require("../../assets/icons/food.png"), tag: "SALE" },
  { name: "Mart", icon: require("../../assets/icons/mart.png"), tag: "SALE" },
  { name: "Dine Out", icon: require("../../assets/icons/dineout.png"), tag: "SALE" },
  { name: "Express", icon: require("../../assets/icons/express.png") },
  { name: "Chope", icon: require("../../assets/icons/chope.png") },
  { name: "Shopping", icon: require("../../assets/icons/shopping.png") },
  { name: "All", icon: require("../../assets/icons/all.png") },
];

const ServiceGrid = () => {
  const [loadedIcons, setLoadedIcons] = useState<{ [key: string]: boolean }>({});
  const [allLoaded, setAllLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.8, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (Object.keys(loadedIcons).length === services.length) {
      setAllLoaded(true);
    }
  }, [loadedIcons]);

  const handleImageLoad = (name: string) => {
    setLoadedIcons((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  };

  const renderItem = ({ item }: { item: ServiceItem }) => {
    return (
      <View style={styles.item}>
        {item.tag && <Text style={styles.tag}>{item.tag}</Text>}

        <View style={styles.iconWrapper}>
          {!allLoaded && <Animated.View style={[styles.placeholder, { opacity: fadeAnim }]} />}

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
};

export default ServiceGrid;

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: T.gridPaddingHorizontal,
    paddingTop: T.gridPaddingTop,
    alignItems: T.gridAlignItems,
  },

  item: {
    width: T.itemWidth,
    alignItems: "center",
    marginBottom: T.itemMarginBottom,
    marginTop: T.itemMarginTop,
    position: "relative",
    marginRight: T.itemMarginRight,
    marginLeft: T.itemMarginLeft,
  },

  tag: {
    position: "absolute",
    top: T.tagTop,
    right: T.tagRight,
    backgroundColor: "#f44",
    color: "#fff",
    fontSize: T.tagFontSize,
    paddingHorizontal: T.tagPaddingHorizontal,
    borderRadius: T.tagBorderRadius,
    zIndex: 1,
  },

  iconWrapper: {
    backgroundColor: "#d2f1f3",
    borderRadius: T.iconWrapperRadius,
    width: T.iconWrapperWidth,
    height: T.iconWrapperHeight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: T.iconWrapperMarginBottom,
    overflow: "hidden",
  },

  icon: {
    width: T.iconSize,
    height: T.iconSize,
    resizeMode: "contain",
  },

  placeholder: {
    width: T.placeholderSize,
    height: T.placeholderSize,
    backgroundColor: "#ffffff",
    borderRadius: T.placeholderRadius,
    position: "absolute",
    opacity: T.placeholderOpacity,
  },

  hidden: {
    opacity: 0,
  },
});
