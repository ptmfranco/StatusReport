import { DetalheLinhaOS, ORDENS_SERVICO, ATIVIDADES_FATURAMENTO, VALOR_UST } from './cetData'

// Mapeamento de contagem exata por OS conforme especificação
// 6.1=177, 1.1=134, 2.1=96, 12.1=78, 14.1=73, 22.1=65, 9.1=61, 18.1=58, 13.1=43, 3.3=35, 11.1=31, 4.3=30, 17.1=30,
// 8.1=27, 16.1=23, 21.1=21, 3.5=14, 5.1=14, 10.2=13, 15.1=12, 20.1=11, 3.2=10, 3.4=10, 3.1=9, 7.1=5, 10.3=3,
// 10.1=2, 4.x=2, 3.7=2, 19.2=2, 3.6=2, 2.2=1, 19.1=1, 4.2=1, 7.x=1. Total exato = 1.097

export const CONTAGEM_LINHAS_POR_OS: Record<string, number> = {
  '6.1': 177,
  '1.1': 134,
  '2.1': 96,
  '12.1': 78,
  '14.1': 73,
  '22.1': 65,
  '9.1': 61,
  '18.1': 58,
  '13.1': 43,
  '3.3': 35,
  '11.1': 31,
  '4.3': 30,
  '17.1': 30,
  '8.1': 27,
  '16.1': 23,
  '21.1': 21,
  '3.5': 14,
  '5.1': 14,
  '10.2': 13,
  '15.1': 12,
  '20.1': 11,
  '3.2': 10,
  '3.4': 10,
  '3.1': 9,
  '7.1': 5,
  '10.3': 3,
  '10.1': 2,
  '4.x': 2,
  '3.7': 2,
  '19.2': 2,
  '3.6': 2,
  '2.2': 1,
  '19.1': 1,
  '4.2': 1,
  '7.x': 1,
}

// Histórias representativas e autênticas do domínio CET
const HISTORIAS_MODELO: { cod: string; desc: string; complex: 'C1' | 'C2' | 'C3'; est: number }[] =
  [
    {
      cod: 'H1',
      desc: 'Como operador CET, desejo visualizar bloqueios viários em tempo real no mapa com camadas ativas',
      complex: 'C1',
      est: 16.0,
    },
    {
      cod: 'H1',
      desc: 'Como gestor de tráfego, quero exportar relatório de lentidão por corredor e distrito',
      complex: 'C1',
      est: 16.0,
    },
    {
      cod: 'H1',
      desc: 'Como fiscal de campo, desejo registrar ocorrência de semáforo apagado com foto e geolocalização',
      complex: 'C1',
      est: 16.0,
    },
    {
      cod: 'F1',
      desc: 'Desenvolvimento do componente de mapa interativo com marcadores de sinistros e filtros dinâmicos',
      complex: 'C1',
      est: 21.0,
    },
    {
      cod: 'F1',
      desc: 'Construção da interface de emissão de termo de vistoria técnica e assinatura digital',
      complex: 'C2',
      est: 21.0,
    },
    {
      cod: 'B1',
      desc: 'API REST de integração com sistema de radares fiscais e validação de velocidade média',
      complex: 'C2',
      est: 21.0,
    },
    {
      cod: 'B1',
      desc: 'Serviço de cálculo de tempos de percurso ponderado por histórico da malha viária CET',
      complex: 'C1',
      est: 21.0,
    },
    {
      cod: 'T1',
      desc: 'Automação de testes de carga e testes regressivos end-to-end do módulo de login e perfis',
      complex: 'C1',
      est: 10.0,
    },
    {
      cod: 'AD3',
      desc: 'Protótipo navegável de média fidelidade do painel de controle operacional de eventos',
      complex: 'C1',
      est: 8.0,
    },
    {
      cod: 'E1',
      desc: 'Alinhamento com Diretoria de Operações e Engenharia para refinamento da Sprint corrente',
      complex: 'C1',
      est: 31.0,
    },
    {
      cod: 'A1',
      desc: 'Definição arquitetural de microsserviços para streaming de dados telemetria de radares',
      complex: 'C2',
      est: 10.0,
    },
    {
      cod: 'L1',
      desc: 'Acompanhamento diário de ritos ágeis, remoção de impedimentos e métricas de vazão',
      complex: 'C1',
      est: 36.5,
    },
    {
      cod: 'D2',
      desc: 'Evolução do modelo relacional georreferenciado para identificação de sentido de vias',
      complex: 'C1',
      est: 4.0,
    },
    {
      cod: 'D1',
      desc: 'Estruturação do banco geoespacial PostGIS com segmentos de vias e interseções municipais',
      complex: 'C2',
      est: 10.0,
    },
    {
      cod: 'R1',
      desc: 'Sessão de Inception de produto com stakeholders da CET para definição de MVP',
      complex: 'C1',
      est: 2.0,
    },
    {
      cod: 'AD1',
      desc: 'Definição da identidade visual e guia de componentes para o aplicativo móvel CET MOB',
      complex: 'C1',
      est: 15.0,
    },
    {
      cod: 'D3',
      desc: 'Script de carga e transformação automatizada (ETL) da base histórica de multas e acidentes',
      complex: 'C2',
      est: 4.0,
    },
    {
      cod: 'E4',
      desc: 'Workshop de Design Thinking para mapeamento da jornada do munícipe no trânsito',
      complex: 'C1',
      est: 4.5,
    },
    {
      cod: 'EC1',
      desc: 'Auditoria técnica e engenharia reversa do código-fonte do sistema legado de semáforos',
      complex: 'C1',
      est: 10.0,
    },
    {
      cod: 'AD2',
      desc: 'Elaboração e validação de diretrizes de acessibilidade e usabilidade corporativa CET',
      complex: 'C1',
      est: 5.0,
    },
  ]

// Gerador determinístico das 1.097 linhas com distribuição exata
export function gerarLinhasDetalhadasOS(): DetalheLinhaOS[] {
  const todasLinhas: DetalheLinhaOS[] = []
  let idCounter = 1

  for (const os of ORDENS_SERVICO) {
    const totalLinhasEsperadas = CONTAGEM_LINHAS_POR_OS[os.numeroOS] || os.qtdLinhas
    const targetUstTotal = os.ust

    // Regra especial da OS 2.1 informada na spec: "OS 2.1 com 96 linhas de descrição repetida"
    if (os.numeroOS === '2.1') {
      const ustPorLinha = targetUstTotal / 96 // 1740 / 96 = 18.125
      for (let i = 0; i < 96; i++) {
        todasLinhas.push({
          id: idCounter++,
          numero_os: os.numeroOS,
          codigo: 'H1',
          atividade_nome: 'Entendimento, refinamento, escrita e validação de história de usuário',
          descricao_historia_usuario_atividades:
            'Implementação e refinamento de histórias funcionais do APP CET MOB para usuários do sistema viário',
          nivel_complexidade: 'C1',
          estimativa_em_ust: ustPorLinha,
          multiplicar_complexidade: 1.0,
          total_em_ust: ustPorLinha,
          valor: ustPorLinha * VALOR_UST,
        })
      }
      continue
    }

    // Para as demais OSs, gerar linhas distribuindo os valores proporcionalmente
    // de modo que a soma exata bata com os.ust
    const baseUstLinha = targetUstTotal / totalLinhasEsperadas

    for (let i = 0; i < totalLinhasEsperadas; i++) {
      const modelo = HISTORIAS_MODELO[(i + totalLinhasEsperadas) % HISTORIAS_MODELO.length]

      // Ajustar fator determinístico para manter C1/C2/C3 compatível
      let complexidade: 'C1' | 'C2' | 'C3' = 'C1'
      let fator = 1.0

      if (i % 7 === 0 && totalLinhasEsperadas > 5) {
        complexidade = 'C2'
        fator = 1.5
      } else if (i === 1 && totalLinhasEsperadas > 40) {
        complexidade = 'C3'
        fator = 2.0
      }

      // Distribuir de modo que soma dê targetUstTotal
      // Variação leve preservando a soma
      let totalEmUstLinha = baseUstLinha
      if (totalLinhasEsperadas > 1) {
        // Criar uma leve variação sem alterar a soma
        const delta = ((i % 5) - 2) * (baseUstLinha * 0.15)
        if (i === totalLinhasEsperadas - 1) {
          // Última linha ajusta o balanço
          const acumuladoAnterior = todasLinhas
            .filter((l) => l.numero_os === os.numeroOS)
            .reduce((s, l) => s + l.total_em_ust, 0)
          totalEmUstLinha = Math.max(
            0.5,
            Math.round((targetUstTotal - acumuladoAnterior) * 10) / 10,
          )
        } else {
          totalEmUstLinha = Math.max(0.5, Math.round((baseUstLinha + delta) * 10) / 10)
        }
      }

      const estimativaEmUst = Math.round((totalEmUstLinha / fator) * 100) / 100
      const ativ = ATIVIDADES_FATURAMENTO.find((a) => a.codigo === modelo.cod)

      todasLinhas.push({
        id: idCounter++,
        numero_os: os.numeroOS,
        codigo: modelo.cod,
        atividade_nome: ativ ? ativ.atividade : modelo.desc,
        descricao_historia_usuario_atividades: `${modelo.desc} [OS ${os.numeroOS} - Item ${i + 1}]`,
        nivel_complexidade: complexidade,
        estimativa_em_ust: estimativaEmUst,
        multiplicar_complexidade: fator,
        total_em_ust: totalEmUstLinha,
        valor: totalEmUstLinha * VALOR_UST,
      })
    }
  }

  return todasLinhas
}

export const LINHAS_DETALHADAS_OS: DetalheLinhaOS[] = gerarLinhasDetalhadasOS()
