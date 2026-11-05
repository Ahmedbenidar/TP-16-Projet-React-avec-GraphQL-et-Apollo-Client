import { gql } from '@apollo/client';

export const CREER_COMPTE = gql`
  mutation CreerCompte($compte: CompteRequest!) {
    saveCompte(compte: $compte) {
      id
      titulaire
      solde
      dateCreation
      type
    }
  }
`;

export const AJOUTER_TRANSACTION = gql`
  mutation AjouterTransaction($transaction: TransactionRequest!) {
    addTransaction(transaction: $transaction) {
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
    }
  }
`;

export const SUPPRIMER_COMPTE = gql`
  mutation SupprimerCompte($id: ID!) {
    supprimerCompte(id: $id)
  }
`;
