# Artiklite Haldamise Rakendus – Praktika 5. Backend / Frontend
**Autor:** tKozuhhar<br>
**Kursus:** Veebiprogrammeerimine<br>

## Projekti kirjeldus
See on **SPA** (Single Page Application), mis võimaldab kasutajatel hallata artikleid ja kommentaare. Rakendus võimaldab kasutajate registreerimist ja **autentimist JWT** abil ning toetab kahte **kasutajarolli**: Admin ja User. Administraator võib luua, redigeerida ja kustutada kõikide kasutajate artikleid ja kommentaare, kuid kasutaja võib lisada, redigeerida ja kustutada ainult oma artikleid ja kommentaare. Kasutajaliides on reaktiivne ning loodud **Bootstrapi** abil.<br>

Kasutatud tehnoloogiad:
- **Node.js** + **Express.js** (serveri loogika — backend, REST API)
- **Sequelize ORM** + **MSSQL** (andmebaasi haldus)
- **React 19** (kasutajaliidese loomiseks — frontend)
- **React Router DOM 7** (SPA navigeerimiseks — kliendipoolne routing)
- **Axios** (HTTP-päringute tegemiseks — frontend ja backend API päringud)
- **JWT-decode** (JWT tokeni dekodeerimiseks — kasutaja autentimise haldamiseks)
- **bcryptjs** (paroolide krüpteerimine)
- **dotenv** (keskkonnamuutujate haldus)
- **Bootstrap** (UI kujundamiseks)
- **CORS** (ristdomeeni päringute lubamiseks)

Projekti struktuur:<br>
projekt/
- config/                   # Andmebaasi ja muu konfiguratsiooni failid
    - database.js               # Andmebaasi ühenduse konfiguratsioon
- middleware/               # Middleware funktsioonid
    - auth.js                   # Autentimise vahevara
- models/                   # Andmemudelid Sequelize abil
    - Article.js                # Artikli mudel
    - Comment.js                # Kommentaari mudel
    - index.js                  # Mudelite indekseerimisfail (ühendamine)
    - User.js                   # Kasutaja mudel
- public/                       # Staatilised failid frontendile
- routes/                   # API marsruudid
    - articles.js               # Marsruudid artiklitega töötamiseks
    - auth.js                   # Registreerimise ja sisselogimise marsruudid
    - comments.js               # Marsruudid kommentaaridega töötamiseks
- src/                      # Kõik Reacti lähtekoodid
    - components/               # React komponendid
        - ArticlePage.js          # Artikli detailvaade koos kommentaaride haldusega 
        - Articles.js             # Artiklite kuvamine ja loomine
        - AuthContext.js          # Autentimise oleku ja kasutajaandmete haldus (kontekst)
        - Home.js                 # Avalehte koos slaidiseeria ja tervitustekstiga
        - Signin.js               # Kasutaja sisselogimine
        - Signup.js               # Kasutaja registreerimisvorm
    - images/                   # Pildid frontendile
    - App.css                   # App stiilid
    - App.js                    # Peamine React komponent
    - index.css                 # Globaalne stiil
    - index.js                  # React rakenduse sisenemispunkt
    - reportWebVitals.js        # Abi fail Reacti mõõdikute jaoks
  .gitignore                    # Failid, mida Git ignoreerib<br>
  .env                          # Keskkonnamuutujad (on vaja luua)<br>
  package-lock.json             # Parandatud paketiversioonid<br>
  package.json                  # Projekti sõltuvused ja skriptid<br>
  README.md                     # Projekti dokumentatsioon<br>
  server.js                     # Backend'i käivitusfail<br>

Vastavus ülesande nõuetele:
- RESTful API artiklite haldamiseks
- JWT autentimine ja autoriseerimine
- Registreerimisvorm põhiliste väljadega: e-post, parool, parooli kinnitus
- Kasutajate rollid: Admin ja User
- Artiklite loomine, muutmine ja kustutamine (Artikli omanik)
- Artiklite loomine ja muutmine (Admin: ainult oma artikleid)
- Artiklite kustutamine (Admin: kõik)
- Kommentaaride lisamine, muutmine ja kustutamine (Artikli omanik)
- Kommentaaride lisamine ja muutmine (Admin: ainult oma kommentaare)
- Kommentaaride kustutamine (Admin: kõik)
- API dokumentatsioon (käsitsi lisatud README-sse)
- Projekt GitHub'is koos README failiga

## INSTALLIMA. Kuidas käivitada
Lae projekt alla https://github.com/tKozuhhar/Praktika5_Articles <br>
Paigaldakse Node.js (LTS) järgmiselt lingilt: https://nodejs.org/en <br>
LTS (Long Term Support) on stabiilne versioon pikaajalise toega. Soovitatav enamiku kasutajate jaoks.<br>
Pärast seda paigalda Microsoft SQL Server Management, kui seda ei ole, ja paketid projektis: <br>
`npm install` <br>
`npm install react react-dom` <br>
`npm install react router-dom` <br>
`npm install cors` <br>
`npm install bcryptjs` <br>
`npm install axios` <br>
`npm install jwt-decode` <br>

Loo ".env" fail järgmine sisuga: <br>
`DB_HOST = your_localhost` <br>
`DB_PORT = your_db_port` <br>
`DB_NAME = your_db_name` <br>
`DB_USER = your_db_user` <br>
`DB_PASSWORD = your_db_password` <br>
`JWT_SECRET = your_salajane_sone` <br>
`PORT = 3002` <br>

Pärast seda kasutatakse käsk CMD-is (serveri käivitamiseks käsurealt tuleb olla projekti kaustas): <br>
`cd C:\Users\dungeon girl-master\..\whip\..\...` (käsk projekti kataloogi (kausta) sisenemiseks) <br>
`node server.js` (serveri käivitamise käsk) <br>

Pärast seda kasutatakse käsk (näiteks) VSC-is: <br>
`npm start` (frontendi käivitamise käsk) <br>
(Serveri aadress - `http://localhost:3002/`) <br>

## Autentimine
Autentimine toimub JWT tokeni abil. Kasutaja saab tokeni sisselogimisel ja peab selle lisama iga kaitstud päringusse Authorization päisesse kujul:<br>
`Authorization: Bearer <token>` <br>

## API Endpointide dokumentatsioon
| **Meetod** | **URL**                   | **Kirjeldus**                                  | **Ligipääs**               |
|------------|---------------------------|------------------------------------------------|----------------------------|
| POST       | `/auth/register`          | Registreeri uus kasutaja                       | Avalik                     |
| POST       | `/auth/login`             | Kasutaja sisselogimine (tagastab JWT)          | Avalik                     |
| POST       | `/articles`               | Artikli loomine                                | Kaitstud (Kasutaja)        |
| GET        | `/articles`               | Kõigi artiklite saamine                        | Avalik                     |
| GET        | `/articles/:id`           | Artikli detailvaade ID järgi                   | Avalik                     |
| PUT        | `/articles/:id`           | Artikli uuendamine (ainult autor)              | Kaitstud (Kasutaja)        |
| DELETE     | `/articles/:id`           | Artikli kustutamine (autor või administraator) | Kaitstud (Kasutaja/Admin)  |
| POST       | `/comments/:articleId`    | Lisa kommentaar artiklile                      | Kaitstud (Kasutaja/Admin)  |
| GET        | `/comments/:articleId`    | Kommentaaride vaatamine artikli kohta          | Avalik                     |
| PUT        | `/comments/:commentId`    | Kommentaari muutmine (ainult autor)            | Kaitstud (Autor)           |
| DELETE     | `/comments/:commentId`    | Kommentaari kustutamine                        | Kaitstud (Autor/Admin)     |

### Artikli loomine
POST /articles <br>
Kaitstud — vaja JWT tokenit.<br>

Keha (JSON):<br>
{<br>
  "title": "Minu uus artikkel",<br>
  "content": "Sisu siia"<br>
}<br>

Vastus:<br>
{<br>
  "id": 1,<br>
  "title": "Minu uus artikkel",<br>
  "content": "Sisu siia",<br>
  "userId": 4<br>
}<br>

### Kõik artiklid
GET /articles<br>
Avalik — tagastab kõik artiklid koos autori e-postiga.<br>

Vastus:<br>
[<br>
  {<br>
    "id": 1,<br>
    "title": "Pealkiri",<br>
    "content": "Sisu",<br>
    "userId": 2,<br>
    "User": {<br>
      "email": "kasutaja@email.com"<br>
    }<br>
  }<br>
]<br>

### Artikli vaatamine ID alusel
GET /articles/:id<br>
Avalik — näitab konkreetset artiklit koos autori andmetega.<br>

Vastus:<br>
{<br>
  "id": 1,<br>
  "title": "Pealkiri",<br>
  "content": "Sisu",<br>
  "userId": 4,<br>
  "User": {<br>
    "id": 4,<br>
    "email": "kasutaja@email.com",<br>
    "role": "Roll",<br>
    "createdAt": "...",<br>
    "updatedAt": "..."<br>
  }<br>
}<br>

### Artikli muutmine
PUT /articles/:id<br>
Kaitstud — ainult autor saab muuta.<br>

Keha:<br>
{<br>
  "title": "Uuendatud pealkiri",<br>
  "content": "Uus sisu"<br>
}<br>

Vastus:<br>
{<br>
  "message": "Статья обновлена",<br>
  "article": {<br>
    "id": 1,<br>
    "title": "Uuendatud pealkiri",<br>
    "content": "Uus sisu",<br>
    "userId" 4<br>
  }<br>
}<br>

### Artikli kustutamine
DELETE /articles/:id<br>
Kaitstud — autor saab kustutada oma artikli, Admin saab kõik.<br>

Vastus:<br>
{<br>
  "message": "Статья успешно удалена"<br>
}<br>

### Kommentaari lisamine
POST /comments/:articleId<br>
Kaitstud — vaja JWT tokenit.<br>

Keha:<br>
{<br>
  "content": "See on kommentaar"<br>
}<br>

Vastus:<br>
{<br>
  "id": 1,<br>
  "content": "See on kommentaar",<br>
  "userId": 2,<br>
  "articleId": 1,<br>
  "createdAt": "...",<br>
  "updatedAt": "2025-05-27T17:26:40.467Z",<br>
  "User": {<br>
    "id": 2,<br>
    "email": "kasutaja@email.com"<br>
  }<br>
}<br>

### Kommentaaride vaatamine
GET /comments/:articleId<br>
Avalik — tagastab kõik kommentaarid artiklile koos autoriga.<br>

Vastus:<br>
[<br>
  {<br>
    "id": 1,<br>
    "content": "See on kommentaar",<br>
    "createdAt": "...",<br>
    "User": {<br>
      "id": 2,<br>
      "email": "kasutaja@email.com"<br>
    }<br>
  }<br>
]<br>

### Kommentaari muutmine
PUT /comments/:commentId<br>
Kaitstud — ainult autor saab muuta.<br>

Keha:<br>
{<br>
  "content": "Uuendatud kommentaar"<br>
}<br>

Vastus:<br>
{<br>
  "message": "Комментарий обновлён",<br>
  "comment": {<br>
    "id": 1,<br>
    "content": "Uuendatud kommentaar",<br>
    "userId": 1,<br>
    "articleId": 2,<br>
    "createdAt": "...",<br>
    "updatedAt": "...",<br>
    "User": {<br>
      "id": 1,<br>
      "email": "kasutaja@email.com"<br>
    }<br>
  }<br>
}<br>

### Kommentaari kustutamine
DELETE /comments/:commentId<br>
Kaitstud — saab kustutada autor või Admin.<br>

Vastus:<br>
{<br>
  "message": "Комментарий удалён"<br>
}<br>

## Märkused
Andmebaas töötab *Microsoft SQL Server Management Studio* peal.<br>
Admin'i andmed: "admin@example.com","admin123".<br>
Admin'i lisamine cmd'i kaudu (cURL): curl -X POST http://localhost:3001/auth/register -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"admin123\",\"role\":\"Admin\"}"<br>
