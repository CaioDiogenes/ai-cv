import { GeminiContent } from "../models/gemini";

export type SegmentoRecrutamento =
  | "dev"
  | "contabilidade"
  | "agronegocio"
  | "eventos-cerimoniais";

function descricaoSetor(seg: SegmentoRecrutamento): string {
  switch (seg) {
    case "contabilidade":
      return "um escritório de contabilidade";
    case "agronegocio":
      return "uma empresa de implementos agrícolas (ex.: Marchesan/Baldan)";
    case "eventos-cerimoniais":
      return "uma empresa de eventos cerimoniais";
    default:
      return "uma empresa de tecnologia";
  }
}

function criteriosPorSegmento(seg: SegmentoRecrutamento): string {
  switch (seg) {
    case "contabilidade":
      return `Aqui estão os requisitos consideráveis para uma vaga em Escritório de Contabilidade:
- Conhecimento Técnico: Formação ou cursos em Contabilidade, Finanças ou áreas administrativas. Experiência com impostos (ICMS, PIS, COFINS) é um diferencial importante.
- Habilidades com Sistemas: Experiência ou conhecimento em ERPs, planilhas (Excel) e sistemas contábeis (ex.: SPED).
- Atenção aos Detalhes: Currículo sem erros de digitação/português; demonstra organização e cuidado.
- Ética e Sigilo: Perfil que transmita confiança para lidar com informações sensíveis de clientes.`;

    case "agronegocio":
      return `Aqui estão os requisitos consideráveis para uma vaga em Empresa de Implementos Agrícolas:
- Conhecimento do Setor: Entendimento do vocabulário e cotidiano do agronegócio (ex.: plantadeira, colheitadeira).
- Habilidades Comerciais/Relacionamento (se vendas): Negociação, prospecção de clientes, relacionamento interpessoal; foco em construir confiança com o produtor rural.
- Raciocínio Lógico/Prático: Capacidade de resolver problemas no campo e lidar com imprevistos de forma ágil.
- Disponibilidade para Viagens: Pode ser essencial para visitar clientes e fazendas.`;

    case "eventos-cerimoniais":
      return `Aqui estão os requisitos consideráveis para uma vaga em Empresa de Eventos Cerimoniais:
- Habilidades de Comunicação: Atendimento ao público, negociação com fornecedores, postura proativa.
- Criatividade e Flexibilidade: Adaptação a imprevistos; soluções rápidas e criativas.
- Gestão de Prazos e Organização: Evidências de planejamento e cumprimento de prazos.
- Multitarefas: Capacidade de lidar com várias atividades simultaneamente (contato com fornecedores, clientes e organização de planilhas).`;

    default:
      return `Aqui estão os requisitos consideráveis para a vaga de Desenvolvedor de Software:
- Conhecimento sólido em Python.
- Experiência com frameworks web.
- Habilidade em bancos de dados (SQL ou NoSQL).
- Experiência com desenvolvimento de APIs RESTful.
- Conhecimento de Git para controle de versão.
- Habilidade de comunicação e trabalho em equipe.
- Capacidade de resolver problemas complexos.`;
  }
}

export function buildRecruiterPrompt(
  candidateJson: unknown,
  segmento: SegmentoRecrutamento = "contabilidade"
): GeminiContent[] {
  const setor = descricaoSetor(segmento);
  const criterios = criteriosPorSegmento(segmento);

  return [
    {
      role: "user",
      parts: [
        {
          text:
            "Responda SOMENTE com um JSON válido, sem markdown, sem ``` e sem texto extra."
        },
        {
          text:
            `Você é um especialista em recrutamento e seleção de talentos para ${setor}.
Sua função é analisar o perfil de candidatos a partir de dados fornecidos e determinar se eles são aptos para a vaga.
Você deve ser rigoroso, objetivo e basear sua avaliação nos critérios especificados.
Sua resposta deve ser SEMPRE um objeto JSON com dois campos: "apto" (booleano) e "justificativa" (string).
Se faltarem dados essenciais para concluir, retorne "apto": false e explique claramente o que faltou na "justificativa".`
        },
        {
          text: criterios
        },
        {
          text:
            "A seguir, você receberá os dados do candidato no formato JSON. Analise-os e forneça sua avaliação final."
        }
      ]
    },
    {
      role: "user",
      parts: [
        { text: "Abaixo estão os dados do candidato:" },
        { text: JSON.stringify(candidateJson, null, 2) }
      ]
    }
  ];
}

export const buildDevRecruiterPrompt = (candidateJson: unknown) =>
  buildRecruiterPrompt(candidateJson, "contabilidade");
