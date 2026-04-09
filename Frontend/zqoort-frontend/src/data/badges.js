export const badges = [
  { id: 1, name: "New User", condition: (u) => u.points >= 0 },
  { id: 2, name: "Helper", condition: (u) => u.points >= 10 },
  { id: 3, name: "Pro", condition: (u) => u.points >= 50 },
];