import { Injectable } from '@angular/core';
import { AppwriteService } from './appwrite.service';
import { Query } from 'appwrite';
import { environment } from '../environments/environment';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private readonly HABITS_COLLECTION_ID = '66e6e38100070314fadc';
  private readonly COMPLETIONS_COLLECTION_ID = '66e6e38c000b63de3747';

  constructor(
    private appwrite: AppwriteService,
    private authService: AuthService
  ) {}

  async createHabit(habit: any) {
    const user = await firstValueFrom(this.authService.getCurrentUser());
    return this.appwrite.database.createDocument(
      environment.appwrite.databaseId,
      this.HABITS_COLLECTION_ID,
      'unique()',
      {
        ...habit,
        userId: user.$id,
      }
    );
  }

  async getHabits() {
    const user = await firstValueFrom(this.authService.getCurrentUser());
    const response = await this.appwrite.database.listDocuments(
      environment.appwrite.databaseId,
      this.HABITS_COLLECTION_ID,
      [Query.equal('userId', user.$id), Query.orderDesc('$createdAt')]
    );
    return response.documents;
  }

  async getHabit(id: string) {
    return this.appwrite.database.getDocument(
      environment.appwrite.databaseId,
      this.HABITS_COLLECTION_ID,
      id
    );
  }

  async updateHabit(id: string, habit: any) {
    return this.appwrite.database.updateDocument(
      environment.appwrite.databaseId,
      this.HABITS_COLLECTION_ID,
      id,
      habit
    );
  }

  async deleteHabit(id: string) {
    return this.appwrite.database.deleteDocument(
      environment.appwrite.databaseId,
      this.HABITS_COLLECTION_ID,
      id
    );
  }

  async getTodaysHabits() {
    const today = new Date().toISOString().split('T')[0];
    const habits = await this.getHabits();
    const completions = await this.getHabitCompletions(null, today, today);

    return habits.filter((habit) => {
      const isCompleted = completions.some(
        (completion) => completion['habitId'] === habit.$id
      );
      return habit['frequency'] === 'daily' && !isCompleted;
    });
  }

  async completeHabit(habitId: string) {
    const today = new Date().toISOString().split('T')[0];
    const user = await firstValueFrom(this.authService.getCurrentUser());

    // Create a completion record
    return this.appwrite.database.createDocument(
      environment.appwrite.databaseId,
      this.COMPLETIONS_COLLECTION_ID,
      'unique()',
      {
        habitId: habitId,
        completionDate: today,
        userId: user.$id,
      }
    );
  }

  async getHabitCompletions(
    habitId: string | null,
    startDate: string,
    endDate: string
  ) {
    let queries = [
      Query.greaterThanEqual('completionDate', startDate),
      Query.lessThanEqual('completionDate', endDate),
    ];

    if (habitId) {
      queries.push(Query.equal('habitId', habitId));
    }

    const response = await this.appwrite.database.listDocuments(
      environment.appwrite.databaseId,
      this.COMPLETIONS_COLLECTION_ID,
      queries
    );
    return response.documents;
  }

  async getHabitStreak(habitId: string) {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    while (true) {
      const dateString = currentDate.toISOString().split('T')[0];
      const completions = await this.getHabitCompletions(
        habitId,
        dateString,
        dateString
      );

      if (completions.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }
}
