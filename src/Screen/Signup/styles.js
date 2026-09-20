const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginTop: 12,
  },
  title: {
    marginTop: 28,
    marginBottom: 26,
  },
  subtitle: {
    color: '#ADB5BD',
    lineHeight: 21,
    marginTop: 8,
  },
  body: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  hint: {
    color: '#ADB5BD',
    marginTop: 6,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 28,
  },
  signup: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 44,
    marginTop: 10,
  },
  linkButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
});

export default styles;
