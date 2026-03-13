# Nykalender – Claude Code Instructions

## TDD-udviklingsflow

Følg **altid** dette flow. Spring **ingen** trin over.

Der er to spor afhængigt af commit-typen:

| Type | Eksempler | Spor |
|---|---|---|
| `feat:` | ny UI-funktion, ny side | Kræver brugerverifikation i UI |
| `fix:` `refactor:` `chore:` `test:` | bugfix, oprydning, infrastruktur | Automatisk efter grønne tests |

---

### Trin 1 — Planlæg

- Beskriv hvad der skal laves
- Identificer hvilke filer der berøres
- Aftal med brugeren hvad "done" betyder

---

### Trin 2 — Skriv tests først

Opret eller opdater testfilen **før** implementeringen.

- Tests skal beskrive den ønskede adfærd, ikke implementeringen
- Kør tests og bekræft at de **fejler** (red)
- Eksempel: `npm test -- --testPathPattern=<filnavn>`

---

### Trin 3 — Implementer

- Skriv den mindste mængde kode der får testene til at bestå
- Kør tests løbende under implementeringen

---

### Trin 4 — Alle tests grønne

Kør den **fulde** testsuite og bekræft at alle tests består:

```bash
npm test
```

Commit **ikke** hvis der er fejlende tests.

---

### Trin 5a — Automatisk commit (fix / refactor / chore / test)

Når alle tests er grønne, commit og push **med det samme** uden at vente på brugerbekræftelse:

```bash
.claude/hooks/commit-and-push.sh "<beskrivende commit-besked>"
```

---

### Trin 5b — Brugerverifikation i UI (kun feat:)

Kun for `feat:`-commits: send følgende besked til brugeren og **vent**:

```
✅ Alle tests er grønne.

Kan du bekræfte at det virker i brugerfladen?

👉 Åbn: http://localhost:<PORT>/<sti-til-relevant-side>

Hvad der er ændret:
- [beskriv konkret hvad brugeren skal kigge efter]

Svar 'ok' eller beskriv eventuelle problemer, inden jeg committer.
```

Når brugeren siger ok:

```bash
.claude/hooks/commit-and-push.sh "<beskrivende commit-besked>"
```

---

### Commit-besked format

- Starte med typen: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`
- Kort beskrive hvad der er lavet (under 72 tegn)
- Eksempel: `feat: tilføj 'Ny begivenhed'-knap til kalendervisning`

---

### Merge til main

Push til `claude/`-branchen sker automatisk via scriptet.
**Merge til `main` sker via pull request i GitHub web UI** — ikke automatisk (platformbegrænsning).

---

## Regler

| Regel | Beskrivelse |
|---|---|
| Tests først | Skriv altid tests inden implementering |
| Grønne tests | Commit kun når alle tests består |
| feat: kræver UI-ok | Vent på brugerens bekræftelse før commit af nye features |
| fix/chore/refactor: auto | Commit automatisk når tests er grønne |
| Én ting ad gangen | Commit én logisk enhed — ikke flere features i én commit |
| Ingen halvfærdige commits | Commit ikke midtvejs i en feature |

## Lokale URL-mønstre

Opdater disse efterhånden som projektet vokser:

| Side | Lokal URL |
|---|---|
| Startside / kalender | `http://localhost:3000/` |
| *(tilføj flere efterhånden)* | |

## Projektoversigt

**Nykalender** — kalenderapplikation (webapp).

Tilføj projektspecifikke noter her efterhånden som arkitekturen tager form.
