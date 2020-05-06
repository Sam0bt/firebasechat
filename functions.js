// reset database
function clean() {
	var userKey = firebase.database().ref("user").remove().key;
	var messageKey = firebase.database().ref("chat/").remove().key;
	firebase.database().ref("chat/" + messageKey).remove({});
	firebase.database().ref("user/" + userKey).remove({});
}
// add users to the database
function registerMember() {
	var kadi = $("#kadi").val();
	if (kadi != "") {
		var userKey = firebase.database().ref("user").push().key;
		firebase.database().ref("user/" + userKey).set({
			username: kadi,
			kulid: userKey
		});
		$("#loginScreen").hide();
		$("#chatScreen").show();
		uploadChat();
	} else {
		alert("Kullanıcı adını boş bırakmayın!");
	}
}
// add message to database
function sendMessage() {
	var msg = $("#msg").val();
	var kadi = $("#kadi").val();
	if (kadi != "" && msg != "") {
		var date = new Date();
		var messageKey = firebase.database().ref("chat").push().key;
		firebase.database().ref("chat/" + messageKey).set({
			message: msg,
			from: kadi,
			hour: date.getHours(),
			minute: date.getMinutes()
		});
		$("#msg").val('');
	} else {
		alert("Lütfen boş bırakmayın!");
	}
}
// loads the entire database
function uploadChat() {
	var query = firebase.database().ref("chat");
	var kadi = $("#kadi").val();
	query.on('value', function (snapshot) {
		$("#messageArea").html("");
		snapshot.forEach(function (childSnapshot) {
			var data = childSnapshot.val();
			if (data.from == kadi) {
				var msg = `
				<div class="outgoingMessage">
				<div style="max-width:350px;"><b>(` + data.from + `) </b>` + data.message + `<b> (` + data.hour + ` : ` + data.minute + `)</b></div>
				</div>
				`;
				$("#messageArea").append(msg);
			} else {
				var msg = `
				<div class="incomingMessage">
				<div style="max-width:350px;"><b>(` + data.from + `) </b>` + data.message + `<b> (` + data.hour + ` : ` + data.minute + `)</b></div>
				</div>
				`;
				$("#messageArea").append(msg);
			}
			$(".card-body").scrollTop($('.card-body')[0].scrollHeight - $('.card-body')[0].clientHeight);
		});
	});
}