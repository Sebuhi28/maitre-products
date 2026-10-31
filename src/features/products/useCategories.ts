import { useEffect, useState } from "react";
import { getCategories, type Category } from "../../api/api";

export function useCategories(): Category[] {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((result) => {
        if (!cancelled) setCategories(result);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}