import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const INITIAL_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const DriverMapScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFillObject} initialRegion={INITIAL_REGION}>
        <Marker
          coordinate={INITIAL_REGION}
          title="Demo map only"
          description="This driver map is a non-functional preview in this build."
        />
      </MapView>
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Driver map preview – not live data</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  overlayText: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#ffffff',
    fontSize: 14,
  },
});

export default DriverMapScreen;
