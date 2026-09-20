const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 24, 27, 0.58)',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 12,
  },
  bottom: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingBottom: 12,
  },
  heading: {
    marginBottom: 12,
    lineHeight: 48,
  },
  copy: {
    lineHeight: 23,
    marginBottom: 28,
    maxWidth: 420,
  },
  primaryButton: {
    marginBottom: 12,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#495057',
  },
});

export default styles;
