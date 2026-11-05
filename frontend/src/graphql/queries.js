import { gql } from '@apollo/client';

const CHAMPS_COMPTE = `
  id
  titulaire
  solde
  dateCreation
  type
`;

const CHAMPS_TRANSACTION = `
  id
  type
  montant
  date
  compte {
    id
    titulaire
    solde
    type
  }
`;

export const LISTER_COMPTES = gql`
  query ListerComptes {
    allComptes {
      ${CHAMPS_COMPTE}
    }
  }
`;

export const COMPTE_PAR_ID = gql`
  query CompteParId($id: ID!) {
    compteById(id: $id) {
      ${CHAMPS_COMPTE}
      transactions {
        id
        type
        montant
        date
      }
    }
  }
`;

export const COMPTES_PAR_TYPE = gql`
  query ComptesParType($type: TypeCompte!) {
    comptesParType(type: $type) {
      ${CHAMPS_COMPTE}
    }
  }
`;

export const RECHERCHER_COMPTES = gql`
  query RechercherComptes($fragment: String!) {
    rechercherComptes(fragment: $fragment) {
      ${CHAMPS_COMPTE}
    }
  }
`;

export const STATS_SOLDES = gql`
  query StatsSoldes {
    totalSolde {
      count
      sum
      average
      max
      min
    }
  }
`;

export const TRANSACTIONS_DU_COMPTE = gql`
  query TransactionsDuCompte($id: ID!) {
    compteTransactions(id: $id) {
      ${CHAMPS_TRANSACTION}
    }
  }
`;

export const TOUTES_TRANSACTIONS = gql`
  query ToutesTransactions {
    allTransactions {
      ${CHAMPS_TRANSACTION}
    }
  }
`;

export const STATS_TRANSACTIONS = gql`
  query StatsTransactions {
    transactionStats {
      count
      sumDepots
      sumRetraits
      soldeNet
    }
  }
`;

export const TABLEAU_DE_BORD = gql`
  query TableauDeBord {
    tableauBord {
      nombreComptes
      nombreTransactions
      soldeTotal
      repartition {
        type
        nombre
        solde
      }
    }
  }
`;
