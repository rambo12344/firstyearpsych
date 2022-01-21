var color;
var group_select;
var is_loaded;
var final_answer = [];
var question_number =0;
var answertime;
var accuracy;
var verbal_answer;
var control;
var trial_num =0;

function slide1() {
	$("body").empty();
  var add_exp = document.createElement('div');
		add_exp.setAttribute("class", "txt");
    add_exp.innerHTML = '<p>This is the instruction page for the lab. Words will presented in the center of the page. Please say the color of the word and do not read out the word. For maximal efficiency please do the lab in an quiet place. Please click the NEXT button to contiune to the oritentation page  </p> <button class="start" onclick = "orientatin()">NEXT</button>';
  $("body").append(add_exp);
  var group_num = [1,2,3,4,5];
  group_select = group_num[Math.floor(Math.random()*group_num.length)];
  trial_num=1;
  
}
function voice_input(text_color, tex){
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    var colors = ['blue', 'red', 'green', 'yellow']
    var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    /// need a recognition.start event activator
    if (trial_num > 0){
        recognition.start();
    } else {
        alert("error has occurred, please restart the trial if possible")
    }
    recognition.onresult = function(event) {
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The first [0] returns the SpeechRecognitionResult at the last position.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The second [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object
        question_number= question_number +1;
        var colo = event.results[0][0].transcript;
        var comparer = colo.toLowerCase();
        verbal_answer = colo;
        console.log(colo,comparer, text_color);
        if (comparer.localeCompare(text_color) == 0){
            accuracy= 1; //declared globally
        } else {
            accuracy = 0;
        }
        console.log('Confidence: ' + event.results[0][0].confidence);
        recognition.stop();
      var q = parseInt(localStorage.getItem('a'));
      var p = Date.now();
      answertime = p-q;
      if (text_color == tex){
        control = true;
      } else {
          control = false;
      }
      var valueToPush = new Array();
        valueToPush[0] = question_number;
        valueToPush[1] = accuracy;
        valueToPush[2] = text_color;
        valueToPush[3] = tex;
        valueToPush[4] = verbal_answer;
        valueToPush[5] = answertime; 
        valueToPush[6] = control;
      final_answer.push(valueToPush);
      orientatin();
    }
      }


function orientatin(){
	$("body").empty();
	var colors = ['red', 'yellow', 'blue', 'green'];
  var word = colors[Math.floor(Math.random()*colors.length)];
  color = colors[Math.floor(Math.random()*colors.length)];
  var add_exp = document.createElement('div');
	add_exp.setAttribute("class", "exp");
  add_exp.innerHTML=word.toUpperCase();
  $("body").append(add_exp);
  console.log(word, group_select);
  add_exp.style.color = color;
  var timenow = Date.now();
  var t = timenow.toString();
  localStorage.setItem('a',t);
  if(trial_num ==1 || trial_num == 2){
    add_exp.style.letterSpacing = "5px";
    
  } else if ( trial_num == 3) {
    if(group_select == 1){
        add_exp.style.letterSpacing = "10px";
        
    }else if (group_select == 2){
        add_exp.style.letterSpacing = "20px";
        
    }else if (group_select == 3){
        add_exp.style.letterSpacing = "30px";
        
    }else if (group_select == 4){
        add_exp.style.letterSpacing = "40px";
    }
  } 
  console.log(final_answer);
  if(trial_num == 1 && question_number == 5){
    trial_num = 0;
    slide2();
    question_number = 0;
    final_answer = [['id', 'accuracy', 'word_color', 'word', 'given_answer', 'time(ms)', 'control?']];
    alert("you finished orientation");
  
  } else if (trial_num == 2 && question_number == 10){
    trial_num = 0;
    slide3();
    alert("you finished the first set")
    
  } else if (trial_num == 3 && question_number == 20){
      trial_num= 0;
      finish();
      alert("You finished this lab!");
      exportdata(final_answer);
  } else {
    voice_input(color, word);
    
    
  }
  
  
}
function slide2(){
    $("body").empty();
  var add = document.createElement('div');
		add.setAttribute("class", "txt");
    add.innerHTML = '<p> We will now begin the actual experiment.  </p> <button class="start" onclick = "orientatin()">NEXT</button>';
  $("body").append(add);
  trial_num=2;
}
function slide3(){
    $("body").empty();
    var add = document.createElement('div');
          add.setAttribute("class", "txt");
      add.innerHTML = '<p> We will now begin second set of questions.  </p> <button class="start" onclick = "orientatin()">NEXT</button>';
    $("body").append(add);
    trial_num=3;
}
function finish(){
    $("body").empty();
    var add = document.createElement('div');
          add.setAttribute("class", "txt");
      add.innerHTML = '<p>You Have Finished this lab! make sure to download your data file and submit it to brightspace!</p>';
    $("body").append(add);
}
function exportdata(rows){
  let csvContent = "data:text/csv;charset=utf-8," 
  + rows.map(e => e.join(",")).join("\n")
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "my_data.csv");
  document.body.appendChild(link); // Required for FF

  link.click(); // This will download the data file named "my_data.csv".
}
