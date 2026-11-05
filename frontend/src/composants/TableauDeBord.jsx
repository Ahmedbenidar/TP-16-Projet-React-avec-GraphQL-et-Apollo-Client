import React from 'react';
import { useQuery } from '@apollo/client';
import { TABLEAU_DE_BORD, STATS_TRANSACTIONS } from '../graphql/queries.js';
import { formaterMontant } from '../outils/format.js';
import { LIBELLES_COMPTE } from '../graphql/types.js';

const Carte = ({ titre, valeur, detail, accent }) => (
  <div className="carte p-5">
    <p className="text-xs font-semibold uppercase tracking-wider text-rif-400">{titre}</p>
    <p className={`mt-2 text-2xl font-bold ${accent ?? 'text-rif-800'}`}>{valeur}</p>
    {detail ? <p className="mt-1 text-xs text-rif-500">{detail}</p> : null}
  </div>
);

const TableauDeBord = () => {
  const bord = useQuery(TABLEAU_DE_BORD);
  const stats = useQuery(STATS_TRANSACTIONS);

  if (bord.loading || stats.loading) {
    return (
      <section className="carte p-6 text-sm text-rif-500">
        Chargement du tableau de bord...
      </section>
    );
  }

  if (bord.error || stats.error) {
    return (
      <section className="carte border-rose-200 bg-rose-50 p-6 text-sm font-medium text-rose-700">
        Tableau de bord indisponible : {bord.error?.message ?? stats.error?.message}
      </section>
    );
  }

  const bordData = bord.data.tableauBord;
  const statsData = stats.data.transactionStats;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Carte
          titre="Comptes ouverts"
          valeur={bordData.nombreComptes}
          detail="clients et professionnels"
        />
        <Carte
          titre="Encours total"
          valeur={formaterMontant(bordData.soldeTotal)}
          detail="somme des soldes"
          accent="text-rif-600"
        />
        <Carte
          titre="Transactions"
          valeur={bordData.nombreTransactions}
          detail={`net ${formaterMontant(statsData.soldeNet)}`}
        />
        <Carte
          titre="Depots / Retraits"
          valeur={`${formaterMontant(statsData.sumDepots)} / ${formaterMontant(statsData.sumRetraits)}`}
          detail="cumul des operations"
          accent="text-sable-600"
        />
      </div>

      <div className="carte p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-rif-500">
          Repartition par type de compte
        </h3>
        <ul className="mt-4 space-y-3">
          {bordData.repartition.map((ligne) => {
            const part = bordData.soldeTotal > 0 ? (ligne.solde / bordData.soldeTotal) * 100 : 0;
            return (
              <li key={ligne.type}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-rif-700">
                    {LIBELLES_COMPTE[ligne.type] ?? ligne.type}
                  </span>
                  <span className="text-rif-500">
                    {ligne.nombre} compte(s) - {formaterMontant(ligne.solde)}
                  </span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-sable-100">
                  <div
                    className="h-2 rounded-full bg-rif-500"
                    style={{ width: `${Math.min(part, 100)}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default TableauDeBord;
