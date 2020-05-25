import { getDataFromFieldsNotRender, isFormDataEqualsFormView } from '../utils';

describe('Utils', () => {
  describe('isFormDataEqualsFormView', () => {
    test('should return true when firebaseConfig null', () => {
      const currentForm = { a: 'a', b: 'b' };
      const firebaseConfig = { fields: [{ c: 'c' }, { d: 'd' }] };
      const result = isFormDataEqualsFormView(firebaseConfig, currentForm);
      expect(result).toEqual(true);
    });

    test('should return false when firebaseConfig null', () => {
      const result = isFormDataEqualsFormView(null, {});
      expect(result).toEqual(false);
    });

    test('should return false when firebaseConfig length not equal current form length', () => {
      const currentForm = { a: 'a', b: 'b', c: 'c' };
      const firebaseConfig = { fields: [{ d: 'd' }, { e: 'e' }] };
      const result = isFormDataEqualsFormView(firebaseConfig, currentForm);
      expect(result).toEqual(false);
    });
  });

  describe('getDataFromFieldsNotRender', () => {
    test('should ignore when fields are invisible but no default value ', () => {
      const firebaseConfig = {
        fields: [{ id: 'a', visible: true }, { id: 'b', visible: false }],
      };
      const currentForm = {
        a: 'a',
      };
      const result = getDataFromFieldsNotRender(firebaseConfig, currentForm);
      expect(result).toEqual({});
    });
    test('should get defaultValue from fields are invisible ', () => {
      const firebaseConfig = {
        fields: [
          { id: 'a', visible: true },
          { id: 'b', visible: false, defaultValue: 'b' },
        ],
      };
      const currentForm = {
        a: 'a',
      };
      const result = getDataFromFieldsNotRender(firebaseConfig, currentForm);
      expect(result).toEqual({ b: 'b' });
    });

    test('should get defaultValue as refer Value from fields are invisible ', () => {
      const firebaseConfig = {
        fields: [
          { id: 'a', visible: true },
          { id: 'b', visible: false, defaultValue: '${a}' },
        ],
      };
      const currentForm = {
        a: 'a',
      };
      const result = getDataFromFieldsNotRender(firebaseConfig, currentForm);
      expect(result).toEqual({ b: 'a' });
    });
  });
});
