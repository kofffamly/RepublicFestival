import { useState } from 'react';
import { View, Image, StyleSheet, ImageStyle, StyleProp, ImageProps } from 'react-native';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

interface ImageWithFallbackProps extends Omit<ImageProps, 'source'> {
  src?: string;
  style?: StyleProp<ImageStyle>;
  className?: string;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);
  const { src, style, className, ...rest } = props;

  if (didError || !src) {
    return (
      <View style={[styles.fallbackContainer, style as ImageStyle]}>
        <Image
          source={{ uri: ERROR_IMG_SRC }}
          style={[styles.fallbackImage, style as ImageStyle]}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: src }}
      style={style as ImageStyle}
      onError={() => setDidError(true)}
      {...(rest as any)}
    />
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
  },
});

