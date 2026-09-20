import {Fonts} from '../../Utils/Fonts';
import {scaledSize} from '../../Utils/Sizing';

const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 22,
  },
  profileCard: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B3035',
    borderColor: '#343A40',
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#40916C',
    borderRadius: 28,
  },
  identity: {
    flex: 1,
    marginLeft: 13,
  },
  input: {
    minHeight: 44,
    fontFamily: Fonts.semi,
    fontSize: scaledSize(18),
    color: '#FFFFFF',
    borderBottomColor: '#52B788',
    borderBottomWidth: 1,
    paddingVertical: 6,
  },
  editActions: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
  },
  sportCard: {
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B3035',
    borderColor: '#343A40',
    borderWidth: 1,
    borderRadius: 18,
    padding: 10,
  },
  sportImage: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#343A40',
    borderRadius: 14,
  },
  sportText: {
    flex: 1,
    marginHorizontal: 13,
  },
  detailsCard: {
    backgroundColor: '#2B3035',
    borderColor: '#343A40',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  detailRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    flex: 1,
    marginLeft: 14,
  },
  divider: {
    height: 1,
    marginLeft: 33,
    backgroundColor: '#343A40',
  },
  actions: {
    marginTop: 28,
  },
  actionSpacing: {
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 12,
  },
});

export default styles;
