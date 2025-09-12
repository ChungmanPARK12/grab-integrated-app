import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const restaurants = [
  {
    id: '1',
    name: 'Burger King - Tampines Mart',
    distance: '7.7 km',
    rating: 4.3,
    discount: '10% off',
    image: require('../../assets/icons/restaurants/burgerking.png'),
  },
  {
    id: '2',
    name: 'McDonalds - Elias Community Centre',
    distance: '7.8 km',
    rating: 4.3,
    discount: '20% off',
    image: require('../../assets/icons/restaurants/mcdonald.png'),
  },
  {
    id: '3',
    name: 'Cafe O - Changi Airport Terminal2',
    distance: '5.7 km',
    rating: 4.2,
    discount: '10% off',
    image: require('../../assets/icons/restaurants/cafeo.png'),
  },
  {
    id: '4',
    name: 'WokeRamen - Changi Airport Terminal1',
    distance: '6.2 km',
    rating: 4.1,
    discount: '15% off',
    image: require('../../assets/icons/restaurants/wokeramen.png'),
  },
  {
    id: '5',
    name: 'Texas Chicken - Terminal2',
    distance: '7.1 km',
    rating: 4.0,
    discount: '5% off',
    image: require('../../assets/icons/restaurants/texaschicken.png'),
  },
  {
    id: '6',
    name: 'KFC - Changi Airport',
    distance: '8.0 km',
    rating: 4.4,
    discount: '12% off',
    image: require('../../assets/icons/restaurants/kfc.png'),
  },
];

const RecommendedRestaurants = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurants you may like</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.info}>
              {item.distance} · ⭐ {item.rating}
            </Text>
            <View style={styles.discountBox}>
              <Text style={styles.discount}>{item.discount}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <View style={styles.arrowWrapper}>
            <TouchableOpacity style={styles.arrowButton}>
              <MaterialIcons name="arrow-forward-ios" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default RecommendedRestaurants;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    width: 130,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 130,
    marginBottom: 5,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    paddingHorizontal: 6,
    minHeight: 36,
    marginBottom: 5,
  },
  info: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 6,
    marginTop: 2,
    marginBottom: 2,
  },
  discountBox: {
    marginTop: 6,
    backgroundColor: '#fff2e6',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 6,
    marginBottom: 10,
  },
  discount: {
    fontSize: 12,
    color: '#ff6600',
    fontWeight: 'bold',
  },
  arrowWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginTop: 50,
    marginLeft: 5,  
  },
});


