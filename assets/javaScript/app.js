var config = {
  apiKey: "AIzaSyBYb-utsMDSg3_467eMLxhiIO9dX5rChUA",
  authDomain: "train-schedule-3835d.firebaseapp.com",
  databaseURL: "https://train-schedule-3835d.firebaseio.com",
  projectId: "train-schedule-3835d",
  storageBucket: "",
  messagingSenderId: "908442405861"
};
firebase.initializeApp(config);

var dataBase = firebase.database();


  var name = "";
  var destination = "";
  var firstTrain = 0;
  var frequency = 0;

$("#train").on("click", function (event) {
  event.preventDefault();

  name = $("#train-input").val().trim();
  destination = $("#destination-input").val().trim();
  firstTrain = $("#firstTrain-input").val().trim();
  frequency = $("#frequency-input").val().trim();

  dataBase.ref().push({

        name: name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        datedAdded: firebase.database.ServerValue.TIMESTAMP
   });
  }); 
  console.log("gothere");


dataBase.ref().on("child_added", function (childSnapshot) {

  var firstTrainConvert = moment(childSnapshot.val().firstTrain, "hh:mm").subtract(1, "years");
  var timeDif = moment().diff(moment(firstTrainConvert), "minutes");
  var timeLeft = timeDif % childSnapshot.val().frequency;
  var timeToArrive = childSnapshot.val().frequency - timeLeft;
  var nextTrain = moment().add(timeToArrive, "minutes");

  var row = $("<tr>");
  row.append($("<td>" + childSnapshot.val().name + "</td>"));
  row.append($("<td>" + childSnapshot.val().destination + "</td>"));
  row.append($("<td class='text-center'>" + childSnapshot.val().frequency + "</td>"));
  row.append($("<td class='text-center'>" + moment(nextTrain).format("LT") + "</td>"));
  row.append($("<td class='text-center'>" + timeToArrive + "</td>"));




  $("#full-train-list").append(newRow);

}, function (errorObject) {
  console.log("Errors handled:" + errorObject.code);
});
console.log("got here too");
dataBase.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function (snapshot) {
  $("#name-display").text(snapshot.val().name);
  $("#destination-display").text(snapshot.val().destination);
  $("#firstTrain-display").text(snapshot.val().firstTrain);
  $("#frequency-display").text(snapshot.val().frequency);
});

function currentTime() {
  var Now = moment().format('MMMM Do YYYY, h:mm:ss a');
  $("#currentTime").html(Now);
  setTimeout(currentTime, 1000);
};

currentTime();
