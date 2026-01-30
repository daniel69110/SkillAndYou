package org.example.skillandyou.entity.enums;

public enum ReportReason {
    SPAM("Spam ou publicité"),
    FRAUD("Fraude ou arnaque"),
    INAPPROPRIATE_BEHAVIOR("Comportement inapproprié"),
    HARASSMENT("Harcèlement"),
    FAKE_PROFILE("Faux profil"),
    INAPPROPRIATE_CONTENT("Contenu inapproprié"),
    OTHER("Autre");

    private final String label;

    ReportReason(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
