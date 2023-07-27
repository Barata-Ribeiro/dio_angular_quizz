import { Component, OnInit } from '@angular/core';
import quizz_questions from '../../../assets/data/quizz_questions.json';

interface QuizzOption {
  id: number;
  name: string;
  alias: string;
}

interface QuizzQuestion {
  id: number;
  question: string;
  options: QuizzOption[];
}

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css'],
})
export class QuizzComponent implements OnInit {
  title: string = '';

  questions!: QuizzQuestion[];
  questionSelected!: QuizzQuestion;

  answers: string[] = [];
  answerSelected: string = '';

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (quizz_questions) {
      this.finished = false;
      this.title = quizz_questions.title;

      this.questions = quizz_questions.questions;
      this.questionSelected = this.questions[this.questionIndex];

      this.questionIndex = 0;
      this.questionMaxIndex = this.questions.length;
    }
  }

  playerChoice(value: string) {
    this.answers.push(value);
    this.nextQuestion();
  }

  async nextQuestion() {
    this.questionIndex += 1;
    if (this.questionIndex < this.questionMaxIndex)
      this.questionSelected = this.questions[this.questionIndex];
    else {
      let finalAnswer: string = await this.checkResult(this.answers);
      this.finished = true;
      this.answerSelected =
        quizz_questions.results[
          finalAnswer as keyof typeof quizz_questions.results
        ];
    }
  }

  async checkResult(answers: string[]): Promise<string> {
    const result = answers.reduce((prev, curr, i, arr) => {
      let previous = arr.filter((item) => item === prev).length;
      let current = arr.filter((item) => item === curr).length;

      if (previous > current) {
        return prev;
      } else {
        return curr;
      }
    });

    return result;
  }
}
