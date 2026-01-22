import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';

import { TravelSmarterT as T } from '../ui/tokens/travelSmarter';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.44; // 2 items visible with tight spacing

type TravelItem = {
  id: string;
  title: string;
  description: string;
  button: string;
  image: ImageSourcePropType;
};

const travelSmarterItems: TravelItem[] = [
  {
    id: '1',
    title: 'Book your very own food trip',
    description: 'Chat with us',
    button: '',
    image: require('../../assets/icons/travel/culinary.png'),
  },
  {
    id: '2',
    title: 'Pre-book your ride now',
    description: 'Learn more',
    button: '',
    image: require('../../assets/icons/travel/advance-booking.png'),
  },
];

const TravelSmarterSection = () => {
  const renderItem = ({ item }: { item: TravelItem }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Travel smarter with Grab</Text>
      <FlatList
        data={travelSmarterItems}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
      />
    </View>
  );
};

export default TravelSmarterSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    fontSize: 18 * (T.headerFontScale ?? 1),
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  card: {
    width: ITEM_WIDTH,
  },
  image: {
    width: '100%',
    height: ITEM_WIDTH,
    borderRadius: 12,
    resizeMode: 'cover',
    marginBottom: 12,
  },
 title: {
    fontSize: 15 * (T.titleFontScale ?? 1),
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },

  description: {
    fontSize: 14 * (T.descriptionFontScale ?? 1),
    color: '#00b14f',
    fontWeight: '600',
  },
});
