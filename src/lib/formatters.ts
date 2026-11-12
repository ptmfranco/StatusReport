// Utilitários de formatação e exportação para o sistema Rautaki CET

export function formatarMoeda(valor: number): string {
  if (isNaN(valor)) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor)
}

export function formatarNumero(valor: number, decimais = 1): string {
  if (isNaN(valor)) return '0'
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  }).format(valor)
}

export function formatarInteiro(valor: number): string {
  if (isNaN(valor)) return '0'
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 0,
  }).format(valor)
}

export function formatarPercentual(valor: number, decimais = 2): string {
  if (isNaN(valor)) return '0,00%'
  return `${new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  }).format(valor)}%`
}

/**
 * Exporta dados para CSV com separador ponto-e-vírgula (;) e BOM UTF-8
 * conforme especificação técnica
 */
export function exportarParaCSV(
  colunas: { chave: string; titulo: string }[],
  linhas: Record<string, any>[],
  nomeArquivo: string,
) {
  // Cabeçalho
  const cabecalho = colunas.map((c) => `"${c.titulo.replace(/"/g, '""')}"`).join(';')

  // Linhas
  const corpo = linhas.map((linha) => {
    return colunas
      .map((col) => {
        let val = linha[col.chave]
        if (val === undefined || val === null) val = ''
        if (typeof val === 'number') {
          // Format brasileiro com vírgula para números no CSV
          val = val.toString().replace('.', ',')
        } else {
          val = String(val).replace(/"/g, '""')
        }
        return `"${val}"`
      })
      .join(';')
  })

  const conteudoCsv = [cabecalho, ...corpo].join('\r\n')
  const blob = new Blob(['\uFEFF' + conteudoCsv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `${nomeArquivo.replace(/\.csv$/, '')}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
