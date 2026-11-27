/* =========================================================
RAUTAKI · IMPORTAÇÃO DA PLANILHA (v0.0.27)
Reestruturação da base: cada aba da planilha real é reconhecida
pelo NOME (tolerante a espaços extras, maiúsculas e acentos) e
gravada na coleção PocketBase correspondente:

  "Status Projetos (ddmmaaaa)"     → projetos_cet (só a de data mais recente)
  "Dados OS Fabrica"               → ordens_servico
  "Resumo OS USTs"                 → resumo_os_usts
  "Detalhe das OSs"                → detalhes_os
  "Catálogo de Serviços"           → catalogo_servicos
  "Níveis de Complexidade por tipo"→ niveis_complexidade

NENHUMA linha/valor da planilha está embutido aqui: os dados entram
só pela importação feita pelo usuário na UI.
========================================================= */
;(function () {
  if (window.RAUTAKI_IMPORTAR) return
  const norm = (s) =>
    String(s == null ? '' : s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
  const normSolida = (s) => norm(s).replace(/[^a-z0-9]/g, '')
  /* ---- casamento tolerante de nomes (produto ↔ projeto) ----
     1) igualdade sólida; 2) um nome contém o outro (mínimo de 4
     caracteres) — cobre "APP CET MOB" ⊂ "APP CET MOBILIDADE" e
     "Proposta Orçamentária" ⊂ "Sistema Orçamentário (Proposta
     Orçamentária)". Nenhum nome é fixado em código. */
  function casarNome(alvo, candidatos) {
    const a = normSolida(alvo)
    if (!a || !candidatos || !candidatos.length) return null
    for (const c of candidatos) if (normSolida(c) === a) return c
    for (const c of candidatos) {
      const cs = normSolida(c)
      if (cs.length >= 4 && a.length >= 4 && (cs.indexOf(a) >= 0 || a.indexOf(cs) >= 0)) return c
    }
    return null
  }
  const num = (v) => {
    if (v == null || v === '') return 0
    if (typeof v === 'number') return isFinite(v) ? v : 0
    const s = String(v).trim().replace(/\s/g, '')
    const n = s.includes(',') ? parseFloat(s.replace(/\./g, '').replace(',', '.')) : parseFloat(s)
    return isNaN(n) ? 0 : n
  }
  /* datas da planilha chegam como string de spreadsheet (série de dias
     desde 30/12/1899, possivelmente com fração de horas). */
  const dataIso = (v) => {
    if (v == null || v === '') return ''
    const s = String(v).trim()
    let d = null
    if (/^\d+(\.\d+)?$/.test(s)) {
      const serie = parseFloat(s)
      const ms = Math.round((serie - 25569) * 86400000)
      d = new Date(ms)
    } else {
      const m = /^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/.exec(s)
      if (m) {
        let a = +m[3]
        if (a < 100) a += 2000
        d = new Date(a, +m[2] - 1, +m[1])
      } else {
        const p = Date.parse(s)
        if (!isNaN(p)) d = new Date(p)
      }
    }
    if (!d || isNaN(d.getTime())) return ''
    return (
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0') +
      ' 00:00:00.000Z'
    )
  }
  const txt = (r, ix) => (ix >= 0 ? String(r[ix] == null ? '' : r[ix]).trim() : '')

  /* índice de colunas por nomes alternativos (sem espaços/acento) */
  function colIx(headers, alternativas) {
    const h = (headers || []).map(normSolida)
    for (const alvo of alternativas) {
      const i = h.indexOf(alvo)
      if (i >= 0) return i
    }
    for (const alvo of alternativas) {
      const i = h.findIndex((x) => x && x.indexOf(alvo) >= 0)
      if (i >= 0) return i
    }
    return -1
  }

  /* ---------- reconhecimento das abas ---------- */
  const ABAS = {
    dadosOS: {
      colecao: 'ordens_servico',
      rotulo: 'Dados OS Fabrica',
      rotuloNorm: normSolida('Dados OS Fabrica'),
    },
    resumo: {
      colecao: 'resumo_os_usts',
      rotulo: 'Resumo OS USTs',
      rotuloNorm: normSolida('Resumo OS USTs'),
    },
    detalhe: {
      colecao: 'detalhes_os',
      rotulo: 'Detalhe das OSs',
      rotuloNorm: normSolida('Detalhe das OSs'),
    },
    catalogo: {
      colecao: 'catalogo_servicos',
      rotulo: 'Catálogo de Serviços',
      rotuloNorm: normSolida('Catálogo de Serviços'),
    },
    niveis: {
      colecao: 'niveis_complexidade',
      rotulo: 'Níveis de Complexidade por tipo',
      rotuloNorm: normSolida('Níveis de Complexidade por tipo'),
    },
  }
  /* tolerante a espaços antes/depois do parêntese: solida o nome todo */
  /* aceita "Status Projeto (ddmmaaaa)" e "Status Projetos (ddmmaaaa)",
     singular ou plural, com espaços extras em volta do parêntese */
  const RE_STATUS_SOLIDA = /^statusprojetos?(\d{2})(\d{2})(\d{4})$/
  function tipoDaAba(nome) {
    const solida = normSolida(nome)
    const m = RE_STATUS_SOLIDA.exec(solida)
    if (m) {
      const d = +m[1],
        mo = +m[2],
        y = +m[3]
      const dt = new Date(y, mo - 1, d)
      if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null
      return {
        tipo: 'status',
        dataKey: y * 10000 + mo * 100 + d,
        dataTexto: m[1] + '/' + m[2] + '/' + m[3],
      }
    }
    for (const k of Object.keys(ABAS)) {
      if (solida === ABAS[k].rotuloNorm) return { tipo: k }
    }
    return null
  }

  /* ---------- conversores: {headers, rows} → registros ---------- */
  function convDadosOS(sheet) {
    const H = sheet.headers || []
    const ixOS = colIx(H, ['numeroos', 'nros', 'os'])
    const ixProj = colIx(H, ['projeto'])
    const ixProd = colIx(H, ['produto'])
    const ixAbert = colIx(H, ['dataabertura'])
    const ixFech = colIx(H, ['datafechamento'])
    const ixUst = colIx(H, ['qtdeusts', 'usts'])
    const ixVust = colIx(H, ['valorust'])
    const ixTot = colIx(H, ['totalemrs', 'totalrs', 'totalemr_', 'totalemr'])
    const ixObs = colIx(H, ['observacao'])
    const out = []
    ;(sheet.rows || []).forEach((r) => {
      const numeroOS = txt(r, ixOS)
      if (!numeroOS) return
      const reg = { numero_os: numeroOS }
      if (ixProj >= 0) reg.projeto = txt(r, ixProj)
      if (ixProd >= 0) reg.produto = txt(r, ixProd)
      const dA = dataIso(r[ixAbert])
      if (dA) reg.data_abertura = dA
      const dF = dataIso(r[ixFech])
      if (dF) reg.data_fechamento = dF
      if (ixUst >= 0) reg.qtde_usts = num(r[ixUst])
      if (ixVust >= 0) reg.valor_ust = num(r[ixVust])
      if (ixTot >= 0) reg.total_rs = num(r[ixTot])
      if (ixObs >= 0) reg.observacao = txt(r, ixObs)
      out.push(reg)
    })
    return out
  }
  function convResumo(sheet) {
    const H = sheet.headers || []
    const ixOS = colIx(H, ['numeroos', 'nros', 'os'])
    const ixCod = colIx(H, ['codigo'])
    const ixDesc = colIx(H, ['descricao'])
    const ixOcor = colIx(H, ['qtdeocorrencias', 'ocorrencias'])
    const ixC1 = colIx(H, ['c1'])
    const ixC2 = colIx(H, ['c2'])
    const ixC3 = colIx(H, ['c3'])
    const ixTot = colIx(H, ['totalusts'])
    const out = []
    ;(sheet.rows || []).forEach((r) => {
      const numeroOS = txt(r, ixOS)
      const cod = txt(r, ixCod)
      if (!numeroOS && !cod) return
      const reg = {}
      if (numeroOS) reg.numero_os = numeroOS
      if (cod) reg.codigo = cod
      if (ixDesc >= 0) reg.descricao = txt(r, ixDesc)
      if (ixOcor >= 0) reg.qtde_ocorrencias = num(r[ixOcor])
      if (ixC1 >= 0) reg.c1 = num(r[ixC1])
      if (ixC2 >= 0) reg.c2 = num(r[ixC2])
      if (ixC3 >= 0) reg.c3 = num(r[ixC3])
      if (ixTot >= 0) reg.total_usts = num(r[ixTot])
      if (Object.keys(reg).length) out.push(reg)
    })
    return out
  }
  function convDetalhe(sheet) {
    const H = sheet.headers || []
    const ixOS = colIx(H, ['numeroos', 'nros', 'os'])
    const ixProd = colIx(H, ['produto'])
    const ixAtiv = colIx(H, ['atividadetermoreferencia', 'atividadetermo'])
    const ixCod = colIx(H, ['codigo'])
    const ixDesc = colIx(H, ['descricao', 'descricaohistoriausuario', 'descricaohistoria'])
    const ixCx1 = colIx(H, ['nivelcomplexidade1'])
    const ixCx = colIx(H, ['nivelcomplexidade', 'complexidade'])
    const ixEst = colIx(H, ['estimativaemust'])
    const ixFat = colIx(H, ['multiplicarcomplexidade'])
    const ixTot = colIx(H, ['totalemust', 'totalust'])
    /* "Total (observações)" — só casa com coluna de observação (ou exata
       "total"), nunca com "Total em UST" */
    let ixObs = H.findIndex((x) => normSolida(x).indexOf('observac') >= 0)
    if (ixObs < 0) {
      const cand = H.map((x) => normSolida(x))
      ixObs = cand.indexOf('total') >= 0 ? cand.indexOf('total') : -1
    }
    const out = []
    ;(sheet.rows || []).forEach((r) => {
      const numeroOS = txt(r, ixOS)
      if (!numeroOS) return
      const reg = { numero_os: numeroOS }
      if (ixProd >= 0) reg.produto = txt(r, ixProd)
      if (ixAtiv >= 0) reg.atividade_termo = txt(r, ixAtiv)
      if (ixCod >= 0) reg.codigo = txt(r, ixCod)
      if (ixDesc >= 0) reg.descricao_atividade = txt(r, ixDesc)
      const cx = txt(r, ixCx1 >= 0 ? ixCx1 : ixCx)
      if (cx) reg.nivel_complexidade = cx
      if (ixEst >= 0) reg.estimativa_ust = num(r[ixEst])
      if (ixFat >= 0) reg.fator_complexidade = num(r[ixFat])
      if (ixTot >= 0) reg.total_ust = num(r[ixTot])
      if (ixObs >= 0) reg.total_observacoes = txt(r, ixObs)
      out.push(reg)
    })
    return out
  }
  function convCatalogo(sheet) {
    const H = sheet.headers || []
    const ixItem = colIx(H, ['item'])
    const ixCod = colIx(H, ['codigo'])
    const ixArea = colIx(H, ['area'])
    const ixDesc = colIx(H, ['descricao', 'descricaodaatividade'])
    const ixEst = colIx(H, ['estimativaemusts', 'estimativaemust'])
    const ixQtd = colIx(H, ['quantidade'])
    const ixUn = colIx(H, ['unidadedemedida', 'unidademedida'])
    const out = []
    ;(sheet.rows || []).forEach((r) => {
      const cod = txt(r, ixCod)
      const desc = txt(r, ixDesc)
      if (!cod && !desc) return
      const reg = {}
      if (ixItem >= 0) reg.item = num(r[ixItem])
      if (cod) reg.codigo = cod
      if (ixArea >= 0) reg.area = txt(r, ixArea)
      if (desc) reg.descricao = desc
      if (ixEst >= 0) reg.estimativa_ust = num(r[ixEst])
      if (ixQtd >= 0) reg.quantidade = num(r[ixQtd])
      if (ixUn >= 0) reg.unidade_medida = txt(r, ixUn)
      out.push(reg)
    })
    return out
  }
  function convNiveis(sheet) {
    const H = sheet.headers || []
    const ixNivel = colIx(H, ['niveldecomplexidade', 'nivelcomplexidade', 'nivel'])
    const ixDesc = colIx(H, ['descricao'])
    const ixFat = colIx(H, ['fatordecomplexidade', 'fatorcomplexidade', 'fator'])
    const out = []
    ;(sheet.rows || []).forEach((r) => {
      const nivel = txt(r, ixNivel)
      if (!nivel) return
      const reg = { nivel: nivel }
      if (ixDesc >= 0) reg.descricao = txt(r, ixDesc)
      if (ixFat >= 0) reg.fator = num(r[ixFat])
      out.push(reg)
    })
    return out
  }
  function convStatus(sheet) {
    const H = sheet.headers || []
    const ixNome = colIx(H, ['nomedoprojeto', 'nomeprojeto', 'projeto', 'nome'])
    const ixStatus = colIx(H, ['status'])
    const ixAnd = colIx(H, ['andamentoatual', 'andamento'])
    const ixProx = colIx(H, ['proximospassos'])
    const out = []
    const itens = {}
    ;(sheet.rows || []).forEach((r) => {
      const nome = txt(r, ixNome)
      if (!nome) return
      const reg = { nome: nome }
      const mapa = [
        [
          'descricao_produto_escopo',
          ['descricaodoprodutoescopo', 'descricaoprodutoescopo', 'escopo'],
        ],
        ['status', ['status']],
        ['andamento_atual', ['andamentoatual', 'andamento']],
        ['proximos_passos', ['proximospassos']],
        ['responsavel', ['responsavel']],
        ['status_pausa', ['statusdepausa', 'statuspausa']],
        ['motivo_pausa', ['motivodapausa', 'motivopausa']],
        ['classificacao', ['classificacao']],
      ]
      mapa.forEach(([campo, alvos]) => {
        const ix = colIx(H, alvos)
        const v = txt(r, ix)
        if (v) reg[campo] = v
      })
      const dts = [
        ['data_demanda', ['datadedemanda', 'datademanda']],
        ['data_inicio', ['datadeinicio', 'datainicio']],
        ['data_desenvolvimento', ['datadedesenvolvimento', 'datadesenvolvimento']],
        ['prazo_alvo', ['prazoalvo']],
        ['data_finalizacao_real', ['datadefinalizacaoreal', 'datafinalizacaoreal']],
      ]
      dts.forEach(([campo, alvos]) => {
        const ix = colIx(H, alvos)
        const d = dataIso(r[ix])
        if (d) reg[campo] = d
      })
      const ixProg = colIx(H, ['progresso', 'progresso'])
      if (ixProg >= 0) {
        const p = num(r[ixProg])
        if (p) reg.progresso = p <= 1 ? Math.round(p * 10000) / 100 : Math.round(p * 100) / 100
      }
      out.push(reg)
      /* itens para o estado dos projetos (mesma chave da 0.0.26) */
      const it = {}
      const st = txt(r, ixStatus)
      const and = txt(r, ixAnd)
      const prox = txt(r, ixProx)
      if (st) it.status = st
      if (and) it.andamento = and
      if (prox) it.proximos = prox
      if (Object.keys(it).length) itens[norm(nome)] = it
    })
    return { registros: out, itens: itens }
  }
  const CONVERSORES = {
    dadosOS: convDadosOS,
    resumo: convResumo,
    detalhe: convDetalhe,
    catalogo: convCatalogo,
    niveis: convNiveis,
  }

  /* ---------- leitura do arquivo: lista abas e extrai linhas ---------- */
  function listarNomesAbas(buf) {
    const nomes = []
    readSheetRowsFromXlsx(buf, (nm) => {
      nomes.push(nm)
      return false
    })
    return nomes
  }

  /* =========================================================
  IMPORTAÇÃO COMPLETA — chamada pelo botão da seção Importar Base.
  Lê TODAS as abas reconhecidas do arquivo .xlsx e grava cada uma
  na coleção PocketBase correspondente (lote, substituindo o que
  já havia). Retorna um resumo { aba → { colecao, gravados, erro } }
  para a mensagem de confirmação da tela.
  ========================================================= */
  async function importarPlanilhaCompleta(file) {
    const buf = await new Promise((resolve, reject) => {
      const rd = new FileReader()
      rd.onload = () => resolve(rd.result)
      rd.onerror = () => reject(new Error('Não foi possível ler o arquivo.'))
      rd.readAsArrayBuffer(file)
    })
    const nomes = listarNomesAbas(buf)
    const encontradas = {}
    nomes.forEach((n) => {
      const t = tipoDaAba(n)
      if (!t) return
      if (t.tipo === 'status') {
        if (!encontradas.status || t.dataKey > encontradas.status.dataKey)
          encontradas.status = Object.assign({ nome: n }, t)
      } else if (!encontradas[t.tipo]) {
        encontradas[t.tipo] = { nome: n, tipo: t.tipo }
      }
    })
    /* abas de status lidas (todas as datadas, para a mensagem da tela) */
    const abasStatus = nomes
      .map((n) => tipoDaAba(n))
      .map((t, i) => (t && t.tipo === 'status' ? Object.assign({ nome: nomes[i] }, t) : null))
      .filter(Boolean)
      .sort((a, b) => b.dataKey - a.dataKey)
    if (!Object.keys(encontradas).length) {
      return { ok: false, msg: 'Nenhuma aba conhecida foi encontrada no arquivo.' }
    }

    const token = await pbAuth()
    const base = pbBase()
    const resumo = {}
    if (!base || !token) {
      Object.keys(encontradas).forEach((k) => {
        const alvo = k === 'status' ? 'projetos_cet' : ABAS[k].colecao
        resumo[k] = { colecao: alvo, gravados: 0, erro: 'banco indisponível' }
      })
      return {
        ok: false,
        msg: 'Banco de dados indisponível — nenhuma coleção foi gravada.',
        resumo: resumo,
        encontradas: encontradas,
        abasStatus: abasStatus,
      }
    }

    /* extrai + converte cada aba reconhecida (itens da aba de status vão
       junto no retorno, para o HTML gravar no localStorage como na 0.0.26) */
    let itensStatus = null
    let abaStatusNome = null
    let abaStatusData = null
    const registros = {}
    const lerAba = (nome) => {
      try {
        return readSheetRowsFromXlsx(buf, (nm) => nm === nome)
      } catch (e) {
        return null
      }
    }
    /* TODAS as abas de status datadas são lidas: a de data mais recente
       alimenta projetos_cet; as demais entram no resumo com contagem */
    abasStatus.forEach((aba, i) => {
      const key = i === 0 ? 'status' : 'status#' + aba.dataKey
      resumo[key] = {
        colecao: 'projetos_cet',
        gravados: 0,
        lidos: 0,
        rotulo:
          'Status Projetos (' + (aba.dataTexto || aba.nome) + ')' + (i === 0 ? ' — gravada' : ''),
      }
      const sheet = lerAba(aba.nome)
      if (!sheet || !sheet.rows || !sheet.rows.length) {
        resumo[key].erro = 'aba sem linhas'
        return
      }
      if (i > 0) {
        resumo[key].lidos = sheet.rows.length
        return
      }
      try {
        const conv = convStatus(sheet)
        registros.status = conv.registros
        itensStatus = conv.itens
        abaStatusNome = aba.nome
        abaStatusData = aba.dataTexto
      } catch (e) {
        registros.status = []
      }
      resumo[key].lidos = (registros.status || []).length
    })
    for (const k of Object.keys(encontradas)) {
      if (k === 'status') continue
      const nome = encontradas[k].nome
      const sheet = lerAba(nome)
      if (!sheet || !sheet.rows || !sheet.rows.length) {
        resumo[k] = {
          colecao: ABAS[k].colecao,
          gravados: 0,
          erro: 'aba sem linhas',
          rotulo: ABAS[k].rotulo,
        }
        continue
      }
      try {
        registros[k] = CONVERSORES[k] ? CONVERSORES[k](sheet) : []
      } catch (e) {
        registros[k] = []
      }
      resumo[k] = {
        colecao: ABAS[k].colecao,
        gravados: 0,
        lidos: (registros[k] || []).length,
        rotulo: ABAS[k].rotulo,
      }
    }
    /* projetos/produtos criados dinamicamente: todo produto presente nas
       abas de OS que não casar com nenhum projeto importado (casamento
       tolerante) vira um projeto novo em projetos_cet */
    const nomesProjetos = (registros.status || []).map((p) => p.nome).filter(Boolean)
    const produtosVistos = {}
    ;(registros.dadosOS || []).forEach((r) => {
      if (r.produto) produtosVistos[normSolida(r.produto)] = r.produto
    })
    ;(registros.detalhe || []).forEach((r) => {
      if (r.produto) produtosVistos[normSolida(r.produto)] = r.produto
    })
    Object.keys(produtosVistos).forEach((ps) => {
      const prod = produtosVistos[ps]
      if (!casarNome(prod, nomesProjetos)) {
        registros.status.push({ nome: prod })
        nomesProjetos.push(prod)
      }
    })
    /* vínculo OS ↔ projeto tolerante a variações de nome: quando o nome
       da OS não casa exatamente com um projeto, casa por contenção */
    ;(registros.dadosOS || []).forEach((r) => {
      const baseNome = r.projeto || r.produto
      if (!baseNome) return
      const m = casarNome(baseNome, nomesProjetos)
      if (m && r.projeto !== m) r.projeto = m
      if (!r.produto && m) r.produto = m
    })

    /* gravação: cada coleção é limpa antes de receber os novos registros */
    try {
      await pbApagarColecao('catalogo_servicos', token)
      await pbApagarColecao('niveis_complexidade', token)
      await pbApagarColecao('ordens_servico', token)
      await pbApagarColecao('resumo_os_usts', token)
      await pbApagarColecao('detalhes_os', token)
      await pbApagarColecao('projetos_cet', token)
    } catch (e) {
      Object.keys(resumo).forEach((k) => {
        if (!resumo[k].erro) resumo[k].erro = 'não foi possível limpar a coleção anterior'
      })
      return {
        ok: false,
        msg: 'Falha ao limpar as coleções no banco de dados — nada foi gravado.',
        resumo: resumo,
      }
    }
    const reqs = {
      catalogo_servicos: [],
      niveis_complexidade: [],
      ordens_servico: [],
      resumo_os_usts: [],
      detalhes_os: [],
      projetos_cet: [],
    }
    Object.keys(registros).forEach((k) => {
      const alvo = k === 'status' ? 'projetos_cet' : ABAS[k].colecao
      ;(registros[k] || []).forEach((reg) => {
        if (reqs[alvo])
          reqs[alvo].push({
            method: 'POST',
            url: '/api/collections/' + alvo + '/records',
            body: reg,
          })
      })
    })
    for (const alvo of Object.keys(reqs)) {
      const lista = reqs[alvo]
      let falhou = null
      for (let i = 0; i < lista.length; i += 40) {
        const chunk = lista.slice(i, i + 40)
        try {
          await pbBatch(chunk, token)
        } catch (e) {
          for (const rq of chunk) {
            try {
              const rr = await fetch(pbBase() + rq.url, {
                method: rq.method,
                headers: { 'Content-Type': 'application/json', Authorization: token },
                body: JSON.stringify(rq.body),
              })
              if (!rr.ok) throw new Error(alvo + ' (' + rr.status + ')')
            } catch (e2) {
              falhou = e2
              break
            }
          }
        }
        if (falhou) break
      }
      const k = Object.keys(resumo).find((kk) => resumo[kk].colecao === alvo)
      if (k) {
        resumo[k].gravados = falhou ? resumo[k].gravados : lista.length
        if (falhou) resumo[k].erro = String(falhou.message || falhou)
      }
    }

    const partes = Object.keys(resumo).map((k) => {
      const r = resumo[k]
      const rotulo =
        r.rotulo ||
        (k === 'status'
          ? 'Status Projetos (mais recente: ' + encontradas.status.nome + ')'
          : ABAS[k].rotulo)
      return r.erro
        ? rotulo + ' → ' + r.colecao + ': FALHOU (' + r.erro + ')'
        : rotulo + ' → ' + r.colecao + ': ' + r.gravados + ' registros gravados'
    })
    return {
      ok: Object.keys(resumo).every((k) => !resumo[k].erro),
      msg:
        'Importação concluída. Abas lidas: ' +
        Object.keys(resumo)
          .map(
            (k) => resumo[k].rotulo || (k === 'status' ? encontradas.status.nome : ABAS[k].rotulo),
          )
          .join(', ') +
        '. ' +
        partes.join(' · '),
      resumo: resumo,
      encontradas: encontradas,
      abasStatus: abasStatus,
      abaStatusMaisRecente: itensStatus
        ? {
            nome: abaStatusNome,
            data: abaStatusData,
            itens: itensStatus,
            abas: abasStatus.map((a) => a.nome),
          }
        : null,
    }
  }
  window.RAUTAKI_IMPORTAR = {
    tipoDaAba,
    listarNomesAbas,
    importarPlanilhaCompleta,
    casarNome,
  }
})()
