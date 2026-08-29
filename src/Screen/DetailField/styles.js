const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 16 / 9,
  },
  body: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    marginBottom: 10,
  },
  rating: {
    marginTop: -15,
  },
  address: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  operationalTitle: {
    marginBottom: 20,
  },
  operational: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  back: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    padding: 10,
  },
});

export default styles;
