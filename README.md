# Lyriquiz
## Konzept
Lyriquiz ist ein Quizspiel welches die meistgehörten Musikstücke und Interpreten vom Spotify Account des Nutzers 
bezieht und auf Basis dieser Daten die Sontexte der Lieder als Frage darstellt. Allerdings werden nur einzelne Zeilen zufällig präsentiert. Der Nutzer bekommt eine Auswahl von vier Antworten dazu angezeigt und muss die richtige auswählen. Nach der Auswahl einer Frage wird farblich angezeigt ob diese richtig oder falsch war. Am Ende einer Runde werden die Punkte angezeigt. Eine Spielrunde besteht zur Zeit aus fünf Fragen und beim Start einer neuen Runde werden wieder neue Textausschnitte ausgewählt.

Im Spielmenü kann außerdem der Gesamtpunktestand eingesehen werden.
Des Weiteren kann eingesehen werden welcher Nutzer aktuell eingeloggt ist, es gibt die Möglichkeit sich wieder aus zu loggen und die Spotify Anmeldemaske bietet die Möglichkeit den Nutzer zu wechseln.
Zugriff auf Lyriquiz erhält man, indem man sich mit einem Spotify Account einloggt.
### Techisches Konzept
Genutzt werden zwei API's: [Spotify](https://developer.spotify.com/) und [Lyrics.ovh](https://lyrics.ovh/).
Die Spotify bietet neben zahlreichen anderen Informationen eine Liste von maximal 50 der meistgehörten Interpreten oder Lieder eines Nutzers, auswähbar nach Zeitraum `short_term`, `medium_term` und `long_term`. Lyriquiz nutzt den `short_term` um eine rege Zirkulation der Liedauswahl zu garantieren.

Um die Spotify API überhaupt nutzen zu können, muss zu allererst ein 'Access-Token' beschafft werden, genutzt wurde dabei der 'Implicit Grant Flow', siehe https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow.

Mit Hilfe des Access-Tokens werden dann Lieder von der API beschafft, sobald diese angekommen sind werden sie genutzt um von der zweiten API, Lyrics.ovh, die Texte der Lieder anzufordern. Diese API ist recht einfach aufgebaut und benötigt lediglich Interpreten und Namen des Liedes, ist der Text verfügbar, kommt lediglich dieser als Antwort. Da es nicht für jedes Lied verfügbare Texte gibt, wird bei einer Error Antwort der Lyrics.ohv API erneut ein Spotify Song angefordert und an die Lyric API gesendet. Es werden solange Liedtexte angefordert bis es für fünf Fragen reicht.

Darüber hinaus werden weitere Songs von Spotify angefordert bis eine genügend große Auswahl vorhanden ist um auch die falschen Antwortmöglichkeiten mit genügend Varianz zu befüllen.
#### Firebase Cloud Firestore 
Zur Datenhaltung wird theoretisch Cloud Firestore genutzt, allerdings im aktuellen Stand nur zum Erfassen der Nutzer die sich bei Lyriquiz über Spotify anmelden. Von diesen wird die Spotify Nutzer ID gespeichert, um in einem späteren Stand bspw. die bereits genutzten Songs und Textstellen zu speichern und nciht eerneut anzuzeigen.
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
| Allgemein Seitenlayout und Logik                                |     18           |





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