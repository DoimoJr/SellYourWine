# SellYourWine API - Postman Collection

Questa cartella contiene la collection Postman completa per testare tutte le API del backend SellYourWine.

## File Inclusi

### 1. `SellYourWine-API.postman_collection.json`
Collection completa con tutti gli endpoints organizzati per categorie:

- **Authentication** - Login, registrazione, refresh token, password reset
- **Cart Management** - Gestione carrello completa (CRUD)
- **Products** - Catalogo prodotti e gestione inventory
- **Categories** - Gestione categorie prodotti
- **Orders** - Creazione e gestione ordini
- **Addresses** - Gestione indirizzi utente
- **Sellers** - Profili venditori
- **Inventory** - Gestione stock e inventario
- **Product Images** - Gestione immagini prodotti
- **System** - Health check e monitoraggio

### 2. `SellYourWine-Environment.postman_environment.json`
Environment di sviluppo con tutte le variabili pre-configurate:

- `base_url`: http://localhost:3000
- `access_token`: Token JWT (auto-popolato dopo login)
- `refresh_token`: Refresh token (auto-popolato dopo login)
- `user_id`: ID utente corrente
- `test_email`: test@example.com
- `test_password`: password123
- Sample IDs per testing (prodotti, seller, categorie, etc.)

## Come Importare in Postman

### 1. Importa la Collection
1. Apri Postman
2. Click su **Import** (in alto a sinistra)
3. Drag & drop o seleziona `SellYourWine-API.postman_collection.json`
4. Click **Import**

### 2. Importa l'Environment
1. Click sull'icona **Environments** (sidebar sinistra)
2. Click **Import**
3. Seleziona `SellYourWine-Environment.postman_environment.json`
4. Click **Import**
5. Seleziona l'environment "SellYourWine - Development" dal dropdown

## Workflow di Testing Consigliato

### 1. Setup Iniziale
```
1. Health Check → Verifica che il server sia attivo
2. Get All Products → Popola sample_product_id
3. Get All Categories → Popola sample_category_id
```

### 2. Autenticazione
```
1. Register User → Crea nuovo utente e ottiene token
   O
2. Login → Usa credenziali esistenti
3. (Opzionale) Demo Login → Per testing rapido
```

### 3. Test Carrello
```
1. Get Cart → Crea/ottieni carrello utente
2. Add Item to Cart → Aggiungi prodotto
3. Update Cart Item Quantity → Modifica quantità
4. Remove Item from Cart → Rimuovi singolo prodotto
5. Clear Cart → Svuota carrello
```

### 4. Gestione Indirizzi
```
1. Create Address → Crea indirizzo (necessario per ordini)
2. Get My Addresses → Lista indirizzi utente
```

### 5. Creazione Ordini
```
1. Add Item to Cart → Aggiungi prodotti al carrello
2. Create Order from Cart → Converti carrello in ordine
3. Get My Orders → Visualizza ordini
```

## Funzionalità Avanzate

### Auto-population delle Variabili
La collection include script automatici che:
- Salvano i token JWT dopo login/registrazione
- Popolano gli ID dei sample data (prodotti, categorie, etc.)
- Gestiscono automaticamente l'autenticazione Bearer

### Scripts Inclusi
- **Pre-request Scripts**: Preparazione automatica delle richieste
- **Test Scripts**: Validazione risposte e salvataggio variabili
- **Environment Management**: Gestione automatica token e ID

### Esempi di Body Request
Tutti i request body sono precompilati con esempi realistici:
- Registrazione utenti
- Creazione prodotti con metadati vino
- Indirizzi italiani
- Dati carrello e ordini

## Configurazione per Ambienti Diversi

### Development (default)
- Base URL: http://localhost:3000
- Database: PostgreSQL locale

### Staging/Production
Per altri ambienti, duplica l'environment e modifica:
- `base_url`: URL del server
- Eventuali credenziali specifiche

## Debugging e Troubleshooting

### Token Scaduto
Se ricevi errori 401:
1. Usa "Refresh Token" per rinnovare
2. O rifai "Login" per ottenere nuovi token

### Dati di Test
Gli ID di sample sono preconfigurati con i dati del database demo.
Se il database è vuoto, alcuni test potrebbero fallire.

### CORS Issues  
Assicurati che il server abbia CORS abilitato per le chiamate da Postman.

## Contribuzione

Per aggiornare la collection:
1. Modifica le richieste in Postman
2. Export della collection aggiornata
3. Sostituisci il file JSON
4. Aggiorna questo README se necessario

---

**Nota**: Questa collection è sincronizzata con l'implementazione corrente dell'API SellYourWine e include tutte le funzionalità implementate: autenticazione JWT con refresh token, password reset, e sistema carrello completo.