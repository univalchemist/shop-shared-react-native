import { assignDefaultValueForDependentQuestions } from '../helpers';

describe('assignDefaultValueForDependentQuestions', () => {
  test('should be empty', async () => {
    const values = [];
    const questions = { questionGroups: {} };
    const result = assignDefaultValueForDependentQuestions(values, questions);
    expect(result).toEqual(values);
  });
  test('shoule be', async () => {
    const values = { a1: 'a', a2: 'b', a7: 'c' };
    const questions = {
      dependentQuestion: {},
      questionGroups: {
        test1: [
          { name: 'a1', dependentQuestion: 'b1', defaultValue: 'c1' },
          { name: 'a2', dependentQuestion: 'b2', defaultValue: 'c2' },
        ],
        test2: [
          { name: 'a3', dependentQuestion: 'b3', defaultValue: 'c3' },
          { name: 'a4', dependentQuestion: 'b4', defaultValue: 'c4' },
        ],
      },
    };
    const result = assignDefaultValueForDependentQuestions(values, questions);
    expect(result).toEqual({
      a1: 'a',
      a2: 'b',
      a3: 'c3',
      a4: 'c4',
      a7: 'c',
    });
  });
});
