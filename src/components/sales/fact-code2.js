// Función para validar un XML firmado mediante un servicio web SOAP del SRI
async function validar_xml(signed_xml) {
    // Ruta del archivo WSDL
    const wsdl_url = 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/RecepcionComprobantesOffline?wsdl';
    // const wsdl_url = 'https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantesOffline?wsdl';

    try {
        // Crear un cliente SOAP a partir del archivo WSDL utilizando la librería "soap"
        const soap = require('soap');
        const client = await soap.createClientAsync(wsdl_url);

        // Codificar el contenido XML en base64
        const xml_bytes = Buffer.from(signed_xml, 'utf-8');
        const xml_base64 = xml_bytes.toString('base64');

        // Llamar al método "validarComprobante" del servicio web
        const response = await client.validarComprobanteAsync({ xml: xml_base64 });

        // Procesar la respuesta del servicio web
        const comprobantes = response[0].comprobantes.comprobante;

        // Verificar si la lista de comprobantes está vacía
        if (!comprobantes) {
            // Retornar mensaje de validación exitosa
            return "Validación exitosa";
        }

        // Crear una lista para almacenar los resultados
        const resultados = [];

        // Agregar el estado y los detalles de cada comprobante a la lista de resultados
        for (const comprobante of comprobantes) {
            const clave_acceso = comprobante.claveAcceso;
            const mensajes = comprobante.mensajes;
            const detalles = [];
            for (const mensaje of mensajes) {
                const identificador = mensaje[0];
                const mensaje_texto = mensaje[1];
                detalles.push({ 'identificador': identificador, 'mensaje': mensaje_texto });
            }
            resultados.push({ 'clave_acceso': clave_acceso, 'detalles': detalles });
        }

        // Retornar la lista de resultados
        return resultados;
    } catch (error) {
        // Manejar errores, por ejemplo, mostrar un mensaje de error
        console.error("Error al validar el XML:", error.message);
        return "Error al validar el XML";
    }
}
