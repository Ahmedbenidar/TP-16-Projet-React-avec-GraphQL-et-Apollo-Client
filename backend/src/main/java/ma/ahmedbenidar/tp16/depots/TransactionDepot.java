package ma.ahmedbenidar.tp16.depots;

import ma.ahmedbenidar.tp16.entites.Compte;
import ma.ahmedbenidar.tp16.entites.Transaction;
import ma.ahmedbenidar.tp16.entites.TypeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransactionDepot extends JpaRepository<Transaction, Long> {

    List<Transaction> findByCompteOrderByDateDesc(Compte compte);

    @Query("select coalesce(sum(t.montant), 0) from Transaction t where t.type = :type")
    double sommeParType(@Param("type") TypeTransaction type);

    @Query("select coalesce(sum(t.montant), 0) from Transaction t where t.compte = :compte and t.type = :type")
    double sommeParCompteEtType(@Param("compte") Compte compte, @Param("type") TypeTransaction type);
}
