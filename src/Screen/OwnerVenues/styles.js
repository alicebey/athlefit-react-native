import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  header: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#343A40',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: '#2B3035',
  },
  headerTitle: {
    flex: 1,
    marginLeft: 14,
  },
  list: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 16,
    backgroundColor: '#2B3035',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    marginRight: 10,
  },
  visibility: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  visible: {
    backgroundColor: 'rgba(82, 183, 136, 0.16)',
  },
  hidden: {
    backgroundColor: 'rgba(173, 181, 189, 0.12)',
  },
  meta: {
    marginTop: 8,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#495057',
  },
  alertText: {
    marginLeft: 6,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 12,
    marginBottom: 6,
  },
  retry: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },
});

export default styles;
