import type { Schema, Attribute } from '@strapi/strapi';

export interface HeaderHeaderSektion extends Schema.Component {
  collectionName: 'components_header_header_sektions';
  info: {
    displayName: 'Header-Sektion';
    description: '';
  };
  attributes: {
    Slogan: Attribute.Text & Attribute.Required;
    Text: Attribute.Text & Attribute.Required;
    Image: Attribute.Media & Attribute.Required;
    ImageAltText: Attribute.String & Attribute.Required;
  };
}

export interface PageComponentsCollapse extends Schema.Component {
  collectionName: 'components_page_components_collapses';
  info: {
    displayName: 'Collapse';
    description: '';
  };
  attributes: {
    Frage: Attribute.String;
    Antwort: Attribute.RichText;
  };
}

export interface PageComponentsKarussell extends Schema.Component {
  collectionName: 'components_page_components_karussells';
  info: {
    displayName: 'Karussell';
    description: '';
  };
  attributes: {
    Karusellkarte: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 99;
      }>;
    Icon: Attribute.Media;
    IconAltText: Attribute.String & Attribute.Required;
  };
}

export interface PageComponentsListe extends Schema.Component {
  collectionName: 'components_page_components_listes';
  info: {
    displayName: 'Liste';
    description: '';
  };
  attributes: {
    Stichpunkt: Attribute.String;
  };
}

export interface StartpageAnleitungSektion extends Schema.Component {
  collectionName: 'components_startpage_anleitung_sektions';
  info: {
    displayName: 'Anleitung-Sektion';
    description: '';
  };
  attributes: {
    Beschreibungstext: Attribute.Text;
    Schritt1: Attribute.Text;
    Schritt2: Attribute.Text;
    Schritt3: Attribute.Text;
    Titel: Attribute.String;
    Schritt1Titel: Attribute.String;
    Schritt2Titel: Attribute.String;
    Schritt3Titel: Attribute.String;
  };
}

export interface StartpageFaqSektion extends Schema.Component {
  collectionName: 'components_startpage_faq_sektions';
  info: {
    displayName: 'FAQ-Sektion';
  };
  attributes: {
    FAQ: Attribute.Component<'page-components.collapse', true>;
  };
}

export interface StartpageGruendeSektion extends Schema.Component {
  collectionName: 'components_startpage_gruende_sektions';
  info: {
    displayName: 'Gruende-Sektion';
    description: '';
  };
  attributes: {
    Titel: Attribute.String;
    Beschreibungstext: Attribute.Text;
    Grund: Attribute.Component<'page-components.karussell', true>;
  };
}

export interface StartpageMitmachenSektion extends Schema.Component {
  collectionName: 'components_startpage_mitmachen_sektions';
  info: {
    displayName: 'Mitmachen-Sektion';
  };
  attributes: {
    Titel: Attribute.String;
    Beschreibungstext: Attribute.Text;
  };
}

export interface StartpageReperaturSektion extends Schema.Component {
  collectionName: 'components_startpage_reperatur_sektions';
  info: {
    displayName: 'Reperatur-Sektion';
    description: '';
  };
  attributes: {
    TitelLinks: Attribute.String;
    TitelRechts: Attribute.String;
    UntertitelLinks: Attribute.String;
    UnterTitelRechts: Attribute.String;
    GrundStichpunktRechts: Attribute.Component<'page-components.liste', true>;
    GrundStichpunktLinks: Attribute.Component<'page-components.liste', true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'header.header-sektion': HeaderHeaderSektion;
      'page-components.collapse': PageComponentsCollapse;
      'page-components.karussell': PageComponentsKarussell;
      'page-components.liste': PageComponentsListe;
      'startpage.anleitung-sektion': StartpageAnleitungSektion;
      'startpage.faq-sektion': StartpageFaqSektion;
      'startpage.gruende-sektion': StartpageGruendeSektion;
      'startpage.mitmachen-sektion': StartpageMitmachenSektion;
      'startpage.reperatur-sektion': StartpageReperaturSektion;
    }
  }
}
