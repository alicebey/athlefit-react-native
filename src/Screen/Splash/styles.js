const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loading: {
    position: 'absolute',
    bottom: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    marginLeft: 10,
  },
  feedback: {
    width: '100%',
    alignItems: 'center',
    marginTop: 48,
  },
  feedbackTitle: {
    marginTop: 14,
    marginBottom: 4,
  },
  retryButton: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
  signOutButton: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 8,
  },
});

export default styles;
