package ma.ahmedbenidar.tp16.outils;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Date;

public final class ConvertisseurDates {

    private static final DateTimeFormatter AFFICHAGE = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter[] ACCEPTES = {
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd"),
            DateTimeFormatter.ofPattern("dd/MM/yyyy")
    };

    private ConvertisseurDates() {
    }

    public static Date versDate(String texte) {
        if (texte == null || texte.isBlank()) {
            return new Date();
        }
        String valeur = texte.trim();
        for (DateTimeFormatter format : ACCEPTES) {
            try {
                LocalDate locale = LocalDate.parse(valeur, format);
                return Date.from(locale.atStartOfDay(ZoneId.systemDefault()).toInstant());
            } catch (DateTimeParseException ignored) {
                // on essaie le format suivant
            }
        }
        throw new IllegalArgumentException("Date invalide : " + texte + ". Formats acceptes : aaaa-MM-jj ou jj/MM/aaaa");
    }

    public static String versTexte(Date date) {
        if (date == null) {
            return null;
        }
        LocalDate locale;
        if (date instanceof java.sql.Date sqlDate) {
            locale = sqlDate.toLocalDate();
        } else {
            locale = date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        }
        return locale.format(AFFICHAGE);
    }
}
