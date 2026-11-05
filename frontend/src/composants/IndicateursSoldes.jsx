import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { STATS_SOLDES } from '../graphql/queries.js';
import { formaterMontant } from '../outils/format.js';

const IndicateursSoldes = () => {
  const { data, loading, error } = useQuery(STATS_SOLDES);

  if (loading) {
    return (
      <section className="carte p-5 text-sm text-rif-500">Calcul des soldes en cours...</section>
    );
  }

  if (error) {
    return (
      <section className="carte border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700">
        Statistiques indisponibles : {error.message}
      </section>
    );
  }

  const stats = data.totalSolde;

  return (
    <section className="carte p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-rif-500">
        Indicateurs de soldes
      </h2>
      <p className="text-xs text-rif-400">Requete GraphQL totalSolde</p>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <p className="text-xs text-rif-400">Comptes</p>
          <p className="text-xl font-bold text-rif-800">{stats.count}</p>
        </div>
        <div>
          <p className="text-xs text-rif-400">Total</p>
          <p className="text-xl font-bold text-rif-600">{formaterMontant(stats.sum)}</p>
        </div>
        <div>
          <p className="text-xs text-rif-400">Moyenne</p>
          <p className="text-xl font-bold text-rif-800">{formaterMontant(stats.average)}</p>
        </div>
        <div>
          <p className="text-xs text-rif-400">Max / Min</p>
          <p className="text-sm font-bold text-rif-700">
            {formaterMontant(stats.max)} / {formaterMontant(stats.min)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default IndicateursSoldes;
