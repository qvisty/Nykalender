# Nykalender – Claude Code Instructions

## Git Workflow

### Hvornår skal Claude committe og pushe?

Commit og push **efter** en logisk afsluttet enhed:

- En komplet bugfix
- En ny feature er implementeret og testet
- En refaktorering der giver mening som én enhed
- Alle relaterede filer er opdateret (fx komponent + test + styles)

Commit **ikke** for:
- Midtvejs i en feature (halv implementation)
- Kun whitespace/formatering ændringer alene
- Eksperimentel kode der ikke er klar

### Commit-besked format

```
<kort beskrivelse af hvad der er lavet>

- Bullet point med detalje 1
- Bullet point med detalje 2
```

Hold første linje under 72 tegn. Skriv på dansk eller engelsk.

### Branch strategi

- Udvikling sker på `claude/...`-branchen
- Merge til `main` sker via pull request i Gitea web UI
- Push altid med: `git push -u origin <branch-navn>`

## Projekt

**Nykalender** – kalenderapplikation.

Tilføj projektspecifikke instruktioner her efterhånden som projektet vokser.
