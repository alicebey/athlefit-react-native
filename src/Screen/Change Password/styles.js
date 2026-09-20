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
    paddingHorizontal: 20,
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#343A40',
  },
  backButton: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -10,
  },
  headerSpacer: {
    width: 44,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    paddingTop: 32,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  title: {
    marginBottom: 28,
  },
  description: {
    color: '#ADB5BD',
    lineHeight: 21,
    marginTop: 8,
  },
  hint: {
    color: '#ADB5BD',
    marginTop: 6,
    marginBottom: 16,
  },
  button: {
    marginTop: 28,
  },
});

export default styles;
