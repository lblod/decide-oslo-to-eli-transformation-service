const prefixes = `
PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX eli:     <http://data.europa.eu/eli/ontology#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX prov:    <http://www.w3.org/ns/prov#>
PREFIX epvoc:   <https://data.europarl.europa.eu/def/epvoc#>
`;

const inputResourcesGraph =
  "http://mu.semte.ch/graphs/oslo-decisions/ghent/besluit";
const inputDataGraph = "http://mu.semte.ch/graphs/oslo-decisions/landing";
const outputGraph = "http://mu.semte.ch/graphs/eli-decisions/ghent";

export function buildResourceInsertQuery(limit, offset) {
  return `${prefixes}
    INSERT {
      GRAPH <${outputGraph}> {
        ?besluit a eli:Expression, eli:LegalExpression ;
                 dcterms:created ?now ;
                 dcterms:modified ?now .
        ?besluit_work a eli:Work, eli:LegalResource ;
                      dcterms:created ?now ;
                      dcterms:modified ?now .
      }
    } WHERE {
      {
        SELECT * WHERE {
          GRAPH <${inputResourcesGraph}> {
            ?besluit a besluit:Besluit .
          }
        } LIMIT ${limit} OFFSET ${offset}
      }
      BIND(URI(CONCAT(STR(?besluit), '/work')) AS ?besluit_work)
      BIND(NOW() AS ?now)
    }`;
}

export function buildTitleInsertQuery(limit, offset) {
  return `${prefixes}
    INSERT {
      GRAPH <${outputGraph}> {
        ?besluit eli:title ?title_nl ;
                 dcterms:title ?title_nl .
        ?besluit_work dcterms:title ?title_nl .
      }
    } WHERE {
      {
        SELECT * WHERE {
          GRAPH <${inputResourcesGraph}> {
            ?besluit a besluit:Besluit .
          }
          GRAPH <${inputDataGraph}> {
            ?besluit eli:title ?title .
          }
        } LIMIT ${limit} OFFSET ${offset}
      }
      BIND(URI(CONCAT(STR(?besluit), '/work')) AS ?besluit_work)
      BIND(STRLANG(STR(?title), "nl") AS ?title_nl)
    }`;
}

export function buildDescriptionInsertQuery(limit, offset) {
  return `${prefixes}
    INSERT {
      GRAPH <${outputGraph}> {
        ?besluit eli:description ?description_nl ;
                 dcterms:description ?description_nl .
      }
    } WHERE {
      {
        SELECT * WHERE {
          GRAPH <${inputResourcesGraph}> {
            ?besluit a besluit:Besluit .
          }
          GRAPH <${inputDataGraph}> {
            ?besluit eli:description ?description .
          }
        } LIMIT ${limit} OFFSET ${offset}
      }
      BIND(STRLANG(STR(?description), "nl") AS ?description_nl)
    }`;
}

export function buildDateInsertQuery(limit, offset) {
  return `${prefixes}
    INSERT {
      GRAPH <${outputGraph}> {
        ?besluit_work eli:date_document ?date_parsed ;
                      dcterms:date ?date_parsed .
      }
    } WHERE {
      {
        SELECT * WHERE {
          GRAPH <${inputResourcesGraph}> {
            ?besluit a besluit:Besluit .
          }
          GRAPH <${inputDataGraph}> {
            ?besluit eli:date_publication ?date .
          }
        } LIMIT ${limit} OFFSET ${offset}
      }
      BIND(URI(CONCAT(STR(?besluit), '/work')) AS ?besluit_work)
      BIND(xsd:date(?date) AS ?date_parsed)
    }`;
}

export function buildLanguageInsertQuery(limit, offset) {
  return `${prefixes}
    INSERT {
      GRAPH <${outputGraph}> {
        ?besluit eli:language ?language_parsed .
      }
    } WHERE {
      {
        SELECT * WHERE {
          GRAPH <${inputResourcesGraph}> {
            ?besluit a besluit:Besluit .
          }
          GRAPH <${inputDataGraph}> {
            ?besluit eli:language ?language .
          }
        } LIMIT ${limit} OFFSET ${offset}
      }
      BIND(COALESCE(?language, <http://publications.europa.eu/resource/authority/language/NLD>) AS ?language_parsed)
    }`;
}

export function buildContentInsertQuery(limit, offset) {
  return `${prefixes}
    INSERT {
      GRAPH <${outputGraph}> {
          ?besluit epvoc:expressionContent ?content_nl .
      }
    } WHERE {
      {
        SELECT * WHERE {
          GRAPH <${inputResourcesGraph}> {
            ?besluit a besluit:Besluit .
          }
          GRAPH <${inputDataGraph}> {
            ?besluit prov:value ?content .
          }
        } LIMIT ${limit} OFFSET ${offset}
      }
      BIND(STRLANG(STR(?content), "nl") AS ?content_nl)
    }`;
}

export function buildCreatorInsertQuery(limit, offset) {
  return `${prefixes}
    INSERT {
      GRAPH <${outputGraph}> {
          ?besluit_work eli:passed_by ?bestuursorgaan ;
                        dcterms:creator ?bestuursorgaan .
      }
    } WHERE {
      {
        SELECT * WHERE {
          GRAPH <${inputResourcesGraph}> {
            ?besluit a besluit:Besluit .
          }
          GRAPH <${inputDataGraph}> {
            ?besluit ^prov:generated / dcterms:subject / ^besluit:behandelt / besluit:isGehoudenDoor ?bestuursorgaan .
          }
        } LIMIT ${limit} OFFSET ${offset}
      }
      BIND(URI(CONCAT(STR(?besluit), '/work')) AS ?besluit_work)
    }`;
}

export function buildContributorInsertQuery(limit, offset) {
  return `${prefixes}
    INSERT {
      GRAPH <${outputGraph}> {
          ?besluit_work dcterms:contributor ?aanwezige, ?secretaris, ?voorzitter .
      }
    } WHERE {
      {
        SELECT * WHERE {
          GRAPH <${inputResourcesGraph}> {
            ?besluit a besluit:Besluit .
          }
          GRAPH <${inputDataGraph}> {
            ?besluit ^prov:generated ?behandeling .
            OPTIONAL { ?behandeling besluit:heeftAanwezige ?aanwezige . }
            OPTIONAL { ?behandeling besluit:heeftSecretaris ?secretaris . }
            OPTIONAL { ?behandeling besluit:heeftVoorzitter ?voorzitter . }
          }
        } LIMIT ${limit} OFFSET ${offset}
      }
      BIND(URI(CONCAT(STR(?besluit), '/work')) AS ?besluit_work)
    }`;
}
