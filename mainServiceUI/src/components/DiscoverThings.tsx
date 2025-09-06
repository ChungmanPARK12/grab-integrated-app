import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const discoverItems = [
  {
    id: '1',
    image: require('../assets/icons/discover/dineout.png'),
  },
  {
    id: '2',
    image: require('../assets/icons/discover/groceries.png'),
  },
  {
    id: '3',
    image: require('../assets/icons/discover/grouporder.png'),
  },
];

const DiscoverSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover things you’d love</Text>
      <Text style={styles.subText}>Ad · Swipe to be inspired</Text>

      <FlatList
        data={discoverItems}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage} />
          </View>
        )}
      />
    </View>
  );
};

export default DiscoverSection;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  subText: {
    fontSize: 13,
    color: 'gray',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  cardList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  card: {
    width: width * 0.42,
    height: 300,
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
