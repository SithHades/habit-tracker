import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HabitService } from '../../services/habit.service';

@Component({
  selector: 'app-create-habit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './create-habit.component.html',
  styleUrl: './create-habit.component.scss',
})
export class CreateHabitComponent {
  habitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private habitService: HabitService
  ) {
    this.habitForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      frequency: ['daily', Validators.required],
    });
  }

  async onSubmit() {
    if (this.habitForm.valid) {
      try {
        await this.habitService.createHabit(this.habitForm.value);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Error creating habit:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  }
}
