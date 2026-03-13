# Nykalender – Claude Code Instructions

## TDD-udviklingsflow

Følg **altid** dette flow for nye features og rettelser. Spring **ingen** trin over.

---

### Trin 1 — Planlæg

- Beskriv hvad der skal laves (feature eller bugfix)
- Identificer hvilke filer der berøres
- Aftal med brugeren hvad "done" betyder

---

### Trin 2 — Skriv tests først

Opret eller opdater testfilen **før** implementeringen.

- Test skal beskrive den ønskede adfærd, ikke implementeringen
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

### Trin 5 — Brugerverifikation i UI (OBLIGATORISK)

Når alle tests er grønne, send følgende besked til brugeren:

```
✅ Alle tests er grønne.

Kan du bekræfte at det virker i brugerfladen?

👉 Åbn: http://localhost:<PORT>/<sti-til-relevant-side>

Hvad der er ændret:
- [beskriv konkret hvad brugeren skal kigge efter, fx "ny 'Tilføj begivenhed'-knap i øverste højre hjørne"]
- [eventuelle yderligere ændringer]

Svar 'ok' eller beskriv eventuelle problemer, inden jeg committer.
```

**Vent på brugerens svar. Commit ikke endnu.**

---

### Trin 6 — Commit og push (kun efter brugerbekræftelse)

Når brugeren har bekræftet at det virker i UI:

```bash
.claude/hooks/commit-and-push.sh "<beskrivende commit-besked>"
```

Commit-beskeden skal:
- Starte med typen: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`
- Kort beskrive hvad der er lavet (under 72 tegn)
- Eksempel: `feat: tilføj 'Ny begivenhed'-knap til kalendervisning`

---

### Trin 7 — Merge til main

Push til `claude/`-branchen sker automatisk via scriptet.
**Merge til `main` sker via pull request i Gitea web UI** — ikke automatisk.

---

## Regler

| Regel | Beskrivelse |
|---|---|
| Tests først | Skriv altid tests inden implementering |
| Grønne tests | Commit kun når alle tests består |
| Brugerverifikation | Vent altid på brugerens ok fra UI |
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
