export interface Contact {
  id: string,
  icon: string,
  personal: boolean,
  firstName: string,
  lastName: string,
  dateOfBirth: Date | null,
  favoritesRanking: number | null,
  phones: Phone[],
  addresses: Address[],
  notes: string,
}

export interface Phone {
  phoneNumber: string,
  phoneType: string,
  preferred: boolean,
}

export interface Address {
  streetAddress: string,
  city: string,
  state: string,
  postalCode: string,
  addressType: string,
}

export const PhoneTypes = [
  { "title": "Home", "value": "home" },
  { "title": "Work", "value": "work" },
  { "title": "Other", "value": "other" }
]; 

export const AddressTypeValues = [
  { "title": "Home", "value": "home" },
  { "title": "Work", "value": "work" },
  { "title": "Other", "value": "other" }
]; 