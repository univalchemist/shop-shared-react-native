import { checkJailBroken } from '../jailbreak';
import { NativeModules } from 'react-native';

const mockPlatform = OS => {
  jest.resetModules();
  jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
    OS: OS || 'android',
  }));
};
describe('jailbreak', () => {
  it('checkJailBroken should return fail if platform is android', () => {
    mockPlatform('android');
    const result = checkJailBroken();
    expect(result).toEqual(false);
  });
  it(' should return fail if platform is ios and isJailBroken false', () => {
    mockPlatform('ios');
    NativeModules.CheckJailbreakModule = { isJailBroken: false };
    const result = checkJailBroken();
    expect(result).toEqual(false);
  });

  it(' should return fail if platform is ios and isJailBroken true', () => {
    mockPlatform('ios');
    NativeModules.CheckJailbreakModule = { isJailBroken: true };
    const result = checkJailBroken();
    expect(result).toEqual(true);
  });
});
