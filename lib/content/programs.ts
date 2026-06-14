export type CoachingProgram = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  duration: string;
  idealFor: string;
  forPeopleWho: string[];
  outcomes: string[];
};

export const coachingPrograms: CoachingProgram[] = [
  {
    id: "foundation-edit",
    name: "Foundation Edit",
    eyebrow: "Start strong",
    description:
      "A focused reset for people who want structure and a clear plan without tracking everything.",
    duration: "8 weeks",
    idealFor: "New or returning clients",
    forPeopleWho: [
      "Haven't trained consistently in 6+ months",
      "Feel stuck in an all-or-nothing cycle",
      "Want a clear plan without tracking everything",
    ],
    outcomes: [
      "A realistic workout routine",
      "Daily nutrition structure",
      "Weekly habits that feel automatic",
    ],
  },
  {
    id: "body-recomposition",
    name: "Body Recomposition",
    eyebrow: "Build the next version",
    description:
      "Lose fat while building strength, with accountability and steady progression.",
    duration: "12 weeks",
    idealFor: "Ready for visible progress",
    forPeopleWho: [
      "Already exercise occasionally",
      "Want to lose fat while building strength",
      "Need accountability and progression",
    ],
    outcomes: [
      "Measurable fat-loss progress",
      "Strength benchmarks improved",
      "Nutrition targets dialed in",
    ],
  },
  {
    id: "executive-wellness",
    name: "Executive Wellness",
    eyebrow: "High performance, real life",
    description:
      "Health systems that survive travel, meetings, and a full calendar.",
    duration: "16 weeks",
    idealFor: "Busy leaders and professionals",
    forPeopleWho: [
      "Lead busy professional lives",
      "Travel frequently",
      "Need systems that survive chaos",
    ],
    outcomes: [
      "Travel-proof routines",
      "Better energy and recovery",
      "Health systems that fit your calendar",
    ],
  },
];

export function getProgramById(id: string) {
  return coachingPrograms.find((program) => program.id === id);
}
