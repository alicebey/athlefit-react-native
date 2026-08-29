import {widthPercentageToDP} from '../../Utils/Sizing';

const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    paddingVertical: 28,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  title: {
    width: widthPercentageToDP(20),
    height: undefined,
    aspectRatio: 21 / 9,
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 5,
  },
  subTitle: {
    width: widthPercentageToDP(10),
    height: undefined,
    aspectRatio: 21 / 9,
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 150,
  },
});

export default styles;
