import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  content: {
    paddingBottom: 24,
  },
  hero: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#2B3035',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(27, 31, 34, 0.88)',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  intro: {
    marginTop: 3,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginHorizontal: -4,
  },
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    margin: 4,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#495057',
    borderRadius: 20,
    backgroundColor: '#2B3035',
  },
  chipSelected: {
    borderColor: '#52B788',
    backgroundColor: '#3D8F6B',
  },
  dateRow: {
    paddingTop: 12,
    paddingRight: 8,
  },
  dateChip: {
    width: 64,
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#495057',
    borderRadius: 14,
    backgroundColor: '#2B3035',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginHorizontal: -4,
  },
  slot: {
    width: '30.5%',
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#495057',
    borderRadius: 12,
    backgroundColor: '#2B3035',
  },
  slotDisabled: {
    borderColor: '#343A40',
    backgroundColor: '#1B1F22',
  },
  slotSelected: {
    borderColor: '#52B788',
    backgroundColor: '#3D8F6B',
  },
  slotState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 14,
    backgroundColor: '#2B3035',
  },
  slotStateText: {
    marginTop: 8,
    lineHeight: 18,
  },
  retry: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 4,
    paddingHorizontal: 12,
  },
  durationOptions: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginTop: 12,
  },
  duration: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#495057',
    borderRadius: 12,
    backgroundColor: '#2B3035',
  },
  selectedDuration: {
    borderColor: '#52B788',
    backgroundColor: '#3D8F6B',
  },
  priceCard: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 16,
    backgroundColor: '#2B3035',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceCopy: {
    flex: 1,
    marginRight: 12,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#343A40',
  },
  noticeText: {
    flex: 1,
    marginLeft: 6,
    lineHeight: 16,
  },
  submitButton: {
    marginTop: 16,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: '#212529',
  },
  fallbackTitle: {
    marginTop: 12,
    marginBottom: 6,
  },
  fallbackButton: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
});

export default styles;
