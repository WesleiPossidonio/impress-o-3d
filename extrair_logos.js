const fs = require('fs')
const https = require('https')

const { getIconData, iconToSVG } = require('@iconify/utils')

const logos = require('@iconify-json/logos/icons.json')
const mdi = require('@iconify-json/mdi/icons.json')
const fci = require('@iconify-json/flat-color-icons/icons.json')

const SVG_NS = 'http://www.w3.org/2000/svg'

/*
==========================================================
CONFIGURAÇÃO DOS ÍCONES
==========================================================

Para ADICIONAR um ícone:
    basta adicionar um novo objeto aqui.

Para ALTERAR um ícone:
    altere "colecao" e "icone".

Para REMOVER um ícone:
    remova o objeto da lista.

O sistema apagará automaticamente os arquivos antigos
que não pertencem mais à configuração.
==========================================================
*/

const ICONES = [
  {
    nome: 'whatsapp',
    fonte: 'cdn',
    colecao: 'basil',
    icone: 'whatsapp-outline',
  },

  {
    nome: 'instagram',
    fonte: 'local',
    colecao: mdi,
    ids: ['instagram'],
  },

  {
    nome: 'google',
    fonte: 'local',
    colecao: fci,
    ids: ['google'],
  },

  {
    nome: 'pix',
    fonte: 'cdn',
    colecao: 'simple-icons',
    icone: 'pix',
  },
  {
    nome: 'wifi',
    fonte: 'cdn',
    colecao: 'akar-icons',
    icone: 'wifi',
  },
  {
    nome: 'nfc',
    fonte: 'cdn',
    colecao: 'ph',
    icone: 'contactless-payment',
  },
]

/*
==========================================================
UTILITÁRIOS
==========================================================
*/

function getIcon(colecao, id) {
  const iconData = getIconData(colecao, id)

  if (!iconData) {
    throw new Error(`Ícone não encontrado: ${id}`)
  }

  const renderizado = iconToSVG(iconData, {
    height: 'auto',
    width: 'auto',
  })

  const attrs = renderizado.attributes

  const body = renderizado.body

  return {
    attrs,
    body,
  }
}

/*
==========================================================
SALVAR SVG
==========================================================
*/

function salvarSVG(nome, svg) {
  const arquivo = `${nome}_raw.svg`

  fs.writeFileSync(arquivo, svg, 'utf8')

  console.log(`   ✓ Gerado: ${arquivo}`)
}

/*
==========================================================
GERAR SVG LOCAL
==========================================================
*/

function gerarSVGLocal(config) {
  if (!config.ids || !config.ids.length) {
    throw new Error(`Nenhum ID configurado para o ícone "${config.nome}".`)
  }

  let idEncontrado = null

  for (const id of config.ids) {
    try {
      const iconData = getIconData(config.colecao, id)

      if (iconData) {
        idEncontrado = id
        break
      }
    } catch (_) {
      // Continua procurando.
    }
  }

  if (!idEncontrado) {
    throw new Error(`Nenhum ícone encontrado para "${config.nome}".`)
  }

  console.log(`   → Local: ${config.nome} (${idEncontrado})`)

  const icon = getIcon(config.colecao, idEncontrado)

  const atributos = Object.entries(icon.attrs)
    .map(([chave, valor]) => `${chave}="${valor}"`)
    .join(' ')

  return `
<svg
    xmlns="${SVG_NS}"
    ${atributos}
>
    ${icon.body}
</svg>
`.trim()
}

/*
==========================================================
BAIXAR ARQUIVO HTTPS
==========================================================
*/

function baixar(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          return baixar(response.headers.location).then(resolve).catch(reject)
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${url}`))

          return
        }

        let dados = ''

        response.setEncoding('utf8')

        response.on('data', (trecho) => (dados += trecho))

        response.on('end', () => resolve(dados))
      })
      .on('error', reject)
  })
}

/*
==========================================================
BAIXAR ÍCONE ICONIFY CDN
==========================================================
*/

async function baixarIconeIconify(config) {
  const url =
    `https://api.iconify.design/` + `${config.colecao}/` + `${config.icone}.svg`

  console.log(`   → CDN: ${config.nome}`)

  console.log(`     ${url}`)

  const svg = await baixar(url)

  if (!svg || !svg.includes('<svg')) {
    throw new Error(`Resposta inválida para "${config.nome}".`)
  }

  return svg
}

/*
==========================================================
VALIDAÇÃO DO SVG
==========================================================
*/

function validarSVG(nome, svg) {
  if (!svg || !svg.trim()) {
    throw new Error(`SVG vazio: ${nome}`)
  }

  if (!svg.includes('<svg')) {
    throw new Error(`SVG inválido: ${nome}`)
  }

  if (!svg.includes('xmlns=')) {
    console.warn(`   ⚠ SVG sem xmlns detectado: ${nome}`)
  }
}

/*
==========================================================
PROCESSAR UM ÍCONE
==========================================================
*/

async function processarIcone(config) {
  console.log('')
  console.log(`🔹 Processando: ${config.nome}`)

  let svg

  if (config.fonte === 'local') {
    svg = gerarSVGLocal(config)
  } else if (config.fonte === 'cdn') {
    svg = await baixarIconeIconify(config)
  } else {
    throw new Error(`Fonte desconhecida para "${config.nome}": ${config.fonte}`)
  }

  validarSVG(config.nome, svg)

  salvarSVG(config.nome, svg)
}

/*
==========================================================
LIMPEZA AUTOMÁTICA
==========================================================

Remove:

    *_raw.svg
    *.svg

que não estejam mais configurados.

Isso permite:

    antes:
        google
        pix
        nfc

    depois:
        google
        pix

Ao executar novamente:

    nfc_raw.svg
    nfc.svg

serão removidos automaticamente.
==========================================================
*/

function limparArquivosAntigos() {
  console.log('')
  console.log('🧹 Limpando arquivos antigos...')

  const arquivosPermitidos = new Set()

  for (const config of ICONES) {
    arquivosPermitidos.add(`${config.nome}_raw.svg`)

    arquivosPermitidos.add(`${config.nome}.svg`)
  }

  const arquivos = fs.readdirSync('.')

  let removidos = 0

  for (const arquivo of arquivos) {
    if (!arquivo.endsWith('.svg')) {
      continue
    }

    /*
        Evita apagar SVGs que não pertencem
        à esteira de ícones.

        Somente arquivos que seguem o padrão
        *_raw.svg ou nomes configurados serão
        considerados.
        */

    const raw = arquivo.endsWith('_raw.svg')

    const pertenceAoPadrao = raw || arquivosPermitidos.has(arquivo)

    if (!pertenceAoPadrao) {
      continue
    }

    if (!arquivosPermitidos.has(arquivo)) {
      fs.unlinkSync(arquivo)

      console.log(`   🗑 Removido: ${arquivo}`)

      removidos++
    }
  }

  if (removidos === 0) {
    console.log('   ✓ Nenhum arquivo antigo encontrado.')
  } else {
    console.log(`   ✓ ${removidos} arquivo(s) antigo(s) removido(s).`)
  }
}

/*
==========================================================
PROCESSAR TODOS
==========================================================
*/

async function processarTodos() {
  for (const config of ICONES) {
    await processarIcone(config)
  }
}

/*
==========================================================
MAIN
==========================================================
*/

async function main() {
  console.log('')
  console.log('==========================================')
  console.log('🚀 ESTEIRA ICONIFY')
  console.log('==========================================')

  console.log('')
  console.log(`📦 ${ICONES.length} ícone(s) configurado(s).`)

  /*
    PRIMEIRO:
    remove arquivos que não pertencem
    mais à configuração atual.
    */

  limparArquivosAntigos()

  /*
    DEPOIS:
    gera os ícones atuais.
    */

  await processarTodos()

  console.log('')
  console.log('==========================================')
  console.log('✅ EXTRAÇÃO CONCLUÍDA')
  console.log('==========================================')
  console.log('')

  for (const config of ICONES) {
    console.log(`✓ ${config.nome}_raw.svg`)
  }

  console.log('')
}

/*
==========================================================
TRATAMENTO GLOBAL DE ERROS
==========================================================
*/

main().catch((error) => {
  console.error('')
  console.error('==========================================')
  console.error('❌ FALHA NA EXTRAÇÃO')
  console.error('==========================================')

  console.error('')
  console.error(error.message)

  console.error('')

  process.exit(1)
})
