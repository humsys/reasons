// DONE
// Reasons.types
// Reasons.type(x) => { prefix:  ....}
// Reasons.commonForActivity() => promise
// Reasons.addReason() => promise
// Reasons.completions => promise


// TODO: auth rules, so reasons can be added but not edited

// /reasons/<TYPE>/<ID>:<NAME>   (prio is atime?)
// /reasonsMeta/<ID>:{addedby, ctime}
// /terms/<ID>:{syn, hypo/hyper, instr/yield}  (prio is atime?)

import Firebase from 'firebase'
import 'core-js/fn/object/values'
let FIREBASE = new Firebase('https://lifestyles.firebaseio.com')


// MONITOR A COMPACT REPRESENTATION OF ALL REASONS
var reasons
FIREBASE.child('compactReasons').on('value', snap => {
  let newReasons = {}
  let val = snap.val()
  for (var type in val){
    for (var id in val[type]){
      newReasons[id] = {
        id: id,
        type: type,
        title: val[type][id]
      }
    }
  }
  reasons = newReasons
})



var allTerms, termIndex, indexedReasons



let sentences = {
  response: "I was feeling ___",
  tendency: "I often ___",
  become:   "I want to be more ___",
  do:       "I'd like to ___ more often",
}
let relationPhrases = {
  "syn": "___ means the same thing",
  "yield": "makes ___ possible",
  "hypo": "is a type of ___"
}



export default {

  addReason(type, title){
    let ref = FIREBASE.child('compactReasons').child(type).push(title)
    let r = {
      id: ref.key(),
      type: type,
      title: title,
      author: FIREBASE.getAuth().uid,
      ctime: Date.now()
    }
    FIREBASE.child('metadata').child('reasons').child(ref.key()).update(r)
    return r
  },

  pushAssessment(activity, feeling, reason){
    let userID = FIREBASE.getAuth().uid
    let assessment = {
      author: userID,
      assessment: feeling,
      reasons: [reason.id],
      ctime: Date.now(),

      blame: activity.blame,
      elapsed: activity.elapsed,
      over: activity.over,
      recognizer: activity.recognizer,
      verbPhrase: activity.verbPhrase
    }

    console.log('pushAssessment', assessment)
    FIREBASE.child('assessments').child(userID).push(assessment)
  },

  registerUser(data){
    let authData = FIREBASE.getAuth()
    data.uid = authData.uid
    data.provider = authData.provider
    FIREBASE.child('metadata').child('users').child(authData.uid).update(data)
  },


/////

  sentence(x){
    if (!sentences[x]) return ['error', 'error']
    else return sentences[x].split('___')
  },

  relationSentence(rel){
    if (!relationPhrases[rel]) return ['error', 'error']
    return relationPhrases[rel].split('___')
  },

  types(){
    return Object.keys(sentences)
  },


/////

  // TODO: Reasons#commonForActivity
  commonForActivity(a){
    return new Promise((s,f) => s([]))
  },


  // completions!!

  completions(type, str, count){
    this.reindexReasons()
    let results = []
    allTerms.filter( x => x.indexOf(str) != -1 ).slice(0,count).forEach( m => {
      let entries = termIndex[m]  // [[reasonId, rel, term, reasonName]]
      entries.forEach(idx => {
        if (!reasons[idx[0]]) return console.log(idx[0], 'not found')
        if (!type || reasons[idx[0]].type == type) {
          if (idx[1] == 'is') results.push(reasons[idx[0]])
          else results.push({
            id: idx[0],
            type: reasons[idx[0]].type,
            title: idx[3],
            rel: [idx[1], idx[2]]
          })
        }
      })
    })
    return new Promise((s,f) => s(results))
  },

  reindexReasons(){
    if (indexedReasons == reasons) return
    indexedReasons = reasons
    var terms = termIndex = {}
    for (var reasonId in reasons){
      var c = reasons[reasonId]
      if (!terms[c.title]) terms[c.title] = []
      var x = terms[c.title]
      // console.log('terms[c.title]', x, c.title, x.push)
      x.push([c.id, 'is', c.title, c.title]);

      // add all aliases, hyper/hyponyms, and payoffs to the terms database
      (['syn', 'hypo', 'hyper', 'yield']).forEach( rel => {
        if (c[rel]) c[rel].forEach( x => {
          if (!terms[x]) terms[x] = []
          terms[x].push([c.id, rel, x, c.title])
        })
      })
    }
    allTerms = Object.keys(terms)
  }

}


// reasonsOfType(type){
//   return Object.values(reasons).filter(r => r.type == type)
// },


// commonReasons(resource, type){
//   return []
// }
// reasonData(id){
//   return this.reasons[id] || { title: 'unknown' }
// }
// getReasons(resource){
//   return Object.keys(this.reviews[resource] || {})
// }
// addReasonWithId(u, resource, id){
//   this.fbProfile(u,`reviews/${e(resource)}/${e(id)}/_`).set(true)
// },


// fbreasons.on('value', snap => {reasons = decode(snap.val()||{})})
