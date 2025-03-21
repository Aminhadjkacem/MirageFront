export interface NormalClient {
  id?: number;
  fullName: string;
  phoneNumber: string;
  address: string;
  email: string;
  identityCardNumber: string;
}

export interface CompanyClient {
  id?: number;
  companyName: string;
  address: string;
  city: string;
  email: string;
  matriculeFiscal: string;
  contact1Name: string;
  contact1Phone: string;
  contact2Name: string;
  contact2Phone: string;
  contact3Name: string;
  contact3Phone: string;
}