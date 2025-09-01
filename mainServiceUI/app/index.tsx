import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import TopBar from '../components/TopBar';
import ServiceGrid from '../components/ServiceGrid';
import PaymentPointsSection from '@/components/PaymentPanel';
import PromoBanner from '@/components/PromoBanner';
import RecommendedRestaurants from '@/components/RecommendedRestaurants';
import DiscoverSection from '@/components/DiscoverThings';
import TravelSmarterSection from '@/components/TravelSmarter';
import ChallengeSection from '@/components/ChallengesRewarded';

export default function Index() {
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
          <RecommendedRestaurants/>
          <DiscoverSection/>
          <TravelSmarterSection/>
          <ChallengeSection/>
        </View>
      }
      renderItem={null} // 👈 IMPORTANT: suppress rendering since no data
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    />
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  innerContainer: {
    backgroundColor: '#fff',
  },
});
