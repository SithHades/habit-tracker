import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HabitService } from '../../services/habit.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  todaysHabits: any[] = [];
  allHabits: any[] = [];

  constructor(private habitService: HabitService, private router: Router) {}

  ngOnInit() {
    this.loadHabits();
  }

  async loadHabits() {
    this.todaysHabits = await this.habitService.getTodaysHabits();
    const habits = await this.habitService.getHabits();

    // Calculate streaks for all habits
    this.allHabits = await Promise.all(
      habits.map(async (habit) => {
        const streak = await this.habitService.getHabitStreak(habit.$id);
        return { ...habit, streak };
      })
    );
  }

  async completeHabit(habitId: string) {
    await this.habitService.completeHabit(habitId);
    this.loadHabits(); // Reload habits to update the list
  }

  createHabit() {
    this.router.navigate(['/create-habit']);
  }
}
