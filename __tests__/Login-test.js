import React from 'react';
import renderer, {act} from 'react-test-renderer';
import LoginScreen from '../src/Screen/Login';
import ForgotPasswordScreen from '../src/Screen/ForgotPassword';
import LoadingHelper from '../src/Utils/LoadingHelper';

const mockSendPasswordResetEmail = jest.fn();
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();

jest.mock('@react-native-firebase/auth', () => () => ({
  sendPasswordResetEmail: mockSendPasswordResetEmail,
}));
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    reset: jest.fn(),
  }),
}));
jest.mock('../src/Service/sessionStore', () => ({
  useSessionStore: () => ({login: jest.fn(), setCategory: jest.fn()}),
}));
jest.mock('../src/Service/userService', () => ({getCurrentUser: jest.fn()}));
jest.mock('../src/Utils/LoadingHelper', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}));
jest.mock('../src/Component/Header', () => 'Header');
jest.mock('../src/Component/Text', () => 'Text');
jest.mock('../src/Component/Input', () => 'Input');
jest.mock('../src/Component/Button', () => 'Button');
jest.mock('../src/Component/AlertModal', () => 'AlertModal');
jest.mock('react-native-vector-icons/Feather', () => 'Icon');

beforeEach(() => {
  mockSendPasswordResetEmail.mockReset();
  mockNavigate.mockReset();
  mockGoBack.mockReset();
  LoadingHelper.show.mockClear();
  LoadingHelper.hide.mockClear();
});

it('opens the forgot password screen with the entered email', () => {
  const screen = renderer.create(<LoginScreen />);

  act(() => {
    screen.root
      .findByProps({title: 'Email'})
      .props.onChangeText('  eki@example.com  ');
  });
  act(() => {
    screen.root
      .findByProps({accessibilityLabel: 'Forgot password'})
      .props.onPress();
  });

  expect(mockNavigate).toHaveBeenCalledWith('Forgot Password', {
    email: 'eki@example.com',
  });
});

it('sends a Firebase password reset email from its own screen', async () => {
  mockSendPasswordResetEmail.mockResolvedValue();
  const screen = renderer.create(
    <ForgotPasswordScreen route={{params: {email: 'eki@example.com'}}} />,
  );

  await act(async () => {
    await screen.root.findByProps({title: 'Send Reset Link'}).props.onPress();
  });

  expect(mockSendPasswordResetEmail).toHaveBeenCalledWith('eki@example.com');
  expect(LoadingHelper.show).toHaveBeenCalledTimes(1);
  expect(LoadingHelper.hide).toHaveBeenCalledTimes(1);
  expect(screen.root.findByType('AlertModal').props.body).toContain(
    'reset link will arrive',
  );
});
