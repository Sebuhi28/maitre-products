import { useCallback, useEffect, useState } from "react";

export type Filters = {
  search: string;
  categoryId: number | undefined;
  page: number;
};

type Mode = "push" | "replace";

function readFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  const category = Number(params.get("category"));
  const page = Number(params.get("page"));

  return {
    search: params.get("q") ?? "",
    categoryId: Number.isInteger(category) && category > 0 ? category : undefined,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}

function writeFilters(filters: Filters, mode: Mode): void {
  const params = new URLSearchParams();

  if (filters.search) params.set("q", filters.search);
  if (filters.categoryId !== undefined) {
    params.set("category", String(filters.categoryId));
  }
  if (filters.page > 1) params.set("page", String(filters.page));

  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ""}`;

  if (mode === "push") {
    window.history.pushState(null, "", url);
  } else {
    window.history.replaceState(null, "", url);
  }
}

export function useUrlFilters() {
  const [filters, setFiltersState] = useState<Filters>(readFilters);

  useEffect(() => {
    const handlePopState = () => setFiltersState(readFilters());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const setFilters = useCallback(
    (changes: Partial<Filters>, mode: Mode = "push") => {
      const next = { ...readFilters(), ...changes };
      writeFilters(next, mode);
      setFiltersState(next);
    },
    []
  );

  return { filters, setFilters };
}