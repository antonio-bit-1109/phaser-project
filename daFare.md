-[x] studiare collisioni

- [x] sistema variabili al reset della partita tramite tasto spazio
- [x] aggiungi il tempo di gioco
- [x] aggiungi al menu iniziale il dude che sbuca fuori ogni tanto
- ed un dude che corre da sinistra verso destra

- [x] se riavvi il gioco premendo spazio il boss non fa attacchi
- [x] gestione meccanica salvataggio punteggio di gioco e scena di visualizzazione di tutti i punteggi
- [x] gestione bug del teletrasporto quando passi da dude corazzato a dude normale, gestire che la loro posizione x sia
  sempre sincronizzata sullo stesso valore
- [x] impostazione di salvataggio del punteggio solo se hai vinto la partita
- [x] fai un chain di tweens e riporta smootly il dudeship al centro della scena
- [x] imposta un destabilizzatore di gioco (onda d'urto per aumentare velocità palla repentinamente??)
- oppure fare che ad ogni rimbalzo sulla navicella aumenta velocita palla ? restart peròvelocita quando fai punto
- la duration del tweet puo impostare la difficoltà della cpu ???
- [x] sistema audio del boing con mappa centralizzata
- fog of war
- texture fog
- passa il final score anche da ping pong dude come stringa del punteggio : es --->    "3/5"
- reset palla se si bugga
- modifica del metodo overlap, non va piu chiamato nel update
  ma va dichiarato solo una volta dentro al metodo create quali oggetti devono essere controllati se collidono
- sistemare la classe di gameover per gestire dinamicamente il gioco che che la chiama
- quando avvi circleofdeath resetta i valori salvati nelle classe e chiamali dentro il metodo di init (resetta dati a
  default dentro circleofdeath)
- finisci il piranha attack del boss
- [] aggiungi un alert per preavvisare dove spawna il piranha 