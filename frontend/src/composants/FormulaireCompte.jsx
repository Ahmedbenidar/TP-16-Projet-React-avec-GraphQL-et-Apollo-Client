import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREER_COMPTE } from '../graphql/mutations.js';
import { LISTER_COMPTES, TABLEAU_DE_BORD } from '../graphql/queries.js';
import { LIBELLES_COMPTE, TypeCompte } from '../graphql/types.js';
import { dateDuJour, messageErreur } from '../outils/format.js';

const FormulaireCompte = ({ onCree }) => {
  const [titulaire, setTitulaire] = useState('');
  const [solde, setSolde] = useState('1500');
  const [type, setType] = useState(TypeCompte.COURANT);
  const [retour, setRetour] = useState(null);

  const [creerCompte, { loading }] = useMutation(CREER_COMPTE, {
    refetchQueries: [
      { query: LISTER_COMPTES },
      { query: TABLEAU_DE_BORD }
    ]
  });

  const soumettre = async (evenement) => {
    evenement.preventDefault();
    setRetour(null);
    try {
      const reponse = await creerCompte({
        variables: {
          compte: {
            titulaire: titulaire.trim(),
            solde: Number.parseFloat(solde),
            dateCreation: dateDuJour(),
            type
          }
        }
      });
      const cree = reponse.data?.saveCompte;
      if (!cree) {
        setRetour({
          nature: 'erreur',
          texte: messageErreur({ graphQLErrors: reponse.errors })
        });
        return;
      }
      setRetour({ nature: 'succes', texte: `Compte #${cree.id} cree pour ${cree.titulaire}` });      setTitulaire('');
      setSolde('1500');
      setType(TypeCompte.COURANT);
      if (onCree) {
        onCree(cree);
      }
    } catch (erreur) {
      setRetour({ nature: 'erreur', texte: messageErreur(erreur) });
    }
  };

  return (
    <section className="carte p-6">
      <h2 className="text-lg font-bold text-rif-800">Ouvrir un compte</h2>
      <p className="text-xs text-rif-500">Mutation GraphQL saveCompte</p>

      <form onSubmit={soumettre} className="mt-4 space-y-4">
        <div>
          <label htmlFor="titulaire" className="block text-xs font-semibold uppercase tracking-wide text-rif-500">
            Titulaire
          </label>
          <input
            id="titulaire"
            type="text"
            value={titulaire}
            onChange={(evenement) => setTitulaire(evenement.target.value)}
            placeholder="Nom du client"
            required
            className="mt-1 w-full rounded-lg border border-sable-300 px-3 py-2 text-sm outline-none focus:border-rif-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="solde" className="block text-xs font-semibold uppercase tracking-wide text-rif-500">
              Solde initial
            </label>
            <input
              id="solde"
              type="number"
              min="0"
              step="0.01"
              value={solde}
              onChange={(evenement) => setSolde(evenement.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-sable-300 px-3 py-2 text-sm outline-none focus:border-rif-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-xs font-semibold uppercase tracking-wide text-rif-500">
              Type de compte
            </label>
            <select
              id="type"
              value={type}
              onChange={(evenement) => setType(evenement.target.value)}
              className="mt-1 w-full rounded-lg border border-sable-300 px-3 py-2 text-sm outline-none focus:border-rif-500"
            >
              {Object.keys(TypeCompte).map((cle) => (
                <option key={cle} value={cle}>
                  {LIBELLES_COMPTE[cle]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-rif-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rif-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Creation en cours...' : 'Creer le compte'}
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
    </section>
  );
};

export default FormulaireCompte;
