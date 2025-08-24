import React, {memo} from 'react';
import {
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import Divider from './Divider';

type HeaderProps = {title: string; style?: StyleProp<ViewStyle>};

const Header = ({title, style}: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 40,
  },
  title: {
    fontSize: 20,
    paddingHorizontal: 20,
    fontWeight: '500',
    alignSelf: 'stretch',
    marginBottom: 12,
  },
});

export default memo(Header);
