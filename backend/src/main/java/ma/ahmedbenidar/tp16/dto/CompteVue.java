package ma.ahmedbenidar.tp16.dto;

import ma.ahmedbenidar.tp16.entites.TypeCompte;

public record CompteVue(
        Long id,
        String titulaire,
        double solde,
        String dateCreation,
        TypeCompte type
) {
}
