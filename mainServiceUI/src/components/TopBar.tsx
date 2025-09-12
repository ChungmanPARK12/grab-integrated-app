import React from 'react';
import { View, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const TopBar = () => {
  return (
    <LinearGradient
      colors={['#6decb9', '#39c4a0']} // mimicking the Grab gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <TouchableOpacity>
          <Image source={require('../../assets/icons/qr2.png')} style={styles.icon} />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Search the Grab app"
          placeholderTextColor="#666"
        />

        <TouchableOpacity>
          <Image source={require('../../assets/icons/profile2.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    padding: 4,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 12,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    fontSize: 14,
  },
});


