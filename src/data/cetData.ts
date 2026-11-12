export interface PlanejadoRealizadoMes {
  mes: string
  mesLabel: string
  osCount: number
  ustRealizado: number
  valorRealizado: number
  gapUst: number
  atingimento: number
  ustPlanejado: number
  valorPlanejado: number
  gapValor: number
  // acumulados
  acumRealizadoUst: number
  acumPlanejadoUst: number
  acumGapUst: number
  acumAtingimento: number
}

export interface FaturamentoProjeto {
  projeto: string
  osCount: number
  ust: number
  valor: number
}

export interface FaturamentoProduto {
  produto: string
  osCount: number
  ust: number
  valor: number
  primeiraOS: string
  ultimaOS: string
}

export interface AtividadeItem {
  codigo: string
  atividade: string
  area: string
  itens: number
  ustEst: number
  ustTotal: number
  valor: number
}

export interface ComplexidadeItem {
  nivel: 'C1' | 'C2' | 'C3'
  descricao: string
  fator: number
  itens: number
  ustEst: number
  ustTotal: number
  valor: number
}

export interface ProjetoInfo {
  nome: string
  status: 'Desenvolvimento' | 'Finalizado' | 'Pausado' | 'Sem status'
  escopo: string
  andamento: string
  proximosPassos: string
  demanda: string
  inicio: string
  desenvolvimento: string
  pausa: string
}

export interface OrdemServico {
  numeroOS: string
  projeto: string
  produto: string
  fechamento: string
  ust: number
  valor: number
  mesRef: string
  qtdLinhas: number
}

export interface DetalheLinhaOS {
  id: number
  numero_os: string
  codigo: string
  atividade_nome?: string
  descricao_historia_usuario_atividades: string
  nivel_complexidade: 'C1' | 'C2' | 'C3'
  estimativa_em_ust: number
  multiplicar_complexidade: number
  total_em_ust: number
  valor: number
}

export const VALOR_UST = 343.0
export const CONTRATO_UST_MES = 4800.0
export const TOTAL_MESES = 7
export const TOTAL_PLANEJADO_UST = 33600.0
export const TOTAL_PLANEJADO_VALOR = 11524800.0

export const DADOS_MENSAIS: PlanejadoRealizadoMes[] = [
  {
    mes: 'abr/2026',
    mesLabel: 'Abril/2026',
    osCount: 1,
    ustRealizado: 2277.0,
    valorRealizado: 781011.0,
    gapUst: -2523.0,
    atingimento: 47.44,
    ustPlanejado: 4800.0,
    valorPlanejado: 1646400.0,
    gapValor: -865389.0,
    acumRealizadoUst: 2277.0,
    acumPlanejadoUst: 4800.0,
    acumGapUst: -2523.0,
    acumAtingimento: 47.44,
  },
  {
    mes: 'mai/2026',
    mesLabel: 'Maio/2026',
    osCount: 2,
    ustRealizado: 1750.0,
    valorRealizado: 600250.0,
    gapUst: -3050.0,
    atingimento: 36.46,
    ustPlanejado: 4800.0,
    valorPlanejado: 1646400.0,
    gapValor: -1046150.0,
    acumRealizadoUst: 4027.0,
    acumPlanejadoUst: 9600.0,
    acumGapUst: -5573.0,
    acumAtingimento: 41.95,
  },
  {
    mes: 'jun/2026',
    mesLabel: 'Junho/2026',
    osCount: 7,
    ustRealizado: 1890.5,
    valorRealizado: 648441.5,
    gapUst: -2909.5,
    atingimento: 39.39,
    ustPlanejado: 4800.0,
    valorPlanejado: 1646400.0,
    gapValor: -997958.5,
    acumRealizadoUst: 5917.5,
    acumPlanejadoUst: 14400.0,
    acumGapUst: -8482.5,
    acumAtingimento: 41.09,
  },
  {
    mes: 'jul/2026',
    mesLabel: 'Julho/2026',
    osCount: 5,
    ustRealizado: 3883.5,
    valorRealizado: 1332040.5,
    gapUst: -916.5,
    atingimento: 80.91,
    ustPlanejado: 4800.0,
    valorPlanejado: 1646400.0,
    gapValor: -314359.5,
    acumRealizadoUst: 9801.0,
    acumPlanejadoUst: 19200.0,
    acumGapUst: -9399.0,
    acumAtingimento: 51.05,
  },
  {
    mes: 'ago/2026',
    mesLabel: 'Agosto/2026',
    osCount: 4,
    ustRealizado: 1895.5,
    valorRealizado: 650156.5,
    gapUst: -2904.5,
    atingimento: 39.49,
    ustPlanejado: 4800.0,
    valorPlanejado: 1646400.0,
    gapValor: -996243.5,
    acumRealizadoUst: 11696.5,
    acumPlanejadoUst: 24000.0,
    acumGapUst: -12303.5,
    acumAtingimento: 48.74,
  },
  {
    mes: 'set/2026',
    mesLabel: 'Setembro/2026',
    osCount: 7,
    ustRealizado: 2582.0,
    valorRealizado: 885626.0,
    gapUst: -2218.0,
    atingimento: 53.79,
    ustPlanejado: 4800.0,
    valorPlanejado: 1646400.0,
    gapValor: -760774.0,
    acumRealizadoUst: 14278.5,
    acumPlanejadoUst: 28800.0,
    acumGapUst: -14521.5,
    acumAtingimento: 49.58,
  },
  {
    mes: 'out/2026',
    mesLabel: 'Outubro/2026',
    osCount: 9,
    ustRealizado: 4317.0,
    valorRealizado: 1480731.0,
    gapUst: -483.0,
    atingimento: 89.94,
    ustPlanejado: 4800.0,
    valorPlanejado: 1646400.0,
    gapValor: -165669.0,
    acumRealizadoUst: 18595.5,
    acumPlanejadoUst: 33600.0,
    acumGapUst: -15004.5,
    acumAtingimento: 55.34,
  },
]

export const PROJETOS_FATURAMENTO: FaturamentoProjeto[] = [
  { projeto: 'Papel Zero', osCount: 7, ust: 6296.0, valor: 2159528.0 },
  { projeto: 'APP CET MOB', osCount: 2, ust: 4017.0, valor: 1377831.0 },
  { projeto: 'Framework', osCount: 1, ust: 1027.0, valor: 352261.0 },
  { projeto: 'Medição de Contratos', osCount: 1, ust: 908.0, valor: 311444.0 },
  { projeto: 'Proposta Orçamentária', osCount: 2, ust: 895.5, valor: 307156.5 },
  { projeto: 'Radares', osCount: 1, ust: 883.5, valor: 303040.5 },
  { projeto: 'Evolução da usabilidade', osCount: 1, ust: 850.5, valor: 291721.5 },
  { projeto: 'Indicadores e Termal', osCount: 1, ust: 585.5, valor: 200826.5 },
  { projeto: 'APP CET - MOB Framework', osCount: 1, ust: 481.0, valor: 164983.0 },
  { projeto: 'Radares (348 + 85,5)', osCount: 1, ust: 433.5, valor: 148690.5 },
  { projeto: 'Medição Contratos', osCount: 1, ust: 385.5, valor: 132226.5 },
  { projeto: 'Gestão da OS', osCount: 3, ust: 348.5, valor: 119535.5 },
  { projeto: 'Identificação do Sentido das Vias', osCount: 1, ust: 272.5, valor: 93467.5 },
  { projeto: 'Discovery - Produto - Framework', osCount: 1, ust: 252.0, valor: 86436.0 },
  { projeto: 'Mapa Base', osCount: 3, ust: 251.0, valor: 86093.0 },
  {
    projeto: 'Mapeamento e Visualização de Bloqueios e Eventos',
    osCount: 1,
    ust: 231.5,
    valor: 79404.5,
  },
  { projeto: 'Discovery - Produto - APP', osCount: 1, ust: 204.0, valor: 69972.0 },
  { projeto: 'Sentido das Vias', osCount: 1, ust: 119.0, valor: 40817.0 },
  { projeto: 'Arquitetura Serviços', osCount: 1, ust: 40.0, valor: 13720.0 },
  { projeto: 'Projeto de Sinalização', osCount: 1, ust: 40.0, valor: 13720.0 },
  { projeto: 'Transito Agora', osCount: 1, ust: 37.0, valor: 12691.0 },
  { projeto: 'Gestão', osCount: 1, ust: 27.0, valor: 9261.0 },
  { projeto: 'Compras e Licitações', osCount: 1, ust: 10.0, valor: 3430.0 },
]

export const PRODUTOS_FATURAMENTO: FaturamentoProduto[] = [
  {
    produto: 'Papel Zero',
    osCount: 8,
    ust: 6336.0,
    valor: 2173248.0,
    primeiraOS: '30/06/2026',
    ultimaOS: '31/10/2026',
  },
  {
    produto: 'APP CET MOB',
    osCount: 6,
    ust: 5592.5,
    valor: 1918227.5,
    primeiraOS: '30/04/2026',
    ultimaOS: '31/07/2026',
  },
  {
    produto: 'Framework CET',
    osCount: 4,
    ust: 1783.0,
    valor: 611569.0,
    primeiraOS: '30/06/2026',
    ultimaOS: '31/10/2026',
  },
  {
    produto: 'Radares',
    osCount: 2,
    ust: 1317.0,
    valor: 451731.0,
    primeiraOS: '30/09/2026',
    ultimaOS: '31/10/2026',
  },
  {
    produto: 'Medição de Contratos',
    osCount: 2,
    ust: 1293.5,
    valor: 443670.5,
    primeiraOS: '30/09/2026',
    ultimaOS: '31/10/2026',
  },
  {
    produto: 'Proposta Orçamentária',
    osCount: 2,
    ust: 895.5,
    valor: 307156.5,
    primeiraOS: '31/08/2026',
    ultimaOS: '31/10/2026',
  },
  {
    produto: 'Indicadores e Termal',
    osCount: 1,
    ust: 585.5,
    valor: 200826.5,
    primeiraOS: '31/10/2026',
    ultimaOS: '31/10/2026',
  },
  {
    produto: 'Gestão da OS',
    osCount: 4,
    ust: 375.5,
    valor: 128796.5,
    primeiraOS: '31/07/2026',
    ultimaOS: '31/10/2026',
  },
  {
    produto: 'Mapa Base',
    osCount: 3,
    ust: 251.0,
    valor: 86093.0,
    primeiraOS: '31/07/2026',
    ultimaOS: '31/10/2026',
  },
  {
    produto: 'Sentido das Vias',
    osCount: 1,
    ust: 119.0,
    valor: 40817.0,
    primeiraOS: '30/09/2026',
    ultimaOS: '30/09/2026',
  },
  {
    produto: 'Transito Agora',
    osCount: 1,
    ust: 37.0,
    valor: 12691.0,
    primeiraOS: '31/10/2026',
    ultimaOS: '31/10/2026',
  },
  {
    produto: 'Compras e Licitações',
    osCount: 1,
    ust: 10.0,
    valor: 3430.0,
    primeiraOS: '31/05/2026',
    ultimaOS: '31/05/2026',
  },
]

export const ATIVIDADES_FATURAMENTO: AtividadeItem[] = [
  {
    codigo: 'H1',
    atividade: 'Entendimento, refinamento, escrita e validação de história de usuário',
    area: 'Histórias',
    itens: 389,
    ustEst: 6224,
    ustTotal: 6488,
    valor: 2225384.0,
  },
  {
    codigo: 'F1',
    atividade: 'Implementação front-end de 1 história de usuário',
    area: 'Implementação front-end',
    itens: 171,
    ustEst: 3591,
    ustTotal: 3990,
    valor: 1368570.0,
  },
  {
    codigo: 'B1',
    atividade: 'Implementação back-end de 1 história de usuário ou item de trabalho',
    area: 'Implementação back-end',
    itens: 154,
    ustEst: 3234,
    ustTotal: 3748.5,
    valor: 1285735.5,
  },
  {
    codigo: 'T1',
    atividade: 'Preparação e implementação de testes automatizados',
    area: 'Teste',
    itens: 107,
    ustEst: 1070,
    ustTotal: 1240,
    valor: 425320.0,
  },
  {
    codigo: 'AD3',
    atividade: 'Prototipação e construção de protótipo de média fidelidade',
    area: 'Análise e desenho',
    itens: 152,
    ustEst: 1216,
    ustTotal: 1216,
    valor: 417088.0,
  },
  {
    codigo: 'E1',
    atividade: 'Alinhamento inicial e apresentação da visão do Product Backlog',
    area: 'Encontros',
    itens: 24,
    ustEst: 747,
    ustTotal: 747,
    valor: 256221.0,
  },
  {
    codigo: 'A1',
    atividade: 'Definições arquiteturais',
    area: 'Arquitetura',
    itens: 38,
    ustEst: 380,
    ustTotal: 460,
    valor: 157780.0,
  },
  {
    codigo: 'L1',
    atividade: 'Acompanhamento do Scrum Master (ritos, impedimentos, métricas)',
    area: 'Liderança Ágil',
    itens: 12,
    ustEst: 440,
    ustTotal: 440,
    valor: 150920.0,
  },
  {
    codigo: 'D2',
    atividade: 'Modelagem de dados – evolução do modelo por história',
    area: 'Dados',
    itens: 19,
    ustEst: 76,
    ustTotal: 76,
    valor: 26068.0,
  },
  {
    codigo: 'E2',
    atividade: 'Formação Time Ágil',
    area: 'Encontros',
    itens: 1,
    ustEst: 43,
    ustTotal: 43,
    valor: 14749.0,
  },
  {
    codigo: 'D1',
    atividade: 'Modelagem de dados – criação do modelo base/georreferenciado',
    area: 'Dados',
    itens: 3,
    ustEst: 30,
    ustTotal: 40,
    valor: 13720.0,
  },
  {
    codigo: 'R1',
    atividade: 'Inception',
    area: 'Ritos',
    itens: 17,
    ustEst: 17,
    ustTotal: 32,
    valor: 10976.0,
  },
  {
    codigo: 'AD1',
    atividade: 'Elaboração da identidade visual',
    area: 'Análise e desenho',
    itens: 2,
    ustEst: 30,
    ustTotal: 30,
    valor: 10290.0,
  },
  {
    codigo: 'D3',
    atividade: 'Elaboração de procedimento de automatização para carga/extração (ETL)',
    area: 'Dados',
    itens: 3,
    ustEst: 12,
    ustTotal: 17,
    valor: 5831.0,
  },
  {
    codigo: 'E4',
    atividade: 'Planejamento através de metodologia Design Thinking',
    area: 'Encontros',
    itens: 3,
    ustEst: 13,
    ustTotal: 13,
    valor: 4459.0,
  },
  {
    codigo: 'EC1',
    atividade: 'Estudo do código-fonte de sistema',
    area: 'Estudo',
    itens: 1,
    ustEst: 10,
    ustTotal: 10,
    valor: 3430.0,
  },
  {
    codigo: 'AD2',
    atividade: 'Elaboração do guia de usabilidade',
    area: 'Análise e desenho',
    itens: 1,
    ustEst: 5,
    ustTotal: 5,
    valor: 1715.0,
  },
]

export const COMPLEXIDADE_DADOS: ComplexidadeItem[] = [
  {
    nivel: 'C1',
    descricao: 'Baixa complexidade — requisitos simples, pouca interação com outros sistemas',
    fator: 1.0,
    itens: 928,
    ustEst: 14315,
    ustTotal: 14288,
    valor: 4900784.0,
  },
  {
    nivel: 'C2',
    descricao: 'Média complexidade — requisitos moderados, integrações e regras adicionais',
    fator: 1.5,
    itens: 160,
    ustEst: 2677,
    ustTotal: 4015.5,
    valor: 1377316.5,
  },
  {
    nivel: 'C3',
    descricao:
      'Alta complexidade — requisitos complexos, múltiplas integrações e restrições de legado',
    fator: 2.0,
    itens: 9,
    ustEst: 146,
    ustTotal: 292,
    valor: 100156.0,
  },
]

export const PROJETOS_DADOS: ProjetoInfo[] = [
  {
    nome: 'APP CET MOB',
    status: 'Finalizado',
    escopo: 'Aplicativo móvel com mapa, vias favoritas e acesso a serviços da CET',
    andamento: 'APP pausado em 03/08/2026 após informação de aplicativo único para São Paulo',
    proximosPassos: 'Definir com a CET se o produto será retomado como ferramenta interna',
    demanda: '31/05/2026',
    inicio: '—',
    desenvolvimento: '—',
    pausa: 'Sim',
  },
  {
    nome: 'Compras e Licitações (SEI)',
    status: 'Pausado',
    escopo: 'Entendimento e melhoria do fluxo de abertura e tramitação de processos do SEI',
    andamento: 'Pausado. Antes da pausa, estava em discovery funcional/técnico',
    proximosPassos: 'Preencher o contexto formal da pausa e definir se haverá retomada',
    demanda: '31/05/2026',
    inicio: '—',
    desenvolvimento: '—',
    pausa: 'Sim',
  },
  {
    nome: 'Framework CET',
    status: 'Desenvolvimento',
    escopo: 'Plataforma web que concentra dados e funcionalidades de tráfego',
    andamento:
      'Evoluções no mapa e na importação de dados; regras de acesso por organização em definição',
    proximosPassos: 'Priorizar com a CET as entregas e validar os perfis de acesso',
    demanda: '31/10/2026',
    inicio: '10/06/2026',
    desenvolvimento: '10/06/2026',
    pausa: 'Não',
  },
  {
    nome: 'Papel Zero',
    status: 'Desenvolvimento',
    escopo: 'Produto para digitalizar o fluxo de sinalização do DHV4',
    andamento: 'Evoluções da Sprint 5; preparar acesso à homologação',
    proximosPassos: 'Disponibilizar em homologação e organizar testes por perfil',
    demanda: '31/10/2026',
    inicio: '06/07/2026',
    desenvolvimento: '21/07/2026',
    pausa: 'Não',
  },
  {
    nome: 'Mapa Base',
    status: 'Desenvolvimento',
    escopo: 'Recortes da malha viária por rua, distrito ou todas as vias',
    andamento: 'Discovery funcional e técnico; Sprint 1 executada e Sprint 2 planejada',
    proximosPassos: 'Validar atividades realizadas e definir fluxo de importação',
    demanda: '31/10/2026',
    inicio: '—',
    desenvolvimento: '—',
    pausa: 'Não',
  },
  {
    nome: 'Proposta Orçamentária',
    status: 'Desenvolvimento',
    escopo: 'Apoia elaboração da proposta, cenários e acompanhamento Orçado x Realizado',
    andamento: 'Discovery/Sprint Zero; fluxo V5 e protótipo em refinamento',
    proximosPassos: 'Validação das regras e do protótipo para início do desenvolvimento',
    demanda: '31/10/2026',
    inicio: '18/08/2026',
    desenvolvimento: '—',
    pausa: 'Não',
  },
  {
    nome: 'Sentido das Vias',
    status: 'Desenvolvimento',
    escopo: 'Relacionar trechos da malha viária ao sentido de circulação',
    andamento: 'Estudo técnico; algoritmo em teste',
    proximosPassos: 'Consolidar contribuições da CET e validar as regras do algoritmo',
    demanda: '30/09/2026',
    inicio: '22/06/2026',
    desenvolvimento: '22/06/2026',
    pausa: 'Não',
  },
  {
    nome: 'Medição de Contratos',
    status: 'Desenvolvimento',
    escopo: 'Consultar contratos, preparar e acompanhar medições',
    andamento: 'Discovery e Sprint Zero estruturados; protótipo em refinamento',
    proximosPassos: 'Validação das regras e do protótipo',
    demanda: '31/10/2026',
    inicio: '—',
    desenvolvimento: '—',
    pausa: 'Não',
  },
  {
    nome: 'Indicadores e Termal',
    status: 'Desenvolvimento',
    escopo: 'Consultar Tabela Termal, gráficos diários e indicadores de lentidão',
    andamento: 'Discovery; Product Brief e dinâmica da Sprint Zero estruturados',
    proximosPassos: 'Validar fontes, regras para dias atípicos e cálculos',
    demanda: '31/10/2026',
    inicio: '18/08/2026',
    desenvolvimento: '—',
    pausa: 'Não',
  },
  {
    nome: 'Transito Agora',
    status: 'Finalizado',
    escopo: 'Módulo de acompanhamento em tempo real das condições e trânsito operacional',
    andamento: 'Concluído e entregue para operação de rotina',
    proximosPassos: 'Sustentação conforme plano de garantias',
    demanda: '31/10/2026',
    inicio: '—',
    desenvolvimento: '—',
    pausa: 'Não',
  },
  {
    nome: 'Radares',
    status: 'Desenvolvimento',
    escopo: 'Mapeamento e fiscalização eletrônica de velocidade e avanço de semáforo',
    andamento: 'Evolução dos módulos de integração com dispositivos de campo',
    proximosPassos: 'Homologação dos pontos críticos e envio do relatório fiscal',
    demanda: '31/10/2026',
    inicio: '—',
    desenvolvimento: '—',
    pausa: 'Não',
  },
  {
    nome: 'Gestão da OS',
    status: 'Desenvolvimento',
    escopo: 'Controle de ciclos de faturamento, apontamentos e conciliação de USTs',
    andamento: 'Ajustes no fluxo de aprovação e conferência de evidências de entrega',
    proximosPassos: 'Integração direta com o sistema de medições contratuais',
    demanda: '30/09/2026',
    inicio: '—',
    desenvolvimento: '—',
    pausa: 'Não',
  },
]

export const ORDENS_SERVICO: OrdemServico[] = [
  {
    numeroOS: '1.1',
    projeto: 'APP CET MOB',
    produto: 'APP CET MOB',
    fechamento: '30/04/2026',
    ust: 2277.0,
    valor: 781011.0,
    mesRef: 'abr/2026',
    qtdLinhas: 134,
  },
  {
    numeroOS: '2.1',
    projeto: 'APP CET MOB',
    produto: 'APP CET MOB',
    fechamento: '31/05/2026',
    ust: 1740.0,
    valor: 596820.0,
    mesRef: 'mai/2026',
    qtdLinhas: 96,
  },
  {
    numeroOS: '2.2',
    projeto: 'Compras e Licitações',
    produto: 'Compras e Licitações',
    fechamento: '31/05/2026',
    ust: 10.0,
    valor: 3430.0,
    mesRef: 'mai/2026',
    qtdLinhas: 1,
  },
  {
    numeroOS: '3.1',
    projeto: 'Identificação do Sentido das Vias',
    produto: 'Framework CET',
    fechamento: '30/06/2026',
    ust: 272.5,
    valor: 93467.5,
    mesRef: 'jun/2026',
    qtdLinhas: 9,
  },
  {
    numeroOS: '3.2',
    projeto: 'Mapeamento e Visualização de Bloqueios e Eventos',
    produto: 'Framework CET',
    fechamento: '30/06/2026',
    ust: 231.5,
    valor: 79404.5,
    mesRef: 'jun/2026',
    qtdLinhas: 10,
  },
  {
    numeroOS: '3.3',
    projeto: 'Evolução da usabilidade',
    produto: 'APP CET MOB',
    fechamento: '30/06/2026',
    ust: 850.5,
    valor: 291721.5,
    mesRef: 'jun/2026',
    qtdLinhas: 35,
  },
  {
    numeroOS: '3.4',
    projeto: 'Discovery - Produto - APP',
    produto: 'APP CET MOB',
    fechamento: '30/06/2026',
    ust: 204.0,
    valor: 69972.0,
    mesRef: 'jun/2026',
    qtdLinhas: 10,
  },
  {
    numeroOS: '3.5',
    projeto: 'Discovery - Produto - Framework',
    produto: 'Framework CET',
    fechamento: '30/06/2026',
    ust: 252.0,
    valor: 86436.0,
    mesRef: 'jun/2026',
    qtdLinhas: 14,
  },
  {
    numeroOS: '3.6',
    projeto: 'Projeto de Sinalização',
    produto: 'Papel Zero',
    fechamento: '30/06/2026',
    ust: 40.0,
    valor: 13720.0,
    mesRef: 'jun/2026',
    qtdLinhas: 2,
  },
  {
    numeroOS: '3.7',
    projeto: 'Arquitetura Serviços',
    produto: 'APP CET MOB',
    fechamento: '30/06/2026',
    ust: 40.0,
    valor: 13720.0,
    mesRef: 'jun/2026',
    qtdLinhas: 2,
  },
  {
    numeroOS: '4.x',
    projeto: 'Gestão da OS',
    produto: 'Gestão da OS',
    fechamento: '31/07/2026',
    ust: 58.0,
    valor: 19894.0,
    mesRef: 'jul/2026',
    qtdLinhas: 2,
  },
  {
    numeroOS: '4.2',
    projeto: 'Mapa Base',
    produto: 'Mapa Base',
    fechamento: '31/07/2026',
    ust: 10.0,
    valor: 3430.0,
    mesRef: 'jul/2026',
    qtdLinhas: 1,
  },
  {
    numeroOS: '4.3',
    projeto: 'APP CET - MOB Framework',
    produto: 'APP CET MOB',
    fechamento: '31/07/2026',
    ust: 481.0,
    valor: 164983.0,
    mesRef: 'jul/2026',
    qtdLinhas: 30,
  },
  {
    numeroOS: '5.1',
    projeto: 'Papel Zero',
    produto: 'Papel Zero',
    fechamento: '17/07/2026',
    ust: 55.0,
    valor: 18865.0,
    mesRef: 'jul/2026',
    qtdLinhas: 14,
  },
  {
    numeroOS: '6.1',
    projeto: 'Papel Zero',
    produto: 'Papel Zero',
    fechamento: '31/07/2026',
    ust: 3279.5,
    valor: 1124868.5,
    mesRef: 'jul/2026',
    qtdLinhas: 177,
  },
  {
    numeroOS: '7.x',
    projeto: 'Gestão da OS',
    produto: 'Gestão da OS',
    fechamento: '31/08/2026',
    ust: 34.0,
    valor: 11662.0,
    mesRef: 'ago/2026',
    qtdLinhas: 1,
  },
  {
    numeroOS: '7.1',
    projeto: 'Proposta Orçamentária',
    produto: 'Proposta Orçamentária',
    fechamento: '31/08/2026',
    ust: 7.0,
    valor: 2401.0,
    mesRef: 'ago/2026',
    qtdLinhas: 5,
  },
  {
    numeroOS: '8.1',
    projeto: 'Papel Zero',
    produto: 'Papel Zero',
    fechamento: '14/08/2026',
    ust: 711.5,
    valor: 244044.5,
    mesRef: 'ago/2026',
    qtdLinhas: 27,
  },
  {
    numeroOS: '9.1',
    projeto: 'Papel Zero',
    produto: 'Papel Zero',
    fechamento: '28/08/2026',
    ust: 1143.0,
    valor: 392049.0,
    mesRef: 'ago/2026',
    qtdLinhas: 61,
  },
  {
    numeroOS: '10.1',
    projeto: 'Gestão da OS',
    produto: 'Gestão da OS',
    fechamento: '30/09/2026',
    ust: 256.5,
    valor: 87979.5,
    mesRef: 'set/2026',
    qtdLinhas: 2,
  },
  {
    numeroOS: '10.2',
    projeto: 'Sentido das Vias',
    produto: 'Sentido das Vias',
    fechamento: '30/09/2026',
    ust: 119.0,
    valor: 40817.0,
    mesRef: 'set/2026',
    qtdLinhas: 13,
  },
  {
    numeroOS: '10.3',
    projeto: 'Mapa Base',
    produto: 'Mapa Base',
    fechamento: '30/09/2026',
    ust: 50.0,
    valor: 17150.0,
    mesRef: 'set/2026',
    qtdLinhas: 3,
  },
  {
    numeroOS: '11.1',
    projeto: 'Papel Zero',
    produto: 'Papel Zero',
    fechamento: '22/09/2026',
    ust: 522.0,
    valor: 179046.0,
    mesRef: 'set/2026',
    qtdLinhas: 31,
  },
  {
    numeroOS: '14.1',
    projeto: 'Medição de Contratos',
    produto: 'Medição de Contratos',
    fechamento: '30/09/2026',
    ust: 908.0,
    valor: 311444.0,
    mesRef: 'set/2026',
    qtdLinhas: 73,
  },
  {
    numeroOS: '16.1',
    projeto: 'Papel Zero',
    produto: 'Papel Zero',
    fechamento: '30/09/2026',
    ust: 293.0,
    valor: 100499.0,
    mesRef: 'set/2026',
    qtdLinhas: 23,
  },
  {
    numeroOS: '17.1',
    projeto: 'Radares (348 + 85,5)',
    produto: 'Radares',
    fechamento: '30/09/2026',
    ust: 433.5,
    valor: 148690.5,
    mesRef: 'set/2026',
    qtdLinhas: 30,
  },
  {
    numeroOS: '12.1',
    projeto: 'Proposta Orçamentária',
    produto: 'Proposta Orçamentária',
    fechamento: '31/10/2026',
    ust: 888.5,
    valor: 304755.5,
    mesRef: 'out/2026',
    qtdLinhas: 78,
  },
  {
    numeroOS: '13.1',
    projeto: 'Indicadores e Termal',
    produto: 'Indicadores e Termal',
    fechamento: '31/10/2026',
    ust: 585.5,
    valor: 200826.5,
    mesRef: 'out/2026',
    qtdLinhas: 43,
  },
  {
    numeroOS: '15.1',
    projeto: 'Papel Zero',
    produto: 'Papel Zero',
    fechamento: '31/10/2026',
    ust: 292.0,
    valor: 100156.0,
    mesRef: 'out/2026',
    qtdLinhas: 12,
  },
  {
    numeroOS: '18.1',
    projeto: 'Radares',
    produto: 'Radares',
    fechamento: '31/10/2026',
    ust: 883.5,
    valor: 303040.5,
    mesRef: 'out/2026',
    qtdLinhas: 58,
  },
  {
    numeroOS: '19.1',
    projeto: 'Gestão',
    produto: 'Gestão da OS',
    fechamento: '31/10/2026',
    ust: 27.0,
    valor: 9261.0,
    mesRef: 'out/2026',
    qtdLinhas: 1,
  },
  {
    numeroOS: '19.2',
    projeto: 'Transito Agora',
    produto: 'Transito Agora',
    fechamento: '31/10/2026',
    ust: 37.0,
    valor: 12691.0,
    mesRef: 'out/2026',
    qtdLinhas: 2,
  },
  {
    numeroOS: '20.1',
    projeto: 'Mapa Base',
    produto: 'Mapa Base',
    fechamento: '31/10/2026',
    ust: 191.0,
    valor: 65513.0,
    mesRef: 'out/2026',
    qtdLinhas: 11,
  },
  {
    numeroOS: '21.1',
    projeto: 'Medição Contratos',
    produto: 'Medição de Contratos',
    fechamento: '31/10/2026',
    ust: 385.5,
    valor: 132226.5,
    mesRef: 'out/2026',
    qtdLinhas: 21,
  },
  {
    numeroOS: '22.1',
    projeto: 'Framework',
    produto: 'Framework CET',
    fechamento: '31/10/2026',
    ust: 1027.0,
    valor: 352261.0,
    mesRef: 'out/2026',
    qtdLinhas: 65,
  },
]
