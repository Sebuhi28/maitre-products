import type { Product, ProductInput } from "../../api/api";

export type FormValues = {
  nameAz: string;
  nameEn: string;
  categoryId: string;
  price: string;
  isAvailable: boolean;
};

export type FormField = "nameAz" | "categoryId" | "price";

export type FormErrors = Partial<Record<FormField, string>>;

export const emptyValues: FormValues = {
  nameAz: "",
  nameEn: "",
  categoryId: "",
  price: "",
  isAvailable: true,
};

export function valuesFromProduct(product: Product): FormValues {
  return {
    nameAz: product.nameAz,
    nameEn: product.nameEn ?? "",
    categoryId: String(product.categoryId),
    price: product.price.toFixed(2).replace(".", ","),
    isAvailable: product.isAvailable,
  };
}

export function parsePrice(raw: string): number {
  return Number(raw.trim().replace(",", "."));
}

export function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.nameAz.trim()) {
    errors.nameAz = "Azərbaycan dilində ad məcburidir.";
  }

  if (!values.categoryId) {
    errors.categoryId = "Kateqoriya seçin.";
  }

  const rawPrice = values.price.trim();
  if (!rawPrice) {
    errors.price = "Qiymət məcburidir.";
  } else if (!/^\d+([.,]\d{1,2})?$/.test(rawPrice)) {
    errors.price = "Qiymət düzgün yazılmayıb. Nümunə: 4,50";
  } else if (parsePrice(rawPrice) <= 0) {
    errors.price = "Qiymət 0-dan böyük olmalıdır.";
  }

  return errors;
}

export function toInput(values: FormValues): ProductInput {
  return {
    nameAz: values.nameAz.trim(),
    nameEn: values.nameEn.trim() || null,
    categoryId: Number(values.categoryId),
    price: parsePrice(values.price),
    isAvailable: values.isAvailable,
  };
}