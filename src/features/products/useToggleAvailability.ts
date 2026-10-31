import { useCallback, useState } from "react";
import { updateProduct, type Product } from "../../api/api";

type PatchFn = (id: number, changes: Partial<Product>) => void;

export function useToggleAvailability(
  patchProduct: PatchFn,
  onError: (message: string) => void
) {
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  const toggle = useCallback(
    async (product: Product) => {
      const next = !product.isAvailable;

      patchProduct(product.id, { isAvailable: next });
      setPendingIds((prev) => new Set(prev).add(product.id));

      try {
        await updateProduct(product.id, { isAvailable: next });
      } catch (e) {
        patchProduct(product.id, { isAvailable: !next });
        const reason = e instanceof Error ? e.message : "Xəta baş verdi.";
        onError(`“${product.nameAz}” statusu dəyişmədi. ${reason}`);
      } finally {
        setPendingIds((prev) => {
          const copy = new Set(prev);
          copy.delete(product.id);
          return copy;
        });
      }
    },
    [patchProduct, onError]
  );

  return { toggle, pendingIds };
}