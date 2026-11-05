package ma.ahmedbenidar.tp16.controleurs;

import ma.ahmedbenidar.tp16.depots.CompteDepot;
import ma.ahmedbenidar.tp16.depots.TransactionDepot;
import ma.ahmedbenidar.tp16.dto.CompteRequest;
import ma.ahmedbenidar.tp16.dto.CompteVue;
import ma.ahmedbenidar.tp16.dto.TransactionRequest;
import ma.ahmedbenidar.tp16.dto.TransactionVue;
import ma.ahmedbenidar.tp16.entites.Compte;
import ma.ahmedbenidar.tp16.entites.Transaction;
import ma.ahmedbenidar.tp16.entites.TypeCompte;
import ma.ahmedbenidar.tp16.entites.TypeTransaction;
import ma.ahmedbenidar.tp16.outils.ConvertisseurDates;
import ma.ahmedbenidar.tp16.outils.MappeurBanque;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Controller
public class BanqueControllerGraphQL {

    private final CompteDepot compteDepot;
    private final TransactionDepot transactionDepot;

    public BanqueControllerGraphQL(CompteDepot compteDepot, TransactionDepot transactionDepot) {
        this.compteDepot = compteDepot;
        this.transactionDepot = transactionDepot;
    }

    @QueryMapping
    public List<CompteVue> allComptes() {
        return MappeurBanque.versVues(compteDepot.findAll());
    }

    @QueryMapping
    public CompteVue compteById(@Argument Long id) {
        Compte compte = compteDepot.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Compte " + id + " introuvable"));
        return MappeurBanque.versVue(compte);
    }

    @QueryMapping
    public List<CompteVue> comptesParType(@Argument TypeCompte type) {
        return MappeurBanque.versVues(compteDepot.findByTypeOrderBySoldeDesc(type));
    }

    @QueryMapping
    public List<CompteVue> rechercherComptes(@Argument String fragment) {
        return MappeurBanque.versVues(compteDepot.findByTitulaireContainingIgnoreCase(fragment));
    }

    @QueryMapping
    public Map<String, Object> totalSolde() {
        long nombre = compteDepot.count();
        double somme = compteDepot.sommeSoldes();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("count", nombre);
        stats.put("sum", somme);
        stats.put("average", nombre > 0 ? somme / nombre : 0.0);
        stats.put("max", compteDepot.soldeMaximal());
        stats.put("min", compteDepot.soldeMinimal());
        return stats;
    }

    @QueryMapping
    public List<TransactionVue> compteTransactions(@Argument Long id) {
        Compte compte = compteDepot.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Compte " + id + " introuvable"));
        return MappeurBanque.versTransactionVues(transactionDepot.findByCompteOrderByDateDesc(compte));
    }

    @QueryMapping
    public List<TransactionVue> allTransactions() {
        return MappeurBanque.versTransactionVues(transactionDepot.findAll());
    }

    @QueryMapping
    public Map<String, Object> transactionStats() {
        double depots = transactionDepot.sommeParType(TypeTransaction.DEPOT);
        double retraits = transactionDepot.sommeParType(TypeTransaction.RETRAIT);
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("count", transactionDepot.count());
        stats.put("sumDepots", depots);
        stats.put("sumRetraits", retraits);
        stats.put("soldeNet", depots - retraits);
        return stats;
    }

    @QueryMapping
    public Map<String, Object> tableauBord() {
        List<Compte> comptes = compteDepot.findAll();
        List<Map<String, Object>> repartition = Arrays.stream(TypeCompte.values())
                .map(type -> {
                    List<Compte> duType = comptes.stream().filter(c -> c.getType() == type).toList();
                    Map<String, Object> ligne = new LinkedHashMap<>();
                    ligne.put("type", type);
                    ligne.put("nombre", duType.size());
                    ligne.put("solde", duType.stream().mapToDouble(Compte::getSolde).sum());
                    return ligne;
                })
                .toList();

        Map<String, Object> tableau = new LinkedHashMap<>();
        tableau.put("nombreComptes", comptes.size());
        tableau.put("nombreTransactions", transactionDepot.count());
        tableau.put("soldeTotal", comptes.stream().mapToDouble(Compte::getSolde).sum());
        tableau.put("repartition", repartition);
        return tableau;
    }

    @MutationMapping
    public CompteVue saveCompte(@Argument CompteRequest compte) {
        if (compte == null) {
            throw new IllegalArgumentException("Le compte transmis est vide");
        }
        if (compte.titulaire() == null || compte.titulaire().isBlank()) {
            throw new IllegalArgumentException("Le titulaire du compte est obligatoire");
        }
        if (compte.solde() < 0) {
            throw new IllegalArgumentException("Le solde initial ne peut pas etre negatif");
        }
        Compte entite = new Compte();
        entite.setTitulaire(compte.titulaire().trim());
        entite.setSolde(compte.solde());
        entite.setDateCreation(ConvertisseurDates.versDate(compte.dateCreation()));
        entite.setType(compte.type() == null ? TypeCompte.COURANT : compte.type());
        return MappeurBanque.versVue(compteDepot.save(entite));
    }

    @MutationMapping
    public TransactionVue addTransaction(@Argument TransactionRequest transaction) {
        if (transaction == null) {
            throw new IllegalArgumentException("La transaction transmise est vide");
        }
        if (transaction.compteId() == null) {
            throw new IllegalArgumentException("L identifiant du compte est obligatoire");
        }
        Compte compte = compteDepot.findById(transaction.compteId())
                .orElseThrow(() -> new IllegalArgumentException("Compte " + transaction.compteId() + " introuvable"));
        if (transaction.montant() <= 0) {
            throw new IllegalArgumentException("Le montant de la transaction doit etre positif");
        }
        TypeTransaction type = transaction.type() == null
                ? TypeTransaction.DEPOT
                : transaction.type();

        if (type == TypeTransaction.RETRAIT && transaction.montant() > compte.getSolde()) {
            throw new IllegalArgumentException("Retrait refuse : solde insuffisant sur le compte " + compte.getId());
        }

        compte.setSolde(type == TypeTransaction.DEPOT
                ? compte.getSolde() + transaction.montant()
                : compte.getSolde() - transaction.montant());
        compteDepot.save(compte);

        Transaction entite = new Transaction();
        entite.setMontant(transaction.montant());
        entite.setDate(ConvertisseurDates.versDate(transaction.date()));
        entite.setType(type);
        entite.setCompte(compte);
        return MappeurBanque.versVue(transactionDepot.save(entite));
    }

    @MutationMapping
    public Boolean supprimerCompte(@Argument Long id) {
        if (!compteDepot.existsById(id)) {
            throw new IllegalArgumentException("Compte " + id + " introuvable");
        }
        compteDepot.deleteById(id);
        return Boolean.TRUE;
    }

    @SchemaMapping(typeName = "Compte", field = "transactions")
    public List<TransactionVue> transactionsDuCompte(CompteVue compte) {
        return MappeurBanque.versTransactionVues(
                transactionDepot.findByCompteOrderByDateDesc(compteDepot.getReferenceById(compte.id())));
    }
}
