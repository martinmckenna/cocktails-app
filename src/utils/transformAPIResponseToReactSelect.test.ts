import { transformAPIResponseToReactSelect } from './transformAPIResponseToReactSelect';

describe('functions', () => {
  it('should do the thing', () => {
    expect(
      transformAPIResponseToReactSelect({
        pages: 1,
        total_results: 1,
        data: [
          {
            name: 'hello',
            id: 1,
            ing_type: 'fruit'
          }
        ]
      })
    ).toEqual([
      {
        key: 1,
        value: 1,
        label: 'hello'
      }
    ]);
  });
});
