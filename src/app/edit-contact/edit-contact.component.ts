import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';
import { Router } from '@angular/router';
import { AddressTypeValues, PhoneTypes } from '../contacts/contact.model';
import { noWhiteSpaceValidator } from '../validators/no-whiltespace.validator';
import { restrictedWordValidator } from '../validators/restriction-words.validator';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  phoneTypes = PhoneTypes;
  addressTypes = AddressTypeValues;
  constructor(private route: ActivatedRoute,
    private contactsService: ContactsService,
    private router: Router,
    private fb: FormBuilder
  ) { }
  //using form builder with each form control match the data property so it will be easier to set the value
  //providing default values for our FormControls and it is inferring their data types, you can see that for most of our controls, the type is string or null. 
  // But that doesn't actually match our contact interface because only dateOfBirth and favoritesRanking are allowed to be null. So one thing that's nice about the formBuilder is that we can tell it to make all of its controls nullable by calling fb.nonNullable.group. 
  // This will make all of the controls inside this group non‑nullable, except for these two, where we're specifically indicating we want to allow nulls
  contactForm = this.fb.nonNullable.group(
    {
      id: '',
      icon: '',
      personal: false,
      firstName: ['', [Validators.required, Validators.minLength(3), noWhiteSpaceValidator]],
      lastName: '',
      dateOfBirth: <Date | null>(null),
      favoritesRanking: <number | null>null,
      phones: this.fb.array([this.createPhoneGroup()]),
      addresses: this.fb.array([this.createAddressGroup()]),
      notes: ['', restrictedWordValidator(['foo', 'tie'])]
    }
  );


  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];
    if (!contactId) {
      
      return;
    }
    this.contactsService.getContact(contactId).subscribe(
      (contact) => {
        if (!contact)
          return
        //since the shape of our contact interface matches the shape of our form model, I can just pass in our contact right here. And this single contactForm.setValue call replaces all of these calls down here
        // console.log(contact.dateOfBirth, typeof(this.contactForm.controls.dateOfBirth.value));
        for (let i = 1; i < contact.phones.length; i++) {
          this.contactForm.controls.phones.push(this.createPhoneGroup());
        }
        for (let i= 1; i< contact.addresses.length; i++) {
          this.contactForm.controls.addresses.push(this.createAddressGroup());
        }
        this.contactForm.setValue(contact);
        
        //please note a form model has another method called patchValue that allows you to set values of only a few properties on your form model
        //this.contactForm.patchValue({firstName: contact.firstName})

        //set value for each form control
        //this.contactForm.controls.firstName.setValue(contact.firstName)
        //alternatively

        /*  this.contactForm.setValue({
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
         })*/
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

  //add a getter property named firstName that simply returns this.contactForm.controls.firstName.
  //so it wont be too lengthy in the template
  get firstName() {
    return this.contactForm.controls.firstName;
  }

  get streetAddress() {
    return this.contactForm.controls.addresses.controls[0].controls.streetAddress;
  }

  get notes() {
    return this.contactForm.controls.notes;
  }


  stringifyCompare(a:any, b: any){
    return JSON.stringify(a) === JSON.stringify(b);
  }

  createPhoneGroup() {
    const phoneGroup = this.fb.nonNullable.group({
      phoneNumber: '',
      phoneType: '',
      preferred: false
    });

    phoneGroup.controls.preferred.valueChanges
    .pipe(distinctUntilChanged(this.stringifyCompare)) //distinctUntilChanged() is an RxJS operator that suppresses (skips) emitting a value if it is the same as the previous value. If they’re the same, it does not emit the new value.
    .subscribe((value) => {
      if (value) {
        //console.log(value);
        phoneGroup.controls.phoneNumber.addValidators([Validators.required]);
      }
      else 
        phoneGroup.controls.phoneNumber.removeValidators([Validators.required])
      phoneGroup.updateValueAndValidity();
    });

    return phoneGroup;
  }

  addPhoneGroup(){
    this.contactForm.controls.phones.controls.push(this.createPhoneGroup());
  }

  createAddressGroup(){
    const addressGroup = this.fb.nonNullable.group({
        streetAddress: ['', [Validators.required, noWhiteSpaceValidator]],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', Validators.required],
        addressType: ['', Validators.required],
      });
    addressGroup.valueChanges
    .pipe(distinctUntilChanged(this.stringifyCompare))
      .subscribe(() => {
        for (const controlName in addressGroup.controls) {
          //console.log('control name', addressGroup.get(controlName));
          addressGroup.get(controlName)?.removeValidators([Validators.required]);
          addressGroup.get(controlName)?.updateValueAndValidity();
        }
      });
    addressGroup.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged(this.stringifyCompare))
      .subscribe(() => {
        for (const controlName in addressGroup.controls) {
          addressGroup.get(controlName)?.addValidators([Validators.required]);
          addressGroup.get(controlName)?.updateValueAndValidity();
        }
      });    
    return addressGroup;
  }

  addAddressGroup(){
    this.contactForm.controls.addresses.controls.push(this.createAddressGroup());
  }

  subscribeToAddressChanges() {
    const addressGroup = this.contactForm.controls.addresses;
    addressGroup.valueChanges
      .pipe(distinctUntilChanged(this.stringifyCompare))
      .subscribe(() => {
        for (const controlName in addressGroup.controls) {
          console.log('control name', addressGroup.get(controlName));
          addressGroup.get(controlName)?.removeValidators([Validators.required]);
          addressGroup.get(controlName)?.updateValueAndValidity();
        }
      });
    addressGroup.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged(this.stringifyCompare))
      .subscribe(() => {
        for (const controlName in addressGroup.controls) {
          addressGroup.get(controlName)?.addValidators([Validators.required]);
          addressGroup.get(controlName)?.updateValueAndValidity();
        }
      });
  }

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
