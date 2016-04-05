import Firebase from 'firebase'
import React from 'react'
import ReactDOM from 'react-dom'
import ActivitiesPage from 'reasons/activities/reviewPage.jsx'
let FIREBASE = new Firebase('https://lifestyles.firebaseio.com/')

// trailId: trail.ctime,
// steps: subset,
// examples: desc.examples

// favIconUrl: trail.favIconUrl,

// blame: trail.blameUrl,
// elapsed: totalElapsed,
// over: [subset[0][0], subset[subset.length-1][1]],
// recognizer: k,
// verbPhrase: desc.verbPhrase,


let exampleActivity = {
  blame: 'http://facebook.com',
  elapsed: 30*60*1000,
  over: [Date.now()-24*60*60*1000, Date.now()],
  recognizer: 'indirect',

  favIconUrl: 'https://static.xx.fbcdn.net/rsrc.php/yl/r/H3nktOa7ZMg.ico',

  verbPhrase: 'browsing links',
  examples: 'A, B, and C',
}

let exampleActivitySource = {
  forReview(){
    return new Promise((s,f)=>s([exampleActivity]))
  }
}

FIREBASE.authWithOAuthPopup('google').then(() => {
  ReactDOM.render(
    <ActivitiesPage
      activitySource={() => new Promise((s,f) => s([exampleActivity]))}
      />,
    document.body
  )
})

// activitySource={exampleActivitySource}
