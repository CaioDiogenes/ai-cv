import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface CvDecision { apto: boolean; justificativa: string; }

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent {
  decision: CvDecision | null = null;
  candidate: any = null;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.decision = nav?.extras?.state?.['decision'] ?? null;
    this.candidate = nav?.extras?.state?.['candidate'] ?? null;

    if (!this.decision) {
      const s = sessionStorage.getItem('cv-decision');
      if (s) this.decision = JSON.parse(s);
    }
    if (!this.candidate) {
      const c = sessionStorage.getItem('cv-candidate');
      if (c) this.candidate = JSON.parse(c);
    }
  }

  novo() { this.router.navigate(['/']); }
}
