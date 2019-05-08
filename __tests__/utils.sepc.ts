import { currentPlatform, setCmd, trim } from '../src/utils';

it('Get current os platform.', (): void => {
  expect(currentPlatform()).toBe('WIN');
});

it('Set corresponding copy command.', (): void => {
  const platform = currentPlatform();
  expect(setCmd(platform)).toBe('clip.exe');
});

it('Trim unexpected charactor in string.', (): void => {
  expect(trim(' 1234 test  ')).toBe('test');
});
