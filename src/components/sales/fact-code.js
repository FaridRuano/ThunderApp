//Modulo 11
function p_calcular_digito_modulo11(numero) {
    var digito_calculado = -1;
    
    if (typeof(numero) == 'string' && /^\d+$/.test(numero)) {
        
        var digitos = numero.split('').map(Number); //arreglo con los dígitos del número

        digito_calculado = 11 - digitos.reduce(function(valorPrevio, valorActual, indice) {
            return valorPrevio + (valorActual * (7 - indice % 6));
        }, 0) % 11;
        
        digito_calculado = (digito_calculado == 11) ? 0 : digito_calculado; //según ficha técnica
        digito_calculado = (digito_calculado == 10) ? 1 : digito_calculado; //según ficha técnica
    }
    return digito_calculado;
}

//Tipo de comprobante (01 factura)
var p_obtener_secuencial = (function(tipo_comprobante) {
    
    function getRandomInt() {
        return Math.floor(Math.random() * (10000)) + 1;
    }
    
    tipo_comprobante = tipo_comprobante || 0;
    
    var secuencial = {
        0:1,
        1:1,
        4:1,
        5:1,
        6:1,
        7:1
    };
    return function() {
        return secuencial[tipo_comprobante]++;
        //return getRandomInt();
    }
})();

function p_obtener_codigo_autorizacion_desde_comprobante(comprobante) {
    var tipoComprobante = Object.keys(comprobante)[0];
    
    var codigoAutorizacion = p_obtener_codigo_autorizacion(
        moment(comprobante[tipoComprobante].infoFactura.fechaEmision, 'DD/MM/YYYY'), //fechaEmision
        tipoComprobante,//tipoComprobante
        comprobante[tipoComprobante].infoTributaria.ruc,//ruc
        comprobante[tipoComprobante].infoTributaria.ambiente,//ambiente
        comprobante[tipoComprobante].infoTributaria.estab,//estab
        comprobante[tipoComprobante].infoTributaria.ptoEmi,//ptoEmi
        comprobante[tipoComprobante].infoTributaria.secuencial,//secuencial
        null,//codigo
        comprobante[tipoComprobante].infoTributaria.tipoEmision//tipoEmision
        );
    
    return codigoAutorizacion;
}

function p_obtener_codigo_autorizacion(fechaEmision, tipoComprobante, ruc, ambiente, estab, ptoEmi, secuencial, codigo, tipoEmision) {
    fechaEmision = fechaEmision || new Date();
    tipoComprobante = tipoComprobante || 'factura'; //1 factura, 4 nota de crédito, 5 nota de débito, 6 guía de remisión, 7 retención
    ruc = ruc || '9999999999999';
    ambiente = ambiente || 1; // 1 pruebas, 2 produccion
    
    //serie = serie || 0;
    estab = estab || 1;
    ptoEmi = ptoEmi || 1;
    
    
    secuencial = secuencial || p_obtener_secuencial(tipoComprobante);
    codigo = codigo ||  (moment(fechaEmision).format('DDMM') + pad(secuencial, 4).slice(-3) + p_calcular_digito_modulo11(moment(fechaEmision).format('DDMM') + pad(secuencial, 3).slice(-3)));
    tipoEmision = tipoEmision ||  1; //1 emision normal
    
    var codigo_autorizacion = moment(fechaEmision).format('DDMMYYYY') 
                + pad(codDoc[tipoComprobante], 2) 
                + pad(ruc, 13) 
                + pad(ambiente, 1)
                + pad(estab, 3) + pad(ptoEmi, 3)
                + pad(secuencial, 9)
                + pad(codigo, 8)
                + pad(tipoEmision, 1);
                
    var digito_calculado = p_calcular_digito_modulo11(codigo_autorizacion);
    
    if (digito_calculado > -1) {
        return codigo_autorizacion + digito_calculado;
    }
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var codDoc = {
    'factura':1,
    'comprobanteRetencion':7,
    'guiaRemision':6,
    'notaCredito':4,
    'notaDebito':5,
};

function p_generar_factura_xml(){
    var estructuraFactura = {
        factura:{
            _id:"comprobante",
            _version:"1.0.0",
            infoTributaria:{
                ambiente:null,
                tipoEmision:null,
                razonSocial:null,
                nombreComercial:null,
                ruc:null,
                claveAcceso:null,
                codDoc:null,
                estab:null,
                ptoEmi:null,
                secuencial:null,
                dirMatriz:null,
            },
            infoFactura:{
                fechaEmision:null,
                dirEstablecimiento:null,
                contribuyenteEspecial:null,
                obligadoContabilidad:null,
                tipoIdentificacionComprador:null,
                guiaRemision:null,
                razonSocialComprador:null,
                identificacionComprador:null,
                direccionComprador:null,
                totalSinImpuestos:null,
                totalDescuento:null,
                totalConImpuestos:{
                    totalImpuesto:[
                    {
                        codigo:2,
                        codigoPorcentaje:2,
                        //descuentoAdicional:null,
                        baseImponible:null,
                        valor:null,
                    },
                    {
                        codigo:3,
                        codigoPorcentaje:3072,
                        baseImponible:null,
                        valor:null,
                    },
                    {
                        codigo:5,
                        codigoPorcentaje:5001,
                        baseImponible:null,
                        valor:null,
                    }
                    ]
                },
                propina:null,
                importeTotal:null,
                moneda:null,
            },
            detalles:{
                detalle:[
                {
                    codigoPrincipal:null, //opcional
                    codigoAuxiliar:null, //obliatorio cuando corresponda
                    descripcion:null,
                    cantidad:null,
                    precioUnitario:null,
                    descuento:null,
                    precioTotalSinImpuesto:null,
                    detallesAdicionales:{
                        detAdicional:[
                            {
                                _nombre:"",
                                _valor:""
                            }
                            //<detAdicional nombre="Marca Chevrolet" valor="Chevrolet"/>
                        ]
                    },
                        
                    impuestos:{
                        impuesto:[
                        {
                            codigo:2,
                            codigoPorcentaje:2,
                            tarifa:12,
                            baseImponible:null,
                            valor:null
                        },
                        {
                            codigo:3,
                            codigoPorcentaje:3072,
                            tarifa:5,
                            baseImponible:null,
                            valor:null
                        },
                        {
                            codigo:5,
                            codigoPorcentaje:5001,
                            tarifa:0.02,
                            baseImponible:null,
                            valor:null
                        }
                        ]
                    }
                }
                ]
            },
            infoAdicional:{
                campoAdicional:[
                {
                    _nombre:"Codigo Impuesto ISD",
                    __text:4580
                },
                {
                    _nombre:"Impuesto ISD",
                    __text:"15.42x"
                }
                    //<campoAdicional nombre="Codigo Impuesto ISD">4580</campoAdicional> //Obligatorio cuando corresponda
                    //<campoAdicional nombre="Impuesto ISD">15.42x</campoAdicional> //Obligatorio cuando corresponda
                ]
            }
        }
    };
    
    var tipoComprobante = 'factura';
    var estab = 1;
    var ptoEmi = 1;

    estructuraFactura[tipoComprobante].infoTributaria.ambiente = 1; //1 pruebas, 2 produccion
    estructuraFactura[tipoComprobante].infoTributaria.tipoEmision = 1; //1 emision normal
    estructuraFactura[tipoComprobante].infoTributaria.razonSocial = 'RUANO CAICEDO MARCO FARID';
    estructuraFactura[tipoComprobante].infoTributaria.nombreComercial = 'RUANO CAICEDO MARCO FARID';
    estructuraFactura[tipoComprobante].infoTributaria.ruc = '1805467527001';
    estructuraFactura[tipoComprobante].infoTributaria.claveAcceso = ''; //se lo llena más abajo
    estructuraFactura[tipoComprobante].infoTributaria.codDoc = pad(codDoc[tipoComprobante], 2); //tipo de comprobante
    estructuraFactura[tipoComprobante].infoTributaria.estab = pad(estab, 3);
    estructuraFactura[tipoComprobante].infoTributaria.ptoEmi = pad(ptoEmi, 3);
    estructuraFactura[tipoComprobante].infoTributaria.secuencial = pad(p_obtener_secuencial(codDoc[tipoComprobante]), 9);
    estructuraFactura[tipoComprobante].infoTributaria.dirMatriz = 'Julian Coronel s/n y Rodrigo Pachano';
    
    
    estructuraFactura[tipoComprobante].infoFactura.fechaEmision = moment().format('DD/MM/YYYY');
    estructuraFactura[tipoComprobante].infoFactura.dirEstablecimiento = 'Julian Coronel s/n y Rodrigo Pachano';
    estructuraFactura[tipoComprobante].infoFactura.contribuyenteEspecial = '5368';
    estructuraFactura[tipoComprobante].infoFactura.obligadoContabilidad = 'SI';
    estructuraFactura[tipoComprobante].infoFactura.tipoIdentificacionComprador = pad(4, 2);
    estructuraFactura[tipoComprobante].infoFactura.guiaRemision = '001-001-000000001';
    estructuraFactura[tipoComprobante].infoFactura.razonSocialComprador = 'PRUEBAS SERVICIO DE RENTAS INTERNAS';
    estructuraFactura[tipoComprobante].infoFactura.identificacionComprador = '1713328506001';
    estructuraFactura[tipoComprobante].infoFactura.direccionComprador = 'salinas y santiago';
    estructuraFactura[tipoComprobante].infoFactura.totalSinImpuestos = '2995000.00';
    estructuraFactura[tipoComprobante].infoFactura.totalDescuento = '5000.00';
        

    estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[0].baseImponible = '309750.00';
    estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[0].valor = '37170.00';

    estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[1].baseImponible = '295000.00';
    estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[1].valor = '14750.00';
    
    estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[2].baseImponible = '12000.00';
    estructuraFactura[tipoComprobante].infoFactura.totalConImpuestos.totalImpuesto[2].valor = '240.00';
    
    estructuraFactura[tipoComprobante].infoFactura.propina = '0.00';
    estructuraFactura[tipoComprobante].infoFactura.importeTotal = '3371160.00';
    estructuraFactura[tipoComprobante].infoFactura.moneda = 'DOLAR';    
    
    estructuraFactura[tipoComprobante].infoTributaria.claveAcceso = p_obtener_codigo_autorizacion_desde_comprobante(estructuraFactura);
    
    
    estructuraFactura[tipoComprobante].detalles.detalle[0].codigoPrincipal = '125BJC-01';
    estructuraFactura[tipoComprobante].detalles.detalle[0].codigoAuxiliar = '1234D56789-A';
    estructuraFactura[tipoComprobante].detalles.detalle[0].descripcion = 'CAMIONETA 4X4 DIESEL 3.7';
    estructuraFactura[tipoComprobante].detalles.detalle[0].cantidad = '10.00';
    estructuraFactura[tipoComprobante].detalles.detalle[0].precioUnitario = '300000.00';
    estructuraFactura[tipoComprobante].detalles.detalle[0].descuento = '5000.00';
    estructuraFactura[tipoComprobante].detalles.detalle[0].precioTotalSinImpuesto = '295000.00';
    
    estructuraFactura[tipoComprobante].detalles.detalle[0].detallesAdicionales.detAdicional[0]._nombre = 'Marca Chevrolet';
    estructuraFactura[tipoComprobante].detalles.detalle[0].detallesAdicionales.detAdicional[0]._valor = 'Chevrolet';
    
   
    estructuraFactura[tipoComprobante].detalles.detalle[0].impuestos.impuesto[0].baseImponible = '309750.00';
    estructuraFactura[tipoComprobante].detalles.detalle[0].impuestos.impuesto[0].valor = '361170.00';
    
    estructuraFactura[tipoComprobante].detalles.detalle[0].impuestos.impuesto[1].baseImponible = '295000.00';
    estructuraFactura[tipoComprobante].detalles.detalle[0].impuestos.impuesto[1].valor = '14750.00';
    

    estructuraFactura[tipoComprobante].detalles.detalle[0].impuestos.impuesto[2].baseImponible = '12000.00';
    estructuraFactura[tipoComprobante].detalles.detalle[0].impuestos.impuesto[2].valor = '240.00';
    
    
    var x2js = new X2JS({useDoubleQuotes:true});
    
    var xmlAsStr = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmlAsStr += x2js.json2xml_str(estructuraFactura);
    
    return xmlAsStr;
}

var path = ""

saveFile_noui(p_generar_factura_xml(), 'factura-'+moment().format('YYYYMMDD-hhmm')+'.xml', p_firmar_factura);