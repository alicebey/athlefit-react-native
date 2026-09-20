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
    marginTop: 36,
    marginBottom: 28,
  },
  subtitle: {
    color: '#ADB5BD',
    lineHeight: 21,
    marginTop: 8,
  },
  body: {
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  forgotButton: {
    minHeight: 44,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  buttonContainer: {
    paddingTop: 32,
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
