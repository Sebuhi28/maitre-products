import type { Category } from "../../api/api";
import "./Toolbar.css";

type Props = {
  search: string;
  categoryId: number | undefined;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: number | undefined) => void;
};

export function Toolbar({
  search,
  categoryId,
  categories,
  onSearchChange,
  onCategoryChange,
}: Props) {
  return (
    <div className="toolbar">
      <label className="search">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
          <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={search}
          placeholder="Ada görə axtar..."
          aria-label="Ada görə axtar"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <select
        className="select"
        value={categoryId ?? ""}
        aria-label="Kateqoriya"
        onChange={(e) =>
          onCategoryChange(e.target.value ? Number(e.target.value) : undefined)
        }
      >
        <option value="">Bütün kateqoriyalar</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}