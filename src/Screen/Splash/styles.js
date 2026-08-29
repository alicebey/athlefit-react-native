import {heightPercentageToDP, widthPercentageToDP} from '../../Utils/Sizing';

const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width: widthPercentageToDP(20),
    height: undefined,
    alignItems: 'center',
    aspectRatio: 21 / 9,
    marginBottom: 5,
  },
  subTitle: {
    width: widthPercentageToDP(10),
    height: undefined,
    aspectRatio: 21 / 9,
    alignItems: 'center',
    marginLeft: 120,
  },
});

export default styles;
