
// =========================================================================
// DISPLAY QR / NFC — CATÁLOGO DE LOGOS EXTERNOS
// ICONIFY / OPENSCAD
//
// VERSÃO FINAL — PEÇA PRINCIPAL INTEIRA
//
// Engenharia:
// Carcaça: 4.5 mm
// Pé estável: 65 mm
// Batente direito: 7 mm
// Relevo frontal: +0.7 mm
// Cavidade NFC traseira: Ø25 mm x 1.8 mm
// Cartão QR retangular
// Meia-lua na entrada da gaveta
// Meia-lua atravessa somente a parede traseira
// Logo da empresa pequena e rebaixada no canto inferior direito
// Inclinação da placa: -10.5°
//
// IMPORTANTE:
// A placa e o pé fazem parte da MESMA PEÇA.
// Não existe encaixe, cola ou desmontagem da estrutura principal.
//
// =========================================================================


$fn = 120;


// =========================================================================
// CONFIGURAÇÃO
// =========================================================================


// =========================================================================
// LOGO PRINCIPAL
// =========================================================================

ARQUIVO_LOGOTIPO = "whatsapp.svg";

LOGO_LARGURA = 66;
LOGO_ALTURA  = 66;

LOGO_Z = 105;


// =========================================================================
// LOGO DA EMPRESA
// =========================================================================

ARQUIVO_MARCA = "tideon.svg";

MARCA_LARGURA = 6.5;
MARCA_ALTURA  = 6.5;

MARCA_PROFUNDIDADE = 0.3;

MARCA_X = 41.8;
MARCA_Z = 10;


// =========================================================================
// NFC
// =========================================================================

ARQUIVO_NFC = "nfc_raw.svg";

NFC_LARGURA = 29.4;
NFC_ALTURA  = 29.4;

NFC_Z = 45;

NFC_TAG_DIAMETRO = 25;

NFC_CAVIDADE_PROFUNDIDADE = 1.8;


// =========================================================================
// RELEVO
// =========================================================================

RELEVO = 0.7;


// =========================================================================
// PAINEL
// =========================================================================

LARGURA = 100;
ALTURA = 150;
ESPESSURA = 4.5;


// =========================================================================
// INCLINAÇÃO
// =========================================================================

INCLINACAO = -10.5;


// =========================================================================
// PÉ DE APOIO
// =========================================================================

PE_LARGURA = 100;
PE_PROFUNDIDADE = 65;
PE_ESPESSURA = 4.6;


// =========================================================================
// BATENTE DIREITO
// =========================================================================
//
// A gaveta termina em X = +43.
//
// A placa termina em X = +50.
//
// Portanto:
//
// 50 - 43 = 7 mm
//
// =========================================================================

BATENTE_DIREITO = 7;


// =========================================================================
// CARTÃO QR
// =========================================================================

QR_LARGURA = 80;
QR_ALTURA = 60;
QR_ESPESSURA = 0.8;


// =========================================================================
// GAVETA DO QR
// =========================================================================

// Posição inicial da gaveta
QR_GAVETA_X = -51;

QR_GAVETA_Y = 1.65;
QR_GAVETA_Z = 15;


// A largura é calculada para preservar
// exatamente o batente direito de 7 mm.

QR_GAVETA_LARGURA =
    LARGURA - BATENTE_DIREITO - 1;


// Altura interna da gaveta
QR_GAVETA_ALTURA = 61;


// 0.8 mm do cartão
// + 0.5 mm de folga

QR_GAVETA_PROFUNDIDADE = 1.3;


// =========================================================================
// MEIA-LUA — PEGA-DEDO NA ENTRADA
// =========================================================================

QR_MEIA_LUA_DIAMETRO = 14;


// Centro vertical da gaveta
QR_MEIA_LUA_Z = 45.5;


// Entrada da gaveta no lado esquerdo
QR_MEIA_LUA_X = -50;


// =========================================================================
// PAREDE TRASEIRA DA GAVETA
// =========================================================================

// A gaveta começa em Y = 1.65
// e possui profundidade de 1.3 mm.
//
// Portanto:
//
// 1.65 + 1.3 = 2.95 mm
//
// A placa possui 4.5 mm.
//
// Restam:
//
// 4.5 - 2.95 = 1.55 mm
//
// Essa é a parede traseira da gaveta.
//
// =========================================================================

QR_PAREDE_TRASEIRA_Y =
    QR_GAVETA_Y +
    QR_GAVETA_PROFUNDIDADE;


QR_PAREDE_TRASEIRA_ESPESSURA =
    ESPESSURA -
    QR_PAREDE_TRASEIRA_Y;


// =========================================================================
// SOBREPOSIÇÃO DE SEGURANÇA
// =========================================================================
//
// Utilizada somente nos relevos frontais.
//
// Evita que a logo fique apenas "encostada"
// na superfície da placa.
//
// =========================================================================

SOBREPOSICAO_RELEVO = 0.05;


// =========================================================================
// LOGO PRINCIPAL — RELEVO
// =========================================================================

module logo_externo()
{

    linear_extrude(
        height =
            RELEVO +
            SOBREPOSICAO_RELEVO
    )

        resize(
            [
                LOGO_LARGURA,
                LOGO_ALTURA
            ],
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
//
// A ferramenta de corte começa ligeiramente antes
// da superfície frontal.
//
// A profundidade real dentro da placa continua sendo
// MARCA_PROFUNDIDADE.
//
// =========================================================================

module marca_rebaixada()
{

    linear_extrude(
        height =
            MARCA_PROFUNDIDADE +
            0.02
    )

        resize(
            [
                MARCA_LARGURA,
                MARCA_ALTURA
            ],
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

module nfc_externo()
{

    linear_extrude(
        height =
            RELEVO +
            SOBREPOSICAO_RELEVO
    )

        resize(
            [
                NFC_LARGURA,
                NFC_ALTURA
            ],
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
//
// A estrutura principal inteira é formada por:
//
// 1. Pé de apoio
// 2. Painel inclinado
// 3. Logo frontal
// 4. NFC frontal
//
// Depois são subtraídos:
//
// 1. Gaveta QR
// 2. Meia-lua
// 3. Cavidade NFC traseira
// 4. Marca rebaixada
//
// =========================================================================

difference()
{

    // =====================================================================
    // PARTE POSITIVA
    // =====================================================================

    union()
    {

        // ================================================================
        // PÉ DE APOIO
        // ================================================================
        //
        // Continua integrado à placa.
        //
        // Não é uma peça separada.
        //
        // ================================================================

        translate(
            [
                -PE_LARGURA / 2,
                0,
                0
            ]
        )

            cube(
                [
                    PE_LARGURA,
                    PE_PROFUNDIDADE,
                    PE_ESPESSURA
                ]
            );


        // ================================================================
        // PAINEL INCLINADO
        // ================================================================

        rotate(
            [
                INCLINACAO,
                0,
                0
            ]
        )
        {

            // ============================================================
            // PLACA PRINCIPAL
            // ============================================================

            translate(
                [
                    -LARGURA / 2,
                    0,
                    0
                ]
            )

                cube(
                    [
                        LARGURA,
                        ESPESSURA,
                        ALTURA
                    ]
                );


            // ============================================================
            // LOGO PRINCIPAL
            // ============================================================

            translate(
                [
                    0,
                    -0.01,
                    LOGO_Z
                ]
            )

                rotate(
                    [
                        90,
                        0,
                        0
                    ]
                )

                    logo_externo();


            // ============================================================
            // NFC FRONTAL
            // ============================================================

            translate(
                [
                    0,
                    -0.01,
                    NFC_Z
                ]
            )

                rotate(
                    [
                        90,
                        0,
                        0
                    ]
                )

                    nfc_externo();
        }
    }


    // =====================================================================
    // PARTE NEGATIVA
    // =====================================================================

    rotate(
        [
            INCLINACAO,
            0,
            0
        ]
    )
    {

        // =================================================================
        // A. GAVETA LATERAL DO QR
        // =================================================================
        //
        // O cartão continua completamente retangular.
        //
        // A cavidade fica dentro da espessura da placa.
        //
        // =================================================================

        translate(
            [
                QR_GAVETA_X,
                QR_GAVETA_Y,
                QR_GAVETA_Z
            ]
        )

            cube(
                [
                    QR_GAVETA_LARGURA,
                    QR_GAVETA_PROFUNDIDADE,
                    QR_GAVETA_ALTURA
                ]
            );


        // =================================================================
        // B. MEIA-LUA NA ENTRADA DA GAVETA
        // =================================================================
        //
        // A meia-lua fica no extremo esquerdo.
        //
        // Como o centro está exatamente na borda da placa,
        // somente metade do cilindro entra na placa.
        //
        // Resultado:
        //
        // uma meia-lua aberta para o exterior.
        //
        // Ela atravessa SOMENTE a parede traseira da gaveta.
        //
        // =================================================================

        translate(
            [
                QR_MEIA_LUA_X,
                QR_PAREDE_TRASEIRA_Y,
                QR_MEIA_LUA_Z
            ]
        )

            rotate(
                [
                    -90,
                    0,
                    0
                ]
            )

                cylinder(
                    h =
                        QR_PAREDE_TRASEIRA_ESPESSURA
                        + 0.02,

                    d =
                        QR_MEIA_LUA_DIAMETRO,

                    center = false
                );


        // =================================================================
        // C. CAVIDADE TRASEIRA DA TAG NFC
        // =================================================================
        //
        // Ø25 mm
        // Profundidade: 1.8 mm
        //
        // A parede restante possui:
        //
        // 4.5 - 1.8 = 2.7 mm
        //
        // =================================================================

        translate(
            [
                0,
                ESPESSURA + 0.01,
                NFC_Z
            ]
        )

            rotate(
                [
                    90,
                    0,
                    0
                ]
            )

                cylinder(
                    h =
                        NFC_CAVIDADE_PROFUNDIDADE,

                    d =
                        NFC_TAG_DIAMETRO,

                    center = false
                );


        // =================================================================
        // D. LOGO DA EMPRESA — REBAIXO
        // =================================================================
        //
        // O corte entra na face frontal da placa.
        //
        // Profundidade:
        // 0.3 mm
        //
        // =================================================================

        translate(
            [
                MARCA_X,
                -0.01,
                MARCA_Z
            ]
        )

            rotate(
                [
                    -90,
                    0,
                    0
                ]
            )

                marca_rebaixada();
    }
}


// =========================================================================
// PEÇA 2 — CARTÃO / PLAQUINHA DO QR CODE
// =========================================================================
//
// Esta é a ÚNICA peça separada do produto.
//
// Dimensões:
//
// 80 x 60 x 0.8 mm
//
// O cartão permanece completamente retangular.
//
// Ele acompanha a mesma inclinação da gaveta.
//
// =========================================================================

translate(
    [
        60,
        10,
        0
    ]
)

    rotate(
        [
            INCLINACAO,
            0,
            0
        ]
    )

        cube(
            [
                QR_LARGURA,
                QR_ESPESSURA,
                QR_ALTURA
            ]
        );

