import {widthPercentageToDP} from '../../Utils/Sizing';

const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginVertical: 15,
  },
  logo: {
    width: widthPercentageToDP(9),
    height: undefined,
    aspectRatio: 1 / 1,
    alignItems: 'center',
    marginBottom: 5,
  },
  menu: {
    width: widthPercentageToDP(18),
    height: undefined,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    marginBottom: 10,
    aspectRatio: 1 / 1,
  },
  categoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  scroll: {
    paddingBottom: 350,
  },
});

export default styles;
