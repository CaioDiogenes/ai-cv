import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Candidate, ExperienceEntry, EducationEntry, CvDecision } from '../models/candidate';
import { ApiServiceService } from '../services/api-service.service';
import { Router } from '@angular/router';

const STORAGE_KEYS = {
  candidate: 'cv-candidate',
  decision: 'cv-decision',
} as const;

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  form: FormGroup;
  loading: boolean = false;
  candidate?: Candidate;
  decision?: CvDecision;


  constructor(private fb: FormBuilder, private api: ApiServiceService, private router: Router) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      interestArea: ['', [Validators.required, Validators.minLength(3)]],
      education: ['', [Validators.required, Validators.minLength(3)]],
      experience: ['', [Validators.required, Validators.minLength(5)]],
      skills: ['', [Validators.required, Validators.minLength(3)]],
      objective: ['', [Validators.required, Validators.minLength(10)]],
    });

    const c = sessionStorage.getItem(STORAGE_KEYS.candidate);
    const d = sessionStorage.getItem(STORAGE_KEYS.decision);

    if (!c || !d) {
      this.router.navigate(['/']);
      return;
    }

    this.candidate = JSON.parse(c) as Candidate;
    this.decision = JSON.parse(d) as CvDecision;
  }

  isInvalid(path: string): boolean {
    const c = this.form.get(path);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  private toCandidatePayload(): Candidate {
    const v = this.form.value;
    const t = (s: any) => String(s ?? '').trim();

    const payload: Candidate = {
      name: t(v.name),
      interestArea: t(v.interestArea),
      education: t(v.education),
      experience: t(v.experience),
      skills: t(v.skills),
      objective: t(v.objective),
    };

    return payload;
  }


  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const candidate = this.toCandidatePayload();

    this.loading = true;
    try {
      const decision: CvDecision = await this.api.analyzeCandidate(candidate);

      sessionStorage.setItem(STORAGE_KEYS.candidate, JSON.stringify(candidate));
      sessionStorage.setItem(STORAGE_KEYS.decision, JSON.stringify(decision));

      this.router.navigate(['/resultado']);
    } catch (err) {
      console.error(err);
      alert('Não foi possível analisar o currículo agora.');
    } finally {
      this.loading = false;
    }
  }

}
