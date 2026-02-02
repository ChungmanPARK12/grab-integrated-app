// mainServiceUI/src/screens/MainServiceScreens.tsx
import ChallengeSection from '../components/ChallengesRewarded';
import DiscoverSection from '../components/DiscoverThings';
import PaymentPointsSection from '../components/PaymentPanel';
import PromoBanner from '../components/PromoBanner';
import RecommendedRestaurants from '../components/RecommendedRestaurants';
import TravelSmarterSection from '../components/TravelSmarter';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ServiceGrid from '../components/ServiceGrid';
import TopBar from '../components/TopBar';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@login/navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainService'>;

const MainServiceScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <FlatList
      data={[]}
      keyExtractor={(_, index) => index.toString()}
      ListHeaderComponent={
        <View style={styles.innerContainer}>
          <TopBar />
          <ServiceGrid />
          <PaymentPointsSection />
          <PromoBanner />
          <RecommendedRestaurants />
          <DiscoverSection />
          <TravelSmarterSection />
          <ChallengeSection />
        </View>
      }
      renderItem={null}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    />
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  innerContainer: {
    backgroundColor: '#fff',
  },
});

export default MainServiceScreen;
