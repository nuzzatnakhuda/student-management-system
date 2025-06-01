import { Component , Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-add-dialog',
  imports: [MatDialogModule,MatButtonModule,MatInputModule,MatFormFieldModule,ReactiveFormsModule,CommonModule],
  templateUrl: './section-add-dialog.component.html',
  styleUrl: './section-add-dialog.component.css'
})
export class SectionAddDialogComponent {
  sectionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SectionAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.sectionForm = this.fb.group({
      grade_id: [data.grade_id, Validators.required], // Prepopulate grade_id
      name: [
        '',
        [
          Validators.required,
          Validators.pattern('^[A-Z]$') // Ensure single uppercase alphabet
        ]
      ]
    });
    this.sectionForm.get('name')?.valueChanges.subscribe(value => {
      if (value) {
        this.sectionForm.get('name')?.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });
  }

  onSubmit() {
    if (this.sectionForm.valid) {
      this.dialogRef.close(this.sectionForm.value); // Pass the form data to the parent
    }
  }

  onCancel() {
    this.dialogRef.close(); // Close without submitting
  }
}
