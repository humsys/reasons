// TODO: dispositions should use dexie, not localStorage

var activitiesSource, availableCb
var dispositions = {}
if (localStorage.dispositions) dispositions = JSON.parse(localStorage.dispositions)


export default {

  setActivitiesSource(source){
    activitiesSource = source
    if (availableCb) this.recalculate()
  },

  onActivitiesForReviewAvailable(cb){
    availableCb = cb
    if (activitiesSource) this.recalculate()
  },

  forActivity(a){
    let two_weeks_ago = Date.now() - 2*7*24*60*60*1000
    let id = `${a.blame}::${a.recognizer}`
    let d = dispositions[id]
    if (d && d[asOf] > two_weeks_ago) return d.feeling
  },

  wasReviewed(activity, feeling){
    let { blame, recognizer } = activity
    let id = `${blame}::${recognizer}`
    dispositions[id] = {
      feeling: feeling,
      asOf: Date.now()
    }
    this.recalculate()
    localStorage.dispositions = JSON.stringify(dispositions)
    // chrome.storage.local.set({dispositions:dispositions})
  },

  removeFeeling(feeling){
    Object.keys(dispositions).forEach(k => {
      if (dispositions[k].feeling = feeling) delete dispositions[k]
    })
    localStorage.dispositions = JSON.stringify(dispositions)
    this.recalculate()
  },

  hasFeeling(feeling){
    for (var k in dispositions){
      if (dispositions[k].feeling == feeling) return true
    }
  },

  recalculate(){
    let two_weeks_ago = Date.now() - 2*7*24*60*60*1000
    activitiesSource().then(activities => {
      availableCb(
        activities.filter(a => {
          let id = `${a.blame}::${a.recognizer}`
          let d = dispositions[id]
          return !d || d.asOf < two_weeks_ago
        })
      )
    })
  }

}
