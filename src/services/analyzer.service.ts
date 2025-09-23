import { Injectable } from '@angular/core';
import { AnalysisResult, CandidateForm } from '../models/candidate';

@Injectable({ providedIn: 'root' })
export class AnalyzerService {
    private HARD_KEYWORDS = [
        'excel', 'word', 'powerpoint', 'office', 'google sheets', 'google docs', 'google drive',
        'trello', 'asana', 'power query', 'planilha', 'planilhas', 'dados', 'gestão', 'gestao',
        'análise de dados', 'analise de dados', 'erp'
    ];


    private SOFT_KEYWORDS = ['organização', 'proatividade', 'comunicação', 'trabalho em equipe'];


    analyze(form: CandidateForm): AnalysisResult {
        const rationale: string[] = [];
        let score = 0;


        const textBlob = (
            [form.summary, form.hardSkills, form.softSkills, form.experiences?.map(e => `${e.role} ${e.company} ${e.details}`).join(' ')]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
        );


        if ((form.desiredRole || '').toLowerCase().includes('admin')) {
            score += 20; rationale.push('Cargo desejado alinhado a Administração (+20).');
        } else if (form.desiredRole?.trim()) {
            score += 8; rationale.push('Cargo desejado parcialmente alinhado (+8).');
        } else {
            rationale.push('Cargo desejado não informado.');
        }

        const hardHits = this.countHits(textBlob, this.HARD_KEYWORDS);
        if (hardHits >= 5) { score += 25; rationale.push(`Boa cobertura de ferramentas administrativas (${hardHits} acertos) (+25).`); }
        else if (hardHits >= 3) { score += 18; rationale.push(`Cobertura razoável (${hardHits}) (+18).`); }
        else if (hardHits >= 1) { score += 10; rationale.push(`Algumas ferramentas encontradas (${hardHits}) (+10).`); }
        else { rationale.push('Pouca evidência de ferramentas administrativas.'); }


        const softHits = this.countHits(textBlob, this.SOFT_KEYWORDS);
        if (softHits >= 3) { score += 10; rationale.push('Boas soft skills para ambiente administrativo (+10).'); }
        else if (softHits >= 1) { score += 5; rationale.push('Algumas soft skills presentes (+5).'); }

        const expCount = form.experiences?.length || 0;
        if (expCount >= 2) { score += 15; rationale.push('Experiências profissionais múltiplas (+15).'); }
        else if (expCount === 1) { score += 8; rationale.push('Uma experiência profissional (+8).'); }
        else { rationale.push('Sem experiências cadastradas.'); }

        const eduText = (form.education || []).map(e => `${e.degree} ${e.institution}`).join(' ').toLowerCase();
        if (/administra[cç][aã]o/.test(eduText)) { score += 12; rationale.push('Formação relacionada à Administração (+12).'); }
        else if (eduText.trim()) { score += 6; rationale.push('Formação registrada (+6).'); }

        if ((form.summary || '').trim().length >= 120) { score += 8; rationale.push('Resumo profissional consistente (+8).'); }

        if ((form.linkedin || '').trim()) { score += 5; rationale.push('LinkedIn informado (+5).'); }
        if ((form.email || '').trim()) { score += 5; rationale.push('E-mail informado (+5).'); }
        if ((form.phone || '').trim()) { score += 3; rationale.push('Telefone informado (+3).'); }


        score = Math.min(100, Math.round(score));

        let band: AnalysisResult['band'] = 'Reject';
        let accepted = false;
        if (score >= 80) { band = 'Hire'; accepted = true; }
        else if (score >= 65) { band = 'Strong'; accepted = true; }
        else if (score >= 50) { band = 'Borderline'; }


        const advice: string[] = [];
        if (hardHits < 3) advice.push('Evidencie domínio de Excel/PowerPoint/Google Workspace e automação de planilhas.');
        if (softHits < 2) advice.push('Realce organização, proatividade, comunicação e trabalho em equipe com exemplos.');
        if (expCount === 0) advice.push('Inclua experiências (estágio, voluntariado, projetos administrativos).');
        if (!/administra[cç][aã]o/.test(eduText)) advice.push('Destaque cursos/formações ligados à administração/gestão.');
        if ((form.summary || '').trim().length < 120) advice.push('Escreva um resumo de 2–3 parágrafos com resultados e ferramentas.');

        return { accepted, score, band, rationale, advice };
    }
    private countHits(text: string, keywords: string[]): number {
        let hits = 0;
        for (const k of keywords) {
            if (text.includes(k)) hits++;
        }
        return hits;
    }
}