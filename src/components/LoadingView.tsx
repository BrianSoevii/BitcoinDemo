import * as React from 'react';
import LottieView from 'lottie-react-native';
import {StyleSheet} from 'react-native';

interface IProps {
  backgroundColor?: string;
  textColor?: string;
  text?: string;
  animation?: any;
  absolute?: boolean;
}

const animationAux = require('src/assets/BitcoinAnimation.json');

const styles = StyleSheet.create({
  lottie: {width: '100%', height: '100%'},
});

function LoadingView({animation = animationAux}: IProps) {
  return (
    <LottieView
      style={styles.lottie}
      source={animation}
      autoPlay
      speed={0.7}
      renderMode="HARDWARE"
      loop
    />
  );
}

export default React.memo(LoadingView);
