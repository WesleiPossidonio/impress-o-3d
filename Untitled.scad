// =========================================================================
// DISPLAY QR / NFC — CATÁLOGO DE LOGOS EXTERNOS
// ICONIFY / OPENSCAD
//
// Engenharia:
// Carcaça 4.5mm
// Pé Estável 65mm
// Batente Direito 7mm
// Relevo frontal: +0.6mm
// Cavidade NFC traseira: Ø25mm x 1.8mm
// Cartão QR retangular
// Meia-lua na entrada da gaveta
// Meia-lua atravessa somente a parede traseira
// Logo da empresa pequena e rebaixada no canto inferior direito
// =========================================================================

$fn = 120;

// =========================================================================
// CONFIGURAÇÃO
// =========================================================================

// Logo principal
ARQUIVO_LOGOTIPO = "pix.svg";

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

// Relevo
RELEVO = 0.7;

// Painel
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
QR_PAREDE_TRASEIRA_Y = QR_GAVETA_Y + QR_GAVETA_PROFUNDIDADE;

// Espessura restante atrás da gaveta
QR_PAREDE_TRASEIRA_ESPESSURA = ESPESSURA - QR_PAREDE_TRASEIRA_Y;

// =========================================================================
// LOGO PRINCIPAL
// =========================================================================

module logo_externo() {


linear_extrude(
    height = RELEVO
)

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
// NFC — SVG EXTERNO
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


// ---------------------------------------------------------------------
// PARTE POSITIVA
// ---------------------------------------------------------------------

union() {

    // ================================================================
    // PÉ DE APOIO
    // ================================================================

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


    // ================================================================
    // PAINEL INCLINADO
    // ================================================================

    rotate([
        INCLINACAO,
        0,
        0
    ]) {

        // =============================================================
        // PLACA PRINCIPAL
        // =============================================================

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


        // =============================================================
        // LOGO SUPERIOR
        // =============================================================

        translate([
            0,
            -0.01,
            LOGO_Z
        ])

            rotate([
                90,
                0,
                0
            ])

                logo_externo();


        // =============================================================
        // NFC
        // =============================================================

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


// ---------------------------------------------------------------------
// PARTE NEGATIVA
// ---------------------------------------------------------------------

rotate([
    INCLINACAO,
    0,
    0
]) {

    // ================================================================
    // A. GAVETA LATERAL DO QR
    // ================================================================

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


    // ================================================================
    // B. MEIA-LUA NA ENTRADA DA GAVETA
    // ================================================================

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


    // ================================================================
    // C. CAVIDADE TRASEIRA DA TAG NFC
    // ================================================================

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


    // ================================================================
    // D. LOGO DA EMPRESA REBAIXADA
    //
    // Logo pequena na parte inferior direita.
    //
    // Não é relevo.
    // É uma gravação de 0.3 mm para dentro da face frontal.
    // ================================================================

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

// =========================================================================
// PEÇA 2 — PLAQUINHA DO QR CODE
// =========================================================================

// Cartão totalmente retangular
// 80 x 60 x 0.8 mm
//
// Nenhum furo.
// Nenhum recorte.
// Nenhuma meia-lua.
// =========================================================================

translate([
60,
10,
0
])


cube([
    QR_LARGURA,
    QR_ESPESSURA,
    QR_ALTURA
]);

