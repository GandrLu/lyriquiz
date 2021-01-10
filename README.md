# Lyriquiz

<img src="https://github.com/acidyumyum/lyriquiz/blob/master/src/assets/lyriquiz_logo.png" height="256" width="256">

# Deutsch

## Begrifflichkeiten
Im folgenden werden mehrere Begriffe genutzt um dieselben Dinge zu bezeichnen:
* User, Nutzer - Der per Spotify eingeloggte Benutzer von Lyriquiz
* Song, Lied, Track - Ein Musikstück
* Songtext, Liedtext, Text, Lyric - Der Liedtext eines Musikstückes
* Interpret, Künstler, Artist - Interpret eines Musikstückes

## Konzept
Lyriquiz ist ein Quizspiel welches die meistgehörten Musikstücke und Interpreten vom Spotify Account des Nutzers 
bezieht und auf Basis dieser Daten die Sontexte der Lieder als Frage darstellt. Allerdings werden nur einzelne Zeilen zufällig präsentiert. Der Nutzer bekommt eine Auswahl von vier Antworten dazu angezeigt und muss die richtige auswählen. Nach der Auswahl einer Frage wird farblich angezeigt ob diese richtig oder falsch war. Am Ende einer Runde werden die Punkte angezeigt. Eine Spielrunde besteht zur Zeit aus fünf Fragen und beim Start einer neuen Runde werden wieder neue Textausschnitte ausgewählt.

Im Spielmenü kann außerdem der Gesamtpunktestand eingesehen werden.
Des Weiteren kann eingesehen werden welcher Nutzer aktuell eingeloggt ist, es gibt die Möglichkeit sich wieder aus zu loggen und die Spotify Anmeldemaske bietet die Möglichkeit den Nutzer zu wechseln.
Zugriff auf Lyriquiz erhält man, indem man sich mit einem Spotify Account einloggt.
### Technisches Konzept
Genutzt werden zwei API's: [Spotify](https://developer.spotify.com/) und [Lyrics.ovh](https://lyrics.ovh/).
Die Spotify API bietet neben zahlreichen anderen Informationen eine Liste von maximal 50 der meistgehörten Interpreten oder Lieder eines Nutzers, auswählbar nach Zeitraum `short_term`, `medium_term` und `long_term`. Lyriquiz nutzt den `short_term` um eine rege Zirkulation der Liedauswahl zu garantieren.

Um die Spotify API überhaupt nutzen zu können, muss zu allererst ein 'Access-Token' beschafft werden, genutzt wurde dabei der 'Implicit Grant Flow', siehe https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow.

Mit Hilfe des Access-Tokens werden dann Lieder von der API beschafft, sobald diese angekommen sind werden sie genutzt um von der zweiten API, Lyrics.ovh, die Texte der Lieder anzufordern. Diese API ist recht einfach aufgebaut und benötigt lediglich Interpreten und Namen des Liedes, ist der Text verfügbar, kommt lediglich dieser als Antwort. Da es nicht für jedes Lied verfügbare Texte gibt, wird bei einer Error Antwort der Lyrics.ohv API erneut ein Spotify Song angefordert und an die Lyric API gesendet. Es werden solange Liedtexte angefordert bis es für fünf Fragen reicht.

Darüber hinaus werden weitere Songs von Spotify angefordert bis eine genügend große Auswahl vorhanden ist um auch die falschen Antwortmöglichkeiten mit genügend Varianz zu befüllen.
#### Firebase Cloud Firestore 
Zur Datenhaltung wird theoretisch Cloud Firestore genutzt, allerdings im aktuellen Stand nur zum Erfassen der Nutzer die sich bei Lyriquiz über Spotify anmelden. Von diesen wird die Spotify Nutzer ID gespeichert, um in einem späteren Stand bspw. die bereits genutzten Songs und Textstellen zu speichern und nicht erneut anzuzeigen.
## Funktionen
### Funktionen aus Nutzersicht
#### Login
Der Login wird über eine Weiterleitung an Spotify realisiert. Dort loggt sich ein Nutzer mit seinem Spotify Account ein und wird anschließend zurück an Lyriquiz geleitet. Dadurch authentifiziert er zugleich sich selbst und autorisiert Lyriquiz seine "User-Top-Read" Daten zu nutzen. Indem bei der Rückleitung zu Lyriquiz ein Access Token, an die URI angehängt, von Spotify mit den entsprechenden Berechtigungen mit geschickt wird. Dieser Token wird dann bei jedem Request an Spotify mit geschickt, zur Authentifizierung.
Beim Login wird der Nutzer gleichzeitig in der Firestore Cloud neu angelegt, falls er Lyriquiz zum ersten Mal nutzt. Wenn er schon hinterlegt ist, wird er nicht erneut angelegt.
#### Quizspiel [Game]
Das Spiel ist die Hauptfunktion der Web-App. Zu Beginn werden aus den meistgehörten Liedern der letzten vier Wochen von Spotify mehrere zufällig ausgewählt und zu diesen die Songtexte von Lyrics.ovh angefordert. Es wird immer ein einzelnes zufälliges Lied genommen und im Anschluss daran der Text dazu geholt, sowie im Anschluss daran der Text für eine Frage zurecht gestutzt. Dieser Vorgang wiederholt sich, bis fünf Songtexte vorhanden sind. Anschließend werden noch weitere Songtexte angefordert, um genügend für eine Auswahl von falschen Antworten zu haben.
Dieser Vorgang geschieht so "Schritt für Schritt", da es ansonsten zu Problemen auf Grund der Asynchronität und der Tatsache, dass nicht alle Liedtexte bei der Lyrics API verfügbar sind, kommen kann. 
Werden beispielsweise mehrere Lieder auf einmal von Spotify angefordert, kann nicht vorrausgesehen werden, für wieviele dieser tatsächlich Liedtexte verfügbar sind. Außerdem könnten mehrere Lieder nur in einer linearen Sequenz geholt werden, somit wäre die Zufälligkeit der Auswahl eingeschränkt.

##### Ladeanimation
Da speziell die Anfrage der Texte teilweise etwas Zeit in Anspruch nimmt, einerseits da die API nicht so unmittelbar antwortet wie die Spotify API, andererseits da bei nicht vorhanden sein des Liedtextes ein neues Lied ausgewählt wird und sich der Vorgang wiederholt, wird ein Ladebalken angezeigt bevor die Fragen beginnen. Dieser repräsentiert den Status der erfolgreich angeforderten Texte und wird bei jedem neu erhaltenen Text aktualisiert. Er ist komplett gefüllt wenn fünf Texte vorhanden sind. Dann verschwindet der Balken und die erste Frage wird gezeigt.
##### Fragen
Es werden nacheinander fünf Fragen angezeigt. Eine Frage besteht aus ein bis drei Zeilen eines Liedtextes. Zu dieser Frage werden vier Buttons mit möglichen Namen des entsprechenden Liedes angezeigt. Nur einer ist der Richtige, wird der richtige Button angeklickt, ändert dieser die Farbe zu Grün. Wird der Falsche angeklickt, wird er Rot und der Button, welcher die richtige Wahl gewesen wäre, färbt sich Gelb. Nach einer Sekunde erscheint die nächste Frage und alle Buttons werden wieder Neutral gefärbt.
##### Ergebnis
Wurden alle fünf Fragen bearbeitet, erscheint das Ergebnis und teilt mit wie viele Punkte man erreicht hat. Außerdem werden die Punkte zu den Gesamtpunkten der aktuellen Sitzung hinzugefügt.
#### Statistik [Statistics]
Auf der Statistik Seite werden die insgesamt in dieser Sitzung erreichten Punkte angezeigt. Loggt sich der Nutzer aus oder lädt die Seite neu, sind die Punkte zurück gesetzt. Es war geplant diese Punkte in der Firestore Cloud zu speichern sowie andere Statistiken anzuzeigen, beispielsweise das Lied oder der Interpret bei welchem der Nutzer am textsichersten ist. Diese Funktionen konnten bis zum aktuellen Stand allerdings nicht realisiert werden.
#### Benutzer [User]
Die Benutzerseite zeigt die Informationen zum angemeldeten Spotify Nutzer und somit auf welche Daten Lyriquiz Zugriff hat.
#### About
Auf der "About" Seite können Informationen zu Lyriquiz, den beteiligten Personen und genutzter Ressourcen eingesehen werden.
#### Logout
In der Navigationsleiste oben rechts findet sich eine Logout-Funktion über die der Nutzer sich abmelden kann. Dies geschieht indem der Access-Token und andere zur Nutzung der Spotify API nötige Parameter gelöscht werden. Dadurch ist die Nutzung von Lyriquiz nicht mehr möglich ohne erneuten Login.

## Installation und Login
* Zuerst das Repository clonen oder als ZIP herunterladen und entpacken
* Sicherstellen dass die aktuellste Node.js sowie NPM Version installiert ist
* Mit einer Console/Shell in den Lyriquiz Ordner navigieren und dort nacheinander
*  folgende Kommandos ausführen:
    * `npm install @angular/cli`
    * `ng build`
    * `ng serve --open`
* Auf der sich öffnenden Seite, oder falls dies nicht automatisch geschieht zu localhost:4200 im Browser navigieren, dort kann man sich dann mit einem Spotify Account anmelden
* Falls kein Account vorhanden ist lässt sich unter https://www.spotify.com/de/ ein kostenloser Account erstellen
    * Allerdings sollten mindestens 50 Lieder gehört werden vor dem Nutzen von Lyriquiz


## Referenzen und Quellen
* https://angular.io/
* https://developer.spotify.com/
* https://lyrics.ovh/
* https://www.1001fonts.com/glaresome-font.html
* https://github.com/angular/angularfire2
* https://firebase.google.com/docs/
* Diverse Antworten auf https://stackoverflow.com/

## Arbeitsaufwand


| Komponente | Zeitaufwand |
| -------- | -------- |
| Authentifizierung/Login Spotify     | 16 h     |
| Ansprechen API User                                |     6 h           |
| Ansprechen API Songs und Abstimmung mit API Lyrics |    18 h         |
| Optimierungen Spielmechanik                        |     9 h         |
| Allgemein Seitenlayout und Logik                                |     18h           |
| **Gesamt** | **67h**  |


# English

## Terminology
In the following several terms are used to denote the same things:
* User, User - The Lyriquiz user logged in via Spotify
* Song, Lied, Track - A piece of music
* Lyrics, Lyrics, Text, Lyric - The lyrics of a piece of music
* Performer, artist, artist - interpreter of a piece of music

## Concept
Lyriquiz is a quiz game that shows the most popular pieces of music and artists from the user's Spotify account
relates and based on this data presents the sontexts of the songs as a question. However, only individual lines are presented randomly. The user is shown a choice of four answers and has to choose the correct one. After selecting a question, it is shown in color whether it was correct or incorrect. At the end of a round, the points are displayed. A game round currently consists of five questions and new text excerpts are selected at the start of a new round.

The total score can also be viewed in the game menu.
Furthermore, it can be seen which user is currently logged in, there is the possibility to log out again and the Spotify login mask offers the possibility to switch users.
Lyriquiz can be accessed by logging into a Spotify account.
### Technical concept
Two APIs are used: [Spotify] (https://developer.spotify.com/) and [Lyrics.ovh] (https://lyrics.ovh/).
In addition to numerous other information, the Spotify API offers a list of a maximum of 50 of the most popular artists or songs by a user, selectable according to period `short_term`,` medium_term` and `long_term`. Lyriquiz uses the `short_term` to guarantee a lively circulation of the song selection.

In order to be able to use the Spotify API at all, an 'access token' must first of all be obtained; the 'implicit grant flow' was used, see https://developer.spotify.com/documentation/general/guides/authorization- guide / # implicit-grant-flow.

With the help of the access token, songs are then obtained from the API, as soon as they have arrived they are used to request the lyrics of the songs from the second API, Lyrics.ovh. This API is quite simple and only needs the artist and name of the song, if the text is available, only this comes as an answer. Since there are not available lyrics for every song, a Spotify song is requested again in the event of an error response from the Lyrics.ohv API and sent to the Lyric API. Lyrics are requested until there are five questions.

In addition, more songs are requested from Spotify until a sufficiently large selection is available to fill the wrong answer options with enough variance.
#### Firebase Cloud Firestore
Theoretically, Cloud Firestore is used for data storage, but in the current state only to record the users who log on to Lyriquiz via Spotify. The Spotify user ID is saved by these, for example to save the songs and text passages that have already been used and not to display them again.
## functions
### Functions from the user's point of view
#### Log in
The login is realized by forwarding to Spotify. There a user logs in with his Spotify account and is then redirected back to Lyriquiz. In this way, he also authenticates himself and authorizes Lyriquiz to use his "User-Top-Read" data. By sending an access token to the URI attached to the return to Lyriquiz by Spotify with the appropriate authorizations. This token is then sent with every request to Spotify for authentication.
When logging in, the user is created in the Firestore Cloud at the same time if he is using Lyriquiz for the first time. If it has already been saved, it will not be created again.
#### Quiz game [Game]
The game is the main function of the web app. At the beginning, Spotify randomly selects several of the most popular songs of the last four weeks and requests the lyrics from Lyrics.ovh. A single random song is always taken and then the text is fetched, and the text is then trimmed for a question. This process is repeated until five lyrics are available. Then further lyrics will be requested in order to have enough for a selection of wrong answers.
This process is done "step by step", otherwise problems can arise due to the asynchrony and the fact that not all lyrics are available in the Lyrics API.
If, for example, several songs are requested from Spotify at once, it cannot be foreseen how many of these lyrics are actually available. In addition, several songs could only be fetched in a linear sequence, so the randomness of the selection would be limited.

##### loading animation
Since the request for the lyrics in particular sometimes takes some time, on the one hand because the API does not respond as immediately as the Spotify API, on the other hand because if the lyrics are not available, a new song is selected and the process is repeated, a loading bar is displayed before the questions begin. This represents the status of the successfully requested texts and is updated with each new text received. It is completely filled when there are five texts. Then the bar disappears and the first question is shown.
##### Ask
Five questions are displayed one after the other. A question consists of one to three lines of lyrics. Four buttons with possible names of the corresponding song are displayed for this question. Only one person is the right one, if the right button is clicked, it changes color to green. If the wrong one is clicked, it turns red and the button that would have been the right choice turns yellow. After a second the next question appears and all buttons are colored neutral again.
##### Result
When all five questions have been answered, the result appears and tells you how many points you have achieved. The points are also added to the total points for the current session.
#### Statistics [Statistics]
The statistics page shows the total points achieved in this session. If the user logs out or reloads the page, the points are reset. It was planned to save these points in the Firestore Cloud as well as to display other statistics, for example the song or the artist with whom the user is most confident in the text. However, these functions could not be implemented up to the current status.
#### User [User]
The user page shows the information about the registered Spotify user and thus which data Lyriquiz has access to.
#### About
On the "About" page information about Lyriquiz, the people involved and the resources used can be viewed.
#### Logout
In the navigation bar at the top right there is a logout function that the user can use to log out. This is done by deleting the access token and other parameters required to use the Spotify API. This means that it is no longer possible to use Lyriquiz without logging in again.

## Installation and login
* First clone the repository or download it as a ZIP and unzip it
* Make sure that the latest Node.js and NPM version is installed
* Navigate with a console / shell in the Lyriquiz folder and there one after the other
* execute the following commands:
    * `npm install @ angular / cli`
    * `ng build`
    * `ng serve --open`
* On the page that opens, or if this does not happen automatically, navigate to localhost: 4200 in the browser, there you can then log in with a Spotify account
* If no account is available, a free account can be created at https://www.spotify.com/de/
    * However, at least 50 songs should be heard before using Lyriquiz


## References and sources
* https://angular.io/
* https://developer.spotify.com/
* https://lyrics.ovh/
* https://www.1001fonts.com/glaresome-font.html
* https://github.com/angular/angularfire2
* https://firebase.google.com/docs/
* Various answers on https://stackoverflow.com/

## Workload


| Component | Time spent |
| -------- | -------- |
| Authentication / login Spotify | 16 h |
| Addressing API users | 6 h |
| Address API songs and vote with API lyrics | 18 h |
| Game mechanics optimizations | 9 h |
| General page layout and logic | 18h |
| ** Total ** | ** 67h ** |


-----



## Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



