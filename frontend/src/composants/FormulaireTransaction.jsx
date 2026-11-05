import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { AJOUTER_TRANSACTION } from '../graphql/mutations.js';
import {
  LISTER_COMPTES,
  TABLEAU_DE_BORD,
  TOUTES_TRANSACTIONS,
  TRANSACTIONS_DU_COMPTE
} from '../graphql/queries.js';
import { TypeTransaction } from '../graphql/types.js';
import { dateDuJour, formaterMontant, messageErreur } from '../outils/format.js';

const FormulaireTransaction = ({ comptes, compteActif, onTermine }) => {
  const [compteId, setCompteId] = useState(compteActif ?? '');
  const [type, setType] = useState(TypeTransaction.DEPOT);
  const [montant, setMontant] = useState('500');
  const [retour, setRetour] = useState(null);

  const [ajouterTransaction, { loading }] = useMutation(AJOUTER_TRANSACTION, {
    refetchQueries: [
      { query: LISTER_COMPTES },
      { query: TOUTES_TRANSACTIONS },
      { query: TABLEAU_DE_BORD }
    ]
  });

  const identifiant = compteId || compteActif || '';

  const soumettre = async (evenement) => {
    evenement.preventDefault();
    setRetour(null);
    if (!identifiant) {
      setRetour({ nature: 'erreur', texte: 'Choisissez un compte pour la transaction' });
      return;
    }
    try {
      const reponse = await ajouterTransaction({
        variables: {
          transaction: {
            compteId: identifiant,
            montant: Number.parseFloat(montant),
            date: dateDuJour(),
            type
          }
        },
        refetchQueries: [{ query: TRANSACTIONS_DU_COMPTE, variables: { id: identifiant } }]
      });
      const cree = reponse.data?.addTransaction;
      if (!cree) {
        setRetour({
          nature: 'erreur',
          texte: messageErreur({ graphQLErrors: reponse.errors })
        });
        return;
      }
      setRetour({
        nature: 'succes',
        texte: `${type === TypeTransaction.DEPOT ? 'Depot' : 'Retrait'} de ${formaterMontant(cree.montant)}
          enregistre, nouveau solde ${formaterMontant(cree.compte?.solde)}`
      });
      setMontant('500');
      if (onTermine) {
        onTermine(cree);
      }
    } catch (erreur) {
      setRetour({ nature: 'erreur', texte: messageErreur(erreur) });
    }
  };

  return (
    <section className="carte p-6">
      <h2 className="text-lg font-bold text-rif-800">Nouvelle transaction</h2>
      <p className="text-xs text-rif-500">Mutation GraphQL addTransaction</p>

      <form onSubmit={soumettre} className="mt-4 space-y-4">
        <div>
          <label htmlFor="compteTransaction" className="block text-xs font-semibold uppercase tracking-wide text-rif-500">
            Compte concerne
          </label>
          <select
            id="compteTransaction"
            value={identifiant}
            onChange={(evenement) => setCompteId(evenement.target.value)}
            className="mt-1 w-full rounded-lg border border-sable-300 px-3 py-2 text-sm outline-none focus:border-rif-500"
          >
            <option value="">Selectionner un compte</option>
            {comptes.map((compte) => (
              <option key={compte.id} value={compte.id}>
                #{compte.id} - {compte.titulaire}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.keys(TypeTransaction).map((cle) => (
            <button
              key={cle}
              type="button"
              onClick={() => setType(cle)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                type === cle
                  ? cle === TypeTransaction.DEPOT
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-rose-500 bg-rose-50 text-rose-700'
                  : 'border-sable-300 bg-white text-rif-500 hover:bg-sable-100'
              }`}
            >
              {cle === TypeTransaction.DEPOT ? 'Depot' : 'Retrait'}
            </button>
          ))}
        </div>

        <div>
          <label htmlFor="montant" className="block text-xs font-semibold uppercase tracking-wide text-rif-500">
            Montant en dirhams
          </label>
          <input
            id="montant"
            type="number"
            min="1"
            step="0.01"
            value={montant}
            onChange={(evenement) => setMontant(evenement.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-sable-300 px-3 py-2 text-sm outline-none focus:border-rif-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-sable-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sable-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer la transaction'}
        </button>

        {retour ? (
          <p
            className={`rounded-lg p-3 text-sm font-medium ${
              retour.nature === 'succes'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {retour.texte}
          </p>
        ) : null}
      </form>

      <p className="mt-4 text-xs text-rif-400">
        Un retrait superieur au solde est refuse par le serveur GraphQL.
      </p>
    </section>
  );
};

export default FormulaireTransaction;
