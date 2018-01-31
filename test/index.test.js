const Api = require('./../src');
const Validator = require('./../src/validator');

describe('index', () => {
  test('Should be a func', async () => {
    expect(Api).toBeInstanceOf(Function);
  });

  test('Should validate with callback', async () => {
    let mark = false;
    const result = await Api.string().validate('foobar', (error) => {
      expect(error).toBe(false);
      mark = true;
    });

    // to avoid false positive we check the callback real use
    expect(mark).toBe(true);
  });

  test('Should validate with callback and error', async () => {
    let mark = false;
    const result = await Api.string().validate(1, (error) => {
      expect(error).toBeTruthy();
      mark = true;
    });

    // to avoid false positive we check the callback real use
    expect(mark).toBe(true);
  });

  test('Should validate with await', async () => {
    const result = await Api.string().validate('foobar');
    expect(result).toBe(false);
  });

  test('Should validate with callback and error', async () => {
    const result = await Api.string().validate(1);
    expect(result).toBeTruthy();
  });

  describe('schema()', () => {
    test('should pass', async () => {
      const instance = Api({ foo: Api.string() });
      expect(instance).toBeInstanceOf(Validator);
    });
    test('should throw error on bad params', async () => {
      expect(() => {
        Api(true);
      }).toThrow('schema should be object');
    });
  });

  describe('options()', () => {
    test('should throw error on bad params', async () => {
      expect(() => {
        Api({}).options(true);
      }).toThrow('schema should be object');
    });

    describe('unknown', () => {
      test('should failed', async () => {
        const hasError = await Api({
          name: Api.string(),
          login: Api.string()
        }).body({
          name: 'top',
          foo: 'bar'
        }).options({
          unknown: false
        }).validate();

        expect(hasError).toEqual({ type: 'only' });
      });
    });
  });

  describe('validate()', () => {
    test('Should validate simple schema', async () => {
      const hasError = await Api({
        login: Api.string()
      }).body({ login: 'foobar' }).validate();
      expect(hasError).toBe(false);
    });
    test('Should not pass simple schema', async () => {
      const hasError = await Api({
        login: Api.string()
      }).body({ login: 1 }).validate();
      expect(hasError).toBeTruthy();
    });
  });
});
