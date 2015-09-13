$(function(){

$('#choseChef').click(function(){
        $('#signup').show();
        $('#chefInstructions').show();
        $('#patronInstructions').hide();
        $('#isChef').show();
        $('#signupIntro').hide();
});

$('#chosePatron').click(function(){
        $('#signup').show();
        $('#chefInstructions').hide();
        $('#patronInstructions').show();
        $('#isChef').hide();
        $('#signupIntro').hide();
});

});

