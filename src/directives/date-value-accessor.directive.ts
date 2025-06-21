import { Directive, ElementRef, forwardRef, HostListener, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
//You want your directive (or style) to apply only to <input type="date"> elements bound to a form control.



const DATE_VALUE_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateValueAccessorDirective),
  multi: true,
};
@Directive({
  selector: 'input([type=date])[formControlName], input([type=date])[formControl], input([type=date])[ngModel]',
  //The Purpose of providers in the Directive tells Angular:This directive is a ControlValueAccessor. 
  // Use it when binding formControl, formControlName, or ngModel to this element.”
  //This is a special Angular injection token. 
  // Angular looks for it whenever you use forms like:<input type=date formControlName="date" />
  //selector: '[mydateinput]',
  providers:[{
    provide: NG_VALUE_ACCESSOR,
    useExisting:forwardRef(() => DateValueAccessorDirective),
    multi: true //You can have multiple value accessors (like for other form elements).Add this one in addition to the default ones.
  }]
  //providers: [DATE_VALUE_PROVIDER]
})
//useExisting: forwardRef(() => DateValueAccessorDirective) Tells Angular to use this directive class (the one we're in) as the implementation of ControlValueAccessor.
//forwardRef() is needed because at the time Angular processes the decorator, the class may not yet be fully defined.

//create  our own custom ControlValueAccessor 
//ControlValueAccessor is responsible for updating an HTML element's value when it's bound FormControl changes. 
// And in the other direction, it's responsible for updating the FormControls value when the HTML elements value changes.
export class DateValueAccessorDirective implements ControlValueAccessor{

  constructor(private element: ElementRef) { }

  /*
  we need to listen to the host element's input event so that we can update the FormControls value whenever the user types anything into the input element. 
  We can do that with a special Angular decorator named HostListener, and we just import that from Angular core. 
  @HostListener lets you listen to DOM events on the host element (the element the directive is attached to).
'input' is a DOM event triggered whenever the value of an input element changes (like typing into a text box).

  And the first parameter that we passed into the HostListener decorator is the event that we want to listen to, so we'll pass in the input event. 
  And this decorator decorates a function that should be called when the input event fires.
  */
  @HostListener('input',['$event.target.valueAsDate']) //because we're working with input elements of type date, we can count on that being of type date.
  private onChange!: Function;

  @HostListener('blur')
  private onTouched!: Function;
  //update the html element when its corresponding FormControl value changes. 
  // So when the FormControl value changes, it will call this writeValue method 
  // and it will pass the newValue in as a parameter. 
  //in order to get access to the host elemenet, need to inject the element reference in the constructur
  //to make it more defensive, assume the newValue be any
  //writeValue(newValue: Date): void {
  writeValue(newValue: any): void {
    //yyyy-mm-dd
    //iso: yyyy-mm-ddThh:mm:ss.000Z
    //console.log('writevalue', newValue);
    if (newValue instanceof Date) {
      console.log('writevalue', newValue);
      this.element.nativeElement.value = newValue.toISOString().split('T')[0];
    }
  }

/*when reactive forms is bootstrapping the host element and sees that it has a ControlValueAccessor directive on it, 
it will call this registeronChange method and pass in a function which we need to call in order to update the FormControl attached to the host element. 
this register on change function is a way for us to get access to this callback function, which updates the FormControl's value for us*/
  registerOnChange(fn: Function): void {
    this.onChange = (valueAsDate : Date)=>{
      fn(valueAsDate);// callback function and pass along this valueAsDate parameter. 
    }
  }

  registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

}
