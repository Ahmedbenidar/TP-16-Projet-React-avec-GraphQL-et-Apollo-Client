import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { LISTER_COMPTES, RECHERCHER_COMPTES } from '../graphql/queries.js';
import { LIBELLES_COMPTE, STYLES_COMPTE, TypeCompte } from '../graphql/types.js';
import { formaterDate, formaterMontant } from '../outils/format.js';

const ListeComptes = ({ onSelectionner, compteActif }) => {
  const [fragment, setFragment] = useState('');
  const [filtre, setFiltre] = useState('TOUS');

  const { data, loading, error, refetch } = useQuery(LISTER_COMPTES, {
    fetchPolicy: 'network-only'
  });
  const recherche = useQuery(RECHERCHER_COMPTES, {
    variables: { fragment },
    skip: fragment.trim().length < 2
  });

  const source = fragment.trim().length >= 2 ? recherche.data?.rechercherComptes : data?.allComptes;
  const comptes = (source ?? []).filter((c) => filtre === 'TOUS' || c.type === filtre);

  return (
    <section className="carte p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-rif-800">Comptes bancaires</h2>
          <p className="text-xs text-rif-500">
            Requete GraphQL allComptes et rechercherComptes
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg border border-sable-300 px-3 py-1.5 text-xs font-semibold text-rif-600 hover:bg-sable-100"
        >
          Recharger
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={fragment}
          onChange={(evenement) => setFragment(evenement.target.value)}
          placeholder="Rechercher un titulaire (2 lettres minimum)"
          className="w-full rounded-lg border border-sable-300 px-3 py-2 text-sm outline-none focus:border-rif-500"
        />
        <select
          value={filtre}
          onChange={(evenement) => setFiltre(evenement.target.value)}
          className="rounded-lg border border-sable-300 px-3 py-2 text-sm outline-none focus:border-rif-500"
        >
          <option value="TOUS">Tous les types</option>
          {Object.keys(TypeCompte).map((type) => (
            <option key={type} value={type}>
              {LIBELLES_COMPTE[type]}
            </option>
          ))}
        </select>
      </div>

      {loading ? <p className="mt-4 text-sm text-rif-500">Chargement des comptes...</p> : null}
      {error ? (
        <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">
          Erreur GraphQL : {error.message}
        </p>
      ) : null}

      <ul className="mt-4 space-y-2">
        {comptes.map((compte) => (
          <li key={compte.id}>
            <button
              type="button"
              onClick={() => onSelectionner(compte)}
              className={`w-full rounded-xl border p-3 text-left transition hover:border-rif-400 hover:bg-rif-50 ${
                compteActif === compte.id ? 'border-rif-500 bg-rif-50' : 'border-sable-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-rif-800">
                  #{compte.id} - {compte.titulaire}
                </span>
                <span className={`etiquette ${STYLES_COMPTE[compte.type] ?? ''}`}>
                  {LIBELLES_COMPTE[compte.type] ?? compte.type}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="font-bold text-rif-600">{formaterMontant(compte.solde)}</span>
                <span className="text-xs text-rif-400">cree le {formaterDate(compte.dateCreation)}</span>
              </div>
            </button>
          </li>
        ))}
        {!loading && comptes.length === 0 ? (
          <li className="rounded-xl border border-dashed border-sable-300 p-4 text-sm text-rif-500">
            Aucun compte ne correspond a ce filtre.
          </li>
        ) : null}
      </ul>
    </section>
  );
};

export default ListeComptes;
