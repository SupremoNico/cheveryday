export default function ActivityCategoryBadge({
  category,
  color,
}: {
  category: string;
  color: string;
}) {
  return (
    <span
      className="category-tag"
      style={{ color, background: `${color}15` }}
    >
      {category}
    </span>
  );
}
