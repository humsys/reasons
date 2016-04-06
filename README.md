# Reasons

Tools to support the collection of and analysis of user reasons, as per http://nxhx.org/maximizing/

## Usage

There's a database API, and several React widgets that work with that database.

The database is built on Firebase, and in order to use it you’ll need to have users authenticate into the db, using code like this:

```js
let FIREBASE = new Firebase('https://lifestyles.firebaseio.com/')
FIREBASE.authWithOAuthPopup('google').then(YOUR CODE HERE)
```

The database lets you add reasons, list them, and find completions for a partially typed reason string.

```js
import Reasons from ‘reasons’
console.log(Reasons.types())
let newReasonId = Reasons.add(‘response’, ‘bored’)
Reasons.commonForActivity(facebookUseActivity).then(console.log)
```

There are widgets for picking reasons, and collecting reasons and outcomes from users about a chain of activities.

And activity looks like the following:

```js
let exampleActivity = {
  blame: 'http://facebook.com',
  elapsed: 30*60*1000,
  over: [Date.now()-24*60*60*1000, Date.now()],
  recognizer: 'indirect',

  favIconUrl: 'https://static.xx.fbcdn.net/rsrc.php/yl/r/H3nktOa7ZMg.ico',

  verbPhrase: ‘browsing links’,
  examples: ‘A, B, and C’,
}
```

An `assessment` consist of the reported reasons and outcomes for an activity:

```js
let assessment = {
      author: userID,
      assessment: feeling,
      reasons: [reason.id],
      time: Date.now(),

      blame: activity.blame,
      elapsed: activity.elapsed,
      over: activity.over,
      recognizer: activity.recognizer,
      verbPhrase: activity.verbPhrase
    }
```



## Getting started

`npm install`



## Contributing

* https://groups.google.com/forum/#!forum/reasons-dev
