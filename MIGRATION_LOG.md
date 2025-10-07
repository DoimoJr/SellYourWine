# Log di Migrazione Progetto - Wine Marketplace

## Problema Identificato
Il progetto si trova in `/Users/doimo/Desktop/SYW` che è sincronizzato con **iCloud Desktop**.

iCloud causa:
- Lock continui sui file durante la sincronizzazione
- Timeout nell'installazione delle dipendenze con pnpm
- File corrotti o incompleti in `node_modules`
- Impossibilità di completare `pnpm install`

## Soluzione in Corso
**Spostare il progetto FUORI dalla cartella Desktop sincronizzata con iCloud**

### Passi Completati ✅
1. ✅ Terminati tutti i processi in background (API, Web, npm install)
2. ✅ Rimossi tutti i `node_modules` e `pnpm-lock.yaml`

### Passi da Completare 🔄
3. 🔄 **MANUALMENTE**: Spostare il progetto in una cartella NON sincronizzata con iCloud
   - Consigliato: `~/Dev/SYW` o `~/Projects/SYW`
4. ⏳ Pulire lo store globale pnpm: `pnpm store prune --force`
5. ⏳ Reinstallare dipendenze: `pnpm install`
6. ⏳ Generare client Prisma: `pnpm --filter database db:generate`
7. ⏳ Avviare i servizi: `pnpm dev`

## Comandi da Eseguire nella Nuova Posizione

```bash
# 1. Vai nella nuova cartella
cd ~/Dev/SYW  # (o dove hai spostato il progetto)

# 2. Pulisci lo store globale pnpm
pnpm store prune --force

# 3. Installa le dipendenze (dovrebbe essere MOLTO più veloce ora)
pnpm install

# 4. Genera il client Prisma
pnpm --filter database db:generate

# 5. Avvia i servizi (API su :3010, Web su :3000)
pnpm dev
```

## Note Importanti
- **NON** lavorare mai su progetti Node.js in cartelle sincronizzate con iCloud/Dropbox/OneDrive
- La struttura del progetto è rimasta identica
- Il codice sorgente è intatto
- Solo i `node_modules` e `pnpm-lock.yaml` sono stati rimossi e verranno ricreati

## Stato Corrente
- Progetto originale: `/Users/doimo/Desktop/SYW`
- Aspettando lo spostamento manuale in una cartella locale
- Una volta spostato, procedere con i comandi sopra

---
**Data**: 2025-10-06
**Problema Root Cause**: iCloud Desktop Sync
**Soluzione**: Migrazione a cartella locale
