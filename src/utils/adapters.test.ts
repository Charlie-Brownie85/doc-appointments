import { PayloadFromServer, PayloadToServer } from './adapters';

const capitalizedObj = {
  Id: 1,
  Name: 'John Doe',
  Email: 'johndoe@email.com',
  Phone: '123456789',
};

const lowerCaseObj = {
  id: 1,
  name: 'John Doe',
  email: 'johndoe@email.com',
  phone: '123456789',
};

describe('adapters', () => {
  it('PayloadFromServer should return a new object with all keys in lower case', () => {
    const result = PayloadFromServer(capitalizedObj);

    expect(result).toEqual(lowerCaseObj);
  });

  it('PayloadToServer should return a new object with all keys capitalized', () => {
    const result = PayloadToServer(lowerCaseObj);

    expect(result).toEqual(capitalizedObj);
  });

  it('PayloadFromServer should return an array with all keys in lower case', () => {
    const obj = [capitalizedObj, capitalizedObj];

    const result = PayloadFromServer(obj);

    expect(result).toEqual([lowerCaseObj, lowerCaseObj]);
  });

  it('PayloadToServer should return an array with all keys capitalized', () => {
    const obj = [lowerCaseObj, lowerCaseObj];

    const result = PayloadToServer(obj);

    expect(result).toEqual([capitalizedObj, capitalizedObj]);
  });

  it('PayloadFromServer should work also with nested objects', () => {
    const obj = {
      Id: 1,
      Name: 'Jane Doe',
      Email: 'janedoe@email.com',
      Phone: '987654321',
      Relative: capitalizedObj,
    };

    const result = PayloadFromServer(obj);

    expect(result).toEqual({
      id: 1,
      name: 'Jane Doe',
      email: 'janedoe@email.com',
      phone: '987654321',
      relative: lowerCaseObj,
    });
  });

  it('PayloadToServer should work also with nested objects', () => {
    const obj = {
      id: 1,
      name: 'Jane Doe',
      email: 'janedoe@email.com',
      phone: '987654321',
      relative: lowerCaseObj,
    };

    const result = PayloadToServer(obj);

    expect(result).toEqual({
      Id: 1,
      Name: 'Jane Doe',
      Email: 'janedoe@email.com',
      Phone: '987654321',
      Relative: capitalizedObj,
    });
  });
});
