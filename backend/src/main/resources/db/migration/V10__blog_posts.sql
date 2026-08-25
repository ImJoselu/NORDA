CREATE TABLE blog_posts (
    id UUID PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(20) NOT NULL,
    author VARCHAR(120) NOT NULL,
    published_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_blog_posts_category ON blog_posts (category);

INSERT INTO blog_posts (id, slug, title, excerpt, content, category, author, published_at)
VALUES
    (gen_random_uuid(), 'como-elegir-la-molienda-segun-tu-metodo-de-preparacion', 'Cómo elegir la molienda según tu método de preparación', 'La molienda determina buena parte del resultado en taza. Te explicamos cómo ajustar el tamaño de partícula para espresso, V60, prensa francesa, moka y AeroPress.', '## La molienda no es un detalle: es media receta

Cuando alguien nos pregunta por qué su café sabe amargo, ácido o simplemente plano, la respuesta casi nunca está en el origen del grano ni en la marca de la cafetera. Está en la molienda. El tamaño de partícula regula la velocidad a la que el agua extrae los compuestos solubles del café —ácidos, azúcares, compuestos amargos— y por tanto decide si una receta queda equilibrada o se desvía hacia la sobreextracción o la subextracción.

La regla básica es simple: cuanto más fino es el molido, mayor es la superficie de contacto entre el agua y el café, y más rápido se extrae. Cuanto más grueso, más lento. El problema es que cada método de preparación trabaja con un tiempo de contacto distinto, así que necesita un tamaño de partícula distinto para llegar al mismo punto de equilibrio.

## Por qué el tiempo de contacto y el tamaño de partícula van de la mano

Un espresso fuerza entre 9 y 10 bares de presión a través de la pastilla de café en apenas 25-30 segundos. Con ese tiempo tan corto, si la molienda fuera gruesa el agua pasaría casi sin extraer nada: café aguado y ácido. Por eso el espresso necesita una molienda muy fina, similar a la sal fina de mesa.

En el extremo opuesto, una prensa francesa deja el café en contacto con el agua durante 4 minutos completos, sin ningún filtro de papel que retenga los finos. Si la molienda fuera fina como la de espresso, el resultado sería una sobreextracción amarga y turbia, además de un poso arenoso en el fondo de la taza. Por eso pide una molienda gruesa, similar a las migas de pan.

Entre ambos extremos se mueven los métodos de filtro, que buscan un punto intermedio de extracción a lo largo de varios minutos.

## Guía de molienda por método

Espresso: molienda fina, textura similar a la sal de mesa fina. Con 18-20 g de café molido se busca un tiempo de extracción de 25-30 segundos para obtener 36-40 g de bebida, un ratio 1:2 aproximado.

V60 y otros filtros de goteo (Kalita, Chemex): molienda media-fina, textura similar a la sal marina gruesa o el azúcar granulado. El agua atraviesa el lecho de café en 2:30 a 3:30 minutos.

Prensa francesa: molienda gruesa, como migas de pan grandes. Infusión de 4 minutos antes de presionar el émbolo.

Moka (cafetera italiana): molienda media-fina, ligeramente más gruesa que el espresso pero más fina que un filtro, para evitar que el vapor a presión atraviese el café demasiado rápido y queme el resultado.

AeroPress: molienda media-fina, flexible según la receta —más fina para extracciones cortas tipo espresso, más gruesa para recetas de inmersión más largas.

## Los errores más frecuentes

El primero es usar el mismo molido para todo. Cada método necesita el suyo, y ajustar el molinillo lleva quince segundos.

El segundo es fiarse de un molinillo de cuchillas en lugar de uno de muelas (burr grinder). Las cuchillas trocean el grano de forma irregular, generando una mezcla de partículas muy finas y muy gruesas, lo que en catación llamamos una distribución de partícula amplia. Esa heterogeneidad hace que unas partículas se sobreextraigan mientras otras quedan subextraídas al mismo tiempo, produciendo un café simultáneamente amargo y ácido. Un molinillo de muelas cónicas o planas genera partículas mucho más homogéneas.

El tercero es no reajustar la molienda cuando cambia el café. Un tueste más claro y denso suele necesitar una molienda ligeramente más fina que uno oscuro y poroso, porque la estructura celular del grano varía con el desarrollo del tueste.

## En la práctica

Empieza siempre por la recomendación de tu método, prepara una taza y prueba. Si el café sabe ácido, punzante o hueco, muele más fino la próxima vez. Si sabe amargo, áspero o astringente, muele más grueso. Ajustar en pasos pequeños —medio punto en la escala del molinillo— y volver a probar es el hábito que separa una buena taza de una taza excelente.', 'GUIDES', 'Marcos Iribarren', now() - interval '48 days'),
    (gen_random_uuid(), 'v60-paso-a-paso-la-guia-definitiva-para-tu-primera-taza-de-especialidad', 'V60 paso a paso: la guía definitiva para tu primera taza de especialidad', 'Ratio 1:16, agua a 92-94°C, bloom de 30-45 segundos y un tiempo total de 2:30 a 3:00 minutos: la técnica completa para dominar el V60 desde la primera taza.', '## Qué necesitas antes de empezar

El V60 es un filtro cónico de goteo diseñado por Hario, con estrías en espiral que permiten que el agua fluya libremente y una única abertura grande en la base. Para preparar uno bien necesitas: un V60 (cerámica o plástico, da igual), un filtro de papel específico para V60, una jarra o servidor, una báscula con temporizador, un hervidor —idealmente de cuello de cisne, para controlar el vertido— y café recién molido.

Antes de nada, aclara el filtro de papel con agua caliente directamente en el V60 colocado sobre la jarra. Esto elimina el sabor a papel y precalienta tanto el filtro como el recipiente. Descarta esa agua antes de añadir el café.

## La proporción: 1:16 como punto de partida

La relación café-agua de referencia para V60 es 1:16, es decir, 20 gramos de café molido por cada 320 gramos de agua. Es un punto de partida sólido: si te queda plano o débil, puedes bajar hacia 1:15; si te queda intenso o astringente, puedes subir hacia 1:17. Pesa siempre el café y el agua, nunca uses volumen: una cucharada de café no pesa lo mismo según la densidad del tueste.

La molienda debe ser media-fina, con una textura comparable a la sal marina gruesa o el azúcar granulado. La temperatura del agua debe estar entre 92°C y 94°C: por debajo de 90°C la extracción se ralentiza y el café puede quedar subextraído y ácido; por encima de 96°C se corre el riesgo de extraer compuestos amargos en exceso.

## Paso 1: el bloom

Vierte agua caliente sobre el café —el doble o el triple de su peso, es decir, entre 40 y 60 gramos para 20 gramos de café— y deja que repose entre 30 y 45 segundos antes de continuar. Este paso se llama bloom o floración, y su función es dejar escapar el CO2 que el grano retiene desde el tueste. Si el café es fresco, de entre 5 y 20 días desde el tueste, verás que la cama de café se hincha y burbujea visiblemente; si apenas reacciona, probablemente el café ya no está en su punto óptimo de frescura.

## Paso 2: los vertidos

Después del bloom, vierte el agua restante en 2 o 3 tandas, en movimientos circulares desde el centro hacia fuera sin tocar las paredes del filtro, y vuelve al centro. El objetivo es mantener el lecho de café uniformemente saturado y evitar canales secos por donde el agua pase sin extraer. Cada vertido debe hacerse con un chorro constante, ni demasiado fino ni demasiado brusco, para no remover en exceso los finos del fondo.

## Paso 3: tiempo total y ajustes

El tiempo total de preparación, desde que empieza el bloom hasta que el agua termina de drenar, debería situarse entre 2:30 y 3:00 minutos para esta proporción. Si el café drena mucho más rápido, la molienda estaba demasiado gruesa y probablemente el café sabrá aguado y ácido; muele más fino la próxima vez. Si tarda mucho más de 3:30, la molienda estaba demasiado fina, y el resultado tenderá a ser amargo y astringente; muele más grueso.

## Errores comunes

Verter toda el agua de golpe sin respetar el bloom es el error más habitual: satura el filtro, genera canales y produce una extracción desigual. El segundo error es usar agua hirviendo directamente de la tetera sin dejarla reposar unos segundos: por encima de 96°C se queman los compuestos más delicados del café. El tercero es mover el V60 o interrumpir el vertido de forma brusca, lo que remueve el lecho de café y libera finos que taponan el filtro y ralentizan el drenaje de forma impredecible.

Con estas variables controladas —proporción, molienda, temperatura y tiempo— tienes una base repetible. A partir de ahí, cada café de origen único se comporta de forma distinta, y ese margen de ajuste es, precisamente, la parte más interesante de preparar café de especialidad en casa.', 'GUIDES', 'Marcos Iribarren', now() - interval '42 days'),
    (gen_random_uuid(), 'por-que-etiopia-es-la-cuna-genetica-del-cafe-arabica', 'Por qué Etiopía es la cuna genética del café arábica', 'Etiopía no es un origen más: es el lugar donde nació genéticamente el café arábica, cuna de miles de variedades heirloom y de la ceremonia tradicional del buna.', '## El bosque que vio nacer una especie

Coffea arabica es, genéticamente, un caso singular entre las plantas cultivadas: es una especie alotetraploide surgida de la hibridación natural entre Coffea canephora (robusta) y Coffea eugenioides, un cruce que ocurrió de forma espontánea en las tierras altas del suroeste de Etiopía, en la región histórica de Kaffa, de donde, según la etimología más aceptada, proviene la propia palabra café. Ningún otro lugar del planeta alberga poblaciones silvestres de arábica comparables a las que todavía crecen bajo el dosel de los bosques de Kaffa, Sheka y la zona de Bench Maji, en el suroeste etíope.

Esto no es un dato anecdótico para el sector: es la razón por la que, cuando una nueva plaga o una nueva variante de roya del café amenaza las plantaciones del mundo, los programas de mejora genética siguen recurriendo a estos bosques. La diversidad genética de la arábica cultivada en el resto del planeta —Centroamérica, Brasil, Colombia, Indonesia— es comparativamente estrecha, porque deriva de un puñado de plantas que salieron de Etiopía y Yemen hace siglos. El bosque etíope, en cambio, conserva miles de variantes silvestres que nunca han pasado por ese cuello de botella.

## Variedades heirloom: por qué Etiopía no habla el mismo idioma varietal que el resto del mundo

En Colombia se cultiva Castillo o Caturra. En Centroamérica, Bourbon, Typica o Catuaí. En Etiopía, la etiqueta que aparece en la mayoría de los cafés de exportación es simplemente heirloom, herencia, y no es una evasiva comercial: es la constatación de que en muchas zonas del país los agricultores cultivan mezclas de miles de landraces locales, muchas de ellas sin nombre catalogado, seleccionadas durante generaciones por adaptación al terreno más que por un programa de mejora genética formal. Se calcula que existen varios miles de estas variantes distintas repartidas entre las regiones cafeteras del país, lo que convierte a cualquier lote etíope en una mezcla genética mucho más compleja que la de un lote de un solo cultivar en otro origen.

## La ceremonia del café: buna como ritual social

En Etiopía el café no es solo un cultivo de exportación, es un ritual doméstico diario llamado buna. La persona anfitriona tuesta los granos verdes en una sartén plana sobre brasas, los muele a mano y prepara el café en una jebena, una jarra de barro de cuello estrecho, sirviéndolo en tres rondas sucesivas —abol, tona y baraka— consideradas cada vez menos intensas mientras se rehace la infusión con más agua. La ceremonia puede durar más de una hora y es un espacio social central en la vida comunitaria, especialmente entre las mujeres etíopes, que tradicionalmente la dirigen.

## Lavado frente a natural: dos perfiles, un mismo origen

Etiopía es también el lugar donde se aprecia con más claridad cómo el procesado transforma la taza a partir del mismo material genético. En zonas como Yirgacheffe y Gedeo predomina el procesado lavado: la pulpa se retira mecánicamente y el grano fermenta entre 24 y 48 horas antes de lavarse y secarse sobre camas africanas elevadas. El resultado son tazas luminosas, de acidez cítrica y floral marcada —jazmín, bergamota, té negro—, con cuerpo ligero y una limpieza en boca muy característica.

En Sidamo, Guji y Harrar, en cambio, es habitual el procesado natural: la cereza entera se seca al sol durante 15 a 30 días sin despulpar, dejando que los azúcares de la fruta migren hacia el grano a través del pergamino. La taza resultante es mucho más afrutada y de cuerpo denso, con notas de fresa, arándano o incluso vino, y una dulzura que recuerda a fruta macerada.

## Un origen que sigue siendo referencia

Ningún otro país cafetero combina diversidad genética silvestre, miles de variedades heirloom en cultivo activo y una tradición de consumo tan arraigada. Por eso, cuando en NØRDA hablamos de Etiopía, no hablamos solo de un origen más en el mapa: hablamos del punto de partida de todo lo demás.', 'ORIGINS', 'Elena Ferraz', now() - interval '36 days'),
    (gen_random_uuid(), 'geisha-panamena-anatomia-de-la-variedad-que-rompio-las-subastas', 'Geisha panameña: anatomía de la variedad que rompió las subastas', 'En 2004, un lote de Geisha de Hacienda La Esmeralda rompió récords de subasta. Repasamos su origen etíope, el terroir volcánico de Boquete y su escalada de precio.', '## Una variedad etíope que tardó cincuenta años en ser descubierta

La variedad Geisha, también escrita Gesha, no nació en Panamá. Sus semillas originales proceden de los bosques de Gori Gesha, cerca de la localidad que le da nombre, en el suroeste de Etiopía. De allí viajó a Kenia y Tanzania en los años treinta, y en 1953 llegó al centro de investigación CATIE, en Costa Rica, catalogada bajo el código T2722. Desde Costa Rica se distribuyó a varios países de Centroamérica, entre ellos Panamá, donde en los años sesenta se plantó en varias fincas de la región de Boquete —entre ellas Hacienda La Esmeralda— sobre todo por su resistencia a la roya del café, no por su calidad en taza. Durante décadas nadie le prestó especial atención: era una variedad más, de producción baja y poco atractiva para los estándares agronómicos de la época.

## 2004: el año que cambió la historia de la variedad

Todo cambió en 2004, cuando la familia Peterson, propietaria de Hacienda La Esmeralda, presentó por primera vez un lote separado de Geisha al concurso Best of Panama. El jurado, catadores internacionales, quedó desconcertado por un perfil que no se parecía a nada del resto de la mesa: una taza intensamente floral, con notas de jazmín y bergamota, dulzor a fruta tropical y un cuerpo sedoso de té, muy alejado del perfil más corriente de otras variedades cultivadas en la misma finca. El lote ganó el concurso y se subastó a 21 dólares por libra verde, un precio que en aquel momento multiplicaba varias veces el récord anterior para café panameño y disparó el interés internacional por la variedad de la noche a la mañana.

## Por qué Boquete y no cualquier otro lugar

Que la Geisha alcanzara ese perfil en Boquete no es casualidad geográfica. La región se asienta en las faldas del volcán Barú, a altitudes que en las mejores parcelas superan los 1.500 y llegan a los 1.900 metros sobre el nivel del mar. Esa combinación de altitud elevada y suelos volcánicos —ricos en minerales, buen drenaje, alta retención de nutrientes— ralentiza la maduración de la cereza. Una maduración lenta permite que se acumulen más precursores aromáticos y azúcares en el grano antes de la cosecha, lo que en variedades ya predispuestas genéticamente a perfiles florales y afrutados, como la Geisha, se traduce en una intensidad aromática mucho mayor que la que la misma variedad produce en tierras bajas. En otras palabras: la Geisha necesita ese terroir específico para expresar su potencial genético; plantada en altitudes bajas o suelos distintos, su perfil se aplana notablemente.

## La escalada de precios en subasta

Desde 2004, el precio de la Geisha panameña en las subastas Best of Panama no ha dejado de subir, con años puntuales de correcciones. A finales de la década de 2000 los mejores lotes ya superaban los 100 dólares por libra; en la década de 2010 se rompió sistemáticamente la barrera de los 300 y los 500 dólares; y a partir de 2019, lotes de fincas como Elida Estate llegaron a superar los 800 dólares por libra verde en categorías de proceso natural, con récords posteriores que han seguido escalando en años sucesivos. Estos precios no son representativos del café que se vende al público general —corresponden a microlotes extremos vendidos a tostadores y coleccionistas en subastas competitivas— pero han consolidado a la Geisha panameña como la referencia de precio más alta y constante del café de especialidad mundial.

## Qué esperar en la taza

Una Geisha panameña bien procesada, lavada, suele mostrar una acidez cítrica brillante tipo bergamota, notas florales de jazmín, dulzor de mango o papaya, y un cuerpo ligero pero sedoso, con un final largo y limpio. Las versiones naturales intensifican el componente afrutado, aproximándolo a nota de fruta de la pasión o frutos rojos maduros, con más cuerpo y una dulzura casi de mermelada.

Sigue siendo, más de veinte años después de aquella subasta de 2004, la prueba más citada del sector de que la variedad, el terroir y el procesado pueden combinarse para producir algo genuinamente distinto en la taza.', 'ORIGINS', 'Elena Ferraz', now() - interval '30 days'),
    (gen_random_uuid(), 'lavado-natural-honey-como-el-proceso-cambia-la-taza', 'Lavado, natural, honey: cómo el proceso cambia la taza', 'Lavado, natural y honey no son etiquetas de marketing: cada uno define cuánto mucílago se retiene en el grano, y eso cambia radicalmente el perfil de la taza final.', '## El proceso es la otra mitad del origen

Dos cerezas de la misma planta, cosechadas el mismo día, pueden producir tazas radicalmente distintas según cómo se sequen. El procesado poscosecha —lo que ocurre entre la recolección y el grano verde listo para tostar— no es un paso logístico secundario: es una de las variables que más define el perfil sensorial final, junto con la variedad y la altitud.

Para entenderlo hay que partir de la estructura de la cereza de café. Bajo la piel exterior (exocarpo) hay una capa de pulpa (mesocarpo), después una capa mucilaginosa rica en azúcares y pectinas, luego el pergamino (endocarpo), y finalmente el grano en sí, cubierto por una fina película plateada. Los tres métodos principales —lavado, natural y honey— se diferencian, esencialmente, en qué se hace con esa capa de mucílago antes del secado.

## Lavado: transparencia y limpieza

En el proceso lavado, la cereza se despulpa mecánicamente el mismo día de la cosecha, retirando la piel y la mayor parte de la pulpa. El grano, todavía cubierto de mucílago, se sumerge en tanques de fermentación entre 12 y 48 horas, dependiendo del clima y la altitud, donde enzimas naturales y microorganismos descomponen las pectinas del mucílago. Después se lava con agua abundante para eliminar los residuos y se seca —al sol sobre camas elevadas o patios, o mecánicamente— hasta alcanzar entre un 10% y un 12% de humedad.

Al eliminarse casi toda la materia orgánica externa antes del secado, el grano absorbe muy poco sabor de la fruta. El resultado es una taza más limpia, de acidez más definida y brillante, donde se aprecian con claridad las características del terroir y la variedad: es el método que menos interfiere con el origen.

## Natural: la fruta entera

En el proceso natural, la cereza se seca completa, sin despulpar, extendida sobre camas africanas o patios de cemento durante 15 a 30 días, con rastrillado frecuente para evitar fermentaciones no deseadas y moho. Durante ese tiempo, los azúcares y compuestos de la pulpa se difunden lentamente a través del pergamino hacia el grano.

El resultado es una taza de cuerpo mucho más denso, dulzor pronunciado y notas que recuerdan a fruta macerada, fresa, mora o incluso vino y fermentación láctica cuando el proceso se controla con especial cuidado. Es también el método con mayor margen de error: una mala gestión de la humedad o del rastrillado puede producir defectos de sobrefermentación fácilmente detectables en taza, como notas a vinagre o a podrido.

## Honey: el punto intermedio, y sus cuatro grados

El proceso honey nace en Costa Rica como una vía intermedia: se despulpa la cereza como en el lavado, pero se deja una parte variable del mucílago adherido al pergamino durante el secado, en lugar de fermentarlo y lavarlo por completo. El nombre no tiene relación con la miel como ingrediente, sino con la textura pegajosa y el aspecto ambarino que adquiere el grano mientras seca.

La clasificación por color indica, aproximadamente, cuánto mucílago se ha retenido. Honey blanco: entre el 10% y el 20% del mucílago, con un secado rápido y mucha exposición al sol; es el más parecido a un lavado, con acidez limpia y cuerpo ligero. Honey amarillo: entre el 20% y el 50% del mucílago, secado moderado con exposición solar directa; aporta más dulzor y cuerpo que el blanco, manteniendo buena claridad. Honey rojo: entre el 50% y el 90% del mucílago, con menos volteos y más tiempo de secado, a menudo con sombra parcial; la taza gana cuerpo, dulzor y notas de fruta madura, acercándose al perfil de un natural sin perder del todo la definición del lavado. Honey negro: el mucílago se retiene casi en su totalidad, entre el 90% y el 100%, con un secado lento, frecuentemente bajo sombra, que puede extenderse más de tres semanas; es el más cercano al natural en cuerpo y dulzor, con notas intensas de fruta y una fermentación más marcada.

## Elegir con el proceso en mente

No hay un método mejor en abstracto: hay un método más adecuado según lo que se busca en taza. Si quieres apreciar con precisión el terroir de un origen concreto, un lavado es la vía más directa. Si buscas intensidad frutal y cuerpo, un natural o un honey rojo o negro te lo van a dar. Entender esta diferencia es, probablemente, la herramienta más útil para leer una bolsa de café de especialidad antes incluso de abrirla.', 'METHODS', 'Marcos Iribarren', now() - interval '24 days'),
    (gen_random_uuid(), 'el-papel-de-las-cooperativas-en-el-cafe-de-especialidad-de-ruanda', 'El papel de las cooperativas en el café de especialidad de Ruanda', 'Con fincas de apenas 200-300 cafetos, Ruanda reconstruyó su sector cafetero tras 1994 gracias al modelo de estaciones de lavado gestionadas por cooperativas.', '## Reconstruir un sector desde cero

En 1994, el genocidio contra la población tutsi dejó a Ruanda con cerca de un millón de personas asesinadas y una economía rural devastada, incluido su sector cafetero, que ya venía debilitado desde el colapso del Acuerdo Internacional del Café en 1989. Miles de fincas quedaron abandonadas o mal atendidas, y buena parte del café que se seguía produciendo se procesaba de forma semilavada a nivel doméstico, con una calidad irregular que apenas alcanzaba precios de commodity en el mercado internacional.

La reconstrucción del sector, a partir de finales de los años noventa, se apoyó en un cambio de modelo muy concreto: pasar de un procesado disperso, hecho en cada hogar con medios rudimentarios, a un procesado centralizado en estaciones de lavado (washing stations) capaces de garantizar consistencia y trazabilidad. El proyecto PEARL, financiado por USAID entre 2000 y 2002 y continuado después por el programa SPREAD, fue determinante para introducir y financiar ese modelo, junto con inversión del propio gobierno ruandés, que identificó el café de especialidad como una vía de diversificación económica prioritaria.

## El modelo de estación de lavado

Una estación de lavado ruandesa recibe cereza fresca de decenas o cientos de pequeños productores del entorno, normalmente en un radio de pocos kilómetros para minimizar el tiempo entre cosecha y despulpado. Allí se aplican controles que un agricultor individual difícilmente podría costear por sí solo: tanques de flotación para descartar cerezas defectuosas o poco maduras —las que flotan se retiran, ya que indican menor densidad y problemas de desarrollo—, despulpado mecánico uniforme, fermentación controlada por tiempo y temperatura, y camas de secado elevadas con rotación de personal para voltear el café de forma constante.

Esta centralización es la que ha permitido a Ruanda competir en el segmento de especialidad: la calidad ya no depende únicamente de la habilidad de un productor concreto secando café en su patio, sino de un proceso técnico gestionado por personal capacitado en la estación, con control de calidad y laboratorios de catación que retroalimentan a los agricultores sobre qué cerezas producen mejor puntuación.

## Por qué el modelo cooperativo encaja tan bien en Ruanda

Ruanda es el país más densamente poblado de África continental, y sus fincas cafeteras reflejan esa presión sobre la tierra: la explotación media apenas ronda los 200-300 cafetos, muchas veces menos de una hectárea, intercalados con cultivos de subsistencia. Ningún productor individual de ese tamaño puede, por sí solo, financiar una estación de lavado, un laboratorio de catación o acceso directo a compradores internacionales.

Las cooperativas resuelven exactamente ese cuello de botella: agregan el volumen de cientos de fincas minúsculas hasta alcanzar una escala que sí justifica la inversión en infraestructura de procesado y control de calidad, y actúan como interlocutor colectivo frente a exportadores y tostadores. El modelo también permite repartir primas de calidad de vuelta a los socios en función de la puntuación obtenida por su cereza, un incentivo directo para mejorar las prácticas de cultivo y selección en la propia finca.

## Bourbon Rojo, la base varietal del país

Genéticamente, el café ruandés se apoya de forma casi monolítica en la variedad Bourbon Rojo, introducida durante el periodo colonial belga y predominante en la práctica totalidad de las fincas del país. Esa relativa uniformidad varietal, combinada con las altitudes altas de la región de las Mil Colinas —entre 1.500 y 2.000 metros en muchas zonas productoras junto al lago Kivu— y el trabajo de las estaciones de lavado, produce tazas de acidez cítrica limpia, cuerpo medio y notas dulces de frutos rojos que se han convertido en la firma reconocible del café ruandés.

## Un caso de estudio para el continente

Desde que Ruanda organizó su primera edición del certamen Cup of Excellence en 2008, la primera vez que este programa de referencia mundial se celebraba en África, el país se ha consolidado como una prueba de que la agregación cooperativa, bien gestionada, puede convertir miles de microexplotaciones fragmentadas en una oferta de café de especialidad competitiva y trazable. Es un modelo que hoy se estudia y se replica, con matices, en otros países de la región de los Grandes Lagos africanos.', 'PRODUCERS', 'Elena Ferraz', now() - interval '18 days'),
    (gen_random_uuid(), 'cold-brew-casero-proporciones-tiempo-y-filtrado', 'Cold brew casero: proporciones, tiempo y filtrado', 'Ratio 1:8 para concentrado o 1:15 listo para beber, molienda gruesa y 12-18 horas de reposo: la técnica real detrás de un cold brew casero bien equilibrado.', '## Cold brew no es café frío, es otra extracción

Conviene aclarar esto desde el principio: el cold brew no es un espresso o un filtro que se ha dejado enfriar, ni tampoco lo mismo que un iced coffee preparado en caliente y servido sobre hielo. Es una infusión distinta, elaborada con agua fría o a temperatura ambiente desde el inicio, con tiempos de contacto muy largos, horas y no minutos. Al no intervenir el calor, la extracción de compuestos amargos y de ciertos ácidos volátiles es mucho menor, lo que produce una bebida naturalmente más dulce, de acidez suave y menor amargor, con menos sensación de astringencia.

## Dos enfoques: concentrado o listo para beber

Hay dos formas habituales de plantear un cold brew casero, y conviene decidir cuál quieres antes de pesar nada.

Concentrado, ratio 1:8: se prepara con una proporción muy cargada, aproximadamente 125 gramos de café molido por cada litro de agua, pensada para diluirse después. Es la opción más práctica si vas a guardar el resultado en la nevera varios días, porque el concentrado se conserva mejor y ocupa menos espacio.

Listo para beber, ratio 1:15: se prepara con una proporción similar a la de un filtro en caliente, alrededor de 67 gramos de café por litro de agua, y se sirve directamente sobre hielo sin necesidad de diluir.

## El proceso paso a paso

La molienda debe ser gruesa, similar o incluso más gruesa que la de una prensa francesa, para evitar una sobreextracción excesiva y facilitar el filtrado posterior. Mezcla el café molido con el agua en un recipiente —puede ser tan simple como una jarra o un bote de cristal grande— asegurándote de que todo el café quede humedecido, y remueve brevemente.

Deja reposar la mezcla entre 12 y 18 horas si la preparas a temperatura ambiente, o hasta 24 horas si la guardas en la nevera, ya que el frío ralentiza la extracción y hay que compensar con más tiempo. No hace falta remover durante el reposo. Pasado ese tiempo, cuela el resultado.

## Cómo filtrar, y por qué importa

El tipo de filtro cambia notablemente el resultado final. Un filtro de papel retiene la mayoría de los finos y de los aceites del café, dando un concentrado más limpio y ligero, parecido en textura a un filtro de goteo. Un filtro de tela, tipo Toddy, o una malla metálica fina dejan pasar más aceites y micropartículas, dando un cuerpo más denso y una textura más redonda, a costa de algo más de sedimento en el fondo de la jarra.

Un método práctico es hacer un colado en dos fases: primero a través de un colador de malla o un paño para retirar la mayor parte de los posos, y después repasar con un filtro de papel de V60 o Chemex si buscas máxima limpieza.

## Dilución y conservación

Si has preparado un concentrado 1:8, dilúyelo antes de beberlo: una proporción de partida razonable es 1:1 con agua fría o con hielo, y desde ahí ajusta al gusto; algunas personas prefieren hasta 1:2 de concentrado por agua para una bebida más suave. El concentrado también funciona bien con leche o bebidas vegetales, ya que su menor acidez y amargor evitan que la leche corte el sabor como puede ocurrir con un espresso.

El concentrado se conserva en la nevera, en un recipiente cerrado, hasta 10-14 días sin pérdida notable de calidad. La versión ya diluida y lista para beber, en cambio, conviene consumirla en 2-3 días.

## Una nota sobre el café que usar

El cold brew perdona menos de lo que parece en la elección del café: al extraer de forma tan distinta al calor, cafés con acidez muy delicada o notas florales sutiles pueden quedar planos. Suele funcionar especialmente bien con procesos naturales o honey de cuerpo denso y notas de fruta madura o chocolate, que se traducen con más facilidad a una extracción fría y prolongada.', 'RECIPES', 'Lucía Beltrán', now() - interval '12 days'),
    (gen_random_uuid(), 'como-catar-cafe-en-casa-como-un-profesional-cupping', 'Cómo catar café en casa como un profesional (cupping)', 'El cupping profesional se puede reproducir en casa: fragancia en seco, ruptura de la costra a los 4 minutos, sorbido técnico y evaluación de acidez, cuerpo y dulzor.', '## Qué es el cupping y por qué lo usa toda la industria

El cupping (catación) es el protocolo estandarizado que usa la industria del café, desde exportadores hasta tostadores y baristas de campeonato, para evaluar y comparar cafés de forma objetiva. Su gran ventaja frente a preparar una taza normal es que elimina variables: mismo tiempo de contacto, misma temperatura de agua, mismo ratio, sin filtro que retenga aromas o compuestos. Es, literalmente, la forma más directa de leer un café. La Specialty Coffee Association (SCA) formalizó el protocolo que hoy se usa como referencia mundial, y su versión simplificada es perfectamente reproducible en una cocina doméstica.

## Lo que necesitas

Varias muestras de café molido grueso-medio, una textura similar a la de una prensa francesa, tazas o vasos idénticos —una por muestra, o mejor, dos o tres por muestra para promediar impresiones—, una báscula, agua recién hervida y enfriada a unos 93°C, y dos cucharas: una para catar y otra, o una de dorso ancho, para retirar la espuma.

La proporción estándar es de 8,25 gramos de café por cada 150 mililitros de agua, aproximadamente un ratio 1:18. En casa, redondear a 8 gramos por 140-150 ml funciona perfectamente.

## Paso 1: fragancia en seco

Antes de añadir agua, acerca la nariz a la taza con el café molido y huele. Esto es la fragancia, el aroma del café seco, antes de hidratarse. Anota tu primera impresión: ¿floral, frutal, especiado, a frutos secos, a chocolate? Este primer olfateo entrena el paladar para lo que viene después y a menudo anticipa notas que luego aparecerán en boca.

## Paso 2: verter el agua y esperar

Vierte el agua a 93°C directamente sobre el café molido, cubriendo toda la superficie, y no toques la taza durante los siguientes 4 minutos. Durante ese tiempo se forma una costra (crust) de café flotando en la superficie, generada por el CO2 que libera el grano al hidratarse.

## Paso 3: romper la costra

A los 4 minutos exactos, acerca la nariz a la taza y rompe la costra con la parte trasera de la cuchara, con tres movimientos suaves de atrás hacia delante, mientras hueles el aroma que se libera: este es el momento en que se percibe con más intensidad el perfil aromático del café, y es distinto de la fragancia en seco del primer paso. Después, con dos cucharas, retira con cuidado la espuma y los restos de café que quedan flotando en la superficie, limpiando entre taza y taza para no contaminar muestras.

## Paso 4: dejar enfriar y catar

Deja reposar la taza unos minutos más, hasta que la temperatura baje a aproximadamente 71°C, lo bastante caliente para que los aromas sigan activos, lo bastante templado para no quemarte ni distorsionar la percepción del dulzor y la acidez. A partir de aquí, cata con una cucharada a la vez, sorbiendo con fuerza para pulverizar el café por toda la boca y el paladar superior: ese sorbido ruidoso no es mala educación, es técnica, porque airea el líquido y potencia la percepción retronasal del aroma.

## Qué evaluar en cada sorbo

Acidez: ¿es brillante y agradable, cítrica, a manzana, o apagada y plana? La acidez de calidad se percibe viva, no agresiva.

Cuerpo: la sensación de peso y textura en boca, ligero como té, medio, o denso y untuoso.

Dulzor: presente incluso sin azúcar añadido, procedente de los propios azúcares del café bien desarrollado en el tueste y el proceso.

Aftertaste (retrogusto): qué sabor queda en la boca varios segundos después de tragar, y si es agradable o se corta bruscamente.

Balance: si ninguno de los atributos anteriores domina de forma desagradable sobre los demás.

Cata la misma muestra varias veces a medida que se enfría: un café cambia de perfil notablemente entre los 71°C iniciales y la temperatura ambiente, y esa evolución también es información.

## Una puntuación simple para empezar

No hace falta replicar la hoja de catación SCA completa de 100 puntos. Una versión doméstica útil es puntuar cada atributo (fragancia y aroma, acidez, cuerpo, dulzor, retrogusto, balance) del 1 al 10, sumar y comparar entre muestras. Lo importante no es el número exacto, sino desarrollar el hábito de describir por qué un café te parece mejor que otro: ese vocabulario es, con diferencia, la herramienta más valiosa que te llevas de una sesión de cupping.', 'RECIPES', 'Lucía Beltrán', now() - interval '6 days');
