// Native map (Apple Maps on iOS, Google Maps on Android) with the design's photo pins.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { CENTER, firstName } from '../../data';
import { slate } from '../../theme';
import { Gradient, Img, Txt, center, fill } from '../ui';
import { findLL, SEL_OFFSET, SPAN_15, type NearbyMapProps } from './types';

/** Desaturated Google style, standing in for the prototype's `saturate(.4)` tile filter on Android. */
const MUTED = [
  { stylers: [{ saturation: -60 }, { lightness: 4 }] },
  { featureType: 'poi', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
];

const LABEL_H = 20;

function Label({ text }: { text: string }) {
  return (
    <View style={{ marginTop: 4, backgroundColor: '#fff', borderRadius: 40, paddingHorizontal: 8, paddingVertical: 2, boxShadow: '0 1px 4px rgba(0,0,0,.18)' }}>
      <Txt size={10} w={700} numberOfLines={1}>{text}</Txt>
    </View>
  );
}

function MePin({ color, ring, visible }: { color: string; ring: string; visible: boolean }) {
  const pulse = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    if (!visible) return;
    const loop = Animated.loop(Animated.timing(pulse, { toValue: 1, duration: 2000, easing: Easing.out(Easing.quad), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [visible, pulse]);
  return (
    <View style={{ width: 66, height: 66, ...center }}>
      {visible && (
        <Animated.View
          style={{
            position: 'absolute', width: 22, height: 22, borderRadius: 11, backgroundColor: ring,
            opacity: pulse.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 0, 0] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 3, 3] }) }],
          }}
        />
      )}
      <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: color, borderWidth: 4, borderColor: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.2)' }} />
    </View>
  );
}

export default function NearbyMap(p: NearbyMapProps) {
  const ref = useRef<MapView>(null);
  const T = p.theme;

  useEffect(() => {
    const ll = findLL(p, p.selected);
    if (ll) ref.current?.animateToRegion({ latitude: ll[0] - SEL_OFFSET, longitude: ll[1], latitudeDelta: SPAN_15 / 2, longitudeDelta: SPAN_15 / 2 }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.selected]);

  useEffect(() => {
    if (p.recenterKey) ref.current?.animateToRegion({ latitude: CENTER[0], longitude: CENTER[1], latitudeDelta: SPAN_15, longitudeDelta: SPAN_15 }, 500);
  }, [p.recenterKey]);

  return (
    <MapView
      ref={ref}
      style={fill}
      initialRegion={{ latitude: CENTER[0], longitude: CENTER[1], latitudeDelta: SPAN_15, longitudeDelta: SPAN_15 }}
      mapType={Platform.OS === 'ios' ? 'mutedStandard' : 'standard'}
      customMapStyle={Platform.OS === 'android' ? MUTED : undefined}
      showsPointsOfInterests={false}
      showsCompass={false}
      toolbarEnabled={false}
      pitchEnabled={false}
    >
      <Circle
        center={{ latitude: CENTER[0], longitude: CENTER[1] }}
        radius={650}
        strokeColor={T.accent + '80'}
        strokeWidth={1.5}
        fillColor={T.accent + '12'}
        lineDashPattern={[4, 6]}
      />
      <Marker coordinate={{ latitude: CENTER[0], longitude: CENTER[1] }} anchor={{ x: 0.5, y: 0.5 }} zIndex={1000} tappable={false}>
        <MePin color={p.visible ? T.accent : slate[400]} ring={T.shadow} visible={p.visible} />
      </Marker>

      {p.filter === 'people'
        ? p.people.map(x => {
            const sel = p.selected === x.id, z = sel ? 60 : 50;
            return (
              <Marker
                key={x.id + (sel ? '-sel' : '') + (x.waved ? '-hi' : '')}
                coordinate={{ latitude: x.ll[0], longitude: x.ll[1] }}
                anchor={{ x: 0.5, y: z / 2 / (z + LABEL_H + 4) }}
                zIndex={sel ? 900 : 1}
                onPress={() => p.onSelect(x.id)}
              >
                <View style={{ alignItems: 'center', minWidth: 72 }}>
                  <View style={{ width: z, height: z, borderRadius: z / 2, boxShadow: `0 6px 14px ${T.shadow}` }}>
                    <Gradient g={T.grad} style={{ flex: 1, borderRadius: z / 2, padding: 3 }}>
                      <Img src={x.src} style={{ flex: 1, borderRadius: z / 2, borderWidth: 2, borderColor: '#fff' }} />
                    </Gradient>
                    {x.waved && (
                      <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: '#fff', borderRadius: 40, paddingHorizontal: 6, paddingVertical: 1, boxShadow: '0 1px 3px rgba(0,0,0,.2)' }}>
                        <Txt size={9} w={800} color={T.accent}>HI</Txt>
                      </View>
                    )}
                  </View>
                  <Label text={firstName(x.name)} />
                </View>
              </Marker>
            );
          })
        : p.meets.map(x => {
            const sel = p.selected === x.id, z = sel ? 56 : 48;
            return (
              <Marker
                key={x.id + (sel ? '-sel' : '') + x.goingN}
                coordinate={{ latitude: x.ll[0], longitude: x.ll[1] }}
                anchor={{ x: 0.5, y: z / 2 / (z + LABEL_H + 4) }}
                zIndex={sel ? 900 : 1}
                onPress={() => p.onSelect(x.id)}
              >
                <View style={{ alignItems: 'center', minWidth: 120 }}>
                  <View style={{ width: z, height: z, borderRadius: 16, borderWidth: 3, borderColor: '#fff', overflow: 'hidden', boxShadow: `0 6px 14px ${T.shadow}` }}>
                    <Gradient g={T.grad} style={[fill, center]}>
                      <Txt size={12} w={800} color="#fff" lh={1}>{x.time}</Txt>
                      <Txt size={9} w={600} color="rgba(255,255,255,.85)" style={{ marginTop: 2 }}>{x.goingN} going</Txt>
                    </Gradient>
                  </View>
                  <Label text={x.title} />
                </View>
              </Marker>
            );
          })}
    </MapView>
  );
}
