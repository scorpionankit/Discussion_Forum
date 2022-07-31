var subject = document.getElementById("subject");
var textQuestion = document.getElementById("question");
var submitBtn = document.getElementById("submit");
var questionList = document.getElementById("questionList");
var rightPane = document.getElementById("container2Text");

var getSubject;
var getTextQuestion;
var questions = [];
var answerInd = -1;

displayLeftPane();
var searchBox = document.getElementById("searchQuestionText");
searchBox.onkeyup = (e)=>{
    let userdata = e.target.value;  //user enter data 
    let emptyArray = [];
    let indexArray = [];

    if(userdata.trim()){
        emptyArray = questions.filter(function(element , index){
            //filtering array value and user char to lower case and return only those word / sentences which are start with user entered letters
            if(element.subject.toLocaleLowerCase().startsWith(userdata.toLocaleLowerCase()))
                 indexArray.push(index);
            return element.subject.toLocaleLowerCase().startsWith(userdata.toLocaleLowerCase());
        });
        showSuggestions(emptyArray , indexArray);
    }
    else{
        displayLeftPane();
    }
}

function showSuggestions(list , ind)
{
    let newList = '';
    let no = "No Match Found";

    if(!list.length){
        newList += no;
    }
    else{
        list.forEach(function(element , index){
             newList +=  `<div> <li> <button id = 'listItem' onclick = "responseForm( ${ind[index]} )"> <h3> ${element.subject} </h3> ${element.description} </li> </button> </div> <hr>`;
        });
    }
    questionList.innerHTML = newList;
}

submitBtn.addEventListener("click" , function()
{
    getSubject = subject.value;
    getTextQuestion = textQuestion.value;

    if(checkData())
    {
        displayLeftPane();

        //Store In Local Storage and in questions array
        let obj = {
            subject : getSubject,
            description : getTextQuestion,
            answer : {personName: "" ,
                        personComment : "" },   
            flag : true,  
            upvoteqn : 0,
            downvoteqn : 0,  
            upvoteans : 0,
            downvoteans : 0,    
        };
        storeQuestions(obj);
        displayLeftPane();
    }
    else
        alert("Both Field Are Mandatory");
    clearSubQuesInput();
});

function clearSubQuesInput()
{
    subject.value = "";
    textQuestion.value = "";
}

function getLocalStorageData()
{
    let storageData = localStorage.getItem("quesList");
    if(!storageData)
        return [];
    return JSON.parse(storageData);
}

function storeQuestions(obj)
{
    //in question array data push
    questions.push(obj);
    //in local storage data push
    let storageData = getLocalStorageData();
    storageData.push(obj);
    localStorage.setItem("quesList" , JSON.stringify(storageData));
}
function checkData()
{
    let x = getSubject.trim();
    let y = getTextQuestion.trim();
    if(x && y)
        return  true;
    return false;
}
//list of all questions in left side show
function displayLeftPane()
{
    let storageData = getLocalStorageData();
    questions = storageData;
    let newList = '';
   
    storageData.forEach(function(element , index){
    if(element.flag === true){
     newList += `<button id = "like" onclick = "likeVoteQn(${index})"> <i class="fa fa-thumbs-up"></i></button> <input id = "likeNo" value = ${element.upvoteqn}>`;
     newList +=  `<button id = "dislike"  onclick = "dislikeVoteQn(${index})"> <i class="fa fa-thumbs-down"></i></button><input id = "dislikeNo" value = ${element.downvoteqn}>  `;
     newList +=  `<div> <li> <button id = 'listItem' onclick = "responseForm( ${index} )"> <h3> ${element.subject} </h3> ${element.description} </li> </button> </div> <hr>`;
     } 
    });
    questionList.innerHTML = newList;
}

function likeVoteQn(index)
{
    let likeVoteNo = questions[index].upvoteqn;
    likeVoteNo +=  1;
    changeInLocalStorage(questions[index].subject , questions[index].description , questions[index].answer.personName , questions[index].answer.personComment , questions[index].flag , likeVoteNo , questions[index].downvoteqn , questions[index].upvoteans , questions[index].downvoteans , index);
    displayLeftPane();
}

function dislikeVoteQn(index)
{
    let dislikeVoteNo = questions[index].downvoteqn;
    dislikeVoteNo +=  1;
    changeInLocalStorage(questions[index].subject , questions[index].description , questions[index].answer.personName , questions[index].answer.personComment , questions[index].flag , questions[index].upvoteqn , dislikeVoteNo , questions[index].upvoteans , questions[index].downvoteans , index);
    displayLeftPane();
}

function changeInLocalStorage(sub , des , resPersonName , resPersonComment , flag , upvoteqn , downvoteqn , upvoteans , downvoteans , index )
{
    let storageData = getLocalStorageData();
    let obj = {
        subject : sub,
        description : des,
        answer : {personName: resPersonName ,
                    personComment : resPersonComment },    
        flag : flag,       
        upvoteqn : upvoteqn,
        downvoteqn : downvoteqn,  
        upvoteans :   upvoteans,
        downvoteans : downvoteans,  
    };
    storageData[index] = obj;
    questions = storageData;
    localStorage.setItem("quesList" , JSON.stringify(storageData));
}

function responseForm(index)
{
    let sub = questions[index].subject;
    let des = questions[index].description;
    answerInd = index;
    let q = "Question";let r = "Resolve";let res=  "Response";let add = "Add Response";let s = "Submit";

    let newPaneText = '';
    //Upper show question with description will fixed
    newPaneText += `<h2> ${q} </h2> <div id = "showQuestion"> <h3> ${sub} </h3> <p> ${des} </p> </div> <button id = "resolve"> ${r} </button> </div>`;

    //append below response form
    newPaneText += `<div id = "rightPaneLower"> </div> <div id = "showResponse"> <h2> ${add} </h2> <input type = "text" placeholder = "Enter Name" id = "name"/> <br> <textarea rows = "6" cols = "75" placeholder = "Enter Comment" id = "comment"/></textarea> </div> `;
    rightPane.innerHTML = newPaneText;
    //already answer response will display
    appendResponseOnDom();

    //If click on resolve button then update the rightPane to Question(Initial Interface)
    var resolveBtn = document.getElementById("resolve");
    resolveBtn.addEventListener("click" , function(){
        resetRightPane();
    });

    //on submit response button change in dom occur
    var resSubBtn = document.createElement("button");
    resSubBtn.id = "resolveSubmitBtn";
    resSubBtn.innerText = "Submit";
    rightPane.appendChild(resSubBtn);
    resSubBtn.addEventListener("click" , function(){
        addResponse();
    });
}

function resetRightPane()
{
    let newList = '';
    let head= "Welcome To Discussion Portal !";
    let subHead= "Enter a subject and question to get started";
    let Submit = "Submit";

    newList += `<div> <h1> ${head} </h1> <h4> ${subHead} </h4> </div> <input type = "text" placeholder="Subject" id = "subject" required><br>
    <textarea id = "question" placeholder="Question" cols = "60" rows = "10" required></textarea><br>
    <button id = "submit">${Submit}</button>`;

    rightPane.innerHTML = newList;
    //make flag false on the question which is resolve so remove from left side question list
    changeInLocalStorage(questions[answerInd].subject , questions[answerInd].description , questions[answerInd].answer.personName , questions[answerInd].answer.personComment , false , questions[answerInd].upvoteqn , questions[answerInd].downvoteqn , questions[answerInd].upvoteans , questions[answerInd].downvoteans , answerInd);
    displayLeftPane()
}

function addResponse()
{
    let nameText = document.getElementById("name");
    let commentText = document.getElementById("comment");
    if(nameText.value.trim() && commentText.value.trim()){
        changeInLocalStorage(questions[answerInd].subject , questions[answerInd].description ,nameText.value , commentText.value , true , questions[answerInd].upvoteqn , questions[answerInd].downvoteqn , questions[answerInd].upvoteans , questions[answerInd].downvoteans , answerInd);
        //append in response div
        appendResponseOnDom();
        clearResponseInput();
    }
    else{
        alert("Both Field Is Mendatory");
    }
}

function likeVoteAns(index)
{
    let likeVoteNo = questions[index].upvoteans;
    likeVoteNo +=  1;
    changeInLocalStorage(questions[index].subject , questions[index].description , questions[index].answer.personName , questions[index].answer.personComment , questions[index].flag , questions[index].upvoteqn , questions[index].downvoteqn , likeVoteNo, questions[index].downvoteans , index);
    appendResponseOnDom();
}
function dislikeVoteAns(index)
{
    let dislikeVoteNo = questions[index].downvoteans;
    dislikeVoteNo +=  1;
    changeInLocalStorage(questions[index].subject , questions[index].description , questions[index].answer.personName , questions[index].answer.personComment , questions[index].flag , questions[index].upvoteqn , questions[index].downvoteqn , questions[index].upvoteans ,dislikeVoteNo , index);
    appendResponseOnDom() ;
}

function appendResponseOnDom()
{
    let response = document.getElementById("rightPaneLower");
    let newList = '';
    let res = "Response";
    newList += "<h3>" +res + "</h3>"

    questions.forEach(function(element , index){
        if(questions[index].answer.personName !== ""){
            newList += `<div id = "resText"> <button id = "like" onclick = "likeVoteAns(${index})"> <i class="fa fa-thumbs-up"></i></button> <input id = "likeNo" value = ${element.upvoteans}>`;
            newList +=  `<button id = "dislike"  onclick = "dislikeVoteAns(${index})"> <i class="fa fa-thumbs-down"></i></button><input id = "dislikeNo" value = ${element.downvoteans}>  `;
            newList += "<h5>" + questions[index].answer.personName + "</h5>" + questions[index].answer.personComment + "<hr> </div>";
        }
    });
    
    response.innerHTML = newList;
}

function clearResponseInput()
{
    let nameText = document.getElementById("name");
    let commentText = document.getElementById("comment");
    nameText.value = "";
    commentText.value = "";
}
