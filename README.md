# Lyriquiz
<img src="https://source.ai.fh-erfurt.de/lu0436ko/lyriquiz/raw/master/src/assets/lyriquiz_logo.png" height="256" width="256">
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
Die Spotify bietet neben zahlreichen anderen Informationen eine Liste von maximal 50 der meistgehörten Interpreten oder Lieder eines Nutzers, auswählbar nach Zeitraum `short_term`, `medium_term` und `long_term`. Lyriquiz nutzt den `short_term` um eine rege Zirkulation der Liedauswahl zu garantieren.

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

**Softwaretechnischer Hintergrund:** [Wiki](https://source.ai.fh-erfurt.de/lu0436ko/lyriquiz/wiki/fetchLyrics%28%29)
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



![pic](http://www.scdn.co/i/_global/open-graph-default.png)