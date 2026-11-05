import React from 'react';

const Entete = ({ onRafraichir, enChargement }) => {
  return (
    <header className="border-b border-sable-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rif-600 text-lg font-bold text-white">
            BR
          </div>
          <div>
            <h1 className="text-xl font-bold text-rif-800">Console Bancaire Rif</h1>
            <p className="text-sm text-rif-500">
              React + Apollo Client sur l API GraphQL du TP 16
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="etiquette bg-rif-100 text-rif-700">port 8090</span>
          <button
            type="button"
            onClick={onRafraichir}
            disabled={enChargement}
            className="rounded-lg bg-rif-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rif-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enChargement ? 'Synchronisation...' : 'Rafraichir les donnees'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Entete;
