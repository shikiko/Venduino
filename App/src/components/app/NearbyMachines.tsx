import React, { useRef, useState, useEffect } from 'react';
import {
  Layout,
  Text,
  withStyles,
  ThemedComponentProps,
  List,
  ListItem,
} from 'react-native-ui-kitten';

import MapView, {
  Marker,
  LatLng,
  Point,
  MapViewProps,
} from 'react-native-maps';

export type MachinePointProps = {
  id?: string;
  title: string;
  description: string;
  location: LatLng;
};

export type PointPressEvent = {
  coordinate: LatLng;
  position: Point;
};

export type NearbyMachinesProps = ThemedComponentProps &
  MapViewProps & {
    data: MachinePointProps[];
    loading?: boolean;
    onPressMarker?: (point: MachinePointProps) => void;
  };

const NearbyMachines = ({
  loading = false,
  data,
  onPressMarker = () => {},
  themedStyle,
  ...props
}: NearbyMachinesProps) => {
  const handlePressMarker = (e: any) => {
    const marker = data.filter(m => m.id === e.nativeEvent.id)[0];
    if (marker) onPressMarker(marker);
  };
  return (
    <MapView
      style={themedStyle.mapview}
      onMarkerPress={handlePressMarker}
      showsCompass
      showsIndoors
      showsUserLocation
      {...props}>
      {!loading &&
        data.map(marker => (
          <Marker
            key={marker.title}
            identifier={marker.id}
            coordinate={marker.location}
            pinColor={themedStyle.color.primary}
            title={marker.title}
            description={marker.description}
          />
        ))}
    </MapView>
  );
};

export default withStyles(NearbyMachines, theme => ({
  mapview: {
    flex: 1,
  },
  color: {
    primary: theme['color-primary-default'],
  },
}));
