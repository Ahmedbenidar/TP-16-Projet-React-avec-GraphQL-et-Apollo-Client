import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SUPPRIMER_COMPTE } from '../graphql/mutations.js';
import {
  COMPTES_PAR_TYPE,
  LISTER_COMPTES,
  RECHERCHER_COMPTES,
  TABLEAU_DE_BORD,
  TOUTES_TRANSACTIONS
} from '../graphql/queries.js';
import { LIBELLES_COMPTE, STYLES_COMPTE, TypeCompte } from '../graphql/types.js';
import { formaterDate, formaterMontant, messageErreur } from '../outils/format.js';

const FicheCompte = ({ compte, onFermer, onSupprime }) => {
  const [etape, setEtape] = useState('repos');
  const [erreur, setErreur] = useState(null);

  const [supprimerCompte, { loading }] = useMutation(SUPPRIMER_COMPTE, {
    refetchQueries: [
      { query: LISTER_COMPTES },
      { query: TOUTES_TRANSACTIONS },
      { query: TABLEAU_DE_BORD },
      { query: COMPTES_PAR_TYPE, variables: { type: TypeCompte.COURANT } },
      { query: RECHERCHER_COMPTES, variables: { fragment: 'ah' } }
    ]
  });

  if (!compte) {
    return (
      <section className="carte p-6">
        <h2 className="text-lg font-bold text-rif-800">Fiche du compte</h2>
        <p className="mt-3 rounded-xl border border-dashed border-sable-300 p-4 text-sm text-rif-500">
          Cliquez sur un compte de la liste pour afficher sa fiche detaillee.
        </p>
      </section>
    );
  }

  const confirmer = async () => {
    setErreur(null);
    try {
      await supprimerCompte({ variables: { id: compte.id } });
      setEtape('repos');
      if (onSupprime) {
        onSupprime(compte);
      }
    } catch (souci) {
      setErreur(messageErreur(souci));
    }
  };

  return (
    <section className="carte p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-rif-800">Fiche du compte</h2>
          <p className="text-xs text-rif-500">Requete GraphQL compteById</p>
        </div>
        <button
          type="button"
          onClick={onFermer}
          className="rounded-lg border border-sable-300 px-2 py-1 text-xs font-semibold text-rif-500 hover:bg-sable-100"
        >
          Fermer
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-rif-500">Identifiant</span>
          <span className="font-mono text-sm font-semibold text-rif-800">#{compte.id}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-rif-500">Titulaire</span>
          <span className="text-sm font-semibold text-rif-800">{compte.titulaire}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-rif-500">Type</span>
          <span className={`etiquette ${STYLES_COMPTE[compte.type] ?? ''}`}>
            {LIBELLES_COMPTE[compte.type] ?? compte.type}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-rif-500">Date de creation</span>
          <span className="text-sm text-rif-700">{formaterDate(compte.dateCreation)}</span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-rif-50 px-3 py-2">
          <span className="text-sm font-semibold text-rif-600">Solde</span>
          <span className="text-lg font-bold text-rif-700">{formaterMontant(compte.solde)}</span>
        </div>
      </div>

      {etape === 'repos' ? (
        <button
          type="button"
          onClick={() => setEtape('confirmation')}
          className="mt-5 w-full rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
        >
          Fermer ce compte
        </button>
      ) : (
        <div className="mt-5 space-y-3 rounded-xl bg-rose-50 p-4">
          <p className="text-sm font-medium text-rose-700">
            Confirmer la suppression definitive du compte #{compte.id} ?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={confirmer}
              disabled={loading}
              className="flex-1 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {loading ? 'Suppression...' : 'Oui, supprimer'}
            </button>
            <button
              type="button"
              onClick={() => setEtape('repos')}
              className="flex-1 rounded-lg border border-sable-300 bg-white px-3 py-2 text-sm font-semibold text-rif-600"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {erreur ? (
        <p className="mt-3 rounded-lg bg-rose-100 p-3 text-sm font-medium text-rose-700">{erreur}</p>
      ) : null}
    </section>
  );
};

export default FicheCompte;
