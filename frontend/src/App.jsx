import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Entete from './composants/Entete.jsx';
import TableauDeBord from './composants/TableauDeBord.jsx';
import IndicateursSoldes from './composants/IndicateursSoldes.jsx';
import ListeComptes from './composants/ListeComptes.jsx';
import FormulaireCompte from './composants/FormulaireCompte.jsx';
import FormulaireTransaction from './composants/FormulaireTransaction.jsx';
import HistoriqueTransactions from './composants/HistoriqueTransactions.jsx';
import FicheCompte from './composants/FicheCompte.jsx';
import { LISTER_COMPTES } from './graphql/queries.js';

function App() {
  const [compteActif, setCompteActif] = useState(null);
  const { data, loading, refetch } = useQuery(LISTER_COMPTES);

  const comptes = data?.allComptes ?? [];
  const compteSelectionne = comptes.find((c) => String(c.id) === String(compteActif)) ?? null;

  const selectionner = (compte) => setCompteActif(compte.id);

  return (
    <div className="min-h-screen bg-sable-50">
      <Entete onRafraichir={() => refetch()} enChargement={loading} />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-8">
        <section className="rounded-2xl bg-gradient-to-r from-rif-700 via-rif-600 to-sable-600 px-6 py-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rif-100">
            Activite 16 - Apollo Client
          </p>
          <h2 className="mt-2 text-3xl font-bold">Pilotage des comptes et des operations</h2>
          <p className="mt-2 max-w-2xl text-sm text-rif-50">
            Une interface React qui interroge le service GraphQL bancaire, affiche les comptes en
            temps reel et enregistre les depots comme les retraits.
          </p>
        </section>

        <TableauDeBord />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ListeComptes onSelectionner={selectionner} compteActif={compteActif} />
            <HistoriqueTransactions compteActif={compteActif} />
          </div>
          <div className="space-y-6">
            <FormulaireCompte onCree={(compte) => setCompteActif(compte?.id ?? null)} />
            <FormulaireTransaction
              comptes={comptes}
              compteActif={compteActif}
              onTermine={() => refetch()}
            />
            <FicheCompte
              compte={compteSelectionne}
              onFermer={() => setCompteActif(null)}
              onSupprime={() => setCompteActif(null)}
            />
          </div>
        </div>

        <IndicateursSoldes />

        <footer className="pb-6 text-center text-xs text-rif-400">
          Console Bancaire Rif - Ahmed Benidar - TP 16 React avec GraphQL et Apollo Client
        </footer>
      </main>
    </div>
  );
}

export default App;
