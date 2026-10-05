// =========================================================================
// DISPLAY QR / NFC — CATÁLOGO DE LOGOS EXTERNOS
// ICONIFY / OPENSCAD
//
// Engenharia:
// Carcaça 4.5mm
// Pé Estável 65mm
// Batente Direito 7mm
// Cavidade frontal Google: 0.3mm
// NFC frontal em relevo: 0.4mm
// Cavidade NFC traseira: Ø25mm x 1.8mm
// Cartão QR retangular
// Meia-lua na entrada da gaveta
// Meia-lua atravessa somente a parede traseira
// Logo da empresa pequena e rebaixado no canto inferior direito
// =========================================================================

$fn = 120;


// =========================================================================
// CONFIGURAÇÃO
// =========================================================================

// Logo principal
ARQUIVO_LOGOTIPO = "google.svg";

LOGO_LARGURA = 66;
LOGO_ALTURA  = 66;
LOGO_Z       = 105;


// Logo da empresa
ARQUIVO_MARCA = "tideon.svg";

MARCA_LARGURA = 8;
MARCA_ALTURA = 8;

MARCA_PROFUNDIDADE = 0.3;

MARCA_X = 39;
MARCA_Z = 9;


// NFC
ARQUIVO_NFC = "nfc_raw.svg";

NFC_LARGURA = 29.4;
NFC_ALTURA  = 29.4;

NFC_Z = 45;

NFC_TAG_DIAMETRO = 25;

NFC_CAVIDADE_PROFUNDIDADE = 1.8;


// Relevo frontal do NFC
RELEVO = 0.4;


// =========================================================================
// CAVIDADE DO ÍCONE FRONTAL
//
// Somente o Google possui cavidade frontal.
//
// Profundidade = 0.3mm.
//
// O NFC frontal NÃO possui cavidade.
// Ele será um relevo de 0.4mm acima da placa.
// =========================================================================

REBAIXO_ICONES = 0.3;


// =========================================================================
// PAINEL
// =========================================================================

LARGURA = 100;
ALTURA = 150;
ESPESSURA = 4.5;

INCLINACAO = -7;


// =========================================================================
// CARTÃO QR
// =========================================================================

QR_LARGURA = 80;
QR_ALTURA = 60;
QR_ESPESSURA = 0.8;


// =========================================================================
// GAVETA DO QR
// =========================================================================

QR_GAVETA_X = -51;
QR_GAVETA_Y = 1.65;
QR_GAVETA_Z = 15;

QR_GAVETA_LARGURA = 94;
QR_GAVETA_ALTURA = 61;
QR_GAVETA_PROFUNDIDADE = 1.2;


// =========================================================================
// MEIA-LUA — PEGA-DEDO NA ENTRADA
// =========================================================================

QR_MEIA_LUA_DIAMETRO = 14;

QR_MEIA_LUA_Z = 45.5;

QR_MEIA_LUA_X = -50;


// Parede traseira da gaveta
QR_PAREDE_TRASEIRA_Y =
    QR_GAVETA_Y + QR_GAVETA_PROFUNDIDADE;


// Espessura restante atrás da gaveta
QR_PAREDE_TRASEIRA_ESPESSURA =
    ESPESSURA - QR_PAREDE_TRASEIRA_Y;


// =========================================================================
// GOOGLE — CAVIDADE FRONTAL
// =========================================================================
//
// A peça separada do Google será encaixada aqui.
//
// Profundidade real da cavidade:
// 0.3mm
//
// O mirror vertical é mantido para preservar a orientação visual
// do Google após a rotação da cavidade.
// =========================================================================

module logo_rebaixado() {

    linear_extrude(
        height = REBAIXO_ICONES
    )

        mirror([0,1,0])

            resize(
                [LOGO_LARGURA, LOGO_ALTURA],
                auto = true
            )

                import(
                    ARQUIVO_LOGOTIPO,
                    center = true
                );
}


// =========================================================================
// LOGO DA EMPRESA — REBAIXADA
// =========================================================================

module marca_rebaixada() {

    linear_extrude(
        height = MARCA_PROFUNDIDADE
    )

        resize(
            [MARCA_LARGURA, MARCA_ALTURA],
            auto = true
        )

            import(
                ARQUIVO_MARCA,
                center = true
            );
}


// =========================================================================
// NFC — RELEVO FRONTAL
// =========================================================================
//
// O NFC frontal NÃO é uma cavidade.
//
// Ele será impresso diretamente sobre a placa,
// ficando 0.4mm acima da superfície.
//
// Segue exatamente o padrão do código NFC original:
//
// linear_extrude(height = RELEVO)
// resize([NFC_LARGURA, NFC_ALTURA])
// import(ARQUIVO_NFC)
//
// NÃO existe mirror.
//
// Dimensão:
// 29.4 x 29.4 mm
//
// Posição:
// X = 0
// Z = 45
//
// Altura:
// 0.4 mm
// =========================================================================

module nfc_externo() {

    linear_extrude(
        height = RELEVO
    )

        resize(
            [NFC_LARGURA, NFC_ALTURA],
            auto = true
        )

            import(
                ARQUIVO_NFC,
                center = true
            );
}


// =========================================================================
// COMPOSIÇÃO DO PRODUTO
// =========================================================================

difference() {


// -------------------------------------------------------------------------
// PARTE POSITIVA
// -------------------------------------------------------------------------

union() {


    // =====================================================================
    // PÉ DE APOIO
    // =====================================================================

    translate([
        -50,
        0,
        0
    ])

        cube([
            100,
            65,
            4.6
        ]);


    // =====================================================================
    // PAINEL INCLINADO
    // =====================================================================

    rotate([
        INCLINACAO,
        0,
        0
    ]) {

        // =================================================================
        // PLACA PRINCIPAL
        // =================================================================

        translate([
            -50,
            0,
            0
        ])

            cube([
                LARGURA,
                ESPESSURA,
                ALTURA
            ]);


        // =================================================================
        // E. NFC — RELEVO FRONTAL
        // =================================================================
        //
        // O NFC fica acima da placa.
        //
        // Altura do relevo:
        // 0.4mm
        //
        // Posição:
        // X = 0
        // Z = 45
        //
        // Sem mirror.
        // Sem cavidade.
        // =================================================================

        translate([
            0,
            -0.01,
            NFC_Z
        ])

            rotate([
                90,
                0,
                0
            ])

                nfc_externo();
    }
}


// -------------------------------------------------------------------------
// PARTE NEGATIVA
// -------------------------------------------------------------------------

rotate([
    INCLINACAO,
    0,
    0
]) {


    // =====================================================================
    // A. GAVETA LATERAL DO QR
    // =====================================================================

    translate([
        QR_GAVETA_X,
        QR_GAVETA_Y,
        QR_GAVETA_Z
    ])

        cube([
            QR_GAVETA_LARGURA,
            QR_GAVETA_PROFUNDIDADE,
            QR_GAVETA_ALTURA
        ]);


    // =====================================================================
    // B. MEIA-LUA NA ENTRADA DA GAVETA
    // =====================================================================

    translate([
        QR_MEIA_LUA_X,
        QR_PAREDE_TRASEIRA_Y,
        QR_MEIA_LUA_Z
    ])

        rotate([
            -90,
            0,
            0
        ])

            cylinder(
                h = QR_PAREDE_TRASEIRA_ESPESSURA + 0.02,
                d = QR_MEIA_LUA_DIAMETRO,
                center = false
            );


    // =====================================================================
    // C. CAVIDADE TRASEIRA DA TAG NFC
    // =====================================================================
    //
    // Esta é a cavidade física para receber a tag NFC.
    //
    // Diâmetro:
    // 25mm
    //
    // Profundidade:
    // 1.8mm
    // =====================================================================

    translate([
        0,
        ESPESSURA + 0.01,
        NFC_Z
    ])

        rotate([
            90,
            0,
            0
        ])

            cylinder(
                h = NFC_CAVIDADE_PROFUNDIDADE,
                d = NFC_TAG_DIAMETRO,
                center = false
            );


    // =====================================================================
    // D. CAVIDADE FRONTAL DO GOOGLE
    // =====================================================================
    //
    // Google é uma peça separada.
    //
    // Posição:
    // X = 0
    // Z = 105
    //
    // Profundidade:
    // 0.3mm
    //
    // A cavidade entra no painel.
    // =====================================================================

    translate([
        0,
        -0.01,
        LOGO_Z
    ])

        rotate([
            -90,
            0,
            0
        ])

            logo_rebaixado();


    // =====================================================================
    // F. LOGO DA EMPRESA REBAIXADA
    // =====================================================================
    //
    // Logo pequena na parte inferior direita.
    //
    // Profundidade:
    // 0.3mm
    // =====================================================================

    translate([
        MARCA_X,
        -0.01,
        MARCA_Z
    ])

        rotate([
            -90,
            0,
            0
        ])

            marca_rebaixada();
}

}