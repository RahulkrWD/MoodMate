// Placeholder recommendations shown until the real POST /mood/analyze
// endpoint exists (M4). Swap MoodWizardPage's call to
// getSampleRecommendation() for api/mood.js's analyzeMood() once that
// backend route is live - everything downstream (ResultCard rendering,
// history save) is already wired to this same { food, watch, activity } shape.
const SAMPLES = {
  happy: [
    { food: "Treat yourself to a fresh fruit bowl or your favorite smoothie.", watch: "A feel-good comedy you've already seen and love.", activity: "Call a friend and share the good news." },
  ],
  sad: [
    { food: "A warm bowl of soup or comfort food you grew up with.", watch: "A gentle, cozy movie - nothing too heavy.", activity: "Wrap yourself in a blanket and journal for 10 minutes." },
  ],
  stressed: [
    { food: "Herbal tea and a small snack, nothing heavy on the stomach.", watch: "A calming nature documentary.", activity: "Try a 5-minute breathing exercise or short walk outside." },
  ],
  low_energy: [
    { food: "Something light and energizing, like a fruit smoothie.", watch: "An easy, low-effort sitcom episode.", activity: "A short 10-minute stretch or nap if you can." },
  ],
  anxious: [
    { food: "Chamomile tea - skip the caffeine for now.", watch: "Something familiar and predictable you can put on in the background.", activity: "Try grounding: name 5 things you can see, 4 you can hear, 3 you can touch." },
  ],
  bored: [
    { food: "Try cooking or ordering something you've never had before.", watch: "Start a new series you've been meaning to watch.", activity: "Learn a small new skill for 15 minutes - a card trick, a recipe, anything." },
  ],
  angry: [
    { food: "Cold water or a crunchy snack to reset.", watch: "Something distracting and mindless for a bit.", activity: "Go for a brisk walk or do a few minutes of physical activity to burn it off." },
  ],
};

const FALLBACK = {
  food: "A meal or snack that usually makes you feel good.",
  watch: "Something familiar and comforting.",
  activity: "A short break doing something you enjoy.",
};

export function getSampleRecommendation(mood) {
  const options = SAMPLES[mood];
  if (!options || options.length === 0) return FALLBACK;
  return options[Math.floor(Math.random() * options.length)];
}
