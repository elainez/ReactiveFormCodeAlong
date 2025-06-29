import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Contact } from './contact.model';

export class InMemoryContactsApi implements InMemoryDbService {
  createDb() {
    let contacts: Contact[] = [
      {
        id: '5CehW',
        icon: 'person-01.png',
        personal: true,
        firstName: 'Percival',
        lastName: 'Doodleplumb',
        dateOfBirth: new Date('1994/05/05'),
        favoritesRanking: 0,
        phones: [
          { phoneNumber: '555-765-4321', phoneType: 'other', preferred: false },
          { phoneNumber: '335-125-5987', phoneType: 'work', preferred: false },
          { phoneNumber: '125-598-3357', phoneType: 'home', preferred: false }
        ],
        addresses: [{
          streetAddress: '777 Whimsy Lane',
          city: 'Gleeberg City',
          state: 'Colohoma',
          postalCode: 'A4321',
          addressType: 'home',
        },
        {
          streetAddress: '666 Grove Lane',
          city: 'Kansas City',
          state: 'Colohoma',
          postalCode: '10321',
          addressType: 'work',
        }
      ],
        notes: "this si stheh lkhdajfkl hjhdf "
      },
      {
        id: 'A6rwe',
        icon: 'person-08.png',
        personal: false,
        firstName: 'Mortimer',
        lastName: 'Flungford',
        dateOfBirth: new Date('1988/10/05'),
        favoritesRanking: 0,
        phones: [
          { phoneNumber: '555-877-5678', phoneType: 'other', preferred: false },
          { phoneNumber: '678-555-8775', phoneType: 'work', preferred:false }
        ],
        addresses: [{
          streetAddress: '543 Lullaby Lane',
          city: 'Sleepytown',
          state: 'Ulaska',
          postalCode: 'F2231',
          addressType: 'other'
        },
        {
          streetAddress: '666 Grove Lane',
          city: 'Kansas City',
          state: 'Colohoma',
          postalCode: '10321',
          addressType: 'work',
        }
      ],
        notes: "this si stheh lkhdajfkl hjhdf "
      },
      {
        id: '3bNGA',
        icon: 'person-09.png',
        personal: false,
        firstName: 'Wanda',
        lastName: 'Giggleworth',
        dateOfBirth: new Date('1986/11/08'),
        favoritesRanking: 1,
        phones: [
          { phoneNumber: '555-123-4567', phoneType: 'other', preferred: false },
          { phoneNumber: '456-555-7123', phoneType: 'home', preferred: false },
        ],
        addresses: [{
          streetAddress: '123 Merriment Avenue',
          city: 'Dorado City',
          state: 'Mezona',
          postalCode: 'Z2345',
          addressType: 'work'
        },
        {
          streetAddress: '666 Grove Lane',
          city: 'Kansas City',
          state: 'Colohoma',
          postalCode: '10321',
          addressType: 'home',
        }
      ],
        notes: "this si stheh lkhdajfkl hjhdf "
      },
    ]

    return { contacts }
  }
}