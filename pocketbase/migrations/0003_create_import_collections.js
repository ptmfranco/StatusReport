migrate(
  (app) => {
    // 1. catalogo_servicos
    const catalogoServicos = new Collection({
      name: 'catalogo_servicos',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'item', type: 'number' },
        { name: 'codigo', type: 'text' },
        { name: 'area', type: 'text' },
        { name: 'descricao', type: 'text' },
        { name: 'estimativa_ust', type: 'number' },
        { name: 'quantidade', type: 'number' },
        { name: 'unidade_medida', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_catalogo_servicos_codigo ON catalogo_servicos (codigo)'],
    })
    app.save(catalogoServicos)

    // 2. niveis_complexidade
    const niveisComplexidade = new Collection({
      name: 'niveis_complexidade',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'nivel', type: 'text' },
        { name: 'descricao', type: 'text' },
        { name: 'fator', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_niveis_complexidade_nivel ON niveis_complexidade (nivel)'],
    })
    app.save(niveisComplexidade)

    // 3. projetos_cet
    const projetosCet = new Collection({
      name: 'projetos_cet',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'nome', type: 'text' },
        { name: 'descricao_escopo', type: 'text' },
        { name: 'status', type: 'text' },
        { name: 'andamento_atual', type: 'text' },
        { name: 'proximos_passos', type: 'text' },
        { name: 'responsavel', type: 'text' },
        { name: 'data_demanda', type: 'date' },
        { name: 'data_inicio', type: 'date' },
        { name: 'data_desenvolvimento', type: 'date' },
        { name: 'prazo_alvo', type: 'date' },
        { name: 'data_finalizacao_real', type: 'date' },
        { name: 'status_pausa', type: 'text' },
        { name: 'motivo_pausa', type: 'text' },
        { name: 'classificacao', type: 'text' },
        { name: 'progresso', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(projetosCet)

    // 4. ordens_servico
    const ordensServico = new Collection({
      name: 'ordens_servico',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'numero_os', type: 'text' },
        { name: 'projeto', type: 'text' },
        { name: 'produto', type: 'text' },
        { name: 'data_abertura', type: 'date' },
        { name: 'data_fechamento', type: 'date' },
        { name: 'qtde_usts', type: 'number' },
        { name: 'valor_ust', type: 'number' },
        { name: 'total_rs', type: 'number' },
        { name: 'observacao', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_ordens_servico_numero_os ON ordens_servico (numero_os)'],
    })
    app.save(ordensServico)

    // 5. detalhes_os
    const detalhesOs = new Collection({
      name: 'detalhes_os',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'numero_os', type: 'text' },
        { name: 'codigo', type: 'text' },
        { name: 'descricao_atividade', type: 'text' },
        { name: 'nivel_complexidade', type: 'text' },
        { name: 'estimativa_ust', type: 'number' },
        { name: 'fator_complexidade', type: 'number' },
        { name: 'total_ust', type: 'number' },
        { name: 'valor_rs', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_detalhes_os_numero_os ON detalhes_os (numero_os)',
        'CREATE INDEX idx_detalhes_os_codigo ON detalhes_os (codigo)',
      ],
    })
    app.save(detalhesOs)

    // 6. resumo_os_usts
    const resumoOsUsts = new Collection({
      name: 'resumo_os_usts',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'numero_os', type: 'text' },
        { name: 'codigo', type: 'text' },
        { name: 'descricao', type: 'text' },
        { name: 'total_usts', type: 'number' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_resumo_os_usts_numero_os ON resumo_os_usts (numero_os)'],
    })
    app.save(resumoOsUsts)
  },
  (app) => {
    const names = [
      'resumo_os_usts',
      'detalhes_os',
      'ordens_servico',
      'projetos_cet',
      'niveis_complexidade',
      'catalogo_servicos',
    ]
    for (const name of names) {
      try {
        const col = app.findCollectionByNameOrId(name)
        app.delete(col)
      } catch (_) {}
    }
  },
)
