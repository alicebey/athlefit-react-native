import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  content: {
    paddingBottom: 20,
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
  ratingRow: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingStars: {
    alignSelf: 'flex-start',
    marginRight: 8,
    marginVertical: 0,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  addressText: {
    flex: 1,
    marginLeft: 8,
    lineHeight: 21,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    minHeight: 72,
    justifyContent: 'center',
    marginHorizontal: 5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 14,
    backgroundColor: '#2B3035',
  },
  section: {
    marginTop: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 16,
    backgroundColor: '#2B3035',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    marginLeft: 8,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#495057',
  },
  attribution: {
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginTop: 24,
  },
  secondaryButton: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#52B788',
  },
  primaryButton: {
    flex: 1,
    marginHorizontal: 5,
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
