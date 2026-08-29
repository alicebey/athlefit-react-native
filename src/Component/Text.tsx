import React from 'react';
import {StyleSheet, Text as NativeText, View} from 'react-native';
import {Fonts} from '../Utils/Fonts';
import {scaledSize} from '../Utils/Sizing';

// Props for global component Text
type PropsText = {
  children: any;
  color?: string;
  style?: Object;
  numberOfLines?: number;
  size?: number;
  type: 'thin' | 'regular' | 'semibold' | 'bold';
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify' | undefined;
  [key: string]: any;
  maxWidth?: string | number;
};

// Global component text with dynamic props so no need for creating style each calling text
const Text = ({
  children,
  color,
  style,
  numberOfLines,
  size,
  type,
  textAlign,
  maxWidth,
}: PropsText) => {
  
  // Conditional for determening Font type
  const fontFamily = (): string => {
    if (type === 'thin') {
      return Fonts.thin;
    }
    if (type === 'bold') {
      return Fonts.bold;
    }
    if (type === 'semibold') {
      return Fonts.semi;
    }
    return Fonts.normal;
  };

  return (
    <NativeText
      numberOfLines={numberOfLines}
      ellipsizeMode={'tail'}
      style={[
        style !== undefined && style,
        {
          fontFamily: fontFamily(),
          fontSize: size ? scaledSize(size) : scaledSize(14),
          color: color ? color : '#FFFFFF',
        },
        textAlign !== undefined && {textAlign: textAlign},
        maxWidth !== undefined && {maxWidth: maxWidth},
      ]}>
      {children}
    </NativeText>
  );
};

export default Text;
