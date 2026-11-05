package ma.ahmedbenidar.tp16.dto;

import ma.ahmedbenidar.tp16.entites.TypeTransaction;

public record TransactionVue(
        Long id,
        double montant,
        String date,
        TypeTransaction type,
        CompteVue compte
) {
}
