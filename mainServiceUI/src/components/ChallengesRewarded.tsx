import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import { ChallengeT as T } from '../ui/tokens/challengesRewarded';

const { width } = Dimensions.get('window');

const challenges = [
  {
    id: '1',
    title: 'Win 2 x Golden Village Movie Vouchers',
    endDate: 'Ends on 31 Aug 2025',
    image: require('../../assets/icons/challenges/drinkies.png'),
  },
  {
    id: '2',
    title: 'Win $15 off TikTok Shop!',
    endDate: 'Ends on 15 Sep 2025',
    image: require('../../assets/icons/challenges/tiktok.png'),
  },
];

const ChallengeSection = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Get rewarded with Challenges</Text>
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.logo} />
            <View style={styles.textSection}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.date}>{item.endDate}</Text>
              <TouchableOpacity>
                <Text style={styles.link}>Accept this challenge</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ChallengeSection;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 18 * (T.headingFontScale ?? 1),
    fontWeight: 'bold',
    marginBottom: 12,
  },
  listContainer: {
    gap: 12,
  },
  card: {
    width: width * 0.8,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginTop: 3,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginRight: 12,
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15 * (T.titleFontScale ?? 1),
    fontWeight: '600',
    marginBottom: 4,
  },

  date: {
    fontSize: 13 * (T.dateFontScale ?? 1),
    color: '#666',
    marginTop: 5,
    marginBottom: 10,
  },

  link: {
    fontSize: 13 * (T.linkFontScale ?? 1),
    color: '#007bff',
    fontWeight: '500',
  },

});
