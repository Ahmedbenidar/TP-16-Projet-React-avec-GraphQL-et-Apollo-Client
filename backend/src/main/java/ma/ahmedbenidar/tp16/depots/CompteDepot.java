package ma.ahmedbenidar.tp16.depots;

import ma.ahmedbenidar.tp16.entites.Compte;
import ma.ahmedbenidar.tp16.entites.TypeCompte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CompteDepot extends JpaRepository<Compte, Long> {

    List<Compte> findByTypeOrderBySoldeDesc(TypeCompte type);

    List<Compte> findByTitulaireContainingIgnoreCase(String fragment);

    @Query("select coalesce(sum(c.solde), 0) from Compte c")
    double sommeSoldes();

    @Query("select coalesce(max(c.solde), 0) from Compte c")
    double soldeMaximal();

    @Query("select coalesce(min(c.solde), 0) from Compte c")
    double soldeMinimal();
}
