import {widthPercentageToDP} from '../../Utils/Sizing';

const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  title: {
    marginVertical: 25,
  },
  category: {
    width: widthPercentageToDP(26),
    height: undefined,
    aspectRatio: 1 / 1,
    alignItems: 'center',
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 15,
    marginBottom: 20,
  },
  categoryTitle: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 5,
  },
  categoryContainer: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  selected: {
    borderWidth: 1,
    borderColor: '#FFF',
  },
});

export default styles;
