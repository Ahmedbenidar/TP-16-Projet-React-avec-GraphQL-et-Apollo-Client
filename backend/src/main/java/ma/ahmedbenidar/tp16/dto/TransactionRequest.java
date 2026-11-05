package ma.ahmedbenidar.tp16.dto;

import ma.ahmedbenidar.tp16.entites.TypeTransaction;

public record TransactionRequest(
        Long compteId,
        double montant,
        String date,
        TypeTransaction type
) {
}
