import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { COMPTE_PAR_ID, TOUTES_TRANSACTIONS, TRANSACTIONS_DU_COMPTE } from '../graphql/queries.js';
import { LIBELLES_COMPTE, STYLES_COMPTE, STYLES_TRANSACTION } from '../graphql/types.js';
import { formaterDate, formaterMontant } from '../outils/format.js';

const HistoriqueTransactions = ({ compteActif }) => {
  const [mode, setMode] = useState('COMPTE');

  const detail = useQuery(COMPTE_PAR_ID, {
    variables: { id: compteActif },
    skip: !compteActif
  });

  const duCompte = useQuery(TRANSACTIONS_DU_COMPTE, {
    variables: { id: compteActif },
    skip: !compteActif
  });

  const global = useQuery(TOUTES_TRANSACTIONS, { skip: mode !== 'GLOBAL' });

  const transactions =
    mode === 'GLOBAL' ? global.data?.allTransactions ?? [] : duCompte.data?.compteTransactions ?? [];
  const chargement = mode === 'GLOBAL' ? global.loading : duCompte.loading;
  const erreur = mode === 'GLOBAL' ? global.error : duCompte.error;

  return (
    <section className="carte p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-rif-800">Historique des transactions</h2>
          <p className="text-xs text-rif-500">
            Requetes compteTransactions et allTransactions
          </p>
        </div>
        <div className="flex rounded-lg border border-sable-300 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('COMPTE')}
            className={`rounded-md px-3 py-1 ${
              mode === 'COMPTE' ? 'bg-rif-600 text-white' : 'text-rif-500'
            }`}
          >
            Compte actif
          </button>
          <button
            type="button"
            onClick={() => setMode('GLOBAL')}
            className={`rounded-md px-3 py-1 ${
              mode === 'GLOBAL' ? 'bg-rif-600 text-white' : 'text-rif-500'
            }`}
          >
            Tous les comptes
          </button>
        </div>
      </div>

      {mode === 'COMPTE' && detail.data?.compteById ? (
        <div className="mt-4 rounded-xl bg-rif-50 p-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-rif-800">
              #{detail.data.compteById.id} - {detail.data.compteById.titulaire}
            </p>
            <span className={`etiquette ${STYLES_COMPTE[detail.data.compteById.type] ?? ''}`}>
              {LIBELLES_COMPTE[detail.data.compteById.type] ?? detail.data.compteById.type}
            </span>
          </div>
          <p className="mt-1 text-2xl font-bold text-rif-600">
            {formaterMontant(detail.data.compteById.solde)}
          </p>
          <p className="text-xs text-rif-400">
            ouvert le {formaterDate(detail.data.compteById.dateCreation)}
          </p>
        </div>
      ) : null}

      {mode === 'COMPTE' && !compteActif ? (
        <p className="mt-4 rounded-xl border border-dashed border-sable-300 p-4 text-sm text-rif-500">
          Selectionnez un compte dans la liste pour afficher ses operations.
        </p>
      ) : null}

      {chargement ? <p className="mt-4 text-sm text-rif-500">Chargement de l historique...</p> : null}
      {erreur ? (
        <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">
          {erreur.message}
        </p>
      ) : null}

      <ul className="mt-4 divide-y divide-sable-200">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="flex items-center justify-between py-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`etiquette ${STYLES_TRANSACTION[transaction.type] ?? ''}`}>
                  {transaction.type}
                </span>
                <span className="text-xs text-rif-400">{formaterDate(transaction.date)}</span>
              </div>
              <p className="mt-1 text-xs text-rif-500">
                {transaction.compte
                  ? `compte #${transaction.compte.id} - ${transaction.compte.titulaire}`
                  : 'compte non renseigne'}
              </p>
            </div>
            <span
              className={`text-sm font-bold ${
                transaction.type === 'DEPOT' ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {transaction.type === 'DEPOT' ? '+' : '-'}
              {formaterMontant(transaction.montant)}
            </span>
          </li>
        ))}
        {!chargement && transactions.length === 0 ? (
          <li className="py-4 text-sm text-rif-500">Aucune transaction pour cette selection.</li>
        ) : null}
      </ul>
    </section>
  );
};

export default HistoriqueTransactions;
