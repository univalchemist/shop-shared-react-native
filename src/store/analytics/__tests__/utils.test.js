import { getActiveRouteName } from '../utils';

describe('Analytics utils', () => {
  describe('getActiveRouteName', () => {
    it('should return active route name from navigation state', () => {
      let navigationState = {
        index: 1,
        routes: [{ name: 'route 0' }, { name: 'route 1' }],
      };

      const activeRouteName = getActiveRouteName(navigationState);

      expect(activeRouteName).toEqual('route 1');
    });

    it('should return nested active route name if there is nested navigator', () => {
      let navigationState = {
        index: 0,
        routes: [
          {
            name: 'route 0',
            index: 1,
            state: {
              index: 0,
              routes: [{ name: 'nested route 0' }, { name: 'nested route 1' }],
            },
          },
          { name: 'route 1' },
        ],
      };

      const activeRouteName = getActiveRouteName(navigationState);

      expect(activeRouteName).toEqual('nested route 0');
    });

    it('should return null if there is no navigator', () => {
      const activeRouteName = getActiveRouteName();

      expect(activeRouteName).toEqual(null);
    });
  });
});
