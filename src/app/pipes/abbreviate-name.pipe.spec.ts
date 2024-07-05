import { AbbreviateNamePipe } from './abbreviate-name.pipe';

describe('AbbreviateNamePipe', () => {
  it('create an instance', () => {
    const pipe = new AbbreviateNamePipe();
    expect(pipe).toBeTruthy();
  });
});
