export function generateConstructQuery(limit, offset) {
  return `
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX eli:     <http://data.europa.eu/eli/ontology#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX prov:    <http://www.w3.org/ns/prov#>
PREFIX epvoc:   <https://data.europarl.europa.eu/def/epvoc#>

CONSTRUCT {
  ?besluit a eli:Expression, eli:LegalExpression ;
    eli:title ?title_nl ;
    dcterms:title ?title_nl ;
    eli:description ?description_nl ;
    dcterms:description ?description_nl ;
    eli:language ?language_parsed ;
    epvoc:expressionContent ?content_nl ;
    dcterms:created ?now ;
    dcterms:modified ?now .

  ?besluit_werk a eli:Work, eli:LegalResource ;
    dcterms:title ?title_nl ;
    eli:date_document ?date_parsed ;
    dcterms: ?date_parsed ;
    eli:is_realized_by ?besluit ;
    eli:passed_by ?bestuursorgaan ;
    dcterms:creator ?bestuursorgaan ;
    dcterms:contributor ?aanwezige, ?secretaris, ?voorzitter ; 
    dcterms:created ?now ;
    dcterms:modified ?now .
}
WHERE {
  GRAPH <http://mu.semte.ch/graphs/oslo-decisions/ghent/besluit> {
    ?besluit a besluit:Besluit .
  }

  GRAPH <http://mu.semte.ch/graphs/oslo-decisions/landing> {
    ?besluit eli:title ?title .
    ?besluit eli:description ?description_nl .
    ?besluit eli:date_publication ?date .
    ?besluit eli:language ?language .
    ?besluit prov:value ?content .

    ?besluit ^prov:generated ?behandeling .
    ?behandeling dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor ?bestuursorgaan .
    ?behandeling besluit:heeftAanwezige ?aanwezige .
    ?behandeling besluit:heeftSecretaris ?secretaris .
    ?behandeling besluit:heeftVoorzitter ?voorzitter .
  }

  BIND(URI(CONCAT(STR(?besluit), '/work')) AS ?besluit_werk)

  BIND(STRLANG(STR(?title), "nl") AS ?title_nl)
  BIND(STRLANG(STR(?description), "nl") AS ?description_nl)
  BIND(STRLANG(STR(?content), "nl") AS ?content_nl)

  BIND(xsd:date(?date) AS ?date_parsed)
  BIND(COALESCE(?language, <http://publications.europa.eu/resource/authority/language/NLD>) AS ?language_parsed)

  BIND(NOW() AS ?now)
}
LIMIT ${limit}
OFFSET ${offset}`;
}
