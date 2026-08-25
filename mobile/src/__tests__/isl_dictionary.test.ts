import { ISLSignItem, SignCategory } from '../types';

const ISL_DICTIONARY: ISLSignItem[] = [
  { id: '1', name: 'HELLO', category: 'Basic', description: 'Open dominant hand near temple and wave outward gracefully.', gestureHint: 'Wave open palm from forehead outward', difficulty: 'Easy' },
  { id: '2', name: 'THANK YOU', category: 'Basic', description: 'Touch fingertips of flat dominant hand to chin, then extend forward towards receiver.', gestureHint: 'Flat hand from chin moving forward', difficulty: 'Easy' },
  { id: '3', name: 'YES', category: 'Basic', description: 'Make a fist and nod it up and down twice like a nodding head.', gestureHint: 'Fist nodding up and down', difficulty: 'Easy' },
  { id: '4', name: 'NO', category: 'Basic', description: 'Extend index and middle finger, snap them quickly against thumb.', gestureHint: 'Index & middle fingers tapping thumb', difficulty: 'Easy' },
  { id: '5', name: 'PLEASE', category: 'Basic', description: 'Place flat hand over chest and move in circular motion clockwise.', gestureHint: 'Flat palm circular motion on chest', difficulty: 'Easy' },
  { id: '6', name: 'SORRY', category: 'Basic', description: 'Form an "S" fist and rub in circular motion over heart.', gestureHint: 'Fist rubbing chest in circle', difficulty: 'Easy' },
  { id: '7', name: 'HELP', category: 'Emergency', description: 'Place dominant fist with thumb up over open palm of non-dominant hand and lift both slightly.', gestureHint: 'Thumb-up fist resting on flat palm lifted upward', difficulty: 'Medium' },
  { id: '8', name: 'WATER', category: 'Food', description: 'Form a "W" with index, middle, and ring fingers, tap index finger against chin.', gestureHint: 'Three fingers tapping chin', difficulty: 'Easy' },
  { id: '9', name: 'FOOD', category: 'Food', description: 'Bring fingertips together near lips as if putting morsel into mouth.', gestureHint: 'Fingertips bunched at mouth', difficulty: 'Easy' },
  { id: '10', name: 'HOME', category: 'Places', description: 'Touch flat fingers to cheek near mouth, then move to cheek near ear.', gestureHint: 'Fingertips touching mouth area then ear area', difficulty: 'Medium' },
  { id: '11', name: 'SCHOOL', category: 'Places', description: 'Clap flat hands horizontally twice.', gestureHint: 'Horizontal palm claps twice', difficulty: 'Easy' },
  { id: '12', name: 'HOSPITAL', category: 'Places', description: 'Use index and middle finger to draw an "H" cross shape on opposite upper arm.', gestureHint: 'Cross gesture on shoulder arm', difficulty: 'Medium' },
  { id: '13', name: 'GOOD', category: 'Basic', description: 'Fingertips at chin, move flat hand forward and downward.', gestureHint: 'Flat hand moving down from mouth', difficulty: 'Easy' },
  { id: '14', name: 'BAD', category: 'Basic', description: 'Fingertips at chin, turn palm outward and push downward sharply.', gestureHint: 'Palm pushing away from mouth downward', difficulty: 'Easy' },
  { id: '15', name: 'NAME', category: 'People', description: 'Tap index and middle fingers of both hands across each other at right angles.', gestureHint: 'H-fingers tapping crosswise', difficulty: 'Medium' },
  { id: '16', name: 'STOP', category: 'Basic', description: 'Chop edge of dominant flat hand onto palm of non-dominant hand sharply.', gestureHint: 'Hand edge chopping open palm', difficulty: 'Easy' },
  { id: '17', name: 'I', category: 'People', description: 'Point index finger towards own chest.', gestureHint: 'Index finger pointing to self', difficulty: 'Easy' },
  { id: '18', name: 'YOU', category: 'People', description: 'Point index finger toward second person.', gestureHint: 'Index finger pointing forward', difficulty: 'Easy' },
  { id: '19', name: 'WE', category: 'People', description: 'Point index finger to right shoulder, then circle around to left shoulder.', gestureHint: 'Index finger arc between shoulders', difficulty: 'Medium' },
  { id: '20', name: 'WHAT', category: 'Phrases', description: 'Hold open palms facing upward and shake side to side slightly with inquisitive facial expression.', gestureHint: 'Open palms shaking side to side', difficulty: 'Easy' },
  { id: '21', name: 'WHERE', category: 'Phrases', description: 'Hold index finger up and wave side to side like a pendulum.', gestureHint: 'Index finger waving side to side', difficulty: 'Easy' },
  { id: '22', name: 'HOW', category: 'Phrases', description: 'Rest curved knuckles together with palms down, rotate palms upward in arc.', gestureHint: 'Curved knuckles rotating upward', difficulty: 'Medium' },
  { id: '23', name: 'GOOD MORNING', category: 'Phrases', description: 'Sign GOOD (chin to palm) followed by MORNING (arm rising up like sun).', gestureHint: 'GOOD sign + sun rising arc gesture', difficulty: 'Hard' },
  { id: '24', name: 'GOOD NIGHT', category: 'Phrases', description: 'Sign GOOD followed by NIGHT (dominant hand arched over arm like setting sun).', gestureHint: 'GOOD sign + hand arching over arm', difficulty: 'Hard' },
];

describe('ISL Dictionary Sign Cards Extensive Tests', () => {
  test('should contain valid items in ISL dictionary', () => {
    expect(ISL_DICTIONARY.length).toBe(24);
  });

  ISL_DICTIONARY.forEach((item) => {
    test(`should validate dictionary properties for sign '${item.name}'`, () => {
      expect(item.id).toBeDefined();
      expect(item.name.length).toBeGreaterThan(0);
      expect(['Basic', 'People', 'Food', 'Places', 'Emergency', 'Phrases']).toContain(item.category);
      expect(item.description.length).toBeGreaterThan(10);
      expect(item.gestureHint.length).toBeGreaterThan(5);
      expect(['Easy', 'Medium', 'Hard']).toContain(item.difficulty);
    });
  });

  const categories: (SignCategory | 'All')[] = ['All', 'Basic', 'People', 'Food', 'Places', 'Emergency', 'Phrases'];
  categories.forEach((cat) => {
    test(`should filter dictionary correctly for category '${cat}'`, () => {
      const filtered = cat === 'All' ? ISL_DICTIONARY : ISL_DICTIONARY.filter((s) => s.category === cat);
      expect(filtered).toBeDefined();
      if (cat !== 'All') {
        filtered.forEach((item) => expect(item.category).toBe(cat));
      }
    });
  });
});
