import { useCallback, useEffect, useState } from "react";
import { getProducts, type Product } from "../../api/api";

type Params = {
  search: string;
  categoryId: number | undefined;
  page: number;
  pageSize: number;
};

type State = {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
};

type Result = State & {
  reload: () => void;
  patchProduct: (id: number, changes: Partial<Product>) => void;
};

export function useProducts({
  search,
  categoryId,
  page,
  pageSize,
}: Params): Result {
  const [state, setState] = useState<State>({
    products: [],
    total: 0,
    loading: true,
    error: null,
  });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    getProducts({ search, categoryId, page, pageSize })
      .then((result) => {
        if (cancelled) return;
        setState({
          products: result.items,
          total: result.total,
          loading: false,
          error: null,
        });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : "Xəta baş verdi.";
        setState((prev) => ({ ...prev, loading: false, error: message }));
      });

    return () => {
      cancelled = true;
    };
  }, [search, categoryId, page, pageSize, reloadKey]);

  const reload = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  const patchProduct = useCallback((id: number, changes: Partial<Product>) => {
    setState((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === id ? { ...p, ...changes } : p
      ),
    }));
  }, []);

  return { ...state, reload, patchProduct };
}