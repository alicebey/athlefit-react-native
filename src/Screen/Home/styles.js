import {widthPercentageToDP} from '../../Utils/Sizing';

const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    minHeight: 52,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#343A40',
    borderColor: '#495057',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
  },
  searchPlaceholder: {
    flex: 1,
    marginHorizontal: 10,
  },
  title: {
    marginTop: 24,
    marginBottom: 12,
  },
  logo: {
    width: widthPercentageToDP(10),
    height: undefined,
    aspectRatio: 1 / 1,
    alignItems: 'center',
    marginBottom: 5,
  },
  menu: {
    flex: 1,
    height: undefined,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    marginBottom: 8,
    aspectRatio: 1 / 1,
    backgroundColor: '#2B3035',
    borderRadius: 16,
    borderColor: '#343A40',
    borderWidth: 1,
  },
  menuPlaceholder: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  menuRow: {
    justifyContent: 'space-between',
  },
  categoryContainer: {
    marginHorizontal: -4,
    marginBottom: 18,
  },
  recommendationContainer: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 14,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 90,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyTitle: {
    marginTop: 12,
    marginBottom: 4,
  },
  retryButton: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },
});

export default styles;
