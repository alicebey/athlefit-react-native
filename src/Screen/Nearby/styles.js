import {StyleSheet} from 'react-native';

export const CARD_GAP = 12;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 16,
  },
  headerCard: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 18,
    backgroundColor: 'rgba(27, 31, 34, 0.96)',
  },
  headerCopy: {
    flex: 1,
    marginRight: 12,
  },
  headerIcon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 21,
    backgroundColor: 'rgba(82, 183, 136, 0.14)',
  },
  cardStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
  },
  cardList: {
    paddingHorizontal: 16,
  },
  card: {
    marginRight: CARD_GAP,
    padding: 14,
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 16,
    backgroundColor: 'rgba(27, 31, 34, 0.97)',
  },
  cardSelected: {
    borderColor: '#52B788',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTitle: {
    flex: 1,
    marginRight: 8,
  },
  cardMeta: {
    marginTop: 6,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  secondaryAction: {
    flex: 1,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#52B788',
    borderRadius: 10,
  },
  actionText: {
    marginLeft: 6,
  },
  primaryAction: {
    flex: 1,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#52B788',
  },
  stateCard: {
    alignSelf: 'center',
    alignItems: 'center',
    width: '86%',
    maxWidth: 340,
    marginTop: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 16,
    backgroundColor: 'rgba(27, 31, 34, 0.96)',
  },
  stateTitle: {
    marginTop: 8,
    marginBottom: 3,
  },
  retryButton: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 4,
    paddingHorizontal: 12,
  },
});

export default styles;
