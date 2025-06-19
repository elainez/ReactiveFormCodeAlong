import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Contact } from './contact.model';
import { nanoid } from 'nanoid'
/*
nanoid is a tiny, secure, URL-friendly, and fast unique ID generator often used in JavaScript and Angular projects to:

Generate unique keys or IDs for components

Assign IDs to items (like in a shopping cart or form)

Avoid collisions when manually assigning identifiers

It’s an alternative to UUIDs — but shorter and faster.
const id = nanoid(5);
The 5 is the length of the generated ID

The characters include letters (A-Z, a-z) and numbers (0–9)
*/ 
@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(private http: HttpClient) { }

  getContact(id: string): Observable<Contact | undefined> {
    return this.http.get<Contact>(`api/contacts/${id}`)
      .pipe(map(c => {
        const dob = c.dateOfBirth ? new Date(c.dateOfBirth) : null;
        return { ...c, dateOfBirth: dob }
      }));
  }

  getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('api/contacts');
  }
//partial is a special data type in TypeScript that allows you to accept objects that do not fully implement their interface. 
// The reason why I like this approach in our current use case is because in a contacts app we don't really expect anyone to fill out every field for a contact. So working with partial objects makes sense
  saveContact(contact: Partial<Contact>): Observable<Contact> {
    const headers = { headers: { 'Content-Type': 'application/json' } };

    if (!contact.id || contact.id === '') {
      let newContact: Partial<Contact> = { ...contact, id: nanoid(5) };
      return this.http.post<Contact>('api/contacts/', newContact, headers)
    }
    else
      return this.http.put<Contact>('api/contacts/', contact, headers)
  }
}