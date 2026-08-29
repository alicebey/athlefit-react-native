const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  emptyImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flex: 1,
    padding: 10,
  },
});

export default styles;
