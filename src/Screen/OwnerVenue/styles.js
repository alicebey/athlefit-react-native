import {StyleSheet} from 'react-native';
import {Fonts} from '../../Utils/Fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
  },
  flex: {
    flex: 1,
  },
  header: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 4,
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
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginTop: 20,
  },
  sectionHint: {
    marginTop: 2,
    marginBottom: 4,
    lineHeight: 17,
  },
  card: {
    marginTop: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 16,
    backgroundColor: '#2B3035',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardNote: {
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#495057',
  },
  rowValue: {
    flex: 1,
    marginLeft: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  smallButton: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 10,
  },
  buttonGap: {
    marginLeft: 10,
  },
  rejectBox: {
    marginTop: 12,
  },
  textInput: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#495057',
    borderRadius: 12,
    color: '#FFFFFF',
    backgroundColor: '#212529',
    fontFamily: Fonts.normal,
    fontSize: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  dayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginHorizontal: -4,
  },
  day: {
    minWidth: 48,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#495057',
    borderRadius: 12,
    backgroundColor: '#2B3035',
  },
  daySelected: {
    borderColor: '#52B788',
    backgroundColor: '#3D8F6B',
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  courtInput: {
    width: 96,
  },
  saveButton: {
    marginTop: 18,
  },
  state: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  stateText: {
    marginTop: 8,
  },
  retry: {
    minHeight: 44,
    justifyContent: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },
});

export default styles;
