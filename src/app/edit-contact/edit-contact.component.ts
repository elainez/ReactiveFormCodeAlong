import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';
import { Router } from '@angular/router';
import { Phone } from '../contacts/contact.model';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private contactsService: ContactsService,
    private router: Router
  ) { }

  contactForm = new FormGroup({
    id: new FormControl(),
    firstName: new FormControl(),
    lastName: new FormControl(),
    dateOfBirth: new FormControl(),
    favoritesRanking: new FormControl(),
    phone: new FormGroup({
      phoneNumber: new FormControl(),
      phoneType: new FormControl()
    }),
    address: new FormGroup({
      streetAddress: new FormControl(),
      city: new FormControl(),
      state: new FormControl(),
      postalCode: new FormControl(),
      addressType: new FormControl(),
    })
  });

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) return
    this.contactsService.getContact(contactId).subscribe(
      (contact) => {
        if (!contact)
          return
        //this.contactForm.controls.firstName.setValue(contact.firstName)
        //alternatively

        this.contactForm.setValue({
          id: contact.id,//since this is an identifier we wont add it to the form
          firstName: contact.firstName,
          lastName: contact.lastName,
          dateOfBirth: contact.dateOfBirth,
          favoritesRanking: contact.favoritesRanking,
          phone: {
            phoneNumber: contact.phone.phoneNumber,
            phoneType: contact.phone.phoneType
          },
          address: {
            streetAddress: contact.address.streetAddress,
            city: contact.address.city,
            state: contact.address.state,
            postalCode: contact.address.postalCode,
            addressType: contact.address.addressType,
          }
       })
        // this.contactForm.controls.firstName.setValue(contact.firstName);
        // this.contactForm.controls.id.setValue(contact.id)
        // this.contactForm.controls.lastName.setValue(contact.lastName);
        // this.contactForm.controls.dateOfBirth.setValue(contact.dateOfBirth);
        // this.contactForm.controls.favoritesRanking.setValue(contact.favoritesRanking);
        // this.contactForm.controls.phone.controls.phoneNumber.setValue(contact.phone.phoneNumber);
        // this.contactForm.controls.phone.controls.phoneType.setValue(contact.phone.phoneType);
        // this.contactForm.controls.address.controls.streetAddress.setValue(contact.address.streetAddress);
        // this.contactForm.controls.address.controls.city.setValue(contact.address.city);
        // this.contactForm.controls.address.controls.state.setValue(contact.address.state);
        // this.contactForm.controls.address.controls.postalCode.setValue(contact.address.postalCode);
        // this.contactForm.controls.address.controls.addressType.setValue(contact.address.addressType);
      }
    );
  }

  //my initial implementation, there is a better one of course
  //saveContact() {
  // const contact = ({
  //   id:nanoid(5),
  //   firstName: this.contactForm.controls.firstName.value,
  //   lastName:  this.contactForm.controls.lastName.value,
  //   dateOfBirth: this.contactForm.controls.dateOfBirth.value,
  //   favoritesRanking:this.contactForm.controls.favoritesRanking.value,
  // }) as Contact;
  //   this.contactsService.saveContact(contact).subscribe((contact)=>(
  //      this.contactForm.setValue({
  //         firstName:contact.firstName,
  //         lastName: contact.lastName,
  //         dateOfBirth : contact.dateOfBirth,
  //         favoritesRanking: contact.favoritesRanking
  //       })
  //   ));
  // }
  saveContact() {
    //this.contactForm.getRawValue() ----This will force my FormGroup to return all properties even if their associated input elements are disabled.
    // or 
    // this.contactForm.value
    this.contactsService.saveContact(this.contactForm.getRawValue()).subscribe({
      next: () => this.router.navigate(['/contacts'])
    }
    )
  }
}
