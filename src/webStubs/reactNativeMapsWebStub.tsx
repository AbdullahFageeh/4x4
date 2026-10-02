import React from 'react';
import { View, Text } from 'react-native';

// Web stub for react-native-maps. The real maps SDK is native-only.
// On Web we render a lightweight placeholder so the app (and any
// screen that touches a map) works in the browser demo.
export default function MapView(props: any) {
  return (
    <View style={{ flex: 1, backgroundColor: '#e8e2d8', alignItems: 'center', justifyContent: 'center' }}>
      <Text>🗺️ {props.region ? 'Map (web preview)' : 'Map'}</Text>
    </View>
  );
}

export function Marker() { return null; }
export function Circle() { return null; }
export function Polygon() { return null; }
export function Polyline() { return null; }
export function Callout() { return null; }
export function Annotation() { return null; }
export const PROVIDER_DEFAULT = 'default';
export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_MAPS = 'maps';