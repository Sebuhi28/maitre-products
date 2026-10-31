import { useCallback, useEffect, useState } from "react";
import type { Product } from "../../api/api";
import { StateMessage } from "../../components/StateMessage";
import { Toast } from "../../components/Toast";
import { SearchOffIcon, WarningIcon } from "../../components/icons";
import { Pagination } from "./Pagination";
import { ProductFormModal } from "./ProductFormModal";
import { ProductTable } from "./ProductTable";
import { TableSkeleton } from "./TableSkeleton";
import { Toolbar } from "./Toolbar";
import { useCategories } from "./useCategories";
import { useDebouncedValue } from "./useDebouncedValue";
import { useProducts } from "./useProducts";
import { useToggleAvailability } from "./useToggleAvailability";
import { useUrlFilters } from "./useUrlFilters";
import "./ProductsPage.css";

const PAGE_SIZE = 10;

type Notice = {
  text: string;
  variant: "error" | "success";
};

type FormState = {
  product: Product | null;
};

export function ProductsPage() {
  const { filters, setFilters } = useUrlFilters();
  const { search, categoryId, page } = filters;

  const [formState, setFormState] = useState<FormState | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);
  const categories = useCategories();
  const { products, total, loading, error, reload, patchProduct } = useProducts({
    search: debouncedSearch,
    categoryId,
    page,
    pageSize: PAGE_SIZE,
  });

  useEffect(() => {
    if (loading || error) return;
    if (products.length === 0 && total > 0 && page > 1) {
      setFilters({ page: Math.ceil(total / PAGE_SIZE) }, "replace");
    }
  }, [loading, error, products.length, total, page, setFilters]);

  const showError = useCallback((text: string) => {
    setNotice({ text, variant: "error" });
  }, []);

  const dismissNotice = useCallback(() => setNotice(null), []);

  const { toggle, pendingIds } = useToggleAvailability(patchProduct, showError);

  const hasFilters = search.trim() !== "" || categoryId !== undefined;

  const handleSearchChange = (value: string) => {
    setFilters({ search: value, page: 1 }, "replace");
  };

  const handleCategoryChange = (value: number | undefined) => {
    setFilters({ categoryId: value, page: 1 }, "push");
  };

  const handlePageChange = (nextPage: number) => {
    setFilters({ page: nextPage }, "push");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setFilters({ search: "", categoryId: undefined, page: 1 }, "push");
  };

  const handleSaved = (saved: Product, mode: "create" | "edit") => {
    setFormState(null);

    if (mode === "edit") {
      patchProduct(saved.id, saved);
      setNotice({
        text: `“${saved.nameAz}” yadda saxlanıldı.`,
        variant: "success",
      });
      return;
    }

    reload();
    setNotice({
      text: `“${saved.nameAz}” menyuya əlavə olundu.`,
      variant: "success",
    });
  };

  const renderContent = () => {
    if (loading) {
      return <TableSkeleton rows={PAGE_SIZE} />;
    }

    if (error) {
      return (
        <StateMessage
          variant="error"
          icon={<WarningIcon />}
          title="Məhsulları yükləmək alınmadı"
          description={error}
          actionLabel="Yenidən cəhd et"
          onAction={reload}
        />
      );
    }

    if (products.length === 0) {
      return hasFilters ? (
        <StateMessage
          variant="empty"
          icon={<SearchOffIcon />}
          title="Heç nə tapılmadı"
          description="Axtarışa və ya filtrə uyğun məhsul yoxdur. Başqa söz yoxlayın və ya filtrləri təmizləyin."
          actionLabel="Filtrləri təmizlə"
          onAction={clearFilters}
        />
      ) : (
        <StateMessage
          variant="empty"
          icon={<SearchOffIcon />}
          title="Menyuda hələ məhsul yoxdur"
          description="İlk məhsulu əlavə etmək üçün “Yeni məhsul” düyməsini istifadə edin."
          actionLabel="Yeni məhsul"
          onAction={() => setFormState({ product: null })}
        />
      );
    }

    return (
      <>
        <ProductTable
          products={products}
          categories={categories}
          pendingIds={pendingIds}
          onToggle={toggle}
          onEdit={(product) => setFormState({ product })}
        />
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={handlePageChange}
        />
      </>
    );
  };

  return (
    <main className="page">
      <div className="page__head">
        <div>
          <h1>Məhsullar</h1>
          <p className="page__subtitle">
            Menyudakı bütün məhsullar · {total} məhsul
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setFormState({ product: null })}
        >
          + Yeni məhsul
        </button>
      </div>

      <Toolbar
        search={search}
        categoryId={categoryId}
        categories={categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
      />

      {renderContent()}

      {formState && (
        <ProductFormModal
          key={formState.product?.id ?? "new"}
          product={formState.product}
          categories={categories}
          onClose={() => setFormState(null)}
          onSaved={handleSaved}
        />
      )}

      <Toast
        message={notice?.text ?? null}
        variant={notice?.variant}
        onClose={dismissNotice}
      />
    </main>
  );
}