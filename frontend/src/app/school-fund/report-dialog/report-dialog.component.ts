import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-report-dialog',
  imports: [MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule],
  templateUrl: './report-dialog.component.html',
  styleUrl: './report-dialog.component.css'
})
export class ReportDialogComponent {
  startDate = new FormControl();
  endDate = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<ReportDialogComponent>
  ) {}

  generateReport() {
    if (this.startDate.value && this.endDate.value) {
      this.dialogRef.close({
        startDate: this.startDate.value,
        endDate: this.endDate.value
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
