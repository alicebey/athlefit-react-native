import { Fonts } from '../../Utils/Fonts';
import {scaledSize, widthPercentageToDP} from '../../Utils/Sizing';

const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  avatar: {
    backgroundColor: '#52B788',
    borderRadius: 100,
    padding: 10,
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 30,
  },
  name: {
    marginLeft: 24,
    flex: 0.8,
  },
  edit: {
    position: 'absolute',
    right: 0,
    padding: 10,
    alignSelf: 'center',
  },
  title: {
    marginBottom: 20,
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
  },
  categoryTitle: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 5,
    zIndex: 10,
  },
  add: {
    backgroundColor: 'rgba(217, 217, 217, 0.1)',
    width: widthPercentageToDP(26),
    height: undefined,
    aspectRatio: 1 / 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 24,
  },
  list: {
    flex: 1,
  },
  categoryContainer: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  input: {
    fontFamily: Fonts.bold,
    fontSize: scaledSize(24),
    color: '#FFF',
    flex: 1,
  },
});

export default styles;
