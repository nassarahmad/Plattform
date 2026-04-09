import { getUserBadges } from "../utils/getUserBadges";

export default function Badges({ user }) {
  const userBadges = getUserBadges(user);

  return (
    <div>
      <h3>Badges</h3>
      {userBadges.map(b => (
        <span key={b.id}>{b.name}</span>
      ))}
    </div>
  );
}