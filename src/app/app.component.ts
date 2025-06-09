import { Component } from '@angular/core';
import { FormComponent } from "./form/form.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [FormComponent],
})
export class AppComponent {}
