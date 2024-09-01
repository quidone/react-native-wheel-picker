import React, {ReactNode} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

const Button = ({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000', // 黒を基調とした背景色
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // 影の色を黒に設定
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Androidの影
  },
  buttonText: {
    color: '#fff', // 白いテキスト
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
