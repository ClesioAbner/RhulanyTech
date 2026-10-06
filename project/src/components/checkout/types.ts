import type { DeliveryMethod } from '../../lib/checkout';

/** Validation messages by field name; undefined means the field is fine. */
export type Errors = Record<string, string | undefined>;

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
}

export interface DeliveryDetails {
  method: DeliveryMethod;
  province: string;
  city: string;
  neighbourhood: string;
  street: string;
  reference: string;
  notes: string;
}

export interface CardDetails {
  name: string;
  number: string;
  expiry: string;
  cvc: string;
}

/** What every checkout form receives to show and clear its errors. */
export interface FormErrorsProps {
  errors: Errors;
  clearError: (key: string) => void;
}
