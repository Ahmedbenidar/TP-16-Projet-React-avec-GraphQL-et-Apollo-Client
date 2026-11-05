export const formaterMontant = (valeur) => {
  const nombre = Number(valeur ?? 0);
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 2
  }).format(nombre);
};

export const formaterDate = (valeur) => {
  if (!valeur) {
    return 'date inconnue';
  }
  const francais = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(valeur).trim());
  const date = francais
    ? new Date(Number(francais[3]), Number(francais[2]) - 1, Number(francais[1]))
    : new Date(valeur);
  if (Number.isNaN(date.getTime())) {
    return valeur;
  }
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const dateDuJour = () => new Date().toISOString().slice(0, 10);

export const messageErreur = (erreur) => {
  if (!erreur) {
    return null;
  }
  const graphQl = erreur.graphQLErrors?.[0]?.message;
  if (graphQl) {
    return graphQl;
  }
  if (erreur.networkError) {
    return 'API GraphQL injoignable, verifiez que le service tourne sur le port 8090';
  }
  return erreur.message ?? 'Erreur inattendue';
};
