const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  footer: {
    padding: 10,
    alignItems: 'center',
  },
});

export default styles;
