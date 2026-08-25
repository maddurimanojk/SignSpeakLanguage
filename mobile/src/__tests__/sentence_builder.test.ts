import { SentenceBuilder } from '../services/temporal';

describe('SentenceBuilder Extensive Unit Tests', () => {
  let builder: SentenceBuilder;

  const ISL_SIGNS = [
    'HELLO', 'THANK YOU', 'YES', 'NO', 'PLEASE', 'SORRY', 'HELP',
    'WATER', 'FOOD', 'HOME', 'SCHOOL', 'HOSPITAL', 'GOOD', 'BAD',
    'NAME', 'STOP', 'COME', 'GO', 'I', 'YOU', 'WE', 'WHAT',
    'WHERE', 'HOW', 'WELCOME', 'GOOD MORNING', 'GOOD NIGHT'
  ];

  beforeEach(() => {
    builder = new SentenceBuilder();
  });

  test('should start with an empty sentence', () => {
    expect(builder.getSentence()).toBe('');
    expect(builder.getWords()).toEqual([]);
  });

  ISL_SIGNS.forEach((sign) => {
    test(`should add ISL sign word '${sign}' correctly`, () => {
      const words = builder.addWord(sign);
      expect(words).toContain(sign);
      expect(builder.getSentence()).toBe(sign);
    });
  });

  test('should trim leading/trailing whitespace and convert to uppercase', () => {
    builder.addWord('   water  ');
    expect(builder.getSentence()).toBe('WATER');
  });

  test('should ignore empty string or whitespace-only additions', () => {
    builder.addWord('');
    builder.addWord('   ');
    expect(builder.getSentence()).toBe('');
  });

  test('should append consecutive words into a single sentence string', () => {
    builder.addWord('I');
    builder.addWord('YOU');
    builder.addWord('HELP');
    expect(builder.getSentence()).toBe('I YOU HELP');
    expect(builder.getWords()).toEqual(['I', 'YOU', 'HELP']);
  });

  test('should perform backspace by removing the last added word', () => {
    builder.addWord('GOOD');
    builder.addWord('MORNING');
    expect(builder.getSentence()).toBe('GOOD MORNING');

    const updated = builder.backspace();
    expect(updated).toEqual(['GOOD']);
    expect(builder.getSentence()).toBe('GOOD');
  });

  test('should handle backspace on empty sentence without throwing', () => {
    const updated = builder.backspace();
    expect(updated).toEqual([]);
    expect(builder.getSentence()).toBe('');
  });

  test('should clear all words and reset sentence to empty string', () => {
    builder.addWord('PLEASE');
    builder.addWord('STOP');
    builder.addWord('HERE');
    expect(builder.getSentence()).toBe('PLEASE STOP HERE');

    const cleared = builder.clear();
    expect(cleared).toEqual([]);
    expect(builder.getSentence()).toBe('');
  });
});
