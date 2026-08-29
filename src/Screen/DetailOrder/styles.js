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
  name: {
    borderWidth: 2,
    borderColor: '#52B788',
    padding: 15,
    borderRadius: 12,
    marginTop: 5,
  },
  bookingName: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    borderWidth: 1,
    borderColor: '#52B788',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bookingDate: {
    marginRight: 24,
  },
  duration: {
    borderWidth: 1,
    borderColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 5,
    marginRight: 20,
  },
  bookingDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationContainer: {
    marginBottom: 25,
  },
  selectedDuration: {
    borderColor: '#52B788'
  },
});

export default styles;
