import {StyleSheet} from 'react-native';
import {Fonts} from '../../Utils/Fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    marginHorizontal: 14,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  intro: {
    lineHeight: 20,
  },
  searchRow: {
    minHeight: 52,
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 18,
  },
  searchInput: {
    flex: 1,
    minHeight: 52,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: '#495057',
    color: '#F8F9FA',
    backgroundColor: '#2B3035',
    fontFamily: Fonts.normal,
    fontSize: 14,
    paddingHorizontal: 14,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  searchButton: {
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#40916C',
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
  },
  disabled: {
    opacity: 0.6,
  },
  resultCard: {
    minHeight: 92,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#343A40',
    backgroundColor: '#2B3035',
    borderRadius: 14,
  },
  resultDetails: {
    flex: 1,
    marginRight: 10,
  },
  resultMeta: {
    marginTop: 3,
    marginBottom: 7,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    paddingHorizontal: 24,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 16,
    backgroundColor: '#2B3035',
  },
  emptyTitle: {
    marginTop: 10,
    marginBottom: 4,
  },
  retryButton: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 5,
    paddingHorizontal: 12,
  },
  reviewCard: {
    padding: 17,
    backgroundColor: 'rgba(82, 183, 136, 0.12)',
    borderWidth: 1,
    borderColor: '#40916C',
    borderRadius: 16,
  },
  reviewName: {
    marginTop: 4,
    marginBottom: 3,
  },
  providerHours: {
    marginTop: 10,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 3,
  },
  helpText: {
    marginBottom: 12,
    lineHeight: 18,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#495057',
    borderRadius: 20,
    backgroundColor: '#2B3035',
  },
  dayChip: {
    minWidth: 44,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginRight: 7,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#495057',
    borderRadius: 20,
    backgroundColor: '#2B3035',
  },
  selectedChip: {
    backgroundColor: '#40916C',
    borderColor: '#52B788',
  },
  sportCard: {
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#343A40',
    backgroundColor: '#2B3035',
    borderRadius: 14,
  },
  sportTitle: {
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeInput: {
    width: '48%',
  },
  publishButton: {
    marginTop: 28,
  },
  publishHint: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
});

export default styles;
