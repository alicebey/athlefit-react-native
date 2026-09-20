const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212529',
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 28,
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 6,
    paddingHorizontal: 24,
  },
  category: {
    width: '48%',
    aspectRatio: 1.05,
    alignItems: 'center',
    backgroundColor: '#2B3035',
    borderWidth: 1,
    borderColor: '#343A40',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    padding: 8,
  },
  categoryImage: {
    flex: 1,
    width: '100%',
  },
  categoryTitle: {
    marginTop: 4,
    marginBottom: 4,
  },
  categoryContainer: {
    flex: 1,
  },
  categoryList: {
    paddingBottom: 8,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  body: {
    flex: 1,
  },
  selected: {
    borderWidth: 2,
    borderColor: '#52B788',
    backgroundColor: 'rgba(82, 183, 136, 0.12)',
  },
  buttonContainer: {
    paddingTop: 8,
  },
});

export default styles;
