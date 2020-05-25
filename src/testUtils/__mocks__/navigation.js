const subscriptionMap = new Map();
const navigation = {
  dispatch: jest.fn(),
  navigate: jest.fn(),
  goBack: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  dangerouslyGetParent: jest.fn(),
  addListener: (state, callback) => {
    const subscriptions = subscriptionMap.get(state) || [];
    subscriptions.push(callback);
    subscriptionMap.set(state, subscriptions);
    return {
      remove: () => {
        const subscriptions = subscriptionMap.get(state);
        subscriptionMap.set(subscriptions.filter(x => x !== callback));
      },
    };
  },

  mockEmitState: state => {
    const subscriptions = subscriptionMap.get(state) || [];
    subscriptions.forEach(x => x());
  },

  clearAll: () => {
    subscriptionMap.clear();
  },
};

export default navigation;
