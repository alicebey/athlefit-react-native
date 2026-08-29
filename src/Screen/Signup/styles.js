const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 20,
  },
  body: {
    justifyContent: 'space-between',
    flex: 1,
  },
  signup: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
