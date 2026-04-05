
export function getBadgeDetails(totalItems: number) {
  if (totalItems >= 1000) return { name: 'Eco-Legend', color: '#14532d', bg: '#dcfce7', icon: '👑' };
  if (totalItems >= 500) return { name: 'Eco-Master', color: '#16a34a', bg: '#dcfce7', icon: '⭐' };
  if (totalItems >= 100) return { name: 'Eco-Elite', color: '#2DB550', bg: '#dcfce7', icon: '⚡' };
  return { name: 'Eco-Warrior', color: '#166534', bg: '#dcfce7', icon: '🌱' };
}

export const LevelBadge = ({ totalItems }: { totalItems: number }) => {
  const badge = getBadgeDetails(totalItems);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: badge.bg, color: badge.color, padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, border: `1px solid ${badge.color}` }}>
      <span>{badge.icon}</span> {badge.name}
    </div>
  );
};
