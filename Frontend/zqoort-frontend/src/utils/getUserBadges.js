import { badges } from "../data/badges";

export const getUserBadges = (user) => {
  return badges.filter(b => b.condition(user));
};