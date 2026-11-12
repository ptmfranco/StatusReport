export type PerfilUsuario = 'SUPERUSUARIO' | 'GESTOR' | 'OPERACIONAL'

export interface Usuario {
  id: string
  email: string
  senha: string // no client demo
  perfil: PerfilUsuario
  nome: string
  criadoEm: string
  status: 'Ativo' | 'Inativo'
}

export interface SessaoUsuario {
  email: string
  perfil: PerfilUsuario
  nome: string
  iniciadoEm: string
}

export interface EventoAuditoria {
  id: string
  dataHora: string
  tipo:
    | 'LOGIN'
    | 'LOGOUT'
    | 'IMPORTACAO'
    | 'REVERSAO'
    | 'SOLICITACAO'
    | 'APROVACAO'
    | 'USUARIO_CRIADO'
    | 'USUARIO_EXCLUIDO'
    | 'CONFIGURACAO'
  usuario: string
  perfil: PerfilUsuario
  descricao: string
  origemIp: string
  detalhes?: string
}

export interface SolicitacaoAprovacao {
  id: string
  protocolo: string
  solicitante: string
  solicitantePerfil: PerfilUsuario
  dataHora: string
  arquivo: string
  score: number
  justificativa: string
  status: 'Pendente' | 'Aprovada' | 'Recusada'
  resposta?: string
  respondidoPor?: string
  respondidoEm?: string
}

export interface VersaoBase {
  versao: string
  dataHora: string
  arquivo: string
  registros: number
  totalUst: number
  totalValor: number
  usuario: string
  status: 'Atual' | 'Histórica' | 'Revertida'
  origem: string
  assinatura: string
}

export interface HistoricoImportacao {
  id: string
  dataHora: string
  origem: string
  arquivo: string
  registros: number
  totalUst: number
  totalValor: number
  status: 'Concluído' | 'Revertido' | 'Reversão'
  usuario: string
  assinatura: string
  detalhes?: string
}

// Chaves padronizadas
export const CHAVE_SESSAO = 'rautaki_sessao'
export const CHAVE_USUARIOS = 'rautaki_usuarios'
export const CHAVE_AUDITORIA = 'rautaki_auditoria'
export const CHAVE_SOLICITACOES = 'rautaki_solicitacoes'
export const CHAVE_VERSOES = 'rautaki_versoes'
export const CHAVE_HISTORICO_IMPORTACAO = 'rautaki_historico_importacao'
export const CHAVE_CONFIG_NOTIFICACOES = 'rautaki_config_notificacoes'

// Usuários iniciais válidos do prompt
export const USUARIOS_PADRAO: Usuario[] = [
  {
    id: 'usr_1',
    email: 'paulo.franco@rautakitecnologia.com.br',
    senha: 'Fred2014@',
    perfil: 'SUPERUSUARIO',
    nome: 'Paulo Franco',
    criadoEm: '15/01/2026 09:00',
    status: 'Ativo',
  },
  {
    id: 'usr_2',
    email: 'renato@rautakitecnologia.com.br',
    senha: 'R@ut4k!2026',
    perfil: 'GESTOR',
    nome: 'Renato Silva',
    criadoEm: '20/01/2026 10:30',
    status: 'Ativo',
  },
  {
    id: 'usr_3',
    email: 'operacional@rautakitecnologia.com.br',
    senha: 'Op3r4c!0n4l',
    perfil: 'OPERACIONAL',
    nome: 'Equipe Operacional',
    criadoEm: '01/02/2026 08:00',
    status: 'Ativo',
  },
]

// Solicitações iniciais para auditoria e badges
export const SOLICITACOES_INICIAIS: SolicitacaoAprovacao[] = [
  {
    id: 'sol_1',
    protocolo: 'SOL-2026-0891',
    solicitante: 'renato@rautakitecnologia.com.br',
    solicitantePerfil: 'GESTOR',
    dataHora: '28/10/2026 14:22',
    arquivo: 'Projetos_CET_2026_Ajuste_DHV4.xlsx',
    score: 86.7,
    justificativa:
      'Base encaminhada pela equipe de fiscalização contendo inclusão das novas atividades da Sprint 5 do Papel Zero.',
    status: 'Pendente',
  },
  {
    id: 'sol_2',
    protocolo: 'SOL-2026-0890',
    solicitante: 'renato@rautakitecnologia.com.br',
    solicitantePerfil: 'GESTOR',
    dataHora: '24/10/2026 11:15',
    arquivo: 'Medicao_Contratos_Outubro_Preliminar.xlsx',
    score: 93.3,
    justificativa:
      'Fechamento parcial das medições de outubro para conferência orçamentária do comitê diretivo.',
    status: 'Pendente',
  },
  {
    id: 'sol_3',
    protocolo: 'SOL-2026-0885',
    solicitante: 'renato@rautakitecnologia.com.br',
    solicitantePerfil: 'GESTOR',
    dataHora: '15/10/2026 16:40',
    arquivo: 'Projetos_CET_2026_Reestruturada_v1.1.xlsx',
    score: 100,
    justificativa: 'Atualização da malha viária com 11 novas linhas no Mapa Base.',
    status: 'Aprovada',
    resposta: 'Aprovado pelo Superusuário em conformidade com o cronograma.',
    respondidoPor: 'paulo.franco@rautakitecnologia.com.br',
    respondidoEm: '15/10/2026 17:05',
  },
]

// Versões de base iniciais
export const VERSOES_INICIAIS: VersaoBase[] = [
  {
    versao: 'v1.2',
    dataHora: '31/10/2026 18:30',
    arquivo: 'Projetos_CET_2026_Reestruturada.xlsx',
    registros: 1097,
    totalUst: 18595.5,
    totalValor: 6378256.5,
    usuario: 'paulo.franco@rautakitecnologia.com.br',
    status: 'Atual',
    origem: 'Pasta Local (Upload)',
    assinatura: 'SHA256: 9f8a2...3b1d [100% Compatível]',
  },
  {
    versao: 'v1.1',
    dataHora: '30/09/2026 17:00',
    arquivo: 'Projetos_CET_2026_Setembro.xlsx',
    registros: 963,
    totalUst: 14278.5,
    totalValor: 4897525.5,
    usuario: 'renato@rautakitecnologia.com.br',
    status: 'Histórica',
    origem: 'Google Drive Corporativo',
    assinatura: 'SHA256: 4e2c1...8a9f [100% Compatível]',
  },
  {
    versao: 'v1.0',
    dataHora: '31/08/2026 16:15',
    arquivo: 'Projetos_CET_2026_Base_Inicial.xlsx',
    registros: 742,
    totalUst: 11696.5,
    totalValor: 4011900.5,
    usuario: 'paulo.franco@rautakitecnologia.com.br',
    status: 'Histórica',
    origem: 'Pasta Local (Upload)',
    assinatura: 'SHA256: 1d9e7...5f3c [100% Compatível]',
  },
]

export const HISTORICO_INICIAL: HistoricoImportacao[] = [
  {
    id: 'imp_3',
    dataHora: '31/10/2026 18:30',
    origem: 'Pasta Local (Upload)',
    arquivo: 'Projetos_CET_2026_Reestruturada.xlsx',
    registros: 1097,
    totalUst: 18595.5,
    totalValor: 6378256.5,
    status: 'Concluído',
    usuario: 'paulo.franco@rautakitecnologia.com.br',
    assinatura: '15/15 itens validados (100%)',
    detalhes: 'Base consolidada do período abr/2026 a out/2026 com 35 OSs.',
  },
  {
    id: 'imp_2',
    dataHora: '30/09/2026 17:00',
    origem: 'Google Drive Corporativo',
    arquivo: 'Projetos_CET_2026_Setembro.xlsx',
    registros: 963,
    totalUst: 14278.5,
    totalValor: 4897525.5,
    status: 'Concluído',
    usuario: 'renato@rautakitecnologia.com.br',
    assinatura: '15/15 itens validados (100%)',
    detalhes: 'Fechamento do terceiro trimestre e conciliação de 7 OSs.',
  },
  {
    id: 'imp_1',
    dataHora: '31/08/2026 16:15',
    origem: 'Pasta Local (Upload)',
    arquivo: 'Projetos_CET_2026_Base_Inicial.xlsx',
    registros: 742,
    totalUst: 11696.5,
    totalValor: 4011900.5,
    status: 'Concluído',
    usuario: 'paulo.franco@rautakitecnologia.com.br',
    assinatura: '15/15 itens validados (100%)',
    detalhes: 'Importação inicial da estruturação do contrato CET 2026.',
  },
]

// Gerar eventos de auditoria realistas para totalizar 48 eventos conforme spec
export function gerarAuditoriaInicial(): EventoAuditoria[] {
  const eventos: EventoAuditoria[] = []
  const tipos = ['LOGIN', 'LOGIN', 'LOGIN', 'LOGOUT', 'CONFIGURACAO', 'LOGIN']
  const usuarios = [
    { email: 'paulo.franco@rautakitecnologia.com.br', perfil: 'SUPERUSUARIO' as PerfilUsuario },
    { email: 'renato@rautakitecnologia.com.br', perfil: 'GESTOR' as PerfilUsuario },
    { email: 'operacional@rautakitecnologia.com.br', perfil: 'OPERACIONAL' as PerfilUsuario },
  ]

  // Evento das 3 importações
  eventos.push({
    id: 'aud_imp_3',
    dataHora: '31/10/2026 18:30:12',
    tipo: 'IMPORTACAO',
    usuario: 'paulo.franco@rautakitecnologia.com.br',
    perfil: 'SUPERUSUARIO',
    descricao:
      'Importação bem-sucedida da base Projetos_CET_2026_Reestruturada.xlsx (1.097 registros, 18.595,5 UST)',
    origemIp: '189.40.12.84 (Sede Rautaki)',
    detalhes: 'Versão v1.2 ativada no sistema com 35 Ordens de Serviço validadas.',
  })
  eventos.push({
    id: 'aud_imp_2',
    dataHora: '30/09/2026 17:00:45',
    tipo: 'IMPORTACAO',
    usuario: 'renato@rautakitecnologia.com.br',
    perfil: 'GESTOR',
    descricao: 'Importação da base Projetos_CET_2026_Setembro.xlsx (963 registros, 14.278,5 UST)',
    origemIp: '177.18.92.10 (VPN Operações)',
    detalhes: 'Versão v1.1 ativada com fechamento de setembro.',
  })
  eventos.push({
    id: 'aud_imp_1',
    dataHora: '31/08/2026 16:15:20',
    tipo: 'IMPORTACAO',
    usuario: 'paulo.franco@rautakitecnologia.com.br',
    perfil: 'SUPERUSUARIO',
    descricao: 'Importação inicial da base de projetos CET 2026 v1.0',
    origemIp: '189.40.12.84 (Sede Rautaki)',
    detalhes: 'Carga inicial do portfólio.',
  })

  // 3 Solicitações
  eventos.push({
    id: 'aud_sol_1',
    dataHora: '28/10/2026 14:22:05',
    tipo: 'SOLICITACAO',
    usuario: 'renato@rautakitecnologia.com.br',
    perfil: 'GESTOR',
    descricao:
      'Abertura da solicitação de aprovação SOL-2026-0891 para arquivo Projetos_CET_2026_Ajuste_DHV4.xlsx (Score 86,7%)',
    origemIp: '177.18.92.10 (VPN Operações)',
    detalhes: 'Pendente de avaliação do Superusuário.',
  })
  eventos.push({
    id: 'aud_sol_2',
    dataHora: '24/10/2026 11:15:33',
    tipo: 'SOLICITACAO',
    usuario: 'renato@rautakitecnologia.com.br',
    perfil: 'GESTOR',
    descricao:
      'Abertura da solicitação de aprovação SOL-2026-0890 para Medicao_Contratos_Outubro_Preliminar.xlsx (Score 93,3%)',
    origemIp: '177.18.92.10 (VPN Operações)',
    detalhes: 'Aguardando validação.',
  })
  eventos.push({
    id: 'aud_sol_3',
    dataHora: '15/10/2026 17:05:19',
    tipo: 'APROVACAO',
    usuario: 'paulo.franco@rautakitecnologia.com.br',
    perfil: 'SUPERUSUARIO',
    descricao:
      'Aprovação da solicitação SOL-2026-0885 protocolada por renato@rautakitecnologia.com.br',
    origemIp: '189.40.12.84 (Sede Rautaki)',
    detalhes: 'Base v1.1 autorizada para atualização de dados.',
  })

  // 42 Acessos e operações de rotina para completar 48 eventos exatos
  const diasOutubro = [
    '31/10/2026',
    '31/10/2026',
    '30/10/2026',
    '29/10/2026',
    '28/10/2026',
    '27/10/2026',
    '26/10/2026',
    '25/10/2026',
    '24/10/2026',
    '23/10/2026',
    '22/10/2026',
    '21/10/2026',
    '20/10/2026',
    '19/10/2026',
    '18/10/2026',
  ]

  for (let i = 1; i <= 42; i++) {
    const usr = usuarios[i % usuarios.length]
    const dia = diasOutubro[i % diasOutubro.length]
    const hora = `${String(8 + (i % 10)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}:${String((i * 13) % 60).padStart(2, '0')}`
    const tipo = i % 6 === 0 ? 'LOGOUT' : 'LOGIN'
    eventos.push({
      id: `aud_acesso_${i}`,
      dataHora: `${dia} ${hora}`,
      tipo,
      usuario: usr.email,
      perfil: usr.perfil,
      descricao:
        tipo === 'LOGIN'
          ? `Autenticação bem-sucedida na plataforma CET 2026`
          : `Encerramento voluntário de sessão de trabalho`,
      origemIp:
        usr.perfil === 'SUPERUSUARIO'
          ? '189.40.12.84 (Sede Rautaki)'
          : '177.18.92.10 (VPN Operações)',
      detalhes: `Sessão iniciada via interface corporativa Web HTTPS`,
    })
  }

  return eventos
}
