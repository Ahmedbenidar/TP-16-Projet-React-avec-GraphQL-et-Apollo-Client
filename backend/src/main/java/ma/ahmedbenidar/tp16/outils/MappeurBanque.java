package ma.ahmedbenidar.tp16.outils;

import ma.ahmedbenidar.tp16.dto.CompteVue;
import ma.ahmedbenidar.tp16.dto.TransactionVue;
import ma.ahmedbenidar.tp16.entites.Compte;
import ma.ahmedbenidar.tp16.entites.Transaction;

import java.util.List;

public final class MappeurBanque {

    private MappeurBanque() {
    }

    public static CompteVue versVue(Compte compte) {
        return new CompteVue(
                compte.getId(),
                compte.getTitulaire(),
                compte.getSolde(),
                ConvertisseurDates.versTexte(compte.getDateCreation()),
                compte.getType()
        );
    }

    public static List<CompteVue> versVues(List<Compte> comptes) {
        return comptes.stream().map(MappeurBanque::versVue).toList();
    }

    public static TransactionVue versVue(Transaction transaction) {
        return new TransactionVue(
                transaction.getId(),
                transaction.getMontant(),
                ConvertisseurDates.versTexte(transaction.getDate()),
                transaction.getType(),
                versVue(transaction.getCompte())
        );
    }

    public static List<TransactionVue> versTransactionVues(List<Transaction> transactions) {
        return transactions.stream().map(MappeurBanque::versVue).toList();
    }
}
