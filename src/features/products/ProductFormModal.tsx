import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  createProduct,
  updateProduct,
  type Category,
  type Product,
} from "../../api/api";
import {
  emptyValues,
  toInput,
  validate,
  valuesFromProduct,
  type FormErrors,
  type FormField,
  type FormValues,
} from "./validateProduct";
import "./ProductFormModal.css";

type Props = {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: (product: Product, mode: "create" | "edit") => void;
};

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
        {hint && <span className="field__hint">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

export function ProductFormModal({
  product,
  categories,
  onClose,
  onSaved,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const fieldRefs = useRef<
    Partial<Record<FormField, HTMLInputElement | HTMLSelectElement | null>>
  >({});

  const [values, setValues] = useState<FormValues>(
    product ? valuesFromProduct(product) : emptyValues
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const setText = (key: "nameAz" | "nameEn" | "categoryId" | "price", value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key !== "nameEn") {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;

    const found = validate(values);
    setErrors(found);

    const firstInvalid = (["nameAz", "categoryId", "price"] as FormField[]).find(
      (field) => found[field]
    );
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setSubmitting(true);
    setServerError(null);

    try {
      const input = toInput(values);
      const saved = product
        ? await updateProduct(product.id, input)
        : await createProduct(input);
      onSaved(saved, product ? "edit" : "create");
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Xəta baş verdi.");
      setSubmitting(false);
    }
  };

  const describe = (field: FormField) =>
    errors[field] ? `${field}-error` : undefined;

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="product-form-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!submitting) onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <form className="modal__form" onSubmit={handleSubmit} noValidate>
        <h2 className="modal__title" id="product-form-title">
          {product ? "Məhsula düzəliş" : "Yeni məhsul"}
        </h2>

        {serverError && (
          <p className="form-alert" role="alert">
            {serverError}
          </p>
        )}

        <Field
          id="nameAz"
          label="Ad (Azərbaycan dilində)"
          error={errors.nameAz}
        >
          <input
            id="nameAz"
            ref={(el) => {
              fieldRefs.current.nameAz = el;
            }}
            className={`control ${errors.nameAz ? "control--invalid" : ""}`}
            type="text"
            value={values.nameAz}
            aria-invalid={Boolean(errors.nameAz)}
            aria-describedby={describe("nameAz")}
            autoFocus
            onChange={(e) => setText("nameAz", e.target.value)}
          />
        </Field>

        <Field id="nameEn" label="Ad (ingilis dilində)" hint="məcburi deyil">
          <input
            id="nameEn"
            className="control"
            type="text"
            value={values.nameEn}
            onChange={(e) => setText("nameEn", e.target.value)}
          />
        </Field>

        <Field id="categoryId" label="Kateqoriya" error={errors.categoryId}>
          <select
            id="categoryId"
            ref={(el) => {
              fieldRefs.current.categoryId = el;
            }}
            className={`control control--select ${
              errors.categoryId ? "control--invalid" : ""
            }`}
            value={values.categoryId}
            aria-invalid={Boolean(errors.categoryId)}
            aria-describedby={describe("categoryId")}
            onChange={(e) => setText("categoryId", e.target.value)}
          >
            <option value="">Kateqoriya seçin</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field id="price" label="Qiymət" error={errors.price}>
          <div className="input-wrap">
            <input
              id="price"
              ref={(el) => {
                fieldRefs.current.price = el;
              }}
              className={`control control--price tabular ${
                errors.price ? "control--invalid" : ""
              }`}
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={values.price}
              aria-invalid={Boolean(errors.price)}
              aria-describedby={describe("price")}
              onChange={(e) => setText("price", e.target.value)}
            />
            <span className="input-wrap__suffix" aria-hidden="true">
              ₼
            </span>
          </div>
        </Field>

        <div className="field field--row">
          <span className="field__label" id="status-label">
            Satış statusu
          </span>
          <div className="status">
            <button
              type="button"
              role="switch"
              aria-checked={values.isAvailable}
              aria-labelledby="status-label"
              className={`switch ${values.isAvailable ? "switch--on" : ""}`}
              onClick={() =>
                setValues((prev) => ({ ...prev, isAvailable: !prev.isAvailable }))
              }
            />
            <span>{values.isAvailable ? "Satışda" : "Satışda deyil"}</span>
          </div>
        </div>

        <div className="modal__footer">
          <button
            type="button"
            className="btn-outline"
            disabled={submitting}
            onClick={onClose}
          >
            Ləğv et
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Saxlanılır..." : "Yadda saxla"}
          </button>
        </div>
      </form>
    </dialog>
  );
}