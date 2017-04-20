app.factory('submitTeacherQuiz', function submitTeacherQuiz(){
  // Registration method
  submitTeacherQuiz.submit = function(items){
    var user = firebase.auth().currentUser;
    var date = Math.floor(Date.now());
    var currentUser;
    if(user){
      var currentUser = firebase.database().ref('users').child(user.uid);
      currentUser.once('value', function(snapshot){
        var snapshot = snapshot.val();
        console.log(snapshot);
        currentUser = snapshot.displayName;
      });
      console.log(currentUser);
      var assignmentsTeacher = firebase.database().ref('assignmentsTeacher');
      var recentActivities = firebase.database().ref('recentActivities');
      var newAction = {
        activity: currentUser + ' added a new assignment',
        timestamp: date,
        addedBy: currentUser
      }
      assignmentsTeacher.push(items);
      recentActivities.push(newAction);

    }else{
      console.log("Errors");
    }
  }

  return submitTeacherQuiz;

});
