import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HabitService } from '../../services/habit.service';

@Component({
  selector: 'app-habit-detail',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './habit-detail.component.html',
  styleUrl: './habit-detail.component.scss',
})
export class HabitDetailComponent {
  habit: any;
  habitForm: FormGroup;
  streak: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private habitService: HabitService
  ) {
    this.habitForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      frequency: ['daily', Validators.required],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadHabit(id);
    }
  }

  async loadHabit(id: string) {
    this.habit = await this.habitService.getHabit(id);
    this.habitForm.patchValue(this.habit);
    this.streak = await this.habitService.getHabitStreak(id);
  }

  async onSubmit() {
    if (this.habitForm.valid) {
      const updatedHabit = {
        ...this.habit,
        ...this.habitForm.value,
      };
      await this.habitService.updateHabit(this.habit.$id, updatedHabit);
      this.router.navigate(['/dashboard']);
    }
  }

  async deleteHabit() {
    if (confirm('Are you sure you want to delete this habit?')) {
      await this.habitService.deleteHabit(this.habit.$id);
      this.router.navigate(['/dashboard']);
    }
  }
}
