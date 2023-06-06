import React, {memo} from 'react';
import {StyleSheet, Text} from 'react-native';
import Divider from './Divider';

type HeaderProps = {title: string};

const Header = ({title}: HeaderProps) => {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <Divider />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    paddingHorizontal: 20,
    fontWeight: '500',
    marginBottom: 12,
    alignSelf: 'stretch',
  },
});

export default memo(Header);
