import { Component, forwardRef, Provider } from '@angular/core';
import { profileNames } from '../profile-names';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'profile-icon-selector',
  templateUrl: './profile-icon-selector.component.html',
  styleUrls: ['./profile-icon-selector.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ProfileIconSelectorComponent),
    multi: true
  }]
})



export class ProfileIconSelectorComponent implements ControlValueAccessor {

  profileIcons = profileNames;
  showAllIcons: boolean = true;
  selectedIcon!: string | null;

  iconSelected(icon: string): void {
    this.selectedIcon = icon;
    //console.log(this.selectedIcon);
    this.showAllIcons = false;
    this.onChange(icon);
  }

  private onChange!: Function;
  private onTouched!: Function;

  writeValue(icon: string): void {
    this.selectedIcon = icon;
    if (icon && icon != '')
      this.showAllIcons = false;
    else
      this.showAllIcons = true;
  }

  registerOnChange(fn: Function): void {
    this.onChange = (icon:string)=>{fn(icon)};
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
