#!/bin/bash
set -Eeuo pipefail

echo "🚀 Iniciando esteira Iconify..."

command -v node >/dev/null 2>&1 || {
    echo "❌ Node.js não encontrado."
    exit 1
}

command -v inkscape >/dev/null 2>&1 || {
    echo "❌ Inkscape não encontrado."
    exit 1
}

if [ ! -d "node_modules" ]; then
    echo "❌ node_modules não encontrado."
    exit 1
fi


echo ""
echo "📦 Extraindo vetores..."
node extrair_logos.js


arquivos=(
    whatsapp_raw.svg
    instagram_raw.svg
    google_raw.svg
    pix_raw.svg
)


echo ""
echo "🔎 Validando SVGs..."

for arquivo in "${arquivos[@]}"; do

    if [ ! -s "$arquivo" ]; then
        echo "❌ Arquivo ausente ou vazio: $arquivo"
        exit 1
    fi

    if ! grep -q "<svg" "$arquivo"; then
        echo "❌ SVG inválido: $arquivo"
        exit 1
    fi

    echo "   ✓ $arquivo"

done


echo ""
echo "🛠️ Normalizando com Inkscape..."


for nome in whatsapp instagram google pix; do

    entrada="${nome}_raw.svg"
    saida="${nome}.svg"

    echo "   → $entrada → $saida"

    inkscape "$entrada" \
        --export-plain-svg \
        --export-filename="$saida"

    if [ ! -s "$saida" ]; then
        echo "❌ Inkscape não gerou: $saida"
        exit 1
    fi

done


echo ""
echo "🧹 Removendo arquivos temporários..."

rm -f \
    whatsapp_raw.svg \
    instagram_raw.svg \
    google_raw.svg \
    pix_raw.svg


echo ""
echo "=========================================="
echo "✅ ESTEIRA CONCLUÍDA COM SUCESSO!"
echo "=========================================="
echo ""

ls -lh \
    whatsapp.svg \
    instagram.svg \
    google.svg \
    pix.svg