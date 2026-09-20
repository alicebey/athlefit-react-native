const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 16,
    padding: 4,
    borderRadius: 14,
    backgroundColor: '#1B1F22',
  },
  tab: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  tabSelected: {
    backgroundColor: '#2B3035',
  },
  emptyImage: {
    width: '75%',
    height: undefined,
    aspectRatio: 16 / 9,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    marginTop: 14,
    marginBottom: 5,
  },
  emptyAction: {
    marginTop: 16,
    padding: 10,
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});

export default styles;
