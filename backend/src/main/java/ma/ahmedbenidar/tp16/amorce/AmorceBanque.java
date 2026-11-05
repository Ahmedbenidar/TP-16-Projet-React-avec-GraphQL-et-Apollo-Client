package ma.ahmedbenidar.tp16.amorce;

import ma.ahmedbenidar.tp16.depots.CompteDepot;
import ma.ahmedbenidar.tp16.depots.TransactionDepot;
import ma.ahmedbenidar.tp16.entites.Compte;
import ma.ahmedbenidar.tp16.entites.Transaction;
import ma.ahmedbenidar.tp16.entites.TypeCompte;
import ma.ahmedbenidar.tp16.entites.TypeTransaction;
import ma.ahmedbenidar.tp16.outils.ConvertisseurDates;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AmorceBanque implements CommandLineRunner {

    private static final Logger JOURNAL = LoggerFactory.getLogger(AmorceBanque.class);

    private final CompteDepot compteDepot;
    private final TransactionDepot transactionDepot;

    public AmorceBanque(CompteDepot compteDepot, TransactionDepot transactionDepot) {
        this.compteDepot = compteDepot;
        this.transactionDepot = transactionDepot;
    }

    @Override
    public void run(String... args) {
        if (compteDepot.count() > 0) {
            return;
        }

        List<Compte> comptes = List.of(
                compte("Ahmed Benidar", 12450.00, "2026-01-09", TypeCompte.COURANT),
                compte("Hajar Belkacem", 48750.75, "2026-02-14", TypeCompte.EPARGNE),
                compte("Omar Rifai", 6320.40, "2026-03-02", TypeCompte.COURANT),
                compte("Sanae Ait Yahia", 97500.00, "2026-03-27", TypeCompte.EPARGNE),
                compte("Atelier Rif Numerique", 21640.10, "2026-04-18", TypeCompte.PROFESSIONNEL)
        );
        compteDepot.saveAll(comptes);

        transactionDepot.saveAll(List.of(
                transaction(3200.00, "2026-05-06", TypeTransaction.DEPOT, comptes.get(0)),
                transaction(950.00, "2026-05-22", TypeTransaction.RETRAIT, comptes.get(0)),
                transaction(12000.00, "2026-06-03", TypeTransaction.DEPOT, comptes.get(1)),
                transaction(1750.25, "2026-06-21", TypeTransaction.RETRAIT, comptes.get(1)),
                transaction(640.00, "2026-07-08", TypeTransaction.DEPOT, comptes.get(2)),
                transaction(5400.00, "2026-07-27", TypeTransaction.DEPOT, comptes.get(4))
        ));

        JOURNAL.info("Amorcage termine : {} comptes et {} transactions de demonstration",
                compteDepot.count(), transactionDepot.count());
    }

    private Compte compte(String titulaire, double solde, String date, TypeCompte type) {
        Compte compte = new Compte();
        compte.setTitulaire(titulaire);
        compte.setSolde(solde);
        compte.setDateCreation(ConvertisseurDates.versDate(date));
        compte.setType(type);
        return compte;
    }

    private Transaction transaction(double montant, String date, TypeTransaction type, Compte compte) {
        Transaction transaction = new Transaction();
        transaction.setMontant(montant);
        transaction.setDate(ConvertisseurDates.versDate(date));
        transaction.setType(type);
        transaction.setCompte(compte);
        return transaction;
    }
}
