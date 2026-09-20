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

  flex: {
    flex: 1,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 14,
    backgroundColor: '#2B3035',
  },
  noticeCopy: {
    flex: 1,
    marginLeft: 10,
  },
  noticeBody: {
    marginTop: 2,
    lineHeight: 18,
  },
  card: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 16,
    backgroundColor: '#2B3035',
  },
  cardTitle: {
    marginBottom: 7,
  },
  formTitle: {
    marginTop: 18,
    marginBottom: 12,
  },
  payButton: {
    marginTop: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#52B788',
  },
  actionSpacing: {
    marginLeft: 10,
  },
  cancelHint: {
    marginTop: 10,
    lineHeight: 17,
  },
  heading: {
    marginTop: 10,
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  addressText: {
    flex: 1,
    marginLeft: 8,
    lineHeight: 20,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#495057',
  },
  detailValue: {
    flex: 1,
    marginLeft: 20,
  },

  cancelButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#C92A2A',
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
