import type { Category, Product } from "../../api/api";
import { formatPrice } from "./formatPrice";
import "./ProductTable.css";

type Props = {
  products: Product[];
  categories: Category[];
  pendingIds: Set<number>;
  onToggle: (product: Product) => void;
  onEdit: (product: Product) => void;
};

export function ProductTable({
  products,
  categories,
  pendingIds,
  onToggle,
  onEdit,
}: Props) {
  const categoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="table-card">
      <table className="table">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Kateqoriya</th>
            <th className="table__right">Qiymət</th>
            <th>Status</th>
            <th>
              <span className="visually-hidden">Əməliyyatlar</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className={p.isAvailable ? "" : "row--off"}>
              <td className="cell-name">
                <div className="name-az">{p.nameAz}</div>
                <div className="name-en">{p.nameEn ?? "—"}</div>
              </td>
              <td className="cell-category">
                <span className={`chip ${p.isAvailable ? "" : "chip--outline"}`}>
                  {categoryName(p.categoryId)}
                </span>
              </td>
              <td className="cell-price table__right tabular">
                {formatPrice(p.price)}
              </td>
              <td className="cell-status">
                <div className="status">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={p.isAvailable}
                    aria-label={`${p.nameAz} statusu`}
                    className={`switch ${p.isAvailable ? "switch--on" : ""}`}
                    disabled={pendingIds.has(p.id)}
                    onClick={() => onToggle(p)}
                  />
                  <span>{p.isAvailable ? "Satışda" : "Satışda deyil"}</span>
                </div>
              </td>
              <td className="cell-actions table__right">
                <button
                  type="button"
                  className="btn-small"
                  aria-label={`${p.nameAz} məhsulunu düzəlt`}
                  onClick={() => onEdit(p)}
                >
                  Düzəlt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}