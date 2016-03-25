

$(document).ready(function(){

	// Open the signup modal onClick
	$("#signupBtn").click(function(){
		$("#signupModal").modal();
	});

	// Open the login modal onClick
	$("#loginBtn").click(function(){
		$("#loginModal").modal();
	});

	// Login modal Not a Member onClick
	$("#notMember").click(function(){
		$("#loginModal").modal("hide");
		$("#signupModal").modal("show");
	});

	// Signup modal Already a Member onClick
	$("#alreadyMember").click(function(){
		$("#signupModal").modal("hide");
		$("#loginModal").modal("show");
	});

	$("#signup-next").click(function(){
		$("#signup-page1").hide();
		$("#signup-page2").show();
	});

	// Go to the program page when login form submitted
	document.querySelector("#signupForm").addEventListener("submit", function (e) {
		console.log(e)
	});

	// Go to the program page when login form submitted
	document.querySelector("#loginForm").addEventListener("submit", function (e) {
		console.log(e)
	});
});