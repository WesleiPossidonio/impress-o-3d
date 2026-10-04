# Esteira local — Logos SVG + OpenSCAD

## 1. Pré-requisitos

Na pasta do projeto devem existir:

- `baixar_logos.sh`
- `extrair_logos.js`
- `package.json`
- `package-lock.json`
- `node_modules/`
- `Untitled.scad`

Também é necessário ter `node`, `npm` e `inkscape` instalados.

## 2. Rodar a esteira

Entre na pasta:

```bash
cd ~/Documentos/teste
```

Substitua os arquivos pelos arquivos desta pasta e rode:

```bash
chmod +x baixar_logos.sh
./baixar_logos.sh
```

Se a instalação local estiver correta, o resultado esperado é:

```text
whatsapp.svg
instagram.svg
google.svg
pix.svg
```

## 3. Se o Pix não for encontrado

Veja exatamente quais versões estão instaladas:

```bash
npm ls @iconify-json/logos @iconify-json/mdi @iconify-json/flat-color-icons
```

A nova versão do `extrair_logos.js` procura o Pix em mais de uma coleção local antes de falhar.

## 4. OpenSCAD

O `Untitled.scad` importa os SVGs diretamente:

```scad
import("google.svg", center = true);
```

O OpenSCAD suporta importação de SVG como geometria 2D e `linear_extrude()` transforma essa geometria em relevo 3D. A documentação também confirma `resize()` e `import()` para SVG. 

O NFC continua 100% nativo no OpenSCAD.

### Para trocar o logo

No topo de `Untitled.scad`:

```scad
ARQUIVO_LOGOTIPO = "google.svg";
```

Pode trocar para:

```scad
ARQUIVO_LOGOTIPO = "whatsapp.svg";
ARQUIVO_LOGOTIPO = "instagram.svg";
ARQUIVO_LOGOTIPO = "pix.svg";
```

## 5. O que foi corrigido

- Namespace SVG correto: `http://www.w3.org/2000/svg`
- Removido o SVG Pix truncado do script antigo
- Falhas agora interrompem o `.sh`
- Inkscape só é chamado depois de validar os arquivos brutos
- SVGs são convertidos para SVG simples/limpo
- Logo é escalado preservando proporção
- NFC não depende de SVG
- Rebaixo da tag NFC é traseiro, não atravessa o painel
- Relevo nominal dos logos/NFC: `0.6 mm`

O Inkscape possui suporte de linha de comando para conversão/exportação de SVG simples; a documentação/manuais registram `--export-plain-svg` e o uso de `-o`/`--export-filename`. citeturn0search9turn0search0
