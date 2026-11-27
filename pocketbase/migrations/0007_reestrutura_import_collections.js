/**
 * 0007_reestrutura_import_collections.js
 *
 * Reestrutura as coleções de importação para casar EXATAMENTE com as
 * abas da planilha "Projetos_CET_2026_Status_Report_OSS":
 *
 *  - aba "Detalhe das OSs"        → detalhes_os: acrescenta `produto`,
 *    `atividade_termo` e `total_observacoes` (além dos campos existentes).
 *  - aba "Resumo OS USTs"         → resumo_os_usts: acrescenta
 *    `qtde_ocorrencias`, `c1`, `c2`, `c3` (além dos campos existentes).
 *
 * As demais coleções (catalogo_servicos, niveis_complexidade, projetos_cet,
 * ordens_servico) já têm campos/tipos equivalentes às colunas das abas
 * "Catálogo de Serviços", "Níveis de Complexidade por tipo",
 * "Status Projetos (ddmmaaaa)" e "Dados OS Fabrica" — nada a mudar nelas.
 *
 * As coleções recriadas estão VAZIAS (a importação pela UI é a única fonte
 * de dados — nenhuma linha da planilha é embutida em código/migração).
 * A recriação é idempotente: se a coleção não existir, é criada; se existir,
 * é recriada apenas quando estiver vazia (com dados, o migrate falha
 * propositalmente para não destruir registros do usuário).
 */
migrate(
  (app) => {
    const regras = {
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
    }
    const autodates = [
      { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ]

    // 1. detalhes_os — aba "Detalhe das OSs"
    const detalhesExiste = (() => {
      try {
        return app.findCollectionByNameOrId('detalhes_os')
      } catch (_) {
        return null
      }
    })()
    if (detalhesExiste) {
      let total = 0
      try {
        total = app.count(detalhesExiste)
      } catch (_) {}
      if (total > 0) throw new Error('detalhes_os tem registros — reestruturação abortada')
      app.delete(detalhesExiste)
    }
    const detalhesOs = new Collection(
      Object.assign(
        {
          name: 'detalhes_os',
          type: 'base',
          fields: [
            { name: 'numero_os', type: 'text' },
            { name: 'produto', type: 'text' },
            { name: 'atividade_termo', type: 'text' },
            { name: 'codigo', type: 'text' },
            { name: 'descricao_atividade', type: 'text' },
            { name: 'nivel_complexidade', type: 'text' },
            { name: 'estimativa_ust', type: 'number' },
            { name: 'fator_complexidade', type: 'number' },
            { name: 'total_ust', type: 'number' },
            { name: 'total_observacoes', type: 'text' },
            { name: 'valor_rs', type: 'number' },
          ].concat(autodates),
          indexes: [
            'CREATE INDEX idx_detalhes_os_numero_os ON detalhes_os (numero_os)',
            'CREATE INDEX idx_detalhes_os_codigo ON detalhes_os (codigo)',
          ],
        },
        regras,
      ),
    )
    app.save(detalhesOs)

    // 2. resumo_os_usts — aba "Resumo OS USTs"
    const resumoExiste = (() => {
      try {
        return app.findCollectionByNameOrId('resumo_os_usts')
      } catch (_) {
        return null
      }
    })()
    if (resumoExiste) {
      let total = 0
      try {
        total = app.count(resumoExiste)
      } catch (_) {}
      if (total > 0) throw new Error('resumo_os_usts tem registros — reestruturação abortada')
      app.delete(resumoExiste)
    }
    const resumoOsUsts = new Collection(
      Object.assign(
        {
          name: 'resumo_os_usts',
          type: 'base',
          fields: [
            { name: 'numero_os', type: 'text' },
            { name: 'codigo', type: 'text' },
            { name: 'descricao', type: 'text' },
            { name: 'qtde_ocorrencias', type: 'number' },
            { name: 'c1', type: 'number' },
            { name: 'c2', type: 'number' },
            { name: 'c3', type: 'number' },
            { name: 'total_usts', type: 'number' },
          ].concat(autodates),
          indexes: ['CREATE INDEX idx_resumo_os_usts_numero_os ON resumo_os_usts (numero_os)'],
        },
        regras,
      ),
    )
    app.save(resumoOsUsts)
  },
  (app) => {
    // rollback: volta ao formato da 0003 (coleções vazias) — sem dados, seguro.
    for (const nome of ['resumo_os_usts', 'detalhes_os']) {
      try {
        const col = app.findCollectionByNameOrId(nome)
        app.delete(col)
      } catch (_) {}
    }
  },
)
